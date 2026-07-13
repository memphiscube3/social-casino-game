import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ALLOWED_BETS } from "./wheel.server";

export const spinWheel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        bet: z
          .number()
          .int()
          .refine((v) => (ALLOWED_BETS as readonly number[]).includes(v), "Invalid bet"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { SECTORS, pickWinner, ensureProfile } = await import("./wheel.server");
    const userId = context.userId;
    const bet = data.bet;

    const profile = await ensureProfile(supabaseAdmin, userId);
    if (profile.coins < bet) throw new Error("Insufficient coins");

    const winnerIdx = pickWinner();
    const sector = SECTORS[winnerIdx];
    const win = bet * sector.mult;
    const balance_after = profile.coins - bet + win;

    const { error: uErr } = await supabaseAdmin
      .from("profiles")
      .update({
        coins: balance_after,
        total_spins: profile.total_spins + 1,
        total_wins: profile.total_wins + (win > 0 ? 1 : 0),
        biggest_win: Math.max(profile.biggest_win, win),
      })
      .eq("id", userId);
    if (uErr) throw new Error(uErr.message);

    await supabaseAdmin.from("game_history").insert({
      user_id: userId,
      bet,
      win,
      symbols: [sector.label],
      balance_after,
    });

    return { winnerIdx, win, balance_after };
  });

export const claimTopUp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ensureProfile } = await import("./wheel.server");
    const userId = context.userId;
    const profile = await ensureProfile(supabaseAdmin, userId);
    if (profile.coins > 100) throw new Error("Top-up available only when balance ≤ 100");
    const balance_after = profile.coins + 500;
    const { error: uErr } = await supabaseAdmin
      .from("profiles")
      .update({ coins: balance_after })
      .eq("id", userId);
    if (uErr) throw new Error(uErr.message);
    return { balance_after };
  });
