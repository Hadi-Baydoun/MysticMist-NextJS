import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  fetchProductById,
  productPayloadToDetail,
  productPayloadToShopProduct,
} from "@/lib/products-data";

import { ProductDetailClient } from "./product-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchProductById(id);

  if (!result.ok) {
    return { title: "Product" };
  }

  const summary = productPayloadToShopProduct(result.product);
  const description =
    typeof result.product.description === "string" && result.product.description
      ? result.product.description
      : undefined;

  return {
    title: summary.name || "Product",
    description,
    openGraph: {
      title: summary.name || "Product",
      description,
      images: summary.image ? [{ url: summary.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const result = await fetchProductById(id);

  if (!result.ok) {
    notFound();
  }

  const product = productPayloadToDetail(result.product);

  if (product.id === "" || product.name === "") {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
