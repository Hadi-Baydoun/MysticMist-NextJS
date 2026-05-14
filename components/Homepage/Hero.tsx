"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

type HeroSlide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;
};

/** Deterministic 0–1 pseudo-random from index (same on server + client; avoids hydration mismatch). */
function unitFromIndex(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLE_COUNT = 15;

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1668191174012-7d5a78e454a5?auto=format&fit=crop&w=1600&q=80",
    title: "Awaken Your Senses",
    subtitle: "Discover the art of luxurious fragrance",
    cta: "Explore Collection",
    accent: "#E5C6ED",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1759793499819-bf60128a54b4?auto=format&fit=crop&w=1600&q=80",
    title: "Elegance in Every Drop",
    subtitle: "Premium body mists crafted with passion",
    cta: "Shop Now",
    accent: "#C8A2D0",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1610630277373-8cb0eb815de0?auto=format&fit=crop&w=1600&q=80",
    title: "Your Signature Scent",
    subtitle: "Luxury fragrances that define you",
    cta: "Discover More",
    accent: "#a156b4",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.1,
              }}
              transition={{
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 7, ease: "linear" },
              }}
              className="absolute inset-0"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${slide.accent}40, transparent)`,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
            </motion.div>
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
            const left = unitFromIndex(i * 4) * 100;
            const top = unitFromIndex(i * 4 + 1) * 100;
            const duration = 4 + unitFromIndex(i * 4 + 2) * 3;
            const delay = unitFromIndex(i * 4 + 3) * 2;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                }}
              />
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="max-w-3xl text-white">
            {/* Badge */}
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#E5C6ED]" />
              <span className="text-sm">Premium Fragrance Collection</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg md:text-xl text-white/80 mb-10"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>

            {/* CTA */}
            <motion.button
              key={`cta-${currentSlide}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-7 py-4 bg-[#B57DC2] rounded-full font-medium"
            >
              <Sparkles className="w-5 h-5" />
              {heroSlides[currentSlide].cta}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronLeft />
          </button>

          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-[#E5C6ED]"
                    : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
}
