import { Suspense } from "react";

import {
  Testimonials,
  TestimonialsSectionSkeleton,
} from "@/components/Homepage/Testimonials";

export default function TestimonialsSlot() {
  return (
    <Suspense fallback={<TestimonialsSectionSkeleton />}>
      <Testimonials />
    </Suspense>
  );
}
