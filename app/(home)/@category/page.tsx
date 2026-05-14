import { Suspense } from "react";

import { CategorySection } from "@/components/Homepage/CategorySection";
import { fetchCategories } from "@/lib/categories-data";

function CategorySectionSkeleton() {
  return (
    <section className="py-16 sm:py-24 lg:pt-32 lg:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-[#a156b4]/5 via-[#a156b4]/5 to-[#a156b4]/5">
      <div className="max-w-7xl mx-auto relative z-10 py-24 text-center">
        <p
          className="text-[#a156b4]/70"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Loading collections…
        </p>
      </div>
    </section>
  );
}

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
    <Suspense fallback={<CategorySectionSkeleton />}>
      <CategoryContent />
    </Suspense>
  );
}
