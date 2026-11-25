export function formatINR(n: number | null | undefined): string {
  if (n === null || n === undefined) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(whatsapp: string, message: string): string {
  const num = whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

type Line = { name: string; variant: string; qty: number; price: number | null };

/** The full order message that is sent to the shop on WhatsApp. */
export function orderMessage(opts: {
  greeting: string;
  shopName: string;
  items: Line[];
  total: number;
  hasPor: boolean;
  customer?: {
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    notes?: string;
  };
}): string {
  const { greeting, shopName, items, total, hasPor, customer } = opts;
  const lines = items.map(
    (i, n) =>
      `${n + 1}. ${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.qty} — ${
        i.price === null ? "Price on request" : formatINR(i.price * i.qty)
      }`,
  );
  const parts = [`${greeting} I would like to order from ${shopName}:`, "", ...lines, ""];
  parts.push(
    total > 0
      ? `Total of priced items: ${formatINR(total)}${hasPor ? " (+ items on request)" : ""}`
      : "Please share the price for these items.",
  );
  if (customer) {
    parts.push("", `Name: ${customer.name}`);
    if (customer.phone) parts.push(`Mobile: ${customer.phone}`);
    const addr = [customer.address, customer.city, customer.state, customer.pincode]
      .filter(Boolean)
      .join(", ");
    if (addr) parts.push(`Address: ${addr}`);
    if (customer.notes) parts.push(`Notes: ${customer.notes}`);
  }
  return parts.join("\n");
}

export function productEnquireMessage(
  greeting: string,
  product: { name: string; slug: string },
  siteUrl: string,
  variant?: string,
): string {
  const url = siteUrl ? `\n\n${siteUrl.replace(/\/$/, "")}/products/${product.slug}/` : "";
  return `${greeting} I am interested in:\n${product.name}${variant ? ` (${variant})` : ""}${url}`;
}
