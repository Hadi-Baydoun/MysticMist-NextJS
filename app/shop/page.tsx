import { fetchCategories } from "@/lib/categories-data";
import {
  fetchProducts,
  productPayloadToShopProduct,
} from "@/lib/products-data";

import ShopPageClient from "./shop-page-client";

export default async function ShopPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  if (!productsResult.ok) {
    console.error("products fetch failed:", productsResult.error);
  }
  if (!categoriesResult.ok) {
    console.error("categories fetch failed:", categoriesResult.error);
  }

  const initialProducts = productsResult.ok
    ? productsResult.products
        .map(productPayloadToShopProduct)
        .filter((p) => p.id !== "")
    : [];

  const categories = categoriesResult.ok ? categoriesResult.categories : [];

  return (
    <ShopPageClient
      initialProducts={initialProducts}
      categories={categories}
    />
  );
}
