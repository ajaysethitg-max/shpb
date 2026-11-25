/**
 * Starter catalogue built ONLY from the shop's own list of deities, materials,
 * fabrics and items. No prices or descriptions are invented: every product is
 * "Price on Request" until the owner adds real prices in the Google Sheet.
 * This is used only until the Google Sheet is connected.
 */
export type Row = Record<string, string>;

export const SAMPLE_DEITY_ROWS: Row[] = [
  { name: "Radha Krishna", hindi: "राधा कृष्ण", tagline: "", description: "", image: "" },
  { name: "Laddu Gopal", hindi: "लड्डू गोपाल", tagline: "", description: "", image: "" },
  { name: "Ram Darbar", hindi: "राम दरबार", tagline: "", description: "", image: "" },
  { name: "Durga Mata", hindi: "दुर्गा माता", tagline: "", description: "", image: "" },
  { name: "Banke Bihari Ji", hindi: "बांके बिहारी जी", tagline: "", description: "", image: "" },
  { name: "Radhavallabh Ji", hindi: "राधावल्लभ जी", tagline: "", description: "", image: "" },
  { name: "Radharaman Ji", hindi: "राधारमण जी", tagline: "", description: "", image: "" },
  { name: "Swami Haridas Ji", hindi: "स्वामी हरिदास जी", tagline: "", description: "", image: "" },
  { name: "Hit Harivansh Ji", hindi: "हित हरिवंश जी", tagline: "", description: "", image: "" },
];

const MATERIALS = "Peetal|Asthdhatu|Pathar|Dust Marble";
const FABRICS = "Cotton|Silk|Woolen|Saneel|Velvet|Jari|Handmade";

const FEATURED_DEITIES = new Set(["Laddu Gopal", "Radha Krishna"]);

const blank = {
  subcategory: "",
  material: "",
  fabric: "",
  sizes: "",
  price: "",
  image: "",
  description: "",
  details: "",
  featured: "",
  bestseller: "",
  in_stock: "",
};

const puja = (name: string, subcategory: string, extra: Row = {}): Row => ({
  ...blank,
  name,
  category: "puja",
  subcategory,
  deity: "All Deities",
  ...extra,
});

export const SAMPLE_PRODUCT_ROWS: Row[] = [
  ...SAMPLE_DEITY_ROWS.map((d) => ({
    ...blank,
    name: `${d.name} Idol`,
    category: "idols",
    subcategory: d.name,
    deity: d.name,
    material: MATERIALS,
    featured: FEATURED_DEITIES.has(d.name) ? "yes" : "",
  })),
  ...SAMPLE_DEITY_ROWS.map((d) => ({
    ...blank,
    name: `${d.name} Poshak`,
    category: "poshak",
    subcategory: d.name,
    deity: d.name,
    fabric: FABRICS,
    description: "Available for all deities in all sizes. Customisation available.",
    featured: FEATURED_DEITIES.has(d.name) ? "yes" : "",
  })),
  puja("Attar", "Attar"),
  puja("Agarbatti", "Agarbatti & Dhoopbatti"),
  puja("Dhoopbatti", "Agarbatti & Dhoopbatti"),
  puja("Chandan", "Chandan"),
  puja("Chandan Lakdi", "Chandan"),
  puja("Kanthi Mala (All Types)", "Kanthi & Tulsi Mala"),
  puja("Tulsi Mala", "Kanthi & Tulsi Mala"),
  puja("Mukut", "Mukut & Pagdi"),
  puja("Pagdi", "Mukut & Pagdi"),
  puja("Pagdi Attachments", "Mukut & Pagdi"),
  puja("Deity Jewellery", "Jewellery & Accessories"),
  puja("Deity Accessories (All)", "Jewellery & Accessories"),
  puja("Bed", "Bed, Sofa, Singhasan & Jhula"),
  puja("Sofa", "Bed, Sofa, Singhasan & Jhula"),
  puja("Singhasan", "Bed, Sofa, Singhasan & Jhula"),
  puja("Jhula", "Bed, Sofa, Singhasan & Jhula"),
  puja("Peetal Jhula", "Peetal Spiritual Items"),
  puja("Peetal Bartan", "Peetal Spiritual Items"),
  puja("Thakur Ji Hair", "Thakur Ji Hair"),
  puja("Counters", "Counters"),
];
