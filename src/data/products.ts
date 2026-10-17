
export type ProductDetail = {
  overview: string;
  facts: { moq: string; capacity: string; lead: string; packaging: string };
  specs: [string, string, string][];
  grades: [string, string, string][];
  packaging: [string, string][];
  applications: string[];
  certs: [string, string][];
};

/** Products are edited in the admin dashboard; their order is the order of `products.items` in the content. */
export const productSlugsOf = (items: unknown): string[] => (items && typeof items === "object" ? Object.keys(items) : []);

/** A photo set in the dashboard for a product (`slug`) or one of its gallery slots (`slug/packaging`). */
export const productImage = (images: Record<string, string> | undefined, key: string) => images?.[key] || "";
