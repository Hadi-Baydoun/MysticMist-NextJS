"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import type { FavoriteCarouselProduct } from "@/lib/favorites-data";

import "swiper/css";
import "swiper/css/pagination";

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export function FavoritesCarousel({
  products,
}: {
  products: FavoriteCarouselProduct[];
}) {
  return (
    <>
      <FadeInSection>
        <div className="text-center mb-20">
          <motion.div
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
              Top Picks
            </p>

            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#a156b4]" />
          </motion.div>

          <h2
            style={{ fontFamily: "var(--font-heading)" }}
            className="text-5xl md:text-6xl text-[#a156b4] mb-6"
          >
            This Week&apos;s Highlights
          </h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-[#E5C6ED] to-transparent mx-auto"
            animate={{ scaleX: [1, 1.5, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </div>
      </FadeInSection>

      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={3}
          spaceBetween={0}
          loop={products.length >= 3}
          grabCursor
          speed={600}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
          className="!px-4 !pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={String(product.id)}>
              <Link href={`/product/${product.id}`} className="block">
                <div className="group relative max-w-xs mx-auto cursor-pointer transition-transform duration-300 ease-out">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-[#E5C6ED]/20 to-[#a156b4]/10 shadow-xl sm:shadow-2xl group-hover:shadow-[0_25px_50px_-12px_rgba(161,86,180,0.25)] border-2 sm:border-4 border-white group-hover:border-[#E5C6ED] transition-all duration-500 mb-6">
                    {product.salePrice && product.salePrice < product.price && (
                      <motion.div
                        className="absolute top-0 right-0 z-30"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <div className="relative">
                          <div className="px-3 py-1.5 rounded-bl-3xl rounded-tr-3xl bg-gradient-to-r from-[#a156b4] to-[#8e4a9f] text-white text-xs sm:text-sm backdrop-blur-sm shadow-lg font-body flex items-center space-x-1.5">
                            <Tag
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                              strokeWidth={2.5}
                            />

                            <span>
                              -
                              {Math.round(
                                ((product.price - product.salePrice) /
                                  product.price) *
                                  100,
                              )}
                              %
                            </span>
                          </div>

                          <div className="absolute inset-0 rounded-bl-3xl rounded-tr-3xl bg-[#a156b4]/30 blur-md -z-10" />
                        </div>
                      </motion.div>
                    )}

                    <div className="w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute inset-0 bg-[#a156b4]/0 group-hover:bg-[#a156b4]/10 transition-colors duration-500" />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />

                    <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="p-6 bg-gradient-to-t from-black/50 via-black/40 to-transparent backdrop-blur-md">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {product.salePrice && (
                              <span
                                style={{
                                  fontFamily: "var(--font-heading)",
                                }}
                                className="text-xs text-[#E5C6ED]/80 uppercase tracking-wider"
                              >
                                NOW
                              </span>
                            )}

                            <span
                              style={{
                                fontFamily: "var(--font-heading)",
                              }}
                              className="text-4xl text-[#E5C6ED]"
                            >
                              ${product.salePrice ?? product.price}
                            </span>
                          </div>

                          {product.salePrice && (
                            <div className="relative">
                              <span
                                style={{
                                  fontFamily: "var(--font-heading)",
                                }}
                                className="text-lg text-gray-300/60"
                              >
                                ${product.price}
                              </span>

                              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E5C6ED]/60" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2 transition-transform duration-500 group-hover:-translate-y-20">
                      {product.specialTags.map((tag, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E5C6ED]/50 shadow-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#E5C6ED] to-[#a156b4] animate-pulse" />

                          <span className="text-xs text-[#a156b4] font-body">
                            {tag}
                          </span>
                        </motion.div>
                      ))}

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex ml-2 items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#E5C6ED]/90 backdrop-blur-md border border-[#a156b4]/30 shadow-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#a156b4] to-[#8e4a9f] animate-pulse" />

                        <span className="text-xs text-[#a156b4] font-body font-semibold">
                          {product.category}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      className="h-0.5 w-10 sm:w-12 bg-gradient-to-r from-transparent to-[#a156b4]"
                      animate={{ scaleX: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />

                    <motion.div
                      animate={{
                        rotate: [0, 90, 180, 270, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mx-2"
                    >
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#a156b4] rotate-45 shadow-sm shadow-[#a156b4]/50" />
                    </motion.div>

                    <motion.div
                      className="h-0.5 w-10 sm:w-12 bg-gradient-to-l from-transparent to-[#a156b4]"
                      animate={{ scaleX: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1,
                      }}
                    />
                  </div>

                  <div className="text-center">
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                      }}
                      className="text-2xl text-[#a156b4] mb-3"
                    >
                      {product.name}
                    </h3>

                    <div className="lg:hidden flex items-center justify-center space-x-3 mt-2">
                      {product.salePrice && (
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                          }}
                          className="text-xs text-[#E5C6ED]/80 uppercase tracking-wider"
                        >
                          NOW
                        </span>
                      )}

                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                        }}
                        className="text-2xl text-[#a156b4]"
                      >
                        ${product.salePrice ?? product.price}
                      </span>

                      {product.salePrice && (
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                          }}
                          className="text-lg text-gray-400 line-through"
                        >
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <FadeInSection delay={0.5}>
        <div className="text-center mt-16">
          <Link href="/shop">
            <motion.button
              style={{
                fontFamily: "var(--font-heading)",
              }}
              className="group relative cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[#a156b4] text-[#a156b4] rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:bg-[#a156b4] hover:text-white hover:shadow-lg hover:shadow-[#a156b4]/30 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <Sparkles className="w-4 h-4 sm:w-5 sm:w-5 text-[#E5C6ED]" />

              <span className="relative z-10">View All Products</span>

              <motion.div
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </Link>
        </div>
      </FadeInSection>
    </>
  );
}
