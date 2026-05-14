import type { Metadata } from "next";
import { Suspense } from "react";

import {
  Category,
  CategorySectionSkeleton,
} from "@/app/components/Homepage/Category";
import {
  Community,
  CommunitySectionSkeleton,
} from "@/app/components/Homepage/Community";
import {
  Favorites,
  FavoritesSectionSkeleton,
} from "@/app/components/Homepage/Favorites";
import {
  Testimonials,
  TestimonialsSectionSkeleton,
} from "@/app/components/Homepage/Testimonials";
import { HomePage } from "./_components/home-page";

export const metadata: Metadata = {
  title: {
    default: "Mystic Mist ",
    template: "%s · Mystic Mist",
  },
  description:
    "Discover luxurious body mists and fragrances—crafted to awaken your senses.",
  openGraph: {
    title: "Mystic Mist",
    description:
      "Discover luxurious body mists and fragrances—crafted to awaken your senses.",
    type: "website",
  },
};

export default function Home() {
  return (
    <HomePage
      category={
        <Suspense fallback={<CategorySectionSkeleton />}>
          <Category />
        </Suspense>
      }
      favorites={
        <Suspense fallback={<FavoritesSectionSkeleton />}>
          <Favorites />
        </Suspense>
      }
      testimonials={
        <Suspense fallback={<TestimonialsSectionSkeleton />}>
          <Testimonials />
        </Suspense>
      }
      community={
        <Suspense fallback={<CommunitySectionSkeleton />}>
          <Community />
        </Suspense>
      }
    />
  );
}
