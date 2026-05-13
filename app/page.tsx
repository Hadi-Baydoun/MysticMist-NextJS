import type { Metadata } from "next";
import { HomePage } from "./_components/home-page";

export const metadata: Metadata = {
  title: {
    default: "Mystic Next — Premium fragrance",
    template: "%s · Mystic Next",
  },
  description:
    "Discover luxurious body mists and fragrances—crafted to awaken your senses.",
  openGraph: {
    title: "Mystic Next — Premium fragrance",
    description:
      "Discover luxurious body mists and fragrances—crafted to awaken your senses.",
    type: "website",
  },
};

export default function Home() {
  return <HomePage />;
}
