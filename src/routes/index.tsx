import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
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
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getLeaderboard, type LeaderboardRow } from "@/lib/leaderboard.functions";

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


function Index() {
  const { user } = useAuth();

  return (
    <SiteLayout>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-jungle-grad" />
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
              <p className="text-sm sm:text-base text-[oklch(0.82_0.04_95)] mb-4 max-w-lg leading-relaxed">
                Vydejte se do ztracené civilizace, roztočte kolo pokladů a získejte místo v ligách odvážných průzkumníků.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Star, text: "Free Social Casino" },
                  { icon: Coins, text: "Virtual Coins Only" },
                  { icon: Ban, text: "No Real Money" },
                  { icon: Smile, text: "Play for Fun" },
                ].map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[oklch(0.22_0.06_155)]/80 border border-[oklch(0.78_0.16_75/0.35)] text-[10px] sm:text-xs uppercase tracking-widest text-[oklch(0.88_0.16_85)]"
                  >
                    <b.icon className="h-3.5 w-3.5 text-[oklch(0.86_0.17_90)]" /> {b.text}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href="/kolo"
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
              <div className="text-4xl sm:text-6xl font-display font-bold text-gold leading-none mb-1">
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
            ].map((s, i) => {
              const card = (
                <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.28_0.09_155)]/90 to-[oklch(0.16_0.05_155)]/90 backdrop-blur border border-[oklch(0.78_0.16_75/0.35)] p-6 hover:border-[oklch(0.86_0.17_90)] transition group relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 text-6xl font-display text-gold opacity-15">
                    {s.num}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gold-grad flex items-center justify-center mb-4 shadow-gold group-hover:animate-tilt">
                    <s.icon className="h-7 w-7 text-[oklch(0.2_0.06_155)]" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[oklch(0.75_0.04_95)] mb-2">{s.title}</div>
                  <h3 className="text-lg text-gold mb-3">{s.head}</h3>
                  <p className="text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{s.desc}</p>
                </div>
              );

              return (
                <div key={i} className="relative">
                  {i === 0 && !user ? (
                    <Link
                      to="/prihlaseni"
                      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.82_0.17_90)]"
                    >
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                  {i < 2 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-2xl text-gold">
                      »
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CTA — KOLO ŠTĚSTÍ ========== */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10 bg-jungle-grad opacity-70" />
        <div className="max-w-3xl mx-auto px-4 relative text-center">
          <h2 className="text-3xl sm:text-5xl mb-4">
            <span className="text-gold">KOLO </span>
            <span className="text-[oklch(0.96_0.03_95)]">POKLADŮ</span>
          </h2>
          <p className="text-[oklch(0.85_0.04_75)] mb-8 max-w-xl mx-auto">
            Roztočte kolo pod pohledem strážce džungle a zjistěte, jaký poklad vám osud přisoudí.
          </p>
          <Link
            to="/kolo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold-grad text-[oklch(0.2_0.06_155)] font-bold uppercase tracking-widest text-base shadow-gold hover:brightness-110 hover:scale-[1.02] transition"
          >
            <Play className="h-5 w-5" /> Hrát kolo štěstí
          </Link>
          {!user && (
            <div className="mt-10 max-w-xl mx-auto rounded-2xl bg-[oklch(0.22_0.06_155)]/85 backdrop-blur border border-[oklch(0.75_0.22_135/0.5)] p-6 text-center shadow-lime">
              <h3 className="text-2xl text-lime mb-2 tracking-widest">
                Uložte si pokrok
              </h3>
              <p className="text-sm text-[oklch(0.85_0.04_95)] mb-4">
                Zaregistrujte se zdarma a vaše mince, historie i jackpoty zůstanou s vámi v táboře průzkumníků.
              </p>
              <Link to="/prihlaseni" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-lime-grad text-[oklch(0.15_0.06_155)] font-bold uppercase tracking-widest shadow-lime hover:brightness-110 transition">
                <Sparkles className="h-4 w-4" /> Registrovat se
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* ========== 3 NOMINACE ========== */}
      <section className="relative overflow-hidden py-16">
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
                    <div className="text-2xl font-display font-bold text-gold">{n.prize}</div>
                  </div>
                  <p className="text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ŽIVÝ ŽEBŘÍČEK ========== */}
      <LiveLeaderboardSection />


      {/* ========== JAK SE URČUJÍ VÍTĚZOVÉ ========== */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.09_155),transparent_70%)]" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
            <div className="relative flex items-center justify-center animate-tilt">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.86_0.17_90/0.3),transparent_65%)] blur-2xl" />
              <img src={jungleLogo} alt="Jungle Circle" className="relative w-full max-w-sm h-auto drop-shadow-[0_20px_50px_oklch(0.1_0.05_155/0.9)]" />
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
                  href="/kolo"
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

function LiveLeaderboardSection() {
  const fetchLeaderboard = useServerFn(getLeaderboard);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await fetchLeaderboard({ data: { limit: 10 } });
        if (alive) setRows(data);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [fetchLeaderboard]);

  const medalIcon = (r: number) => {
    if (r === 1) return <Crown className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />;
    if (r === 2) return <Medal className="h-4 w-4 text-[oklch(0.85_0.05_75)]" />;
    if (r === 3) return <Medal className="h-4 w-4 text-[oklch(0.65_0.15_50)]" />;
    return <span className="text-xs text-[oklch(0.75_0.04_95)] w-4 inline-block text-center">{r}</span>;
  };

  return (
    <section className="relative overflow-hidden py-16 bg-[oklch(0.14_0.05_155)]/70">
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.28_0.12_155)] border border-[oklch(0.78_0.16_75/0.5)] text-[10px] uppercase tracking-widest text-gold mb-3">
              <Trophy className="h-3.5 w-3.5" /> Živý žebříček
            </div>
            <h2 className="text-3xl sm:text-5xl">
              <span className="text-gold">KRÁLOVÉ </span>
              <span className="text-[oklch(0.96_0.03_95)]">DŽUNGLE</span>
            </h2>
            <p className="text-[oklch(0.85_0.04_75)] mt-3 max-w-2xl leading-relaxed">
              Nejbohatší ringmasteři podle nasbíraných mincí. Aktualizuje se každých 15 sekund.
            </p>
          </div>
          <Link
            to="/zebricek"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-grad text-[oklch(0.2_0.06_155)] text-sm font-bold uppercase tracking-widest shadow-gold hover:brightness-110 transition"
          >
            Celý žebříček
          </Link>
        </div>

        <div className="rounded-2xl bg-[oklch(0.2_0.06_155)]/90 backdrop-blur border border-[oklch(0.78_0.16_75/0.35)] overflow-hidden">
          {loading && rows.length === 0 ? (
            <p className="text-center text-[oklch(0.85_0.04_75)] py-10">Načítání…</p>
          ) : rows.length === 0 ? (
            <p className="text-center text-[oklch(0.85_0.04_75)] py-10">Buďte prvním hráčem v žebříčku!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[oklch(0.75_0.04_95)] uppercase text-xs tracking-widest bg-black/30">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Hráč</th>
                    <th className="py-3 px-4 text-right">Mince</th>
                    <th className="py-3 px-4 text-right hidden sm:table-cell">Max. výhra</th>
                    <th className="py-3 px-4 text-right hidden md:table-cell">Výher</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.username + r.rank} className="border-t border-[oklch(0.78_0.16_75/0.1)]">
                      <td className="py-2.5 px-4">{medalIcon(r.rank)}</td>
                      <td className="py-2.5 px-4 font-semibold text-[oklch(0.95_0.04_85)]">{r.username}</td>
                      <td className="py-2.5 px-4 text-right text-gold font-bold tabular-nums">{r.coins.toLocaleString("cs-CZ")}</td>
                      <td className="py-2.5 px-4 text-right text-[oklch(0.9_0.04_85)] tabular-nums hidden sm:table-cell">{r.biggest_win.toLocaleString("cs-CZ")}</td>
                      <td className="py-2.5 px-4 text-right text-[oklch(0.9_0.04_85)] tabular-nums hidden md:table-cell">{r.total_wins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
