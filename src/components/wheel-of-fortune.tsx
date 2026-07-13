import { useEffect, useRef, useState } from "react";
import { Coins, Minus, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { spinWheel, claimTopUp } from "@/lib/wheel.functions";
import { toast } from "sonner";


type Sector = {
  mult: number;
  label: string;
  weight: number;
  fill: string;
  text: string;
};

// Sectors in visual order clockwise starting from the top (12 o'clock).
const SECTORS: Sector[] = [
  { mult: 1,   label: "×1",       weight: 30, fill: "#1f6b3a", text: "#f2e9c8" },
  { mult: 10,  label: "×10",      weight: 3,  fill: "#f2c14b", text: "#1a3a1a" },
  { mult: 2,   label: "×2",       weight: 15, fill: "#1f6b3a", text: "#f2e9c8" },
  { mult: 0,   label: "×0",       weight: 40, fill: "#f2c14b", text: "#1a3a1a" },
  { mult: 3,   label: "×3",       weight: 8,  fill: "#1f6b3a", text: "#f2e9c8" },
  { mult: 25,  label: "×25",      weight: 1,  fill: "#f2c14b", text: "#1a3a1a" },
  { mult: 5,   label: "×5",       weight: 5,  fill: "#1f6b3a", text: "#f2e9c8" },
  { mult: 100, label: "JACKPOT",  weight: 0.5, fill: "#f2c14b", text: "#1a3a1a" },
];

const N = SECTORS.length;
const SLICE = 360 / N;
const TOTAL_WEIGHT = SECTORS.reduce((s, x) => s + x.weight, 0);

function pickWinner() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < N; i++) {
    if (r < SECTORS[i].weight) return i;
    r -= SECTORS[i].weight;
  }
  return 0;
}

const BET_OPTIONS = [10, 25, 50, 100, 250, 500];
const GUEST_KEY = "cs_guest_coins";

function getGuestCoins() {
  if (typeof window === "undefined") return 1000;
  const v = localStorage.getItem(GUEST_KEY);
  return v ? Number(v) : 1000;
}
function setGuestCoins(v: number) {
  if (typeof window !== "undefined") localStorage.setItem(GUEST_KEY, String(v));
}

// Build an SVG wedge path from angle a1 to a2 (degrees, 0 = 12 o'clock, clockwise).
function wedgePath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const toXY = (deg: number) => {
    const rad = (deg - 90) * (Math.PI / 180); // shift so 0° = top
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x1, y1] = toXY(a1);
  const [x2, y2] = toXY(a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

export function WheelOfFortune() {
  const { user, profile, refreshProfile } = useAuth();
  const spinFn = useServerFn(spinWheel);
  const topUpFn = useServerFn(claimTopUp);
  const [coins, setCoins] = useState(1000);
  const [bet, setBet] = useState(25);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [winPulse, setWinPulse] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (user && profile) setCoins(profile.coins);
    else if (!user) setCoins(getGuestCoins());
  }, [user, profile]);

  const animateTo = (winnerIdx: number) => {
    const sectorCenter = winnerIdx * SLICE + SLICE / 2;
    const base = (360 - sectorCenter) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (base - currentMod + 360) % 360;
    const target = rotation + delta + 360 * 6;
    setRotation(target);
  };

  const spin = async () => {
    if (spinning) return;
    if (coins < bet) {
      toast.error("Nedostatek mincí. Snižte sázku.");
      return;
    }
    setLastWin(null);
    setSpinning(true);

    if (user) {
      // Server-authoritative spin: server picks the winner and updates balances.
      try {
        const res = await spinFn({ data: { bet } });
        setCoins(res.balance_after + (0)); // will be corrected after animation
        // Optimistically deduct bet visually while spinning.
        setCoins((c) => c - bet);
        animateTo(res.winnerIdx);
        const t = setTimeout(() => {
          const sector = SECTORS[res.winnerIdx];
          setCoins(res.balance_after);
          setLastWin(res.win);
          setSpinning(false);
          if (res.win > 0) {
            setWinPulse(true);
            setTimeout(() => setWinPulse(false), 1500);
            if (sector.mult >= 25) toast.success(`🎉 ${sector.label}! Výhra ${res.win.toLocaleString("cs-CZ")} mincí!`, { duration: 4000 });
            else toast.success(`Výhra ${res.win.toLocaleString("cs-CZ")} mincí!`, { duration: 2500 });
          } else {
            toast(`${sector.label} — bez výhry. Zkuste znovu!`, { duration: 2000 });
          }
          refreshProfile();
        }, 4600);
        timers.current.push(t);
      } catch (e) {
        setSpinning(false);
        const msg = e instanceof Error ? e.message : "Chyba při točení";
        toast.error(msg);
      }
      return;
    }

    // Guest (unauthenticated): fully client-side, balance stored in localStorage only.
    const afterBet = coins - bet;
    setCoins(afterBet);
    const winnerIdx = pickWinner();
    animateTo(winnerIdx);
    const t = setTimeout(() => {
      const sector = SECTORS[winnerIdx];
      const win = bet * sector.mult;
      const balance = afterBet + win;
      setCoins(balance);
      setGuestCoins(balance);
      setLastWin(win);
      setSpinning(false);
      if (win > 0) {
        setWinPulse(true);
        setTimeout(() => setWinPulse(false), 1500);
        if (sector.mult >= 25) toast.success(`🎉 ${sector.label}! Výhra ${win.toLocaleString("cs-CZ")} mincí!`, { duration: 4000 });
        else toast.success(`Výhra ${win.toLocaleString("cs-CZ")} mincí!`, { duration: 2500 });
      } else {
        toast(`${sector.label} — bez výhry. Zkuste znovu!`, { duration: 2000 });
      }
    }, 4600);
    timers.current.push(t);
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const topUp = async () => {
    if (user) {
      try {
        const res = await topUpFn({});
        setCoins(res.balance_after);
        refreshProfile();
        toast.success("+500 mincí zdarma!");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bonus není dostupný";
        toast.error(msg);
      }
    } else {
      const next = coins + 500;
      setCoins(next);
      setGuestCoins(next);
      toast.success("+500 mincí zdarma!");
    }
  };

  const SIZE = 420;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 20;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="jungle-frame bg-gradient-to-b from-[#1a1209] to-[#0d0803] p-5 sm:p-8">
          <div className="vine-divider vine-divider-animated mb-4" />

          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)]">
              <Coins className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              <span className="text-xs uppercase tracking-widest text-[oklch(0.8_0.05_75)]">Mince</span>
              <span className="text-lg font-bold text-gold tabular-nums">{coins.toLocaleString("cs-CZ")}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] ${winPulse ? "animate-glow" : ""}`}>
              <span className="text-xs uppercase tracking-widest text-[oklch(0.8_0.05_75)]">Výhra</span>
              <span className={`text-lg font-bold tabular-nums ${lastWin && lastWin > 0 ? "text-gold" : "text-[oklch(0.7_0.05_75)]"}`}>
                {lastWin === null ? "—" : lastWin > 0 ? `+${lastWin.toLocaleString("cs-CZ")}` : "0"}
              </span>
            </div>
          </div>

          {/* Wheel */}
          <div className="relative mx-auto" style={{ width: SIZE, maxWidth: "100%" }}>
            {/* Pointer (3D bevel, static above wheel) */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-20 drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)]">
              <svg width="52" height="60" viewBox="0 0 52 60">
                <defs>
                  <linearGradient id="ptrGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff2b8" />
                    <stop offset="45%" stopColor="#f2c14b" />
                    <stop offset="100%" stopColor="#8a5a12" />
                  </linearGradient>
                  <radialGradient id="ptrGem" cx="0.5" cy="0.4" r="0.6">
                    <stop offset="0%" stopColor="#ffd66b" />
                    <stop offset="60%" stopColor="#1f6b3a" />
                    <stop offset="100%" stopColor="#3a0808" />
                  </radialGradient>
                </defs>
                <polygon points="26,58 4,6 48,6" fill="url(#ptrGold)" stroke="#3a1a06" strokeWidth="2" strokeLinejoin="round" />
                <polygon points="26,58 26,6 48,6" fill="#000" opacity="0.18" />
                <circle cx="26" cy="12" r="7" fill="url(#ptrGem)" stroke="#3a1a06" strokeWidth="1.5" />
                <circle cx="24" cy="10" r="2" fill="#fff" opacity="0.8" />
              </svg>
            </div>

            {/* Static outer frame: gold rim + bulbs (does not rotate) */}
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-auto pointer-events-none">
              <defs>
                <radialGradient id="rimGold" cx="0.5" cy="0.35" r="0.7">
                  <stop offset="0%" stopColor="#fff2b8" />
                  <stop offset="40%" stopColor="#f2c14b" />
                  <stop offset="80%" stopColor="#8a5a12" />
                  <stop offset="100%" stopColor="#3a1a06" />
                </radialGradient>
                <radialGradient id="bulbOn" cx="0.4" cy="0.35" r="0.6">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#ffe9a8" />
                  <stop offset="100%" stopColor="#c78a1a" />
                </radialGradient>
                <filter id="dropSoft" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="0" dy="6" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.55" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Cast shadow under wheel */}
              <ellipse cx={CX} cy={CY + R + 8} rx={R * 0.9} ry={10} fill="#000" opacity="0.5" />
              {/* Outer gold rim */}
              <circle cx={CX} cy={CY} r={R + 14} fill="url(#rimGold)" stroke="#3a1a06" strokeWidth="2" filter="url(#dropSoft)" />
              {/* Inner rim well (darker groove) */}
              <circle cx={CX} cy={CY} r={R + 4} fill="#0a2a15" />
              {/* Bulbs around the rim */}
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i / 24) * 2 * Math.PI - Math.PI / 2;
                const rr = R + 9;
                const bx = CX + rr * Math.cos(a);
                const by = CY + rr * Math.sin(a);
                return (
                  <g key={i}>
                    <circle cx={bx} cy={by} r={5} fill="#3a1a06" />
                    <circle cx={bx} cy={by} r={4} fill="url(#bulbOn)" />
                    <circle cx={bx - 1} cy={by - 1.2} r={1.2} fill="#ffffff" opacity="0.9" />
                  </g>
                );
              })}
            </svg>

            {/* Rotating wheel body */}
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="relative w-full h-auto"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 4.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.55))",
              }}
            >
              <defs>
                <radialGradient id="wedgeRed" cx="0.5" cy="0.5" r="0.75">
                  <stop offset="0%" stopColor="#3fa063" />
                  <stop offset="60%" stopColor="#1f6b3a" />
                  <stop offset="100%" stopColor="#0a2a15" />
                </radialGradient>
                <radialGradient id="wedgeGold" cx="0.5" cy="0.5" r="0.75">
                  <stop offset="0%" stopColor="#ffe28a" />
                  <stop offset="55%" stopColor="#e8b23a" />
                  <stop offset="100%" stopColor="#7a4a10" />
                </radialGradient>
                <radialGradient id="hubGold" cx="0.4" cy="0.35" r="0.75">
                  <stop offset="0%" stopColor="#fff2b8" />
                  <stop offset="55%" stopColor="#f2c14b" />
                  <stop offset="100%" stopColor="#5a3208" />
                </radialGradient>
                <radialGradient id="hubCenter" cx="0.4" cy="0.35" r="0.7">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#ffd66b" />
                  <stop offset="100%" stopColor="#6a3a08" />
                </radialGradient>
                <radialGradient id="wheelSheen" cx="0.5" cy="0.35" r="0.7">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                </radialGradient>
              </defs>

              {/* Sectors */}
              {SECTORS.map((s, i) => {
                const a1 = i * SLICE;
                const a2 = (i + 1) * SLICE;
                const mid = a1 + SLICE / 2;
                const rad = (mid - 90) * (Math.PI / 180);
                const tx = CX + R * 0.66 * Math.cos(rad);
                const ty = CY + R * 0.66 * Math.sin(rad);
                const isGold = s.fill === "#f2c14b";
                return (
                  <g key={i}>
                    <path
                      d={wedgePath(CX, CY, R, a1, a2)}
                      fill={isGold ? "url(#wedgeGold)" : "url(#wedgeRed)"}
                      stroke="#0a2a15"
                      strokeWidth="1.5"
                    />
                    <text
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={s.text}
                      fontSize={s.mult === 100 ? 15 : 22}
                      fontWeight="900"
                      transform={`rotate(${mid} ${tx} ${ty})`}
                      style={{ fontFamily: "'Bebas Neue', sans-serif", paintOrder: "stroke", stroke: "#0a2a15", strokeWidth: 1.2 }}
                    >
                      {s.label}
                    </text>
                  </g>
                );
              })}

              {/* Spoke separators for depth */}
              {SECTORS.map((_, i) => {
                const a = (i * SLICE - 90) * (Math.PI / 180);
                const x2 = CX + R * Math.cos(a);
                const y2 = CY + R * Math.sin(a);
                return <line key={i} x1={CX} y1={CY} x2={x2} y2={y2} stroke="#000" strokeOpacity="0.35" strokeWidth="1" />;
              })}

              {/* Glassy sheen overlay */}
              <circle cx={CX} cy={CY} r={R} fill="url(#wheelSheen)" pointerEvents="none" />

              {/* Hub bevel */}
              <circle cx={CX} cy={CY} r={40} fill="url(#hubGold)" stroke="#3a1a06" strokeWidth="2" />
              <circle cx={CX} cy={CY} r={30} fill="#0f3a1f" stroke="#f2c14b" strokeWidth="2" />
              <circle cx={CX} cy={CY} r={16} fill="url(#hubCenter)" stroke="#3a1a06" strokeWidth="1.5" />
              <circle cx={CX - 3} cy={CY - 4} r={4} fill="#fff" opacity="0.7" />
            </svg>
          </div>

          {/* Controls */}
          <div className="mt-6 grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setBet(BET_OPTIONS[Math.max(0, BET_OPTIONS.indexOf(bet) - 1)])}
                className="p-2 rounded-full bg-black/40 border border-[oklch(0.78_0.16_75/0.5)] hover:bg-black/60"
                disabled={spinning}
              >
                <Minus className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              </button>
              <div className="px-4 py-2 rounded-lg bg-black/50 border border-[oklch(0.78_0.16_75/0.5)] min-w-[120px] text-center">
                <div className="text-[10px] uppercase tracking-widest text-[oklch(0.7_0.04_75)]">Sázka</div>
                <div className="text-lg font-bold text-gold tabular-nums">{bet}</div>
              </div>
              <button
                onClick={() => setBet(BET_OPTIONS[Math.min(BET_OPTIONS.length - 1, BET_OPTIONS.indexOf(bet) + 1)])}
                className="p-2 rounded-full bg-black/40 border border-[oklch(0.78_0.16_75/0.5)] hover:bg-black/60"
                disabled={spinning}
              >
                <Plus className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              </button>
            </div>

            <button
              onClick={spin}
              disabled={spinning || coins < bet}
              className="relative px-10 py-4 rounded-xl bg-gold-grad text-[oklch(0.2_0.06_155)] text-lg uppercase tracking-widest font-extrabold shadow-gold disabled:opacity-50 hover:brightness-110 active:scale-95 transition border-2 border-[oklch(0.5_0.12_55)]"
            >
              {spinning ? "Točí se…" : "Roztočit"}
            </button>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={topUp}
                disabled={spinning || coins > 100}
                title={coins > 100 ? "Bonus +500 je dostupný pouze při zůstatku ≤ 100 mincí" : undefined}
                className="px-4 py-2 rounded-lg bg-[oklch(0.4_0.18_155)] hover:bg-[oklch(0.45_0.2_155)] border border-[oklch(0.78_0.16_75/0.5)] text-sm text-[oklch(0.95_0.04_85)] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +500 zdarma
              </button>
              {coins > 100 && (
                <span className="text-[10px] text-[oklch(0.7_0.04_75)]">Dostupné při zůstatku ≤ 100</span>
              )}
            </div>
          </div>
      </div>

      {/* Paytable */}
      <div className="mt-6 rounded-2xl bg-[oklch(0.2_0.06_155)] border border-[oklch(0.78_0.16_75/0.3)] p-5">
        <h3 className="text-gold text-sm uppercase tracking-widest mb-3">Výplaty (sázka × multiplikátor)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SECTORS.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-[oklch(0.78_0.16_75/0.15)]">
              <span className="text-sm font-bold" style={{ color: s.mult === 0 ? "#c86a6a" : "#f2c14b" }}>{s.label}</span>
              <span className="text-xs text-[oklch(0.75_0.04_75)]">×{s.mult}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[oklch(0.7_0.04_75)]">
          Bez vkladů, bez reálných peněz — pouze virtuální mince pro zábavu.
        </p>
      </div>
    </div>
  );
}