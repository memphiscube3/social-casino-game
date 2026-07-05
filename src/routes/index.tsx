import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { WheelOfFortune } from "@/components/wheel-of-fortune";
import { JungleAmbient, JungleLeaf, GoldCoin, Firefly } from "@/components/jungle-decor";
import {
  Sparkles,
  Coins,
  Shield,
  Trophy,
  ChevronDown,
  Leaf,
  Compass,
  LogIn,
  FileText,
  Crown,
  Award,
  Medal,
  Target,
  Zap,
  Play,
  Info,
} from "lucide-react";
import jungleLogo from "@/assets/jungle-logo.png";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jungle Circle — Kolo štěstí zdarma v divoké džungli" },
      { name: "description", content: "Vydejte se do ztracené džungle a roztočte kolo pokladů. 3 nominace, 3 ligy, jackpot ×100. Hrajte zdarma, sbírejte virtuální mince." },
      { property: "og:title", content: "Jungle Circle — Kolo štěstí" },
      { property: "og:description", content: "Roztočte kolo divoké džungle. 3 nominace, 3 ligy, jackpot ×100. Zdarma." },
    ],
  }),
  component: Index,
});

const faqs = [
  { q: "Co je Jungle Circle?", a: "Sociální kasino v atmosféře divoké džungle. Roztáčejte kolo štěstí a sbírejte virtuální mince — bez vkladů, bez reálných peněz." },
  { q: "Je hra opravdu zdarma?", a: "Ano, 100 % zdarma. Žádné vklady, žádné mikrotransakce, žádné povinné platby." },
  { q: "Mohu vyhrát reálné peníze?", a: "Ne. Virtuální mince nemají peněžní hodnotu a nelze je vyměnit za peníze, zboží ani služby." },
  { q: "Jak získat další mince?", a: "Stiskněte tlačítko +500 zdarma v herní obrazovce nebo se zaregistrujte pro uložení pokroku a bonusy." },
  { q: "Jak fungují ligy?", a: "Podle statusu hráče jste zařazeni do jedné ze tří lig. Každá liga má vlastní žebříček a bonusový fond mincí." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-xl border border-[oklch(0.78_0.16_75/0.3)] bg-[oklch(0.22_0.06_155)]/80 backdrop-blur overflow-hidden hover:border-[oklch(0.78_0.16_75/0.6)] transition">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
            <span className="text-[oklch(0.95_0.04_85)] font-semibold">{f.q}</span>
            <ChevronDown className={`h-5 w-5 text-[oklch(0.88_0.16_85)] transition ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-4 pb-4 text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

const nominations = [
  {
    icon: Crown,
    title: "Zlatý objevitel",
    prize: "5 000 mincí",
    desc: "V této nominaci soutěží každý hráč. Kdo najde nejvíc pokladů za měsíc, získá zlatý pohár a bonus mincí.",
    accent: "oklch(0.86 0.17 90)",
  },
  {
    icon: Award,
    title: "Mistr džungle",
    prize: "3 000 mincí",
    desc: "Ocenění pro hráče s nejdelší sérií výher a nejvyšším multiplikátorem během jednoho spinu.",
    accent: "oklch(0.75 0.22 135)",
  },
  {
    icon: Medal,
    title: "Statečné srdce",
    prize: "2 000 mincí",
    desc: "Pro odvážlivce, kteří sázeli nejvíc mincí a nejčastěji roztáčeli kolo divoké džungle.",
    accent: "oklch(0.7 0.2 45)",
  },
];

const leagues = [
  {
    tier: "I",
    name: "Liga zlatých pum",
    prize: "10 000 mincí",
    players: [
      { pos: 1, nick: "Hráč 1", pts: "24 000", reward: "5 000 mincí" },
      { pos: 2, nick: "Hráč 2", pts: "22 000", reward: "2 500 mincí" },
      { pos: 3, nick: "Hráč 3", pts: "20 000", reward: "1 500 mincí" },
      { pos: 4, nick: "Hráč 4", pts: "18 000", reward: "700 mincí" },
      { pos: 5, nick: "Hráč 5", pts: "16 000", reward: "300 mincí" },
    ],
    status: "Známý, Vynikající, Guru, Elita, Legenda.",
  },
  {
    tier: "II",
    name: "Liga smaragdových hadů",
    prize: "5 000 mincí",
    players: [
      { pos: 1, nick: "Hráč 1", pts: "12 000", reward: "2 500 mincí" },
      { pos: 2, nick: "Hráč 2", pts: "11 000", reward: "1 250 mincí" },
      { pos: 3, nick: "Hráč 3", pts: "10 000", reward: "750 mincí" },
      { pos: 4, nick: "Hráč 4", pts: "9 000", reward: "350 mincí" },
      { pos: 5, nick: "Hráč 5", pts: "8 000", reward: "150 mincí" },
    ],
    status: "Amatér, Znalec.",
  },
  {
    tier: "III",
    name: "Liga divokých papoušků",
    prize: "2 500 mincí",
    players: [
      { pos: 1, nick: "Hráč 1", pts: "6 000", reward: "1 250 mincí" },
      { pos: 2, nick: "Hráč 2", pts: "5 500", reward: "625 mincí" },
      { pos: 3, nick: "Hráč 3", pts: "5 000", reward: "375 mincí" },
      { pos: 4, nick: "Hráč 4", pts: "4 500", reward: "175 mincí" },
      { pos: 5, nick: "Hráč 5", pts: "4 000", reward: "75 mincí" },
    ],
    status: "Nováček, Nadšenec.",
  },
];

function Index() {
  const { user } = useAuth();

  return (
    <SiteLayout>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-jungle-grad" />
        <JungleAmbient />

        <div className="max-w-7xl mx-auto px-4 pt-14 sm:pt-20 pb-16 relative">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
            {/* Left: title + CTA */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.28_0.09_155)]/70 border border-[oklch(0.75_0.22_135/0.45)] mb-6 backdrop-blur">
                <Leaf className="h-3.5 w-3.5 text-[oklch(0.86_0.24_130)] animate-vine" />
                <span className="text-xs uppercase tracking-[0.3em] text-[oklch(0.86_0.24_130)] font-semibold">Nový formát · Sezóna džungle</span>
              </div>

              <h1 className="mb-4">
                <span className="block text-4xl sm:text-6xl lg:text-7xl text-gold leading-none">JUNGLE CIRCLE</span>
                <span className="block text-3xl sm:text-5xl lg:text-6xl text-[oklch(0.96_0.03_95)] leading-none mt-2">CHALLENGE</span>
              </h1>

              <p className="text-lg sm:text-2xl text-[oklch(0.92_0.04_95)] mb-2 font-medium">
                Rozdáme <span className="text-gold text-3xl sm:text-4xl font-black">100 000</span> mincí
              </p>
              <p className="text-sm sm:text-base text-[oklch(0.82_0.04_95)] mb-8 max-w-lg leading-relaxed">
                Vydejte se do ztracené civilizace, roztočte kolo pokladů a získejte místo v ligách odvážných průzkumníků.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href="#kolo"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gold-grad text-[oklch(0.2_0.06_155)] font-bold uppercase tracking-widest text-sm shadow-gold hover:brightness-110 hover:scale-[1.02] transition"
                >
                  <Play className="h-4 w-4" /> Roztočit kolo
                </a>
                <a
                  href="#pravidla"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[oklch(0.22_0.06_155)]/80 backdrop-blur border border-[oklch(0.78_0.16_75/0.5)] text-[oklch(0.92_0.04_95)] font-semibold uppercase tracking-widest text-sm hover:border-[oklch(0.86_0.17_90)] transition"
                >
                  <Info className="h-4 w-4 text-[oklch(0.88_0.16_85)]" /> Pravidla hry
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[oklch(0.82_0.04_75)]">
                <span>S podporou</span>
                <span className="px-3 py-1.5 rounded bg-[oklch(0.18_0.06_155)] border border-[oklch(0.78_0.16_75/0.4)] text-gold font-bold">🌿 JUNGLE CO.</span>
              </div>
            </div>

            {/* Right: logo mascot with floating decor */}
            <div className="relative flex items-center justify-center animate-tilt">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.86_0.17_90/0.25),transparent_65%)] blur-2xl" />
              <img
                src={jungleLogo}
                alt="Jungle Circle"
                width={1536}
                height={896}
                className="relative w-full max-w-md h-auto drop-shadow-[0_25px_60px_oklch(0.1_0.05_155/0.95)]"
              />
              <GoldCoin className="top-[10%] left-[-5%]" size={44} delay={0} />
              <GoldCoin className="bottom-[15%] right-[-2%]" size={36} delay={1.2} />
              <GoldCoin className="top-[45%] right-[8%]" size={28} delay={2.4} />
              <JungleLeaf className="top-[-5%] right-[10%] rotate-[45deg]" size={80} delay={0.5} />
              <JungleLeaf className="bottom-[-5%] left-[5%] rotate-[-30deg]" size={70} delay={2} color="oklch(0.6 0.22 135)" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="relative bg-[oklch(0.18_0.06_155)]/85 backdrop-blur border-y border-[oklch(0.78_0.16_75/0.3)] overflow-hidden">
        <div className="absolute inset-0 animate-shimmer opacity-40" />
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 relative">
          {[
            { n: "3", label: "NOMINACE", sub: "Zlatý objevitel, Mistr džungle, Statečné srdce" },
            { n: "18", label: "VÍTĚZŮ", sub: "6 vítězů v každé ze tří lig" },
            { n: "100k", label: "MINCÍ", sub: "Fond první ligy — až 10 000 mincí pro vítěze" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl sm:text-6xl font-black text-gold leading-none mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {s.n}
              </div>
              <div className="text-xs sm:text-sm uppercase tracking-widest text-[oklch(0.95_0.04_85)] font-bold mb-1">{s.label}</div>
              <div className="hidden sm:block text-xs text-[oklch(0.75_0.04_95)] leading-snug">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== POPIS ========== */}
      <section className="relative overflow-hidden">
        <JungleLeaf className="top-10 left-[3%] rotate-[-15deg]" size={100} delay={0.5} />
        <GoldCoin className="top-[30%] left-[6%]" size={40} delay={1.5} />
        <div className="max-w-4xl mx-auto px-4 py-16 relative">
          <h2 className="text-3xl sm:text-5xl mb-6">
            <span className="text-[oklch(0.96_0.03_95)]">POPIS </span>
            <span className="text-gold">TURNAJE</span>
          </h2>
          <div className="space-y-4 text-[oklch(0.9_0.04_95)] leading-relaxed">
            <p>
              <span className="text-gold font-semibold">1. srpna</span> odstartovala nová sezóna Jungle Circle Challenge — turnaj v duchu ztracené civilizace,
              kde zlato a poklady čekají v hloubi divoké džungle.
            </p>
            <p>
              Účastníci turnaje jsou rozděleni do <span className="text-lime font-semibold">3 lig</span> podle svého statusu na webu a bojují také o vítězství
              ve <span className="text-lime font-semibold">3 nominacích</span>: Zlatý objevitel, Mistr džungle a Statečné srdce.
            </p>
            <p>
              Na konci měsíce redakční rada Jungle Circle určí vítěze v nominacích, zatímco žebříčky lig se počítají automaticky podle nasbíraných mincí.
              Top 5 hráčů v každé lize získává bonusy od <span className="text-gold font-semibold">15 až 10 000 mincí</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ========== JAK HRÁT (3 kroky) ========== */}
      <section id="pravidla" className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.25_0.08_155/0.6),transparent_70%)]" />
        <JungleLeaf className="top-8 right-[5%] rotate-[120deg]" size={110} delay={1} color="oklch(0.5 0.2 150)" />
        <Firefly className="top-[20%] left-[10%]" delay={0} />
        <Firefly className="bottom-[15%] right-[15%]" delay={2} size={5} />

        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-3xl sm:text-5xl text-center mb-12">
            <span className="text-[oklch(0.96_0.03_95)]">JAK </span>
            <span className="text-gold">PŘIJMOUT VÝZVU</span>
            <span className="text-[oklch(0.96_0.03_95)]"> DŽUNGLE?</span>
          </h2>
          <p className="text-center text-[oklch(0.85_0.04_75)] mb-10 max-w-2xl mx-auto">
            Abyste se stali součástí Jungle Circle Challenge, potřebujete jen tři kroky:
          </p>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              {
                icon: LogIn,
                num: "1",
                title: "Krok první",
                head: "Zaregistrujte se v táboře",
                desc: "Nebo pokračujte ve své průzkumné cestě, pokud už jste s námi.",
              },
              {
                icon: FileText,
                num: "2",
                title: "Krok druhý",
                head: "Roztočte kolo štěstí",
                desc: "Sázejte, hrajte a sbírejte mince. Každý spin se počítá do žebříčku vaší ligy.",
              },
              {
                icon: Trophy,
                num: "3",
                title: "Krok třetí",
                head: "Staňte se vítězem",
                desc: "Máte šanci vyhrát v každé ze tří nominací a dostat se do TOP 5 své ligy.",
              },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.28_0.09_155)]/90 to-[oklch(0.16_0.05_155)]/90 backdrop-blur border border-[oklch(0.78_0.16_75/0.35)] p-6 hover:border-[oklch(0.86_0.17_90)] transition group relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 text-6xl font-black text-gold opacity-15" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {s.num}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gold-grad flex items-center justify-center mb-4 shadow-gold group-hover:animate-tilt">
                    <s.icon className="h-7 w-7 text-[oklch(0.2_0.06_155)]" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[oklch(0.75_0.04_95)] mb-2">{s.title}</div>
                  <h3 className="text-lg text-gold mb-3">{s.head}</h3>
                  <p className="text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-2xl text-gold">
                    »
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== KOLO ŠTĚSTÍ (centrální hra) ========== */}
      <section id="kolo" className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10 bg-jungle-grad opacity-70" />
        <JungleAmbient />
        <div className="max-w-4xl mx-auto px-4 relative">
          <h2 className="text-3xl sm:text-5xl text-center mb-4">
            <span className="text-gold">KOLO </span>
            <span className="text-[oklch(0.96_0.03_95)]">POKLADŮ</span>
          </h2>
          <p className="text-center text-[oklch(0.85_0.04_75)] mb-10 max-w-xl mx-auto">
            Roztočte kolo pod pohledem strážce džungle a zjistěte, jaký poklad vám osud přisoudí.
          </p>
          <WheelOfFortune />
          {!user && (
            <div className="mt-10 max-w-xl mx-auto rounded-2xl bg-[oklch(0.22_0.06_155)]/85 backdrop-blur border border-[oklch(0.75_0.22_135/0.5)] p-6 text-center shadow-lime relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer opacity-30" />
              <h3 className="text-2xl text-lime mb-2 relative" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}>
                Uložte si pokrok
              </h3>
              <p className="text-sm text-[oklch(0.85_0.04_95)] mb-4 relative">
                Zaregistrujte se zdarma a vaše mince, historie i jackpoty zůstanou s vámi v táboře průzkumníků.
              </p>
              <Link to="/prihlaseni" className="relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-lime-grad text-[oklch(0.15_0.06_155)] font-bold uppercase tracking-widest shadow-lime hover:brightness-110 transition">
                <Sparkles className="h-4 w-4" /> Registrovat se
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========== 3 NOMINACE ========== */}
      <section className="relative overflow-hidden py-16">
        <JungleLeaf className="top-[10%] left-[2%] rotate-[-30deg]" size={140} delay={0.8} />
        <JungleLeaf className="bottom-[8%] right-[3%] rotate-[210deg]" size={120} delay={2.3} color="oklch(0.55 0.2 145)" />
        <GoldCoin className="top-[40%] right-[8%]" size={44} delay={0.4} />

        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-3xl sm:text-5xl mb-4 max-w-3xl">
            <span className="text-gold">3 NOMINACE</span>
            <span className="text-[oklch(0.96_0.03_95)]"> JUNGLE CIRCLE CHALLENGE</span>
          </h2>
          <p className="text-[oklch(0.85_0.04_75)] mb-4 max-w-3xl leading-relaxed">
            V nové sezóně zůstává hlavní fond stejně velkorysý: <span className="text-gold font-semibold">100 000 mincí</span>. Účastníci soutěží nejen o místa v ligách,
            ale i o vítězství ve třech samostatných nominacích s exkluzivními odměnami.
          </p>
          <p className="text-[oklch(0.85_0.04_75)] mb-10 max-w-3xl leading-relaxed">
            Kompetentní porota strážců džungle určí, kdo si zaslouží zlato. Celkem 3 nominace, každá s vlastní odměnou.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {nominations.map((n, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-b from-[oklch(0.22_0.06_155)]/90 to-[oklch(0.13_0.05_155)]/90 backdrop-blur border border-[oklch(0.78_0.16_75/0.3)] overflow-hidden hover:border-[oklch(0.86_0.17_90)] hover:scale-[1.02] transition group"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:animate-tilt"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${n.accent}, oklch(0.15 0.05 155))`,
                      boxShadow: `0 0 30px ${n.accent}88`,
                      border: `2px solid ${n.accent}`,
                    }}
                  >
                    <n.icon className="h-10 w-10 text-[oklch(0.15_0.05_155)]" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-xl mb-3" style={{ color: n.accent }}>{n.title}</h3>
                  <div className="w-full rounded-lg bg-[oklch(0.14_0.05_155)] border border-[oklch(0.78_0.16_75/0.3)] py-3 mb-4">
                    <div className="text-xs uppercase tracking-widest text-[oklch(0.75_0.04_95)] mb-1">Hlavní cena</div>
                    <div className="text-2xl font-black text-gold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{n.prize}</div>
                  </div>
                  <p className="text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 3 LIGY ========== */}
      <section className="relative overflow-hidden py-16 bg-[oklch(0.14_0.05_155)]/70">
        <Firefly className="top-[10%] left-[5%]" delay={0.3} />
        <Firefly className="top-[60%] right-[8%]" delay={1.7} size={5} />
        <JungleLeaf className="bottom-[5%] left-[3%] rotate-[60deg]" size={100} delay={1.5} />

        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-3xl sm:text-5xl mb-4">
            <span className="text-gold">3 LIGY </span>
            <span className="text-[oklch(0.96_0.03_95)]">JUNGLE CIRCLE</span>
          </h2>
          <p className="text-[oklch(0.85_0.04_75)] mb-10 max-w-3xl leading-relaxed">
            Od 1. srpna platí v Jungle Circle systém 3 lig. Hráči jsou rozděleni podle svého statusu. Vítěz první ligy získává až <span className="text-gold font-semibold">10 000 mincí</span>!
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {leagues.map((lg) => (
              <div key={lg.tier} className="rounded-2xl bg-[oklch(0.2_0.06_155)]/90 backdrop-blur border border-[oklch(0.78_0.16_75/0.35)] p-5 hover:border-[oklch(0.86_0.17_90)] transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gold-grad flex items-center justify-center shadow-gold text-[oklch(0.15_0.05_155)] font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {lg.tier}
                  </div>
                  <div>
                    <div className="text-gold font-bold text-lg leading-tight">{lg.name}</div>
                    <div className="text-xs text-[oklch(0.75_0.04_95)]">Fond: <span className="text-lime font-semibold">{lg.prize}</span></div>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[oklch(0.75_0.04_95)] text-xs uppercase tracking-wider border-b border-[oklch(0.78_0.16_75/0.2)]">
                      <th className="text-left py-2 font-medium">#</th>
                      <th className="text-left py-2 font-medium">Nick</th>
                      <th className="text-right py-2 font-medium">Body</th>
                      <th className="text-right py-2 font-medium">Cena</th>
                    </tr>
                  </thead>
                  <tbody className="text-[oklch(0.92_0.04_95)]">
                    {lg.players.map((p) => (
                      <tr key={p.pos} className="border-b border-[oklch(0.78_0.16_75/0.08)] last:border-0">
                        <td className="py-2 text-gold font-bold">{p.pos}</td>
                        <td className="py-2">{p.nick}</td>
                        <td className="py-2 text-right">{p.pts}</td>
                        <td className="py-2 text-right text-lime font-semibold">{p.reward}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-[oklch(0.75_0.04_95)] leading-snug">
                  Účastní se hráči se statusem: <span className="text-[oklch(0.92_0.04_95)]">{lg.status}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[oklch(0.75_0.04_95)] text-center max-w-3xl mx-auto">
            Za aktualizacemi žebříčku můžete sledovat v reálném čase na hlavní stránce. Hodně štěstí, průzkumníku!
          </p>
        </div>
      </section>

      {/* ========== JAK SE URČUJÍ VÍTĚZOVÉ ========== */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.09_155),transparent_70%)]" />
        <JungleAmbient />

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
            <div className="relative flex items-center justify-center animate-tilt">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.86_0.17_90/0.3),transparent_65%)] blur-2xl" />
              <img src={jungleLogo} alt="Jungle Circle" className="relative w-full max-w-sm h-auto drop-shadow-[0_20px_50px_oklch(0.1_0.05_155/0.9)]" />
              <GoldCoin className="top-[15%] right-[5%]" size={38} delay={0.6} />
              <GoldCoin className="bottom-[20%] left-[8%]" size={30} delay={1.8} />
            </div>
            <div>
              <h2 className="text-3xl sm:text-5xl mb-6">
                <span className="text-[oklch(0.96_0.03_95)]">JAK SE URČUJÍ </span>
                <span className="text-gold">VÍTĚZOVÉ?</span>
              </h2>
              <div className="space-y-5">
                <div className="rounded-xl bg-[oklch(0.22_0.06_155)]/70 backdrop-blur border border-[oklch(0.78_0.16_75/0.3)] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-lime" />
                    <h3 className="text-lg text-gold">V nominacích</h3>
                  </div>
                  <p className="text-sm text-[oklch(0.9_0.04_75)] leading-relaxed">
                    Na konci každého měsíce vyhlásíme trojici nejlepších v každé ze tří nominací. Vítěze určuje redakční rada strážců džungle
                    a hlasování hráčů.
                  </p>
                </div>
                <div className="rounded-xl bg-[oklch(0.22_0.06_155)]/70 backdrop-blur border border-[oklch(0.78_0.16_75/0.3)] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-lime" />
                    <h3 className="text-lg text-gold">V ligách</h3>
                  </div>
                  <p className="text-sm text-[oklch(0.9_0.04_75)] leading-relaxed">
                    Ceny v ligách se rozdělují podle nasbíraných bodů za měsíc. V systému hodnocení se zohledňují body od hráčů (dle spinů)
                    i body od redakce (bonusy za úspěchy).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="#kolo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-grad text-[oklch(0.2_0.06_155)] font-bold uppercase tracking-widest text-sm shadow-gold hover:brightness-110 hover:scale-[1.02] transition"
                >
                  <Play className="h-4 w-4" /> Roztočit kolo
                </a>
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[oklch(0.22_0.06_155)]/80 backdrop-blur border border-[oklch(0.78_0.16_75/0.5)] text-[oklch(0.92_0.04_95)] font-semibold uppercase tracking-widest text-sm hover:border-[oklch(0.86_0.17_90)] transition"
                >
                  <Info className="h-4 w-4 text-[oklch(0.88_0.16_85)]" /> Podmínky
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="max-w-7xl mx-auto px-4 py-16 relative">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-12">Proč Jungle Circle</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Coins, t: "Zcela zdarma", d: "Žádné vklady ani mikrotransakce. Hrajte jak dlouho chcete." },
            { icon: Shield, t: "Bezpečné", d: "Sociální kasino bez reálných peněz. Pouze virtuální mince pro zábavu." },
            { icon: Trophy, t: "Ukládání pokroku", d: "Zaregistrujte se a vaše mince, výhry i historie zůstanou s vámi." },
            { icon: Compass, t: "Atmosféra džungle", d: "Ztracené poklady, divoké tvory, zlato a zeleň. Dobrodružství v každém spinu." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl p-6 bg-[oklch(0.22_0.06_155)]/85 backdrop-blur border border-[oklch(0.78_0.16_75/0.3)] hover:border-[oklch(0.78_0.16_75/0.7)] hover:-translate-y-1 transition">
              <div className="w-12 h-12 rounded-full bg-gold-grad flex items-center justify-center mb-4 shadow-gold">
                <f.icon className="h-6 w-6 text-[oklch(0.2_0.06_155)]" />
              </div>
              <h3 className="text-lg text-gold mb-2">{f.t}</h3>
              <p className="text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="max-w-3xl mx-auto px-4 py-16 relative">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-10">Časté otázky</h2>
        <Faq />
      </section>

      {/* ========== DISCLAIMER ========== */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-[oklch(0.22_0.06_155)]/85 backdrop-blur border border-[oklch(0.55_0.22_30/0.5)] p-6 text-center">
          <p className="text-sm text-[oklch(0.9_0.04_75)] leading-relaxed">
            <strong className="text-gold">Důležité upozornění:</strong> Jungle Circle je sociální kasino a není hazardní hrou o reálné peníze.
            Veškeré virtuální mince nemají peněžní hodnotu a nelze je vyměnit za peníze, zboží ani služby. Hra je určena pouze pro osoby starší 18 let.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
