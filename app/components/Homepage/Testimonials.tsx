import { fetchTestimonials } from "@/lib/testimonials-data";
import { TestimonialsCarousel } from "@/app/_components/TestimonialsCarousel";

export function TestimonialsSectionSkeleton() {
  return (
    <section className="py-32 px-4 sm:px-6 relative lg:px-[10rem] bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p
            style={{
              fontFamily: "var(--font-heading)",
            }}
            className="text-gray-500"
          >
            Loading testimonials...
          </p>
        </div>
      </div>
    </section>
  );
}

export async function Testimonials() {
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
