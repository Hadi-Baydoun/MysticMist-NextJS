import { Suspense } from "react";

import { CommunitySection } from "@/components/Homepage/CommunitySection";
import { fetchInstagramPosts } from "@/lib/instagram-posts-data";

function CommunitySectionSkeleton() {
  return (
    <section className="py-12 pb-32 px-4 sm:px-6 lg:px-[11rem] bg-gradient-to-b from-white to-[#E5C6ED]/10 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#E5C6ED]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#a156b4]/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center py-20">
          <p className="text-sm text-[#a156b4]">Loading posts…</p>
        </div>
      </div>
    </section>
  );
}

async function CommunityContent() {
  const result = await fetchInstagramPosts();
  if (!result.ok) {
    console.error("instagram_posts fetch failed:", result.error);
  }

  const posts = result.ok ? result.instagram_posts : [];

  return (
    <section className="py-12 pb-32 px-4 sm:px-6 lg:px-[11rem] bg-gradient-to-b from-white to-[#E5C6ED]/10 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#E5C6ED]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#a156b4]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <CommunitySection posts={posts} />
      </div>
    </section>
  );
}

export default function CommunitySlot() {
  return (
    <Suspense fallback={<CommunitySectionSkeleton />}>
      <CommunityContent />
    </Suspense>
  );
}
