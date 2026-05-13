import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
}

interface InstagramPost {
  id: string | number;
  link: string;
  image: string | null;
}

type InstagramPostsApiBody = {
  instagram_posts?: Array<{
    id?: string;
    link?: string | null;
    image?: string | null;
  }>;
  error?: string;
};

const INSTAGRAM_PROFILE = "https://instagram.com/mystic.mist.lb";

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

export function Community() {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/instagram_posts");
        const body: InstagramPostsApiBody = await res.json();

        if (!res.ok || body.error) {
          console.error(body.error ?? "Failed to load Instagram posts");
          setInstagramPosts([]);
          return;
        }

        const rows = body.instagram_posts ?? [];

        const mapped: InstagramPost[] = rows.map((row, index) => {
          const link =
            typeof row.link === "string" && row.link.trim()
              ? row.link.trim()
              : INSTAGRAM_PROFILE;
          const image =
            typeof row.image === "string" && row.image.trim()
              ? row.image.trim()
              : null;

          return {
            id: row.id ?? index,
            link,
            image,
          };
        });

        setInstagramPosts(mapped);
      } catch (e) {
        console.error("Error loading Instagram posts:", e);
        setInstagramPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-12 pb-32 px-4 sm:px-6 lg:px-[11rem] bg-gradient-to-b from-white to-[#E5C6ED]/10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#E5C6ED]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#a156b4]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeInSection>
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="w-6 h-6 text-[#a156b4]" />
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#E5C6ED] to-transparent mx-4" />
              <InstagramIcon className="w-10 h-10 shrink-0 text-[#a156b4]" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-[#E5C6ED] to-transparent mx-4" />
              <Sparkles className="w-6 h-6 text-[#a156b4]" />
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

            <motion.div
              className="inline-flex items-center space-x-2 mt-6 px-6 py-3 rounded-full bg-white/80 border border-[#E5C6ED]/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-2 h-2 rounded-full bg-[#a156b4] animate-pulse" />
              <span className="text-sm text-[#a156b4]">
                {loading
                  ? "Loading posts…"
                  : `Latest ${instagramPosts.length} Posts`}
              </span>
            </motion.div>
          </div>
        </FadeInSection>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <FadeInSection
              key={`${String(post.id)}-${index}`}
              delay={index * 0.08}
            >
              <motion.a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
                whileHover={{ scale: 1.1 }}
              >
                <div className="aspect-square rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#E5C6ED]/40 to-[#a156b4]/20">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={`Instagram post ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#a156b4]/80 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    <InstagramIcon className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
              </motion.a>
            </FadeInSection>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-20">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#a156b4] text-[#a156b4] rounded-full"
              whileHover={{ scale: 1.02 }}
            >
              <InstagramIcon className="w-5 h-5 shrink-0 text-[#a156b4]" />
              Follow Us on Instagram
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </a>
        </div>
      </div>
    </section>
  );
}
