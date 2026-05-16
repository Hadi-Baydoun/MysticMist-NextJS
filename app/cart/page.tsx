import type { Metadata } from "next";

import CartPageClient from "./cart-page-client";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your Mystic Mist shopping bag.",
};

export default function CartPage() {
  return <CartPageClient />;
}
