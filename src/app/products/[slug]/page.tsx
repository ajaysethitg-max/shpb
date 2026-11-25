import type { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/store";
import ProductView from "./View";

// A static site can only build the pages that exist when it is built.
// Items added to the sheet later are opened through the 404 page (see app/not-found.tsx).
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product not found" };
  const desc = (p.description || p.name).slice(0, 155);
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: desc, images: p.image.startsWith("/images/placeholder") ? undefined : [{ url: p.image, alt: p.name }] },
  };
}


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
