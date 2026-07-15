import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getLeaderboard, type LeaderboardRow } from "@/lib/leaderboard.functions";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Crown, Medal, Coins, TrendingUp, Repeat } from "lucide-react";
import { canonicalLink, openGraphUrl } from "@/lib/seo";

export const Route = createFileRoute("/zebricek")({
  head: () => ({
    meta: [
      { title: "Žebříček hráčů — Jungle Circle" },
      { name: "description", content: "Aktuální žebříček nejlepších hráčů Jungle Circle podle mincí a největších výher." },
      { property: "og:title", content: "Žebříček hráčů — Jungle Circle" },
      { property: "og:description", content: "Kdo právě vládne džungli? Podívejte se na TOP hráče." },
      { property: "og:type", content: "website" },
      openGraphUrl("/zebricek"),
      { name: "twitter:card", content: "summary" },
    ],
    links: [canonicalLink("/zebricek")],
  }),
  component: Leaderboard,
});

type Row = LeaderboardRow;

function Leaderboard() {
  const { profile } = useAuth();
  const fetchLeaderboard = useServerFn(getLeaderboard);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard({ data: { limit: 50 } });
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const medal = (r: number) => {
    if (r === 1) return <Crown className="h-5 w-5 text-[oklch(0.88_0.16_85)]" />;
    if (r === 2) return <Medal className="h-5 w-5 text-[oklch(0.85_0.05_75)]" />;
    if (r === 3) return <Medal className="h-5 w-5 text-[oklch(0.65_0.15_50)]" />;
    return <span className="text-sm text-[oklch(0.7_0.04_75)] tabular-nums w-5 inline-block text-center">{r}</span>;
  };

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.28_0.12_155)] border border-[oklch(0.78_0.16_75/0.5)] text-xs uppercase tracking-widest text-gold mb-3">
            <Trophy className="h-4 w-4" /> Živý žebříček
          </div>
          <h1 className="text-4xl sm:text-5xl text-gold mb-2">Král džungle</h1>
          <p className="text-[oklch(0.85_0.05_75)]">Nejbohatší ringmasteři podle nasbíraných mincí. Aktualizuje se každých 15 s.</p>
        </div>

        {loading && rows.length === 0 ? (
          <p className="text-center text-[oklch(0.85_0.05_75)] py-16">Načítání žebříčku…</p>
        ) : rows.length === 0 ? (
          <p className="text-center text-[oklch(0.85_0.05_75)] py-16">Zatím žádní hráči — buďte první!</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {top3.map((r) => (
                <div
                  key={r.username + r.rank}
                  className={`rounded-2xl p-5 border relative overflow-hidden ${
                    r.rank === 1
                      ? "bg-gradient-to-br from-[oklch(0.35_0.16_75)] to-[oklch(0.2_0.06_155)] border-[oklch(0.88_0.16_85)] sm:order-2 sm:scale-105"
                      : r.rank === 2
                        ? "bg-gradient-to-br from-[oklch(0.28_0.06_155)] to-[oklch(0.18_0.05_155)] border-[oklch(0.78_0.16_75/0.5)] sm:order-1"
                        : "bg-gradient-to-br from-[oklch(0.26_0.08_60)] to-[oklch(0.18_0.05_155)] border-[oklch(0.65_0.15_50/0.5)] sm:order-3"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">{medal(r.rank)}<span className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)]">#{r.rank}</span></div>
                  <div className="text-xl font-bold text-gold truncate">{r.username}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <Coins className="h-5 w-5 text-[oklch(0.88_0.16_85)]" />
                    <span className="text-2xl font-extrabold text-gold tabular-nums">{r.coins.toLocaleString("cs-CZ")}</span>
                  </div>
                  <div className="mt-2 text-xs text-[oklch(0.85_0.05_75)] flex gap-3">
                    <span>🏆 {r.total_wins}</span>
                    <span>💥 {r.biggest_win.toLocaleString("cs-CZ")}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-[oklch(0.22_0.06_155)] border border-[oklch(0.78_0.16_75/0.3)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[oklch(0.75_0.04_75)] uppercase text-xs tracking-widest bg-black/30">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Hráč</th>
                      <th className="py-3 px-3 text-right"><Coins className="inline h-3 w-3" /> Mince</th>
                      <th className="py-3 px-3 text-right hidden sm:table-cell"><TrendingUp className="inline h-3 w-3" /> Max. výhra</th>
                      <th className="py-3 px-3 text-right hidden sm:table-cell"><Trophy className="inline h-3 w-3" /> Výher</th>
                      <th className="py-3 px-3 text-right hidden md:table-cell"><Repeat className="inline h-3 w-3" /> Točení</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((r) => {
                      const isMe = profile?.username === r.username;
                      return (
                        <tr
                          key={r.username + r.rank}
                          className={`border-t border-[oklch(0.78_0.16_75/0.1)] ${isMe ? "bg-[oklch(0.32_0.14_75/0.25)]" : ""}`}
                        >
                          <td className="py-2.5 px-3">{medal(r.rank)}</td>
                          <td className="py-2.5 px-3 font-semibold text-[oklch(0.95_0.04_85)]">
                            {r.username} {isMe && <span className="text-xs text-gold ml-1">(vy)</span>}
                          </td>
                          <td className="py-2.5 px-3 text-right text-gold font-bold tabular-nums">{r.coins.toLocaleString("cs-CZ")}</td>
                          <td className="py-2.5 px-3 text-right text-[oklch(0.9_0.04_85)] tabular-nums hidden sm:table-cell">{r.biggest_win.toLocaleString("cs-CZ")}</td>
                          <td className="py-2.5 px-3 text-right text-[oklch(0.9_0.04_85)] tabular-nums hidden sm:table-cell">{r.total_wins}</td>
                          <td className="py-2.5 px-3 text-right text-[oklch(0.85_0.05_75)] tabular-nums hidden md:table-cell">{r.total_spins}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
