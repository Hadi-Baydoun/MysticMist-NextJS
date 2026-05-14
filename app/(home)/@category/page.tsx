import { Suspense } from "react";

import {
  Category,
  CategorySectionSkeleton,
} from "@/components/Homepage/Category";

export default function CategorySlot() {
  return (
    <Suspense fallback={<CategorySectionSkeleton />}>
      <Category />
    </Suspense>
  );
}
