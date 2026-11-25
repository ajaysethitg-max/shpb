export type Category = "idols" | "poshak" | "puja";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  subcategory: string;
  deity: string;
  /** Selectable options. A product can offer several (e.g. Peetal | Pathar). */
  materials: string[];
  fabrics: string[];
  sizes: string[];
  /** null = "Price on request" */
  price: number | null;
  image: string;
  images: string[];
  description: string;
  details: string;
  featured: boolean;
  bestseller: boolean;
  inStock: boolean;
};

export type Deity = {
  name: string;
  hindi: string;
  mono: string;
  tagline: string;
  description: string;
  image: string;
};

export type Settings = Record<string, string>;

/** Everything the site needs from the Google Sheet. */
export type SheetData = {
  settings: Settings;
  products: Product[];
  deities: Deity[];
};

/** Where each tab is read from (full CSV addresses). */
export type SheetUrls = {
  settings: string | null;
  products: string | null;
  deities: string | null;
};
