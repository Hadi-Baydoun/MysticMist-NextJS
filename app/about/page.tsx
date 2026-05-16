"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, ShieldCheck, Users } from "lucide-react";

import { BackToTop } from "@/components/ui/BackToTop";
import { Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";

export default function About() {
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const values: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[] = [
    {
      icon: Heart,
      title: "Authentic Products",
      description:
        "We bring you 100% original Victoria’s Secret lotions, mists, and sets from the United States.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Quality",
      description:
        "Every item is carefully selected to ensure freshness, high quality, and genuine fragrance.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description:
        "Your satisfaction comes first. We aim to offer a smooth, reliable, and enjoyable shopping experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E5C6ED]/20 to-transparent pointer-events-none" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <Sparkles className="w-8 h-8 text-[#E5C6ED]" />
        </div>

        <div className="absolute bottom-20 right-10 animate-pulse delay-700">
          <Sparkles className="w-6 h-6 text-[#a156b4]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn as Variants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-5 h-5 text-[#a156b4]" />

              <span
                style={{ fontFamily: "var(--font-heading)" }}
                className="text-[#a156b4]/70 tracking-[0.2em] uppercase text-sm font-light"
              >
                Our Story
              </span>

              <Sparkles className="w-5 h-5 text-[#a156b4]" />
            </motion.div>

            <h1
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-5xl md:text-7xl text-[#a156b4] mb-8"
            >
              The Essence of MysticMist
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-10 font-light">
              Born from a passion for bringing the best fragrances to everyone,
              Mystic Mist is your trusted source for authentic Victoria’s Secret
              lotions, mists, and sets. Shipped directly from the United States
              We’re more than a beauty shop. We’re curators of confidence.
              Offering original products that help you feel fresh, stylish, and
              unique every day. Our journey started with one idea: everyone
              deserves access to real, high-quality scents they can trust.
            </p>

            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#E5C6ED] to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Image Split Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1458538977777-0549b2370168?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Perfume Bottle"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  />

                  <img
                    src="https://images.unsplash.com/photo-1585337913966-114ba3cf1f80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTB8fHxlbnwwfHx8fHw%3D"
                    alt="Flowers"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop"
                    alt="Process"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />

                  <img
                    src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800&auto=format&fit=crop"
                    alt="Elegance"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-6 rounded-full shadow-xl border border-[#E5C6ED]">
                <div className="text-center">
                  <span
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="block text-3xl text-[#a156b4]"
                  >
                    Est.
                  </span>

                  <span
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="block text-xl text-[#a156b4]"
                  >
                    2024
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                style={{ fontFamily: "var(--font-heading)" }}
                className="text-4xl text-[#a156b4] mb-6"
              >
                Where Magic Meets Elegance
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                At Mystic Mist, we focus on bringing you 100% authentic
                Victoria’s Secret lotions, mists, and gift sets directly from
                the United States. We carefully select every product to make
                sure you get the best quality, fresh fragrances, and the
                original experience you love.
              </p>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Our goal is simple: premium products, trusted authenticity, and
                scents that make you feel confident every day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-xl border border-[#E5C6ED]/50 hover:shadow-md transition-shadow text-center sm:text-left"
                  >
                    <div className="mb-3 inline-block p-2 bg-[#F5F5F5] rounded-full">
                      <value.icon className="w-6 h-6 text-[#a156b4]" />
                    </div>

                    <h3 className="font-medium text-[#a156b4] mb-1">
                      {value.title}
                    </h3>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Detail Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn as Variants}
            className="text-center mb-16"
          >
            <h2
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-4xl text-[#a156b4] mb-4"
            >
              Our Core Values
            </h2>

            <div className="h-1 w-20 bg-[#E5C6ED] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center p-8 rounded-3xl bg-[#F5F5F5] border border-transparent transition-all duration-300 group"
              >
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-[#a156b4] shadow-md">
                  <value.icon className="w-6 h-6 text-[#a156b4]" />
                </div>

                <h3
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-2xl text-[#a156b4] mb-4"
                >
                  {value.title}
                </h3>

                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BackToTop />
    </div>
  );
}
