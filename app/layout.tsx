import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { GuestCartWishlistSync } from "@/components/GuestCartWishlistSync";
import { BackToTop } from "@/components/ui/BackToTop";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";

import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mystic Mist",
    template: "%s · Mystic Mist",
  },
  description:
    "Discover luxurious body mists and fragrances—crafted to awaken your senses.",
  openGraph: {
    title: "Mystic Mist",
    description:
      "Discover luxurious body mists and fragrances—crafted to awaken your senses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <GuestCartWishlistSync />
        <Navbar />
        <main className="flex-1 mt-8">{children}</main>
        <BackToTop />
        <Footer />
      </body>
    </html>
  );
}
