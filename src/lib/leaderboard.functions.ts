import { createServerFn } from "@tanstack/react-start";

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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("get_leaderboard", { _limit: data.limit });
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
