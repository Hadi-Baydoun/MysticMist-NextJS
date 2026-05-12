"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../app/components/Navbar/Navbar";
import { Footer } from "../app/components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <Navbar />
        <main className="flex-1 mt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
