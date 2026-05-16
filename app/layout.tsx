import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { GuestCartWishlistSync } from "@/components/GuestCartWishlistSync";
import { BackToTop } from "@/components/ui/BackToTop";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GuestCartWishlistSync />
        <Navbar />
        <main className="flex-1 mt-24">{children}</main>
        <BackToTop />
        <Footer />
      </body>
    </html>
  );
}
