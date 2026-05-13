import { useEffect, useState } from "react";
import Link from "next/link";
import { motion as Motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface Collection {
  id: string | number;
  name: string;
  image: string | null;
}

interface CategoryFromApi {
  id: string | number;
  name: string;
  image?: string | null;
}

interface SparkleConfig {
  left: number;
  top: number;
  delay: number;
  duration: number;
}

function coverImageFromTitle(
  title: string,
  remoteFallback: string | null,
): string | null {
  const t = title.toLowerCase().trim();

  if (t === "sets" || t.includes("sets")) return "/category/sets.jpg";

  if (t === "mists" || t.includes("mist")) return "/category/mists.jpg";

  if (t === "lotions" || t.includes("lotion")) return "/category/lotions.jpg";

  return remoteFallback;
}

export function Category() {
  const [collections, setCollections] = useState<Collection[]>([]);

  const [sparkleConfigs, setSparkleConfigs] = useState<SparkleConfig[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/categories");
        const body: { categories?: CategoryFromApi[]; error?: string } =
          await res.json();

        if (!res.ok || !body.categories?.length) return;

        setCollections(
          body.categories.map((c) => {
            const name =
              typeof c.name === "string"
                ? c.name.trim() || "Untitled"
                : "Untitled";
            return {
              id: c.id,
              name,
              image: coverImageFromTitle(
                name,
                typeof c.image === "string" && c.image.trim() ? c.image : null,
              ),
            };
          }),
        );
      } catch {
        setCollections([]);
      }
    })();
  }, []);

  useEffect(() => {
    setSparkleConfigs(
      Array.from({ length: 50 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      })),
    );
  }, []);

  return (
    <section className="py-16 sm:py-24 lg:pt-32 lg:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-[#a156b4]/5 via-[#a156b4]/5 to-[#a156b4]/5">
      {/* Ambient background */}
      <Motion.div
        className="absolute top-20 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#a156b4]/5 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkleConfigs.map((sparkle, i) => (
          <Motion.div
            key={i}
            className="absolute w-3 h-3 bg-[#a156b4] rounded-full shadow-lg shadow-[#a156b4]/50"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-16 relative z-20">
          <Motion.div
            className="inline-flex items-center gap-2 mb-4 sm:mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#a156b4]" />

            <p
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-[#a156b4]/70 tracking-[0.2em] sm:tracking-[0.4em] uppercase text-xs sm:text-sm font-light"
            >
              Collections
            </p>

            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#a156b4]" />
          </Motion.div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#a156b4] mb-4 sm:mb-6 leading-tight font-serif px-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shop by Category
          </h2>

          <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-[#a156b4]/50 to-transparent mx-auto" />
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 w-full max-w-7xl mx-auto">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/shop?category=${encodeURIComponent(String(collection.id))}`}
              className="block group transition-transform duration-300 ease-out hover:-translate-y-3"
            >
              <div className="relative w-full max-w-xs mx-auto sm:max-w-none transition-transform duration-300 ease-out group-hover:-translate-y-5 group-hover:scale-105">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden mb-4 sm:mb-5 rounded-lg shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white">
                  <img
                    src={collection.image ?? ""}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-[#a156b4]/0 group-hover:bg-[#a156b4]/10 transition-colors duration-500" />

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
                </div>

                {/* Text */}
                <div className="text-center space-y-1 sm:space-y-2">
                  <h3
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-xl sm:text-2xl lg:text-3xl text-[#a156b4] group-hover:text-[#8a4a9a] transition-colors duration-300 font-serif"
                  >
                    {collection.name}
                  </h3>

                  <div className="inline-flex items-center gap-2 text-[#a156b4] pt-1 sm:pt-2 transition-all duration-300 group-hover:gap-3">
                    <span
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-xs sm:text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Explore
                    </span>

                    <ArrowRight
                      className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#a156b4] w-0 group-hover:w-16 sm:group-hover:w-20 transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Fan Layout — fan positions tuned for three cards */}
        <div className="hidden lg:block relative h-[500px] xl:h-[600px] lg:mt-[-2rem] w-full max-w-7xl mx-auto flex items-end justify-center">
          {collections.slice(0, 3).map((collection, index) => {
            const rotations = [-12, 0, 12];

            const rotation = rotations[index];

            const translateX = index === 0 ? -200 : index === 2 ? 200 : 0;

            return (
              <Link
                key={collection.id}
                href={`/shop?category=${encodeURIComponent(String(collection.id))}`}
                className="block group absolute bottom-0 transition-transform duration-300 ease-out hover:-translate-y-4"
                style={{
                  left: "50%",
                  transform: `translateX(calc(-50% + ${translateX}px))`,
                  zIndex: index === 1 ? 20 : index === 0 ? 10 : 5,
                }}
              >
                <div
                  className="relative w-72 xl:w-80 transition-transform duration-300 ease-out group-hover:-translate-y-16 group-hover:scale-110"
                  style={{
                    transformOrigin: "bottom center",
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] cursor-pointer overflow-hidden mb-5 rounded-lg shadow-2xl border-4 border-white">
                    <img
                      src={collection.image ?? ""}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-[#a156b4]/0 group-hover:bg-[#a156b4]/10 transition-colors duration-500" />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
                  </div>

                  {/* Explore Button */}
                  <div
                    className="absolute top-0 right-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      transform: "translate(50%, -50%)",
                    }}
                  >
                    <Motion.div
                      className="absolute -top-2 -right-2"
                      initial={{
                        opacity: 0,
                        y: -10,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          delay: 0.3,
                          duration: 0.4,
                          ease: "easeOut",
                        },
                      }}
                    >
                      <div className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl border-2 border-[#a156b4]/50 flex items-center gap-2 group-hover:border-[#a156b4] transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a156b4]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-full" />

                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                          }}
                          className="relative z-10 text-[#a156b4] text-sm font-semibold tracking-wider uppercase"
                        >
                          Explore
                        </span>
                      </div>
                    </Motion.div>
                  </div>

                  {/* Text */}
                  <div className="text-center space-y-2">
                    <h3
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-3xl text-[#a156b4] group-hover:text-[#8a4a9a] transition-colors duration-300 font-serif"
                    >
                      {collection.name}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
