import { cache } from "react";
import { gvizUrl, loadSheet, siteUrlOf } from "./sheet-core";
import type { Product, SheetData, SheetUrls, Settings } from "./types";

/**
 * BUILD-TIME reader (server). It takes a snapshot of the Google Sheet while the site is built,
 * so Google and WhatsApp see real product text and photos. In the visitor's browser the
 * SheetProvider then reloads the sheet, so edits show up without rebuilding.
 */

const TAB_NAMES = {
  settings: process.env.SHEET_TAB_SETTINGS || "Settings",
  products: process.env.SHEET_TAB_PRODUCTS || "Products",
  deities: process.env.SHEET_TAB_DEITIES || "Deities",
};

/** Sheet addresses from the build settings, or null when no sheet is connected yet. */
export function sheetUrls(): SheetUrls | null {
  const id = process.env.GOOGLE_SHEET_ID?.trim();
  const urls: SheetUrls = {
    settings: process.env.SHEET_SETTINGS_CSV_URL?.trim() || (id ? gvizUrl(id, TAB_NAMES.settings) : null),
    products: process.env.SHEET_PRODUCTS_CSV_URL?.trim() || (id ? gvizUrl(id, TAB_NAMES.products) : null),
    deities: process.env.SHEET_DEITIES_CSV_URL?.trim() || (id ? gvizUrl(id, TAB_NAMES.deities) : null),
  };
  return urls.settings || urls.products || urls.deities ? urls : null;
}

export const getSheetData = cache(async (): Promise<SheetData> => {
  const urls = sheetUrls() ?? { settings: null, products: null, deities: null };
  const { data, errors } = await loadSheet(urls);
  for (const e of errors) console.warn("[sheet]", e);
  return data;
});

export async function getSettings(): Promise<Settings> {
  return (await getSheetData()).settings;
}
export async function getProducts(): Promise<Product[]> {
  return (await getSheetData()).products;
}
export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}
export const siteUrl = siteUrlOf;
