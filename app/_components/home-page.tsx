"use client";

import type { ReactNode } from "react";

import { Hero } from "@/app/components/Homepage/Hero";
import { Statistics } from "@/app/components/Homepage/Statistics";

export function HomePage({
  category,
  favorites,
  testimonials,
  community,
}: {
  category: ReactNode;
  favorites: ReactNode;
  testimonials: ReactNode;
  community: ReactNode;
}) {
  return (
    <>
      <Hero />
      <Statistics />
      {category}
      {favorites}
      {testimonials}
      {community}
    </>
  );
}
