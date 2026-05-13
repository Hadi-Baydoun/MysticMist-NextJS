"use client";

import { Hero } from "@/app/components/Homepage/Hero";
import { Statistics } from "@/app/components/Homepage/Statistics";
import { Category } from "@/app/components/Homepage/Category";
import { Products } from "@/app/components/Homepage/Products";
import { Testimonials } from "@/app/components/Homepage/Testimonials";
import { Community } from "@/app/components/Homepage/Community";

export function HomePage() {
  return (
    <>
      <Hero />
      <Statistics />
      <Category />
      <Products />
      <Testimonials />
      <Community />
    </>
  );
}
