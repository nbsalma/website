"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { productSlugsOf } from "@/data/products";
import { ArrowRight, Check, Upload } from "./Icons";

const UNITS = ["t", "m3", "m2", "bags", "c20", "c40"] as const;
const ORDER_TYPES = ["once", "recurring", "unsure"] as const;
const MAX_FILE = 10 * 1024 * 1024;

type Result = { reference: string; email: string };

export function QuoteForm({ defaultMaterial }: { defaultMaterial?: string }) {
  const t = useTranslations("contact");
  const tp = useTranslations("products.items");
  const productSlugs = productSlugsOf(useTranslations("products").raw("items"));
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [material, setMaterial] = useState<string>(defaultMaterial ?? productSlugs[0] ?? "other");

  // Pre-select the material when arriving from a product page (/?material=cement#contact)
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get("material");
    if (m && productSlugs.includes(m)) setMaterial(m);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("locale", locale);
    const file = data.get("file");
    if (file instanceof File && file.size > MAX_FILE) {
      setStatus("error");
      setError(t("errors.fileTooLarge"));
      return;
    }
    setStatus("sending");
    setError("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/quote", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        if (json.fieldErrors) {
          setFieldErrors(json.fieldErrors);
          setError(t("errors.invalid"));
        } else {
          setError(t("errors.generic"));
        }
        return;
      }
      setResult({ reference: json.reference, email: String(data.get("email") ?? "") });
      setStatus("idle");
      form.reset();
      setMaterial(productSlugs[0] ?? "other");
    } catch {
      setStatus("error");
      setError(t("errors.generic"));
    }
  }

  if (result) {
    return (
      <div role="status" className="flex flex-col gap-7 py-[clamp(8px,2vw,24px)]">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-accent text-white">
          <Check size={28} />
        </span>
        <div className="flex flex-col gap-3.5">
          <h2 className="h-condensed m-0 text-[clamp(40px,4.6vw,64px)]">{t("success.title")}</h2>
          <p className="m-0 max-w-[560px] text-[17px] leading-[1.65] text-ink-2">{t("success.body")}</p>
        </div>
        <dl className="m-0 flex max-w-[560px] flex-col border-t border-ink">
          {[
            [t("success.reference"), result.reference, true],
            [t("success.sentTo"), result.email, false],
            [t("success.next"), t("success.nextValue"), false],
          ].map(([k, v, mono]) => (
            <div key={String(k)} className="flex justify-between gap-4 border-b border-sand py-3.5">
              <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted-2">{k}</dt>
              <dd className={`m-0 text-sm ${mono ? "font-mono" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="btn bg-graphite text-paper text-[19px] [font-stretch:72%]">
            {t("success.back")}
          </Link>
          <button type="button" onClick={() => setResult(null)} className="btn cursor-pointer border-0 bg-transparent px-4 text-accent">
            {t("success.again")}
          </button>
        </div>
      </div>
    );
  }

  const req = <span aria-hidden="true"> *</span>;
  const label = "text-sm font-medium";
  const fieldCls = (name: string) => `field ${fieldErrors[name] ? "!border-accent" : ""}`;
  const err = (name: string) =>
    fieldErrors[name] ? (
      <span id={`${name}-err`} className="text-xs text-accent">
        {t("required")}
      </span>
    ) : null;
  const legend = (n: string, text: string) => (
    <legend className="eyebrow flex items-center gap-3 pb-[18px] text-accent">
      <span className="text-ink">{n}</span>
      {text}
    </legend>
  );
  const grid = "m-0 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-5 border-0 p-0";

  return (
    <form aria-label={t("formLabel")} onSubmit={onSubmit} noValidate className="flex flex-col gap-9" encType="multipart/form-data">
      {/* Honeypot: real users never see or fill this */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className={grid}>
        {legend("01", t("groups.requirement"))}
        <div className="flex flex-col gap-2">
          <label htmlFor="q-mat" className={label}>{t("fields.material")}{req}</label>
          <select id="q-mat" name="material" value={material} onChange={(e) => setMaterial(e.target.value)} className={fieldCls("material")} required>
            {productSlugs.map((s) => (
              <option key={s} value={s}>{tp(`${s}.name`)}</option>
            ))}
            <option value="other">{t("fields.materialOther")}</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-grade" className={label}>{t("fields.grade")}</label>
          <input id="q-grade" name="grade" type="text" placeholder={t("fields.gradePh")} className="field" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-qty" className={label}>{t("fields.quantity")}{req}</label>
          <input id="q-qty" name="quantity" type="text" inputMode="decimal" placeholder={t("fields.quantityPh")} className={fieldCls("quantity")} required aria-invalid={!!fieldErrors.quantity} aria-describedby={fieldErrors.quantity ? "quantity-err" : undefined} />
          {err("quantity")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-unit" className={label}>{t("fields.unit")}{req}</label>
          <select id="q-unit" name="unit" defaultValue="t" className="field">
            {UNITS.map((u) => (
              <option key={u} value={u}>{t(`units.${u}`)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-country" className={label}>{t("fields.country")}{req}</label>
          <input id="q-country" name="country" type="text" placeholder={t("fields.countryPh")} className={fieldCls("country")} required aria-invalid={!!fieldErrors.country} />
          {err("country")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-port" className={label}>{t("fields.port")}</label>
          <input id="q-port" name="port" type="text" placeholder={t("fields.portPh")} className="field" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-type" className={label}>{t("fields.orderType")}</label>
          <select id="q-type" name="orderType" defaultValue="once" className="field">
            {ORDER_TYPES.map((o) => (
              <option key={o} value={o}>{t(`orderTypes.${o}`)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-when" className={label}>{t("fields.requiredBy")}</label>
          <input id="q-when" name="requiredBy" type="text" placeholder={t("fields.requiredByPh")} className="field" />
        </div>
      </fieldset>

      <fieldset className={grid}>
        {legend("02", t("groups.company"))}
        <div className="flex flex-col gap-2">
          <label htmlFor="q-co" className={label}>{t("fields.company")}{req}</label>
          <input id="q-co" name="company" type="text" autoComplete="organization" className={fieldCls("company")} required aria-invalid={!!fieldErrors.company} />
          {err("company")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-name" className={label}>{t("fields.name")}{req}</label>
          <input id="q-name" name="name" type="text" autoComplete="name" className={fieldCls("name")} required aria-invalid={!!fieldErrors.name} />
          {err("name")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-email" className={label}>{t("fields.email")}{req}</label>
          <input id="q-email" name="email" type="email" autoComplete="email" dir="ltr" placeholder={t("fields.emailPh")} className={fieldCls("email")} required aria-invalid={!!fieldErrors.email} />
          {err("email")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-phone" className={label}>{t("fields.phone")}{req}</label>
          <input id="q-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" placeholder={t("fields.phonePh")} className={fieldCls("phone")} required aria-invalid={!!fieldErrors.phone} />
          {err("phone")}
        </div>
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-5 border-0 p-0">
        {legend("03", t("groups.details"))}
        <div className="flex flex-col gap-2">
          <label htmlFor="q-notes" className={label}>{t("fields.notes")}</label>
          <textarea id="q-notes" name="notes" rows={5} placeholder={t("fields.notesPh")} className="field resize-y" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="q-file" className={label}>{t("fields.file")}</label>
          <div className="flex flex-wrap items-center gap-3.5 border border-dashed border-[#B5AFA4] bg-white p-[18px]">
            <Upload className="text-muted-2" />
            <input id="q-file" name="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" className="text-sm text-ink-2" />
            <span className="ms-auto text-xs text-muted-2">{t("fields.fileHint")}</span>
          </div>
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="m-0 border-s-0 bg-accent/10 px-4 py-3 text-sm text-accent-dark">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-6">
        <p className="m-0 max-w-[400px] text-[13px] text-muted-2">
          {t("consent")} <Link href="/privacy" className="text-accent">{t("privacy")}</Link>
        </p>
        <button type="submit" disabled={status === "sending"} className="btn btn-primary min-h-14 cursor-pointer border-0 px-[30px] text-xl [font-stretch:72%] disabled:opacity-60">
          {status === "sending" ? t("sending") : t("submit")} <ArrowRight />
        </button>
      </div>
    </form>
  );
}
