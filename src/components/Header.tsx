"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { LogoMark } from "./Logo";
import { Check, Chevron, Close, Globe, Menu } from "./Icons";

const SECTIONS = [
  { id: "products", key: "products" },
  { id: "why", key: "why" },
  { id: "global", key: "export" },
  { id: "process", key: "process" },
  { id: "about", key: "about" },
  { id: "contact", key: "contact" },
] as const;

const LANGS = [
  { id: "en", label: "English", code: "EN", dir: "ltr" },
  { id: "fr", label: "Français", code: "FR", dir: "ltr" },
  { id: "ar", label: "العربية", code: "AR", dir: "rtl" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tb = useTranslations("brand");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLangOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const current = LANGS.find((l) => l.id === locale) ?? LANGS[0];

  // Dark at the top, light once the page scrolls; every element switches colour for contrast.
  const light = scrolled;
  const bar = light
    ? "bg-paper/95 border-sand shadow-[0_8px_24px_rgba(21,23,26,0.08)] backdrop-blur-md"
    : "bg-basalt border-[#24282C]";
  const linkBase = light ? "text-ink-2" : "text-[#D6D8DB]";
  const activeCls = light ? "text-accent after:bg-accent" : "text-accent-light after:bg-accent-light";
  const ctrl = light ? "text-ink border-[#BDB7AC]" : "text-paper border-steel-2";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${bar}`}
      style={
        {
          "--logo-fg": light ? "#15171A" : "#F4F3EF",
          "--logo-bg": light ? "#F4F3EF" : "#0E1012",
        } as React.CSSProperties
      }
    >
      <div className="container-x flex h-[76px] items-center justify-between gap-3 sm:gap-6">
        <Link href={isHome ? "#top" : "/"} aria-label={tb("home")} className="flex min-w-0 items-center gap-2.5 no-underline sm:gap-3">
          <LogoMark size={38} className="sm:size-[42px]" />
          <span className="flex flex-col gap-[3px]">
            <span className={`whitespace-nowrap text-[13px] font-semibold sm:text-[15px] [font-stretch:104%] transition-colors duration-300 ${light ? "text-ink" : "text-paper"}`}>
              {tb("name")}
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${light ? "text-muted-2" : "text-fog"}`}>
              {tb("by")}
            </span>
          </span>
        </Link>

        <nav aria-label={t("primary")} className="hidden items-center gap-[34px] text-sm min-[921px]:flex">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={href(s.id)}
                onClick={() => setActive(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-2 no-underline transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 ${
                  isActive ? activeCls : `${linkBase} after:bg-transparent`
                }`}
              >
                {t(s.key)}
              </a>
            );
          })}
        </nav>

        <div className="flex flex-none items-center gap-2 sm:gap-3">
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-label={t("language")}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 border bg-transparent px-2.5 font-mono sm:gap-2 sm:px-3 text-[13px] tracking-[0.08em] transition-colors duration-300 ${ctrl}`}
            >
              <Globe className="hidden sm:block" />
              <span>{current.code}</span>
              <Chevron />
            </button>
            {langOpen && (
              <ul
                role="menu"
                aria-label={t("language")}
                className="absolute end-0 top-[calc(100%+8px)] z-[70] m-0 min-w-[190px] list-none border border-steel bg-graphite py-1.5 shadow-[0_14px_32px_rgba(0,0,0,0.45)]"
              >
                {LANGS.map((l) => (
                  <li key={l.id} role="none">
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={l.id === locale}
                      onClick={() => {
                        setLangOpen(false);
                        router.replace(pathname, { locale: l.id });
                      }}
                      className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 text-start text-[15px] text-paper"
                    >
                      <span lang={l.id} dir={l.dir}>
                        {l.label}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-fog">
                        {l.code}
                        {l.id === locale && <Check className="text-accent-light" />}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex size-11 cursor-pointer items-center justify-center border bg-transparent transition-colors duration-300 min-[921px]:hidden ${ctrl}`}
          >
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label={t("mobile")}
          className={`flex flex-col border-t px-[clamp(20px,4vw,48px)] pt-3 pb-6 min-[921px]:hidden ${light ? "border-sand" : "border-[#24282C]"}`}
        >
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={href(s.id)}
              onClick={() => {
                setActive(s.id);
                setMenuOpen(false);
              }}
              className={`py-4 text-lg no-underline ${light ? "text-ink" : "text-paper"} ${
                i < SECTIONS.length - 1 ? (light ? "border-b border-sand" : "border-b border-[#24282C]") : ""
              }`}
            >
              {t(s.key)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
