import { Suspense } from "react";

import { HomeSectionFallback } from "@/components/Homepage/HomeSectionFallback";
import { TestimonialsCarousel } from "@/components/Homepage/TestimonialsCarousel";
import { fetchTestimonials } from "@/lib/testimonials-data";

async function TestimonialsContent() {
  const result = await fetchTestimonials();
  if (!result.ok) {
    console.error("testimonials fetch failed:", result.error);
  }

  const testimonials = result.ok ? result.testimonials : [];

  return (
    <section className="py-32 px-4 sm:px-6 relative lg:px-[10rem] bg-white">
      <div className="max-w-7xl mx-auto">
        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}

export default function TestimonialsSlot() {
  return (
    <Suspense
      fallback={<HomeSectionFallback />}
    >
      <TestimonialsContent />
    </Suspense>
  );
}
