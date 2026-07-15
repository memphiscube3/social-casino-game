import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, Coins, LogOut, User as UserIcon, Star, Ban, Smile } from "lucide-react";
import jungleLogo from "@/assets/jungle-logo.png";
import jungleBg from "@/assets/jungle-bg.jpg";

function BrandMark({ className = "h-14" }: { className?: string }) {
  return (
    <img
      src={jungleLogo}
      alt="Jungle Circle"
      className={`${className} w-auto drop-shadow-[0_6px_20px_oklch(0.15_0.05_155/0.9)]`}
    />
  );
}

const nav = [
  { to: "/", label: "Domů" },
  { to: "/kolo", label: "Kolo štěstí" },
  { to: "/zebricek", label: "Žebříček" },
  { to: "/profil", label: "Můj kabinet" },
  { to: "/o-nas", label: "O nás" },
  { to: "/faq", label: "FAQ" },
  { to: "/kontakt", label: "Kontakt" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed jungle background */}
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${jungleBg})`, zIndex: -1 }}
      />
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[oklch(0.1_0.05_155/0.75)] via-[oklch(0.12_0.06_155/0.6)] to-[oklch(0.08_0.04_155/0.92)]"
        style={{ zIndex: -1 }}
      />
      {/* Jungle vine ornament */}
      <div className="h-8 bg-gradient-to-b from-[oklch(0.2_0.06_155)] to-transparent border-b border-[oklch(0.78_0.16_75/0.25)]">
        <div className="vine-divider vine-divider-animated" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md bg-[oklch(0.17_0.06_155/0.85)] border-b border-[oklch(0.78_0.16_75/0.25)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm uppercase tracking-widest text-[oklch(0.85_0.05_75)] hover:text-[oklch(0.88_0.16_85)] transition-colors"
                activeProps={{ className: "text-[oklch(0.88_0.16_85)]" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.28_0.12_155)] border border-[oklch(0.78_0.16_75/0.5)]">
                <Coins className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
                <span className="text-sm font-semibold text-gold">{profile.coins.toLocaleString("cs-CZ")}</span>
              </div>
            )}
            {user ? (
              <>
                <Link to="/profil" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[oklch(0.9_0.04_75)] hover:text-[oklch(0.88_0.16_85)]">
                  <UserIcon className="h-4 w-4" /> Profil
                </Link>
                <button onClick={() => signOut()} className="hidden sm:inline-flex p-2 rounded hover:bg-white/5" aria-label="Odhlásit">
                  <LogOut className="h-4 w-4 text-[oklch(0.85_0.05_75)]" />
                </button>
              </>
            ) : (
              <Link
                to="/prihlaseni"
                className="hidden sm:inline-flex px-4 py-2 rounded-md bg-gold-grad text-[oklch(0.2_0.05_155)] text-sm font-bold shadow-gold hover:brightness-110 transition"
              >
                Přihlásit
              </Link>
            )}
            <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-6 w-6 text-[oklch(0.88_0.16_85)]" /> : <Menu className="h-6 w-6 text-[oklch(0.88_0.16_85)]" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-[oklch(0.78_0.16_75/0.2)] bg-[oklch(0.18_0.06_155)]">
            <div className="px-4 py-3 flex flex-col gap-3">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-1 text-[oklch(0.9_0.04_75)]">
                  {n.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profil" onClick={() => setOpen(false)} className="py-1 text-[oklch(0.9_0.04_75)]">Profil</Link>
                  <button onClick={() => { setOpen(false); signOut(); }} className="py-1 text-left text-[oklch(0.9_0.04_75)]">Odhlásit</button>
                </>
              ) : (
                <Link to="/prihlaseni" onClick={() => setOpen(false)} className="py-1 text-[oklch(0.88_0.16_85)] font-semibold">Přihlásit / Registrace</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Trust bar — visible across the whole site */}
      <div className="border-b border-[oklch(0.78_0.16_75/0.25)] bg-[oklch(0.16_0.05_155)]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-[oklch(0.85_0.04_75)]">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-[oklch(0.86_0.17_90)]" /> Free Social Casino
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-[oklch(0.86_0.24_130)]" /> Virtual Coins Only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Ban className="h-3.5 w-3.5 text-[oklch(0.65_0.2_30)]" /> No Real Money
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Smile className="h-3.5 w-3.5 text-[oklch(0.86_0.17_90)]" /> Play for Fun
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-[oklch(0.78_0.16_75/0.25)] bg-[oklch(0.14_0.05_155)]">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-5 gap-8">
          <div>
            <div className="mb-3"><BrandMark /></div>
            <p className="text-xs text-[oklch(0.75_0.04_95)] leading-relaxed">
              Sociální kasino v duchu divoké džungle. Bez reálných peněz, bez vkladů, bez výher. Pouze pro zábavu.
            </p>
          </div>
          <div>
            <h4 className="text-gold text-sm uppercase tracking-widest mb-3">Hra</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.85_0.04_75)]">
              <li><Link to="/" className="hover:text-[oklch(0.88_0.16_85)]">Hrát zdarma</Link></li>
              <li><Link to="/profil" className="hover:text-[oklch(0.88_0.16_85)]">Můj profil</Link></li>
              <li><Link to="/faq" className="hover:text-[oklch(0.88_0.16_85)]">Časté otázky</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-sm uppercase tracking-widest mb-3">Informace</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.85_0.04_75)]">
              <li><Link to="/o-nas" className="hover:text-[oklch(0.88_0.16_85)]">O nás</Link></li>
              <li><Link to="/kontakt" className="hover:text-[oklch(0.88_0.16_85)]">Kontakt</Link></li>
              <li><Link to="/zodpovedna-hra" className="hover:text-[oklch(0.88_0.16_85)]">Zodpovědná hra</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-sm uppercase tracking-widest mb-3">Kontakt</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.85_0.04_75)]">
              <li className="leading-relaxed">Vinohradská 1203/45,<br />120 00 Praha 2,<br />Česká republika</li>
              <li><a href="tel:+420777123456" className="hover:text-[oklch(0.88_0.16_85)]">+420 777 123 456</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-sm uppercase tracking-widest mb-3">Právní</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.85_0.04_75)]">
              <li><Link to="/ochrana-osobnich-udaju" className="hover:text-[oklch(0.88_0.16_85)]">Ochrana osobních údajů</Link></li>
              <li><Link to="/podminky" className="hover:text-[oklch(0.88_0.16_85)]">Podmínky použití</Link></li>
              <li><Link to="/cookies" className="hover:text-[oklch(0.88_0.16_85)]">Cookies</Link></li>
              <li><Link to="/smazani-uctu" className="hover:text-[oklch(0.88_0.16_85)]">Smazání účtu</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[oklch(0.78_0.16_75/0.15)] py-5 text-center text-xs text-[oklch(0.7_0.04_75)] px-4">
          <p className="mb-1">⚠ Hra je určena pouze pro osoby starší 18 let.</p>
          <p>© {new Date().getFullYear()} Jungle Circle — Sociální kasino. Virtuální mince nemají peněžní hodnotu.</p>
        </div>
      </footer>
    </div>
  );
}