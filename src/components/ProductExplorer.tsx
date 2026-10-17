"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "./Icons";

export type ExplorerItem = { slug: string; name: string; short: string; photo: string; image?: string };
type Labels = { list: string; cantFind: string; quote: string; explore: string };

export function ProductExplorer({ items, labels }: { items: ExplorerItem[]; labels: Labels }) {
  const [picked, setPicked] = useState(0);
  const sel = items[picked];
  const total = String(items.length).padStart(2, "0");

  return (
    <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-start gap-[clamp(24px,3vw,48px)]">
      <div className="min-w-0 flex-[1_1_320px]">
        <ul aria-label={labels.list} className="m-0 list-none border-t border-ink p-0">
          {items.map((it, i) => {
            const active = i === picked;
            const no = String(i + 1).padStart(2, "0");
            return (
              <li key={it.slug}>
                <button
                  type="button"
                  onClick={() => setPicked(i)}
                  aria-current={active ? "true" : undefined}
                  className={`flex w-full cursor-pointer items-center gap-5 border-0 border-b bg-transparent px-1 py-[22px] text-start ${
                    active ? "border-ink text-ink" : "border-sand-2 text-[#5A5E63]"
                  }`}
                >
                  <span className={`font-mono text-xs ${active ? "text-accent" : "text-[#7A7E83]"}`}>{no}</span>
                  <span className={`flex-1 text-xl [font-stretch:106%] ${active ? "font-semibold" : "font-medium"}`}>{it.name}</span>
                  {active && <ArrowRight size={18} className="text-accent" />}
                </button>
              </li>
            );
          })}
        </ul>
        <a href="#contact" className="mt-7 flex items-center gap-2.5 text-sm font-semibold text-accent no-underline">
          {labels.cantFind} <ArrowRight size={14} />
        </a>
      </div>

      <article className="min-w-0 flex-[999_1_560px] border border-sand bg-paper-2">
        <div key={sel.slug} className="ph-light anim-fade relative h-[clamp(220px,24vw,320px)]">
          {sel.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sel.image} alt={sel.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="label-mono absolute start-6 bottom-5 text-[#59554D]">{sel.photo}</span>
          )}
          <span className="absolute end-6 top-5 font-mono text-xs text-[#59554D]">
            {String(picked + 1).padStart(2, "0")} / {total}
          </span>
        </div>
        <div className="flex flex-col gap-7 p-[clamp(24px,3vw,40px)]">
          <div className="flex flex-col gap-3">
            <h3 className="m-0 text-[clamp(26px,2.6vw,36px)] font-semibold uppercase tracking-[-0.02em] [font-stretch:106%]">{sel.name}</h3>
            <p className="m-0 text-base leading-relaxed text-muted">{sel.short}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#contact" className="btn btn-primary">
              {labels.quote}
            </a>
            <Link href={`/products/${sel.slug}`} className="btn btn-ghost-light font-medium">
              {labels.explore} <ArrowRight />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
