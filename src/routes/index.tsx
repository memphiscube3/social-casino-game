import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { WheelOfFortune } from "@/components/wheel-of-fortune";
import { Sparkles, Coins, Shield, Trophy, ChevronDown, Leaf, Compass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jungle Circle — Kolo štěstí zdarma" },
      { name: "description", content: "Sociální kasino s džunglovým kolem štěstí. Roztočte kolo, sbírejte virtuální mince a bavte se zdarma." },
      { property: "og:title", content: "Jungle Circle — Kolo štěstí" },
      { property: "og:description", content: "Roztočte kolo divoké džungle pod velkým stanem. Hrajte zdarma." },
    ],
  }),
  component: Index,
});

const faqs = [
  { q: "Co je sociální kasino?", a: "Zábavní herní platforma s virtuálními mincemi. Není to hazardní hra o reálné peníze." },
  { q: "Je hra opravdu zdarma?", a: "Ano. Hra je 100 % zdarma a nepožaduje žádné vklady ani platby." },
  { q: "Mohu vyhrát reálné peníze?", a: "Ne. Virtuální mince nemají peněžní hodnotu a nelze je vyměnit za peníze, zboží ani služby." },
  { q: "Jak získat další mince?", a: "Stiskněte tlačítko +500 zdarma v herní obrazovce nebo se zaregistrujte pro uložení pokroku." },
  { q: "Co dělat, když hra nefunguje?", a: "Obnovte stránku, vyzkoušejte jiný prohlížeč nebo nás kontaktujte přes formulář v sekci Kontakt." },
  { q: "Jak obnovit účet?", a: "Použijte funkci „Zapomenuté heslo“ na přihlašovací obrazovce nebo nás kontaktujte." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-xl border border-[oklch(0.78_0.16_75/0.3)] bg-[oklch(0.22_0.06_155)] overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
            <span className="text-[oklch(0.95_0.04_85)] font-semibold">{f.q}</span>
            <ChevronDown className={`h-5 w-5 text-[oklch(0.88_0.16_85)] transition ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-4 pb-4 text-sm text-[oklch(0.85_0.04_75)]">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

function Index() {
  const { user } = useAuth();
  return (
    <SiteLayout>
      {/* HERO + WHEEL */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-jungle-grad" />
        {/* Vine silhouettes */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-screen"
             style={{
               backgroundImage:
                 "radial-gradient(circle at 8% 10%, oklch(0.5 0.2 145 / 0.35), transparent 30%)," +
                 "radial-gradient(circle at 92% 20%, oklch(0.45 0.2 155 / 0.35), transparent 32%)," +
                 "radial-gradient(circle at 50% 100%, oklch(0.35 0.15 150 / 0.5), transparent 55%)",
             }}
        />
        <div className="max-w-5xl mx-auto px-4 pt-12 sm:pt-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.28_0.09_155)]/70 border border-[oklch(0.75_0.22_135/0.45)] mb-6">
            <Leaf className="h-3.5 w-3.5 text-[oklch(0.86_0.24_130)]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[oklch(0.86_0.24_130)] font-semibold">Vstupte do džungle</span>
          </div>
          <h1 className="mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            <span className="block text-6xl sm:text-8xl md:text-9xl leading-[0.85] text-gold drop-shadow-[0_8px_30px_oklch(0.5_0.15_60/0.6)]">JUNGLE</span>
            <span className="block text-5xl sm:text-7xl md:text-8xl leading-[0.85] text-lime tracking-[0.15em] drop-shadow-[0_0_40px_oklch(0.75_0.24_135/0.6)]">CIRCLE</span>
          </h1>
          <p className="text-lg sm:text-xl text-[oklch(0.92_0.04_95)] mb-2 font-medium">Roztočte kolo divoké džungle</p>
          <p className="text-sm text-[oklch(0.82_0.04_95)] max-w-xl mx-auto mb-10">
            Poklad ztracené civilizace čeká. Bez vkladů, bez reálných peněz — jen dobrodružství a virtuální zlato.
          </p>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-16 relative">
          <WheelOfFortune />
          {!user && (
            <div className="mt-8 max-w-xl mx-auto rounded-2xl bg-[oklch(0.22_0.06_155)] border border-[oklch(0.75_0.22_135/0.45)] p-6 text-center shadow-lime">
              <h3 className="text-2xl text-lime mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}>Uložte si pokrok</h3>
              <p className="text-sm text-[oklch(0.85_0.04_95)] mb-4">
                Zaregistrujte se zdarma a vaše mince, historie i jackpoty zůstanou s vámi v táboře průzkumníků.
              </p>
              <Link to="/prihlaseni" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-lime-grad text-[oklch(0.15_0.06_155)] font-bold uppercase tracking-widest shadow-lime">
                <Sparkles className="h-4 w-4" /> Registrovat se
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-12">Proč Jungle Circle</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Coins, t: "Zcela zdarma", d: "Žádné vklady, žádné mikrotransakce. Hrajte tak dlouho, jak chcete." },
            { icon: Shield, t: "Bezpečné", d: "Sociální kasino bez reálných peněz. Pouze virtuální mince pro zábavu." },
            { icon: Trophy, t: "Ukládání pokroku", d: "Zaregistrujte se a vaše mince, výhry a historie zůstanou s vámi." },
            { icon: Sparkles, t: "Cirkusová atmosféra", d: "Unikátní design, ohnivé symboly a dramatické animace." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl p-6 bg-[oklch(0.22_0.06_155)] border border-[oklch(0.78_0.16_75/0.3)] hover:border-[oklch(0.78_0.16_75/0.7)] transition">
              <div className="w-12 h-12 rounded-full bg-gold-grad flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-[oklch(0.2_0.06_155)]" />
              </div>
              <h3 className="text-lg text-gold mb-2">{f.t}</h3>
              <p className="text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO PLAY */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-12">Jak hrát</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Nastavte sázku", d: "Vyberte velikost sázky pomocí tlačítek + a −. Sázka se odečte z vašich virtuálních mincí při každém spinu." },
            { n: "02", t: "Roztočte kolo", d: "Stiskněte velké zlaté tlačítko a sledujte, jak se kolo divoké džungle roztočí pod zlatým ukazatelem." },
            { n: "03", t: "Vyhrávejte mince", d: "Kolo se zastaví na jednom z 8 sektorů. Výhra = sázka × multiplikátor. JACKPOT vrací až ×100!" },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl p-6 bg-gradient-to-br from-[oklch(0.28_0.12_155)] to-[oklch(0.18_0.06_155)] border border-[oklch(0.78_0.16_75/0.4)] relative overflow-hidden">
              <div className="absolute -top-2 -right-2 text-7xl font-black text-gold opacity-20">{s.n}</div>
              <h3 className="text-xl text-gold mb-3 relative">{s.t}</h3>
              <p className="text-sm text-[oklch(0.85_0.04_75)] relative leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-10">Časté otázky</h2>
        <Faq />
      </section>

      {/* DISCLAIMER */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-[oklch(0.22_0.06_155)] border border-[oklch(0.55_0.22_30/0.5)] p-6 text-center">
          <p className="text-sm text-[oklch(0.9_0.04_75)] leading-relaxed">
            <strong className="text-gold">Důležité upozornění:</strong> Jungle Circle je sociální kasino a není hazardní hrou o reálné peníze.
            Veškeré virtuální mince nemají peněžní hodnotu a nelze je vyměnit za peníze, zboží ani služby. Hra je určena pouze pro osoby starší 18 let.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
