"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

type HeroSlide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
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
    accent: "#E5C6ED",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1759793499819-bf60128a54b4?auto=format&fit=crop&w=1600&q=80",
    title: "Elegance in Every Drop",
    subtitle: "Premium body mists crafted with passion",
    accent: "#C8A2D0",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1610630277373-8cb0eb815de0?auto=format&fit=crop&w=1600&q=80",
    title: "Your Signature Scent",
    subtitle: "Luxury fragrances that define you",
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
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6 lg:px-0">
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
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
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
            <Link href="/shop">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  y: -2,
                  boxShadow: "0px 15px 35px rgba(181,125,194,0.45)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-full font-medium cursor-pointer bg-[#B57DC2] text-white"
              >
                {/* Animated background glow */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#d9a7e5] via-[#B57DC2] to-[#9b59b6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Shine effect */}
                <span className="absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/20 blur-md group-hover:left-[120%] transition-all duration-700" />

                <Sparkles className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />

                <span className="relative z-10">Explore Collection</span>

                <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
          <button
            onClick={prevSlide}
            className="group w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
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
            className="group w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
}
