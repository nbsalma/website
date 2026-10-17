/** The legal pages served at /{locale}/{doc}; their texts live under `legal.{doc}` in the content. */
export const LEGAL_DOCS = ["privacy", "terms", "cookies"] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];
