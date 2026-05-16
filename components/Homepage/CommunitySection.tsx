"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

import {
  INSTAGRAM_PROFILE,
  type InstagramPost,
} from "@/lib/instagram-posts-data";

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z" />
      <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8 c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z" />
      <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8 c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z" />
    </svg>
  );
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

export function CommunitySection({ posts }: { posts: InstagramPost[] }) {
  return (
    <>
      <FadeInSection>
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-6 h-6 text-[#a156b4]" />
            </motion.div>

            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#E5C6ED] to-transparent mx-4" />

            <InstagramIcon className="w-14 h-14 shrink-0 text-[#a156b4]" />

            <div className="h-px w-24 bg-gradient-to-l from-transparent via-[#E5C6ED] to-transparent mx-4" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-6 h-6 text-[#a156b4]" />
            </motion.div>
          </div>

          <motion.div
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E5C6ED]/30 to-[#a156b4]/20 border border-[#E5C6ED]/40 inline-block"
            animate={{
              boxShadow: [
                "0 0 0px rgba(229, 198, 237, 0)",
                "0 0 20px rgba(229, 198, 237, 0.5)",
                "0 0 0px rgba(229, 198, 237, 0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className="text-[#a156b4] text-lg">
              Join Our Fragrance Community
            </p>
          </motion.div>

          <div className="flex flex-col items-center gap-4 mt-6">
            <motion.div
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white/80 border border-[#E5C6ED]/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-2 h-2 rounded-full bg-[#a156b4] animate-pulse" />
              <span className="text-sm text-[#a156b4]">
                Latest {posts.length} Posts
              </span>
            </motion.div>
          </div>
        </div>
      </FadeInSection>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {posts.map((post, index) => (
          <FadeInSection
            key={`${String(post.id)}-${index}`}
            delay={index * 0.08}
          >
            <motion.a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative isolate group overflow-hidden rounded-3xl transform-gpu backface-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#a156b4] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 420, damping: 26 },
              }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="aspect-square rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#E5C6ED]/40 to-[#a156b4]/20 shadow-lg shadow-black/10 ring-2 ring-transparent transition-[box-shadow,ring-color] duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-[#a156b4]/35 group-hover:ring-[#E5C6ED]/60">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={`Instagram post ${index + 1}`}
                    className="h-full w-full object-cover transition-[transform,filter] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                  />
                ) : null}

                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 -translate-x-[130%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[transform,opacity] duration-[900ms] ease-out will-change-transform group-hover:translate-x-[130%] group-hover:opacity-100" />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-[#a156b4]/22 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2d0c3a]/90 via-[#a156b4]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
                  <span className="-translate-y-3 scale-75 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:scale-100">
                    <span className="relative flex rounded-full bg-black/35 p-3.5 ring-1 ring-white/45 shadow-lg">
                      <InstagramIcon className="h-8 w-8 text-white drop-shadow-md" />
                    </span>
                  </span>
                  <span className="translate-y-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white/95 opacity-0 transition-all duration-500 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    View post
                  </span>
                </div>
              </div>
            </motion.a>
          </FadeInSection>
        ))}
      </div>

      <div className="text-center mt-20">
        <a href={INSTAGRAM_PROFILE} target="_blank" rel="noopener noreferrer">
          <motion.button
            className="inline-flex cursor-pointer items-center gap-3 px-8 py-4 border-2 border-[#a156b4] text-[#a156b4] rounded-full"
            whileHover={{ scale: 1.02 }}
          >
            <InstagramIcon className="w-7 h-7 shrink-0 text-[#a156b4]" />
            Follow Us on Instagram
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </a>
      </div>
    </>
  );
}
