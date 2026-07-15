import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type LeaderboardRow = {
  rank: number;
  username: string;
  coins: number;
  biggest_win: number;
  total_wins: number;
  total_spins: number;
};

export const getLeaderboard = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number } | undefined) => ({
    limit: Math.max(1, Math.min(input?.limit ?? 50, 200)),
  }))
  .handler(async ({ data }): Promise<LeaderboardRow[]> => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabasePublic = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data: rows, error } = await supabasePublic.rpc("get_leaderboard", { _limit: data.limit });
    if (error) {
      console.error("[getLeaderboard]", error.message);
      return [];
    }
    return (rows ?? []).map((r: any) => ({
      rank: Number(r.rank),
      username: String(r.username),
      coins: Number(r.coins),
      biggest_win: Number(r.biggest_win),
      total_wins: Number(r.total_wins),
      total_spins: Number(r.total_spins),
    }));
  });
