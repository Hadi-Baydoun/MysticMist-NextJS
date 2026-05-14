import { Suspense } from "react";

import { CategorySection } from "@/components/Homepage/CategorySection";
import { HomeSectionFallback } from "@/components/Homepage/HomeSectionFallback";
import { fetchCategories } from "@/lib/categories-data";

async function CategoryContent() {
  const result = await fetchCategories();
  if (!result.ok) {
    console.error("categories fetch failed:", result.error);
  }

  const collections = result.ok ? result.categories : [];

  return <CategorySection collections={collections} />;
}

export default function CategorySlot() {
  return (
    <Suspense
      fallback={<HomeSectionFallback />}
    >
      <CategoryContent />
    </Suspense>
  );
}
