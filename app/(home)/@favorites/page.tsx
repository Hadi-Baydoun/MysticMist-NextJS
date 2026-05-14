import { Suspense } from "react";

import {
  favoriteProductToCarousel,
  fetchFavoriteProducts,
} from "@/lib/favorites-data";
import { FavoritesCarousel } from "@/components/Homepage/FavoritesCarousel";

function FavoritesSectionSkeleton() {
  return (
    <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5] relative">
      <div className="max-w-7xl mx-auto">
        <p
          className="text-center text-[#a156b4]/70 py-24 font-body"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Loading highlights…
        </p>
      </div>
    </section>
  );
}

async function FavoritesContent() {
  const result = await fetchFavoriteProducts();
  if (!result.ok) {
    console.error("fetch failed:", result.error);
    return null;
  }

  const cards = result.products
    .map(favoriteProductToCarousel)
    .filter((p) => String(p.id).trim() !== "");

  if (cards.length === 0) return null;

  return (
    <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5] relative">
      <div className="max-w-7xl mx-auto">
        <FavoritesCarousel products={cards} />
      </div>
    </section>
  );
}

export default function FavoritesSlot() {
  return (
    <Suspense fallback={<FavoritesSectionSkeleton />}>
      <FavoritesContent />
    </Suspense>
  );
}
