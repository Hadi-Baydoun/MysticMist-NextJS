"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Users, Award, Heart, TrendingUp, LucideIcon } from "lucide-react";

interface CountUpProps {
  target: number;
  delay?: number;
}

const CountUp: React.FC<CountUpProps> = ({ target, delay = 0 }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [count, setCount] = useState<number>(0);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  });

  useEffect(() => {
    if (!isInView) return;

    const duration = 4000;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = target;

    let animationFrameId: number;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out function
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easeOut,
      );

      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, delay * 2000);

    return () => {
      clearTimeout(timeoutId);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, target, delay]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

interface StatItemProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({
  icon: Icon,
  value,
  label,
  delay,
}) => {
  const controls = useAnimation();

  const ref = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.4,
  });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
      });
    }
  }, [isInView, controls]);

  const numericValue = parseInt(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.7, delay }}
      className="flex flex-col items-center text-center space-y-3"
    >
      <Icon className="w-10 h-10 text-[#a156b4]" />

      <motion.span
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{
          duration: 0.6,
          delay: delay + 0.3,
          type: "spring",
          bounce: 0.4,
        }}
        style={{ fontFamily: "var(--font-heading)" }}
        className="relative inline-block text-6xl font-bold"
      >
        <span className="relative z-10 bg-gradient-to-br from-[#a156b4] via-[#C8A2D0] to-[#E5C6ED] bg-clip-text text-transparent">
          <CountUp target={numericValue} delay={delay} />
          {value.includes("+") && "+"}
          {value.includes("%") && "%"}
        </span>

        <span
          className="absolute inset-0 z-20 pointer-events-none shimmer-overlay"
          style={{
            fontFamily: "var(--font-heading)",
            background:
              "linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.7) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <CountUp target={numericValue} delay={delay} />
          {value.includes("+") && "+"}
          {value.includes("%") && "%"}
        </span>
      </motion.span>

      <p
        style={{ fontFamily: "var(--font-heading)" }}
        className="text-gray-700 text-lg font-medium"
      >
        {label}
      </p>
    </motion.div>
  );
};

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
  delay: number;
}

const stats: Stat[] = [
  {
    icon: Users,
    value: "500+",
    label: "Trusted Customers",
    delay: 0.1,
  },
  {
    icon: Award,
    value: "100%",
    label: "Premium Quality",
    delay: 0.2,
  },
  {
    icon: Heart,
    value: "25+",
    label: "Unique Items",
    delay: 0.3,
  },
];

export function Statistics() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        .shimmer-overlay {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      <section className="relative pt-28 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#a156b4]/5 via-[#a156b4]/5 to-[#a156b4]/5 overflow-hidden pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#E5C6ED]/20 to-[#a156b4]/20 border border-[#E5C6ED]/30 mb-12"
        >
          <TrendingUp className="w-4 h-4 text-[#a156b4]" />

          <span
            style={{ fontFamily: "var(--font-heading)" }}
            className="text-sm text-[#a156b4] font-semibold"
          >
            OUR ACHIEVEMENTS
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-5xl bg-transparent mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </section>
    </>
  );
}
