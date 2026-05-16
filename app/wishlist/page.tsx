import type { Metadata } from "next";

import WishlistPageClient from "./wishlist-page-client";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Mystic Mist favorites.",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
