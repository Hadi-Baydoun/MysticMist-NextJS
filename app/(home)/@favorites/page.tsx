import { Suspense } from "react";

import {
  Favorites,
  FavoritesSectionSkeleton,
} from "@/components/Homepage/Favorites";

export default function FavoritesSlot() {
  return (
    <Suspense fallback={<FavoritesSectionSkeleton />}>
      <Favorites />
    </Suspense>
  );
}
