import { z } from "zod";
import { productSlugs } from "@/data/products";

export const UNITS = ["t", "m3", "m2", "bags", "c20", "c40"] as const;
export const ORDER_TYPES = ["once", "recurring", "unsure"] as const;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
];

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1);

export const quoteSchema = z.object({
  material: z.enum([...productSlugs, "other"] as [string, ...string[]]),
  grade: text(200).optional().default(""),
  quantity: required(40),
  unit: z.enum(UNITS),
  country: required(100),
  port: text(150).optional().default(""),
  orderType: z.enum(ORDER_TYPES).default("once"),
  requiredBy: text(60).optional().default(""),
  company: required(200),
  name: required(150),
  email: z.string().trim().email().max(200),
  phone: required(40),
  notes: text(4000).optional().default(""),
  locale: z.enum(["en", "fr", "ar"]).default("en"),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export function makeReference(date = new Date()): string {
  const y = String(date.getUTCFullYear()).slice(2);
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RFQ-${y}${m}${d}-${rand}`;
}

export const UNIT_LABELS: Record<(typeof UNITS)[number], string> = {
  t: "metric tons",
  m3: "m³",
  m2: "m²",
  bags: "bags",
  c20: "× 20ft containers",
  c40: "× 40ft containers",
};
