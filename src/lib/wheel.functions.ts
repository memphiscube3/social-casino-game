import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Server-authoritative sector table. MUST match the visual order in
// src/components/wheel-of-fortune.tsx so the returned index animates correctly.
const SECTORS = [
  { mult: 1,   label: "×1",       weight: 30 },
  { mult: 10,  label: "×10",      weight: 3 },
  { mult: 2,   label: "×2",       weight: 15 },
  { mult: 0,   label: "×0",       weight: 40 },
  { mult: 3,   label: "×3",       weight: 8 },
  { mult: 25,  label: "×25",      weight: 1 },
  { mult: 5,   label: "×5",       weight: 5 },
  { mult: 100, label: "JACKPOT",  weight: 0.5 },
] as const;

const TOTAL_WEIGHT = SECTORS.reduce((s, x) => s + x.weight, 0);
const ALLOWED_BETS = [10, 25, 50, 100, 250, 500] as const;

function pickWinner() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < SECTORS.length; i++) {
    if (r < SECTORS[i].weight) return i;
    r -= SECTORS[i].weight;
  }
  return 0;
}

export const spinWheel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ bet: z.number().int().refine((v) => (ALLOWED_BETS as readonly number[]).includes(v), "Invalid bet") }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;
    const bet = data.bet;

    const { data: profile, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("coins,total_spins,total_wins,biggest_win")
      .eq("id", userId)
      .single();
    if (pErr || !profile) throw new Error("Profile not found");
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
    const userId = context.userId;
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("coins")
      .eq("id", userId)
      .single();
    if (error || !profile) throw new Error("Profile not found");
    // Only allow top-up when balance is low, to prevent unbounded free coin accumulation.
    if (profile.coins > 100) throw new Error("Top-up available only when balance ≤ 100");
    const balance_after = profile.coins + 500;
    const { error: uErr } = await supabaseAdmin
      .from("profiles")
      .update({ coins: balance_after })
      .eq("id", userId);
    if (uErr) throw new Error(uErr.message);
    return { balance_after };
  });
