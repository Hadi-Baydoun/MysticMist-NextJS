"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const MIST_X_OFFSETS = [-12, 8, -6, 14, -10, 5];

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="fixed bottom-8 right-8 z-50 group "
        >
          <motion.div
            className="absolute -top-6 -left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-[#E5C6ED]" />
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Sparkles className="w-3 h-3 text-[#a156b4]" />
          </motion.div>

          <motion.div
            className="absolute -bottom-6 -right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Sparkles className="w-3 h-3 text-[#E5C6ED]" />
          </motion.div>

          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #E5C6ED, #a156b4, #E5C6ED)",
                padding: "3px",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full rounded-full bg-white" />
            </motion.div>

            <motion.button
              type="button"
              aria-label="Back to top"
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-16 h-16 cursor-pointer rounded-full bg-gradient-to-br from-[#E5C6ED] to-[#a156b4] shadow-2xl shadow-[#a156b4]/40 flex items-center justify-center overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="absolute inset-0 overflow-visible opacity-0 group-hover:opacity-100">
                {MIST_X_OFFSETS.map((xOffset, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/60 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      y: [0, -40],
                      x: [0, xOffset],
                      opacity: [1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <ArrowUp className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>

              <motion.div
                className="absolute inset-2 rounded-full border-2 border-white/30"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-[#E5C6ED] to-[#a156b4] px-4 py-2 rounded-full shadow-lg">
                <span
                  className="text-white text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Back to Top
                </span>
              </div>
            </motion.div>
          </div>

          <svg
            className="absolute -inset-2 w-20 h-20 -rotate-90 pointer-events-none"
            viewBox="0 0 80 80"
            aria-hidden
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#E5C6ED"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke="url(#back-to-top-gradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              style={{
                pathLength: scaleX,
              }}
              strokeDasharray="0 1"
            />
            <defs>
              <linearGradient
                id="back-to-top-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#E5C6ED" />
                <stop offset="100%" stopColor="#a156b4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
