import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LogoMark } from "./Logo";

export function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const b = useTranslations("brand");
  const s = useTranslations("shared");
  const linkedin = s("social.linkedin"), facebook = s("social.facebook"), email = s("contact.salesEmail");
  const year = new Date().getFullYear();
  const col = "flex flex-col gap-3 text-sm";
  const head = "label-mono text-[#8D9298]";
  const link = "text-[#E3E5E8] no-underline hover:text-white";

  return (
    <footer className="bg-coal pt-[clamp(56px,7vw,96px)] pb-[clamp(96px,8vw,40px)] text-fog-2" style={{ "--logo-bg": "#0A0B0C" } as React.CSSProperties}>
      <div className="container-x flex flex-col gap-14">
        <div className="flex flex-wrap gap-x-[clamp(40px,6vw,96px)] gap-y-12">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <div className="flex items-center gap-3.5 text-paper">
              <LogoMark size={56} />
              <span className="flex flex-col gap-1">
                <span className="text-lg font-semibold [font-stretch:104%]">{b("name")}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">{b("by")}</span>
              </span>
            </div>
            <p className="m-0 max-w-[360px] text-[15px] leading-[1.65]">{t("description")}</p>
            <div>
              <Link href="/#contact" className="btn btn-primary min-h-12 text-sm">
                {n("requestQuote")}
              </Link>
            </div>
          </div>
          <nav aria-label="Footer" className="grid min-w-0 flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-8">
            <div className={col}>
              <span className={head}>{t("company")}</span>
              <Link href="/products" className={link}>{n("products")}</Link>
              <Link href="/#about" className={link}>{n("about")}</Link>
              <Link href="/#global" className={link}>{t("globalSupply")}</Link>
              <Link href="/#why" className={link}>{n("why")}</Link>
            </div>
            <div className={col}>
              <span className={head}>{t("getInTouch")}</span>
              <Link href="/#contact" className={link}>{n("contact")}</Link>
              <Link href="/#contact" className={link}>{n("requestQuote")}</Link>
              {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" className={link}>LinkedIn</a>}
              {facebook && <a href={facebook} target="_blank" rel="noreferrer" className={link}>Facebook</a>}
            </div>
            <div className={col}>
              <span className={head}>{t("office")}</span>
              <address className="not-italic leading-relaxed text-[#E3E5E8]">
                {t("address1")}
                <br />
                {t("address2")}
              </address>
              {email ? <a href={`mailto:${email}`} className={link}>{email}</a> : <span className="text-[#E3E5E8]">[sales@company.com]</span>}
            </div>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-[#24282C] pt-6 text-[13px] text-[#8D9298]">
          <span>{t("rights", { year })}</span>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="text-fog">{t("privacy")}</a>
            <a href="#" className="text-fog">{t("terms")}</a>
            <a href="#" className="text-fog">{t("cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileCta() {
  const t = useTranslations("mobileCta");
  const n = useTranslations("nav");
  const whatsapp = useTranslations("shared")("contact.whatsapp");
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t border-steel bg-basalt/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] min-[921px]:hidden">
      <Link href="/#contact" className="btn btn-primary flex-1">
        {t("quote")}
      </Link>
      <a href={whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#"} aria-label={n("whatsapp")} className="flex min-h-[50px] w-[50px] items-center justify-center border border-[#474C52] text-paper">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6Z" /></svg>
      </a>
    </div>
  );
}
