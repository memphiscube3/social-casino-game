import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { WheelOfFortune } from "@/components/wheel-of-fortune";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/kolo")({
  head: () => ({
    meta: [
      { title: "Kolo štěstí — Jungle Circle" },
      { name: "description", content: "Roztočte kolo pokladů džungle. 8 sektorů, jackpot ×100. Zdarma a bez vkladů." },
      { property: "og:title", content: "Kolo štěstí — Jungle Circle" },
      { property: "og:description", content: "Roztočte kolo pokladů džungle. 8 sektorů, jackpot ×100." },
    ],
  }),
  component: KoloPage,
});

function KoloPage() {
  const { user } = useAuth();
  return (
    <SiteLayout>
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 -z-10 bg-jungle-grad" />
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-[oklch(0.85_0.05_75)] hover:text-[oklch(0.88_0.16_85)] mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Zpět
          </Link>

          <h1 className="text-4xl sm:text-6xl text-center mb-4">
            <span className="text-gold">KOLO </span>
            <span className="text-[oklch(0.96_0.03_95)]">POKLADŮ</span>
          </h1>
          <p className="text-center text-[oklch(0.85_0.04_75)] mb-10 max-w-xl mx-auto">
            Roztočte kolo pod pohledem strážce džungle a zjistěte, jaký poklad vám osud přisoudí.
          </p>

          <WheelOfFortune />

          {!user && (
            <div className="mt-10 max-w-xl mx-auto rounded-2xl bg-[oklch(0.22_0.06_155)]/85 backdrop-blur border border-[oklch(0.75_0.22_135/0.5)] p-6 text-center shadow-lime">
              <h3
                className="text-2xl text-lime mb-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
              >
                Uložte si pokrok
              </h3>
              <p className="text-sm text-[oklch(0.85_0.04_95)] mb-4">
                Zaregistrujte se zdarma a vaše mince, historie i jackpoty zůstanou s vámi v táboře průzkumníků.
              </p>
              <Link
                to="/prihlaseni"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-lime-grad text-[oklch(0.15_0.06_155)] font-bold uppercase tracking-widest shadow-lime hover:brightness-110 transition"
              >
                <Sparkles className="h-4 w-4" /> Registrovat se
              </Link>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
