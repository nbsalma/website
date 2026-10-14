import { useTranslations } from "next-intl";
import { ProductExplorer } from "./ProductExplorer";
import { productSlugs } from "@/data/products";

export function ProductsSection() {
  const t = useTranslations("products");
  const items = productSlugs.map((slug) => ({
    slug,
    name: t(`items.${slug}.name`),
    short: t(`items.${slug}.short`),
    photo: t(`items.${slug}.photo`),
  }));
  return (
    <section id="products" className="bg-paper py-[clamp(72px,9vw,128px)]">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5">
            <p className="eyebrow text-accent">{t("eyebrow")}</p>
            <h2 className="h-display m-0 text-[clamp(36px,4.4vw,64px)]">{t("title")}</h2>
          </div>
          <p className="m-0 min-w-0 max-w-[460px] flex-[1_1_360px] text-base leading-[1.65] text-muted">{t("intro")}</p>
        </div>
        <ProductExplorer
          items={items}
          labels={{ list: t("listLabel"), cantFind: t("cantFind"), quote: t("requestQuote"), explore: t("explore") }}
        />
      </div>
    </section>
  );
}

export function WhySection() {
  const t = useTranslations("why");
  const items = t.raw("items") as { title: string; body: string }[];
  return (
    <section id="why" className="bg-concrete py-[clamp(72px,9vw,128px)]">
      <div className="container-x flex flex-wrap gap-x-[clamp(40px,6vw,96px)] gap-y-12">
        <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
          <p className="eyebrow text-accent">{t("eyebrow")}</p>
          <h2 className="h-display m-0 text-[clamp(34px,4vw,56px)] leading-[1.02]">{t("title")}</h2>
          <p className="m-0 max-w-[400px] text-base leading-[1.65] text-muted">{t("intro")}</p>
        </div>
        <ol className="m-0 min-w-0 flex-[999_1_560px] list-none border-t border-ink p-0">
          {items.map((it, i) => (
            <li key={it.title} className="flex flex-wrap gap-x-8 gap-y-2 border-b border-[#C9C4BA] py-7">
              <span className="flex-[0_0_48px] pt-1.5 font-mono text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="m-0 flex-[1_1_220px] text-2xl font-semibold tracking-[-0.015em] [font-stretch:106%]">{it.title}</h3>
              <p className="m-0 flex-[2_1_280px] text-base leading-relaxed text-muted">{it.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const DESTS = [
  { key: "mauritania", x: 68, y: 146, lx: 80, ly: 137, anchor: "start" },
  { key: "senegal", x: 36, y: 192, lx: 36, ly: 214, anchor: "middle" },
  { key: "mali", x: 120, y: 168, lx: 133, ly: 172, anchor: "start" },
  { key: "guinea", x: 64, y: 224, lx: 77, ly: 235, anchor: "start" },
  { key: "ivory", x: 108, y: 248, lx: 121, ly: 259, anchor: "start" },
] as const;
const ORIGIN = { x: 392, y: 92 };

export function GlobalSection() {
  const t = useTranslations("global");
  const rows = t.raw("rows") as { k: string; v: string }[];
  const chips = ["senegal", "mauritania", "mali", "ivory", "guinea"] as const;
  return (
    <section id="global" className="overflow-hidden bg-basalt py-[clamp(72px,9vw,128px)] text-paper">
      <div className="container-x flex flex-wrap items-center gap-x-[clamp(40px,6vw,96px)] gap-y-14">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-9">
          <div className="flex flex-col gap-5">
            <p className="eyebrow text-accent-light">{t("eyebrow")}</p>
            <h2 className="h-display m-0 text-[clamp(36px,4.4vw,64px)]">{t("title")}</h2>
            <p className="m-0 max-w-[480px] text-base leading-[1.65] text-fog-2">{t("body")}</p>
          </div>
          <div className="flex flex-col gap-3.5">
            <p className="label-mono m-0 flex items-center gap-2.5 text-fog">
              <span className="size-[9px] rounded-full bg-accent-light" />
              {t("current")}
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {chips.map((c) => (
                <li key={c} className="border border-steel-2 px-3 py-2 text-sm">
                  {t(`countries.${c}`)}
                </li>
              ))}
            </ul>
          </div>
          <dl className="m-0 flex flex-col border-t border-steel">
            {rows.map((r) => (
              <div key={r.k} className="flex flex-wrap gap-x-6 gap-y-1 border-b border-steel py-3.5">
                <dt className="flex-[0_0_190px] font-mono text-xs uppercase tracking-[0.08em] text-fog">{r.k}</dt>
                <dd className="m-0 flex-[1_1_200px] text-[15px]">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="m-0 flex min-w-0 flex-[1_1_460px] flex-col gap-5">
          <div className="relative mx-auto aspect-[580/600] w-full max-w-[580px]" dir="ltr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/africa-dots.svg" alt={t("mapAlt")} className="absolute inset-0 block h-full w-full max-w-none" />
            <svg viewBox="0 0 580 600" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
              <g fill="none" stroke="#F07A3E" strokeWidth="1.6" strokeLinecap="round">
                {DESTS.map((d) => {
                  const cx = (ORIGIN.x + d.x) / 2;
                  const cy = Math.min(ORIGIN.y, d.y) - 40 - (ORIGIN.x - d.x) * 0.12;
                  return <path key={d.key} className="route" d={`M${ORIGIN.x} ${ORIGIN.y}Q${cx} ${cy} ${d.x} ${d.y}`} />;
                })}
              </g>
              <g fill="none" stroke="#F4F3EF" strokeOpacity="0.35">
                {DESTS.map((d) => (
                  <circle key={d.key} cx={d.x} cy={d.y} r="9" />
                ))}
              </g>
              <g fill="#F4F3EF">
                {DESTS.map((d) => (
                  <circle key={d.key} cx={d.x} cy={d.y} r="4.5" />
                ))}
              </g>
              <g fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="11" fontWeight="500" letterSpacing="1" fill="#E3E5E8" stroke="#0E1012" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke">
                {DESTS.map((d) => (
                  <text key={d.key} x={d.lx} y={d.ly} textAnchor={d.anchor}>
                    {t(`countries.${d.key}`).toUpperCase()}
                  </text>
                ))}
              </g>
            </svg>
            <span className="anim-pulse absolute start-[67.6%] top-[15.3%] size-[120px] rounded-full border border-accent-light" style={{ transform: "translate(-50%,-50%)" }} />
            <span className="absolute start-[67.6%] top-[15.3%] size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-light shadow-[0_0_0_6px_rgba(240,122,62,0.18)]" />
            <span className="absolute start-[calc(67.6%+28px)] top-[calc(15.3%+26px)] flex flex-col gap-1 border border-[#33383E] bg-basalt/90 px-3 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-light">{t("origin")}</span>
              <span className="text-sm font-semibold">{t("originValue")}</span>
            </span>
          </div>
          <figcaption className="label-mono flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-fog">
            <span className="flex items-center gap-2">
              <span className="size-[9px] rounded-full bg-accent-light" />
              {t("legendOrigin")}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-[9px] rounded-full bg-paper" />
              {t("legendDest")}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as { title: string; body: string }[];
  return (
    <section id="process" aria-labelledby="process-h" className="bg-paper py-[clamp(72px,9vw,128px)]">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5">
            <p className="eyebrow text-accent">{t("eyebrow")}</p>
            <h2 id="process-h" className="h-display m-0 text-[clamp(36px,4.4vw,64px)]">{t("title")}</h2>
          </div>
          <p className="m-0 min-w-0 max-w-[460px] flex-[1_1_360px] text-base leading-[1.65] text-muted">{t("intro")}</p>
        </div>
        <ol className="m-0 mt-[clamp(40px,5vw,64px)] grid list-none grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] p-0">
          {steps.map((s, i) => (
            <li key={s.title} className={`flex flex-col gap-4 border-t-2 py-7 pe-7 ${i === 0 ? "border-accent" : "border-ink"}`}>
              <span className={`text-[56px] leading-none font-semibold tracking-[-0.04em] [font-stretch:112%] ${i === 0 ? "text-accent" : "text-ink"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 text-[21px] font-semibold [font-stretch:106%]">{s.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-center justify-between gap-5 bg-graphite px-[clamp(24px,3vw,40px)] py-7 text-paper">
          <p className="m-0 text-[clamp(18px,1.8vw,22px)] font-medium [font-stretch:104%]">{t("ctaText")}</p>
          <a href="#contact" className="btn btn-primary min-h-[52px] px-6">
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
