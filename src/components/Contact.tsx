import { useTranslations } from "next-intl";
import { QuoteForm } from "./QuoteForm";
import { Chat } from "./Icons";

export function ContactSection({ defaultMaterial }: { defaultMaterial?: string }) {
  const t = useTranslations("contact");
  const steps = t.raw("side.steps") as { title: string; body: string }[];
  const s = useTranslations("shared");
  const email = s("contact.salesEmail"), phone = s("contact.phone"), whatsapp = s("contact.whatsapp");
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#";
  return (
    <>
      <section id="contact" className="bg-basalt pt-[clamp(48px,6vw,88px)] pb-[clamp(48px,6vw,80px)] text-paper">
        <div className="container-x flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <h2 className="h-condensed m-0 min-w-0 flex-[1_1_520px] text-[clamp(52px,7.4vw,104px)] leading-[0.92]">{t("title")}</h2>
          <p className="m-0 min-w-0 flex-[0_1_440px] text-[17px] leading-[1.65] text-fog-2">{t("intro")}</p>
        </div>
      </section>
      <section className="bg-paper pt-[clamp(48px,6vw,88px)] pb-[clamp(72px,9vw,120px)]">
        <div className="container-x flex flex-wrap items-start gap-x-[clamp(32px,4vw,64px)] gap-y-10">
          <div className="relative min-w-0 flex-[999_1_600px] border border-sand bg-paper-2 p-[clamp(24px,3.5vw,48px)]">
            <QuoteForm defaultMaterial={defaultMaterial} />
          </div>
          <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-6 lg:sticky lg:top-[100px]">
            <div className="flex flex-col gap-5 bg-basalt p-[clamp(24px,2.6vw,32px)] text-paper">
              <span className="eyebrow text-accent-light">{t("side.nextTitle")}</span>
              <ol className="m-0 flex list-none flex-col p-0">
                {steps.map((s, i) => (
                  <li key={s.title} className={`flex gap-4 border-t border-steel py-3.5 ${i === steps.length - 1 ? "border-b" : ""}`}>
                    <span className={`text-[22px] leading-[1.1] font-bold [font-stretch:66%] ${i === 0 ? "text-accent-light" : ""}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-base font-semibold">{s.title}</span>
                      <span className="text-sm leading-normal text-fog">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="m-0 text-[13px] leading-[1.55] text-fog">{t("side.noPrices")}</p>
            </div>
            <div id="direct" className="flex flex-col gap-4 border border-sand bg-paper-2 p-[clamp(24px,2.6vw,32px)]">
              <span className="eyebrow text-accent">{t("side.talk")}</span>
              <dl className="m-0 flex flex-col border-t border-ink">
                {[
                  [t("side.salesEmail"), email || "[sales@company.com]"],
                  [t("side.phone"), phone || "[+20 XXX XXX XXXX]"],
                  [t("side.whatsapp"), whatsapp || "[+20 XXX XXX XXXX]"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap justify-between gap-2 border-b border-sand py-3">
                    <dt className="text-sm text-muted-2">{k}</dt>
                    <dd className="m-0 text-[15px]" dir="ltr">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href={waLink} target={whatsapp ? "_blank" : undefined} rel="noreferrer" className="btn border border-ink text-[19px] text-ink [font-stretch:72%]">
                <Chat size={18} /> {t("side.whatsappCta")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
