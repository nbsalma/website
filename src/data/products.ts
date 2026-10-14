export const productSlugs = ["cement", "sand", "marble", "clinker", "silica-sand"] as const;
export type ProductSlug = (typeof productSlugs)[number];

export type ProductDetail = {
  overview: string;
  facts: { moq: string; capacity: string; lead: string; packaging: string };
  specs: [string, string, string][];
  grades: [string, string, string][];
  packaging: [string, string][];
  applications: string[];
  certs: [string, string][];
};

export function isProductSlug(s: string): s is ProductSlug {
  return (productSlugs as readonly string[]).includes(s);
}
