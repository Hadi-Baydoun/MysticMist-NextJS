"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import type { Testimonial } from "@/lib/testimonials-data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
}

function FadeInSection({ children, delay = 0 }: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
}

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <>
      <FadeInSection>
        <div className="text-center mb-20">
          <motion.p
            style={{
              fontFamily: "var(--font-heading)",
            }}
            className="text-[#a156b4]/70 tracking-[0.3em] uppercase mb-4 font-body"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            Testimonials
          </motion.p>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
            }}
            className="text-5xl md:text-6xl text-[#a156b4] mb-6"
          >
            What Our Customers Say
          </h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-[#E5C6ED] to-transparent mx-auto"
            animate={{ scaleX: [1, 1.5, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>
      </FadeInSection>

      {testimonials.length > 0 ? (
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={30}
          loop={testimonials.length >= 4}
          grabCursor
          speed={600}
          resistanceRatio={0.85}
          observer
          observeParents
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="!pb-12 !px-4 !pt-4"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={`${String(testimonial.id)}-${index}`}>
              <FadeInSection delay={index * 0.15}>
                <motion.div
                  whileHover={{
                    y: -12,
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.2 }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-white/80 to-[#E5C6ED]/20 backdrop-blur-sm border border-[#E5C6ED]/30 shadow-xl h-full flex flex-col"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#E5C6ED]/50 bg-gradient-to-br from-[#E5C6ED] to-[#a156b4] flex items-center justify-center"
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                    >
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {(testimonial.name || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </motion.div>

                    <div>
                      <h4
                        style={{
                          fontFamily: "var(--font-heading)",
                        }}
                        className="text-lg text-[#a156b4]"
                      >
                        {testimonial.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 italic flex-1">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </motion.div>
              </FadeInSection>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No testimonials found.</p>
        </div>
      )}
    </>
  );
}
