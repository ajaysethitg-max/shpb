/**
 * Every editable setting lives here ONLY as a fallback.
 * The Google Sheet "Settings" tab (key | value) overrides any of these keys.
 * Leave a value blank in the sheet to hide that item on the website.
 */
export type SettingDef = { key: string; value: string; group: string; note: string };

const d = (group: string, key: string, value: string, note: string): SettingDef => ({
  group,
  key,
  value,
  note,
});

export const SETTING_DEFS: SettingDef[] = [
  // ───────── Shop ─────────
  d("Shop", "shop_name", "Shri Haridas Poshak Bhandar", "Full shop name (browser title, WhatsApp messages, footer)"),
  d("Shop", "brand_line1", "Shri Haridas", "Big name in the header. The LAST word is shown in gold"),
  d("Shop", "brand_line2", "Poshak Bhandar", "Small line under the name in the header"),
  d("Shop", "tagline", "Deity Idols · Poshak · Puja Items", "Short tagline (page title and social sharing)"),
  d("Shop", "tagline_hi", "", "Hindi tagline (optional)"),
  d("Shop", "city", "Vrindavan", "City / town shown under the name. Blank = hidden"),
  d("Shop", "est_year", "", "Year the shop started, e.g. 1985. Blank = hidden"),
  d("Shop", "site_url", "", "Your website address, e.g. https://shriharidasposhakbhandar.in (used in WhatsApp links and Google)"),

  // ───────── Contact ─────────
  d("Contact", "phone", "+91 63974 65597", "Phone number for the Call buttons"),
  d("Contact", "whatsapp", "916397465597", "WhatsApp number, DIGITS ONLY with country code. ALL orders are sent here"),
  d("Contact", "whatsapp_display", "+91 63974 65597", "WhatsApp number as shown to visitors"),
  d("Contact", "email", "", "Email address. Blank = hidden"),
  d("Contact", "address", "", "Full shop address. Blank = hidden"),
  d("Contact", "address_short", "", "One-line address for the top menu. Blank = hidden"),
  d("Contact", "hours", "", "Opening hours, e.g. Mon-Sun 8 AM to 9 PM. Blank = hidden"),
  d("Contact", "instagram", "https://www.instagram.com/reel/DfjfuRtRWGP/?cnvx=enNyZXNwZWt3OWN6", "Instagram link (profile or reel). Blank = hidden"),
  d("Contact", "instagram_handle", "", "Instagram handle like @shopname (optional)"),
  d("Contact", "maps_embed", "", "Google Maps EMBED link (Share > Embed a map > copy the src). Blank = no map"),
  d("Contact", "maps_link", "", "Normal Google Maps link for the Get Directions button. Blank = hidden"),

  // ───────── Ordering ─────────
  d("Ordering", "wa_greeting", "Hare Krishna!", "First line of every WhatsApp message"),
  d("Ordering", "order_note", "Your order is sent to us on WhatsApp. We will confirm availability, price and delivery there.", "Shown on the checkout page"),
  d("Ordering", "announcement", "Customisation available for all deities • All sizes available • Order directly on WhatsApp", "Top scrolling bar. Separate messages with the • symbol"),
  d("Ordering", "free_shipping_threshold", "", "Order value (number) above which shipping is free. Blank = no free-shipping bar"),
  d("Ordering", "shipping_text", "", "Shipping / delivery information (product page and FAQ). Blank = hidden"),
  d("Ordering", "returns_text", "", "Returns / exchange information. Blank = hidden"),
  d("Ordering", "payment_text", "", "Payment information. Blank = hidden"),
  d("Ordering", "default_sizes", "3 inch|4 inch|5 inch|6 inch|8 inch|10 inch|12 inch|15 inch|18 inch|24 inch|36 inch", "Sizes offered for idols and poshak when a product row has no sizes. Separate with |"),

  // ───────── Images (paste links; Google Drive share links work) ─────────
  d("Images", "logo_image", "", "Logo (square). Blank = lotus placeholder"),
  d("Images", "hero_image", "", "Big home-page banner photo. Blank = plain dark banner"),
  d("Images", "og_image", "", "Photo shown when the website is shared on WhatsApp / Facebook"),
  d("Images", "cat_idols_image", "", "Home page tile photo for Idols"),
  d("Images", "cat_poshak_image", "", "Home page tile photo for Poshak"),
  d("Images", "cat_puja_image", "", "Home page tile photo for Puja & Accessories"),
  d("Images", "custom_image", "", "Photo beside the Customisation section"),
  d("Images", "about_image", "", "Photo on the About page"),

  // ───────── Home page ─────────
  d("Home page", "hero_title_1", "Idols, Poshak", "Big heading, first line"),
  d("Home page", "hero_title_2", "& Puja Items", "Big heading, second line (shown in gold)"),
  d("Home page", "hero_text", "Deity idols in Peetal, Asthdhatu, Pathar and Dust Marble, poshak in Cotton, Silk, Woolen, Saneel, Velvet, Jari and Handmade, and all puja items. Customisation available.", "Paragraph under the heading"),
  d("Home page", "hero_badge_1", "Customisation available", "Small badge 1 under the buttons. Blank = hidden"),
  d("Home page", "hero_badge_2", "All sizes available", "Small badge 2"),
  d("Home page", "hero_badge_3", "Order directly on WhatsApp", "Small badge 3"),
  d("Home page", "cat_idols_title", "Idols", "Tile title"),
  d("Home page", "cat_idols_sub", "", "Tile subtitle. Blank = automatic from your products' materials"),
  d("Home page", "cat_poshak_title", "Poshak", "Tile title"),
  d("Home page", "cat_poshak_sub", "", "Tile subtitle. Blank = automatic from your products' fabrics"),
  d("Home page", "cat_puja_title", "Puja & Accessories", "Tile title"),
  d("Home page", "cat_puja_sub", "", "Tile subtitle. Blank = automatic from your products' categories"),
  d("Home page", "custom_title_1", "Your deity.", "Customisation banner, first line"),
  d("Home page", "custom_title_2", "Your design.", "Customisation banner, second line (gold)"),
  d("Home page", "custom_points", "Poshak made to your deity's size|Choose your fabric, colour and design|Share a reference photo on WhatsApp|Confirm everything on WhatsApp before we start", "Bullet points, separated by |"),

  // ───────── Page text ─────────
  d("Page text", "deities_title", "Our Deities", "Deities page heading"),
  d("Page text", "deities_text", "Idols, poshak and accessories for every deity. Choose your deity to see everything available.", "Deities page paragraph"),
  d("Page text", "deities_note", "Don't see your deity? Message us on WhatsApp with the name and a photo.", "Note at the bottom of the Deities page. Blank = hidden"),
  d("Page text", "idols_title", "Idols", "Idols page heading"),
  d("Page text", "idols_text", "Deity idols in Peetal, Asthdhatu, Pathar and Dust Marble, available in all sizes.", "Idols page paragraph"),
  d("Page text", "idols_badges", "All sizes available|Customisation available", "Small badges on Idols page, separated by |"),
  d("Page text", "poshak_title", "Poshak", "Poshak page heading"),
  d("Page text", "poshak_text", "Poshak for every deity in all sizes, in Cotton, Silk, Woolen, Saneel, Velvet, Jari and Handmade fabrics. Customisation available.", "Poshak page paragraph"),
  d("Page text", "poshak_badges", "All sizes available|Customisation available", "Small badges on Poshak page, separated by |"),
  d("Page text", "puja_title", "Puja & Accessories", "Puja page heading"),
  d("Page text", "puja_text", "Attar, agarbatti, dhoopbatti, chandan, kanthi mala, tulsi mala, mukut, pagdi, jewellery and all accessories for your deity.", "Puja page paragraph"),
  d("Page text", "puja_note", "", "Optional notice bar on the Puja page. Blank = hidden"),
  d("Page text", "catalog_text", "Everything available at the shop, in one place. Search or filter by deity, material or fabric.", "Shop All paragraph"),
  d("Page text", "custom_intro", "Tell us the deity, size, fabric and colour. We will confirm the design and price with you on WhatsApp.", "Custom Order page paragraph"),
  d("Page text", "custom_item_types", "Poshak (deity dress)|Complete shringar set|Idol|Mukut & Pagdi|Jhula / Singhasan / Bed|Other (I will describe)", "Custom Order: what can be made, separated by |"),
  d("Page text", "custom_fabrics", "Cotton|Silk|Woolen|Saneel|Velvet|Jari|Handmade", "Custom Order: fabric choices, separated by |"),
  d("Page text", "custom_colours", "Red|Maroon|Pink|Orange|Yellow|Green|Blue|Purple|White|Cream|Gold|Multicolour", "Custom Order: colour choices, separated by |"),
  d("Page text", "custom_steps", "You send the details|We confirm design and price on WhatsApp|We make it|Delivery or pickup", "Custom Order: how it works, separated by |"),
  d("Page text", "custom_note", "", "Optional note on the Custom Order page, e.g. time needed. Blank = hidden"),

  // ───────── About page ─────────
  d("About", "about_title", "About Us", "About page heading"),
  d("About", "about_story", "Shri Haridas Poshak Bhandar offers deity idols, poshak and puja items for every deity.||Everything is available in all sizes and customisation is available. Message us on WhatsApp for sizes, prices and availability.", "Your story. Separate paragraphs with ||"),
  d("About", "about_points", "", "Highlights shown as small badges, separated by |. Blank = hidden"),
  d("About", "faq_1_q", "What does Price on Request mean?", "FAQ 1 question"),
  d("About", "faq_1_a", "The price depends on the size, material or fabric you choose. Add the item to your order or message us on WhatsApp and we will confirm the price.", "FAQ 1 answer"),
  d("About", "faq_2_q", "Can I get something customised?", "FAQ 2 question"),
  d("About", "faq_2_a", "Yes. Customisation is available for poshak and other items. Use the Custom Order page or message us on WhatsApp.", "FAQ 2 answer"),
  d("About", "faq_3_q", "How do I place an order?", "FAQ 3 question"),
  d("About", "faq_3_a", "Add items to your order and press Send Order on WhatsApp. We will reply on WhatsApp to confirm everything.", "FAQ 3 answer"),
  d("About", "faq_4_q", "", "FAQ 4 question (blank = hidden)"),
  d("About", "faq_4_a", "", "FAQ 4 answer"),
  d("About", "faq_5_q", "", "FAQ 5 question (blank = hidden)"),
  d("About", "faq_5_a", "", "FAQ 5 answer"),
  d("About", "faq_6_q", "", "FAQ 6 question (blank = hidden)"),
  d("About", "faq_6_a", "", "FAQ 6 answer"),
];

export const DEFAULT_SETTINGS: Record<string, string> = Object.fromEntries(
  SETTING_DEFS.map((s) => [s.key, s.value]),
);

/** Split a "a|b|c" setting into a clean list. */
export const list = (v: string | undefined): string[] =>
  String(v ?? "")
    .split(/[|;]/)
    .map((s) => s.trim())
    .filter(Boolean);
