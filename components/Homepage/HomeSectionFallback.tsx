import { SkeletonCard } from "@/components/ui/skeleton-card";

type HomeSectionFallbackProps = {
  /** How many placeholder cards to show. */
  cards?: number;
};

export function HomeSectionFallback({ cards = 3 }: HomeSectionFallbackProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#a156b4]/5 via-white/80 to-[#E5C6ED]/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5C6ED]/25 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap justify-center gap-7 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {Array.from({ length: cards }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
