"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
}

interface Testimonial {
  id: string | number;
  name: string;
  location: string;
  rating: number;
  quote: string;
  image: string | null;
}

type TestimonialsApiBody = {
  testimonials?: Array<{
    id?: string | number;
    name?: string;
    location?: string;
    rating?: number;
    text?: string;
    avatar_url?: string | null;
  }>;
  error?: string;
};

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

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/testimonials");
        const body: TestimonialsApiBody = await res.json();

        if (!res.ok || body.error) {
          console.error(body.error ?? "Failed to load testimonials");
          setTestimonials([]);
          return;
        }

        const rows = body.testimonials ?? [];

        const mappedTestimonials: Testimonial[] = rows.map((row, index) => {
          const avatar =
            typeof row.avatar_url === "string" && row.avatar_url.trim()
              ? row.avatar_url.trim()
              : null;

          return {
            id: row.id ?? row.name ?? index,
            name: row.name?.trim() || "",
            location: row.location?.trim() || "",
            rating:
              typeof row.rating === "number" &&
              row.rating >= 1 &&
              row.rating <= 5
                ? row.rating
                : 5,
            quote: row.text?.trim() || "",
            image: avatar,
          };
        });

        setTestimonials(mappedTestimonials);
      } catch (error) {
        console.error("Error loading testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative lg:px-[10rem] bg-white">
      <div className="max-w-7xl mx-auto">
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

        {loading ? (
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
        ) : testimonials.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={30}
            loop
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
              <SwiperSlide key={testimonial.id}>
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
                      "{testimonial.quote}"
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
      </div>
    </section>
  );
}
