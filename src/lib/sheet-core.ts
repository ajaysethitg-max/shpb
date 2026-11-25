import { parseCSV } from "./csv";
import { slugify } from "./format";
import { DEFAULT_SETTINGS, list } from "./defaults";
import { SAMPLE_DEITY_ROWS, SAMPLE_PRODUCT_ROWS, type Row } from "./sample";
import type { Category, Deity, Product, SheetData, SheetUrls, Settings } from "./types";

/** Full CSV address of one tab of a Google Sheet. */
export function gvizUrl(sheetId: string, tabName: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
}

/** Download one tab as rows. Works at build time and in the visitor's browser. */
export async function fetchRows(url: string | null): Promise<{ rows: string[][] | null; error?: string }> {
  if (!url) return { rows: null };
  try {
    // At build time (server) a normal cached fetch is required for a static page.
    // In the visitor's browser always ask Google for the latest copy.
    const res = await fetch(url, typeof window === "undefined" ? { cache: "force-cache" } : { cache: "no-store" });
    if (!res.ok) {
      return { rows: null, error: `HTTP ${res.status}. Share the sheet as "Anyone with the link can view" and check the tab name.` };
    }
    const text = await res.text();
    if (text.trim().startsWith("<")) {
      return { rows: null, error: `Google returned a web page, not data. Share the sheet as "Anyone with the link can view".` };
    }
    return { rows: parseCSV(text) };
  } catch (e) {
    return { rows: null, error: e instanceof Error ? e.message : "could not reach Google Sheets" };
  }
}

const norm = (h: string) => h.trim().toLowerCase().replace(/[\s-]+/g, "_");

/** Index of the header row. Google sometimes adds a blank row above it, so look in the first few rows. */
export function findHeaderRow(rows: string[][]): number {
  for (let i = 0; i < Math.min(rows.length, 6); i++) {
    const cells = rows[i].map(norm);
    if (cells.includes("name") || cells.includes("key")) return i;
  }
  return 0;
}

export function toObjects(rows: string[][]): Row[] {
  const at = findHeaderRow(rows);
  if (rows.length < at + 2) return [];
  const header = rows[at].map(norm);
  return rows.slice(at + 1).map((r) => {
    const o: Row = {};
    header.forEach((h, i) => {
      if (h) o[h] = String(r[i] ?? "").trim();
    });
    return o;
  });
}

/* ───────────────────────── helpers ───────────────────────── */

/** Turn Google Drive "share" links into a link an <img> can load. */
export function normalizeImage(raw: string | undefined): string {
  const url = String(raw ?? "").trim();
  if (!url) return "";
  if (url.startsWith("/")) return url;
  if (!/^https?:\/\//i.test(url)) return "";
  const drive =
    url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) ||
    url.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?[^#]*?\bid=([\w-]+)/) ||
    url.match(/docs\.google\.com\/uc\?[^#]*?\bid=([\w-]+)/);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1200`;
  return url;
}

const yes = (v: string | undefined) => /^(yes|true|1|y|x|✓)$/i.test(String(v ?? "").trim());

function parsePrice(v: string | undefined): number | null {
  const raw = String(v ?? "").trim();
  if (!raw || /^(por|poa|price on request|on request|na|n\/a|-)$/i.test(raw)) return null;
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function parseCategory(v: string | undefined): Category | null {
  const c = String(v ?? "").trim().toLowerCase();
  if (/^idol/.test(c) || c === "murti") return "idols";
  if (/^poshak/.test(c) || c === "dress") return "poshak";
  if (/^puja/.test(c) || /accessor/.test(c) || c === "items") return "puja";
  return null;
}

/* ───────────────────────── settings ───────────────────────── */

export function buildSettings(rows: string[][] | null): Settings {
  const out: Settings = { ...DEFAULT_SETTINGS };
  if (rows) {
    for (const r of rows) {
      const key = String(r[0] ?? "").trim().toLowerCase();
      if (!key || key === "key") continue;
      if (key in out) out[key] = String(r[1] ?? "").trim();
    }
  }
  for (const k of Object.keys(out)) if (k.endsWith("_image")) out[k] = normalizeImage(out[k]);
  return out;
}

/** The public web address of the site (from the sheet, or the build setting). */
export function siteUrlOf(settings: Settings): string {
  return (
    settings.site_url?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/* ───────────────────────── products ───────────────────────── */

export function buildProducts(rows: Row[], settings: Settings): Product[] {
  const defaultSizes = list(settings.default_sizes);
  const seen = new Set<string>();
  const out: Product[] = [];

  for (const r of rows) {
    const name = r.name?.trim();
    const category = parseCategory(r.category);
    if (!name || !category) continue;

    let slug = slugify(r.slug || name) || "item";
    const base = slug;
    for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
    seen.add(slug);

    const sizesRaw = list(r.sizes || r.size);
    const sizes = sizesRaw.length ? sizesRaw : category === "puja" ? [] : defaultSizes;

    const extras = [
      ...list(r.images),
      r.image_2,
      r.image_3,
      r.image_4,
      r.image_5,
    ]
      .map(normalizeImage)
      .filter(Boolean);
    const main = normalizeImage(r.image) || extras[0] || "";
    const images = [...new Set([main, ...extras].filter(Boolean))];
    const stockRaw = (r.in_stock ?? r.instock ?? r.available ?? "").trim();

    out.push({
      slug,
      name,
      category,
      subcategory: r.subcategory || "",
      deity: r.deity || "All Deities",
      materials: list(r.material || r.materials),
      fabrics: list(r.fabric || r.fabrics),
      sizes,
      price: parsePrice(r.price),
      image: main || "/images/placeholder.svg",
      images: images.length ? images : ["/images/placeholder.svg"],
      description: r.description || "",
      details: r.details || "",
      featured: yes(r.featured),
      bestseller: yes(r.bestseller),
      inStock: stockRaw === "" ? true : !/^(no|false|0|out|oos|n)$/i.test(stockRaw),
    });
  }
  return out;
}

/* ───────────────────────── deities ───────────────────────── */

function monogram(name: string, hindi: string): string {
  if (hindi) return hindi.split(/\s+/)[0];
  return name.trim().charAt(0).toUpperCase();
}

export function buildDeities(rows: string[][] | null, products: Product[]): Deity[] {
  let objs = rows ? toObjects(rows) : [];
  if (!objs.some((o) => o.name)) objs = SAMPLE_DEITY_ROWS;

  const deities: Deity[] = objs
    .filter((o) => o.name)
    .map((o) => ({
      name: o.name,
      hindi: o.hindi || o.hindi_name || "",
      mono: monogram(o.name, o.hindi || o.hindi_name || ""),
      tagline: o.tagline || "",
      description: o.description || "",
      image: normalizeImage(o.image),
    }));

  // Any deity used in the Products tab but missing here is added automatically.
  const known = new Set(deities.map((d) => d.name.toLowerCase()));
  for (const p of products) {
    const n = p.deity.trim();
    if (!n || /^all deities/i.test(n) || known.has(n.toLowerCase())) continue;
    known.add(n.toLowerCase());
    deities.push({ name: n, hindi: "", mono: monogram(n, ""), tagline: "", description: "", image: "" });
  }
  return deities;
}

/* ───────────────────────── whole sheet ───────────────────────── */

export type TabRows = { settings: string[][] | null; products: string[][] | null; deities: string[][] | null };

/** Build site data from downloaded rows. A missing tab falls back to `previous` (or the sample data). */
export function buildSheetData(rows: TabRows, previous?: SheetData): SheetData {
  const settings = rows.settings ? buildSettings(rows.settings) : previous?.settings ?? buildSettings(null);
  let products: Product[] | null = null;
  if (rows.products) {
    const built = buildProducts(toObjects(rows.products), settings);
    if (built.length) products = built;
  }
  if (!products) {
    products = previous?.products ?? buildProducts(SAMPLE_PRODUCT_ROWS, settings);
  }
  const deities = rows.deities
    ? buildDeities(rows.deities, products)
    : previous
      ? mergeDeities(previous.deities, products)
      : buildDeities(null, products);
  return { settings, products, deities };
}

function mergeDeities(existing: Deity[], products: Product[]): Deity[] {
  const known = new Set(existing.map((d) => d.name.toLowerCase()));
  const out = [...existing];
  for (const p of products) {
    const n = p.deity.trim();
    if (!n || /^all deities/i.test(n) || known.has(n.toLowerCase())) continue;
    known.add(n.toLowerCase());
    out.push({ name: n, hindi: "", mono: monogram(n, ""), tagline: "", description: "", image: "" });
  }
  return out;
}

/** Download all three tabs. Tabs that cannot be read are returned as null. */
export async function loadSheet(urls: SheetUrls, previous?: SheetData): Promise<{ data: SheetData; errors: string[] }> {
  const [s, p, d] = await Promise.all([fetchRows(urls.settings), fetchRows(urls.products), fetchRows(urls.deities)]);
  const errors = [s.error && `Settings: ${s.error}`, p.error && `Products: ${p.error}`, d.error && `Deities: ${d.error}`].filter(
    (x): x is string => Boolean(x),
  );
  return { data: buildSheetData({ settings: s.rows, products: p.rows, deities: d.rows }, previous), errors };
}

export function distinct(values: string[][]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const arr of values)
    for (const v of arr) {
      const k = v.trim();
      if (k && !seen.has(k.toLowerCase())) {
        seen.add(k.toLowerCase());
        out.push(k);
      }
    }
  return out;
}

