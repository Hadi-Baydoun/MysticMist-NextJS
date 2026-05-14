import {
  fetchProducts,
  productPayloadToShopProduct,
} from "@/lib/products-data";

import ShopPageClient from "./shop-page-client";

export default async function ShopPage() {
  const result = await fetchProducts();
  if (!result.ok) {
    console.error("products fetch failed:", result.error);
  }

  const initialProducts = result.ok
    ? result.products.map(productPayloadToShopProduct).filter((p) => p.id !== "")
    : [];

  return <ShopPageClient initialProducts={initialProducts} />;
}
