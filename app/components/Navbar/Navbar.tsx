"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, Heart, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../store/cartStore";
import { useWishlist } from "../../store/wishlistStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/shop", label: "Shop" },
  ];

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-purple-100/50"
          : "bg-white/70 backdrop-blur-md border-b border-purple-100/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-24 relative">
          {/* Logo with Animation - Fixed width to prevent nav shift */}
          <Link
            href="/"
            onClick={scrollToTop}
            className="flex items-center group relative w-48 md:w-56"
          >
            <AnimatePresence mode="wait">
              {!scrolled ? (
                <motion.div
                  key="text-logo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute w-full"
                >
                  <h1
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-2xl md:text-3xl font-bold tracking-wider relative overflow-hidden inline-block"
                  >
                    <span className="relative inline-block text-[#a156b4] bg-clip-text">
                      MYSTIC MIST
                    </span>
                  </h1>
                </motion.div>
              ) : (
                <motion.div
                  key="m-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute w-full flex items-center justify-start"
                >
                  <img
                    src="/logo.png"
                    alt="MysticMist"
                    className="h-16 w-auto object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={scrollToTop}
                className="relative group"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  style={{ fontFamily: "var(--font-heading)" }}
                  className={`text-sm tracking-wider uppercase transition-colors font-body ${
                    pathname === link.path
                      ? "text-purple-700 font-medium"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                </motion.span>

                {/* Animated underline */}
                <motion.span
                  className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-[#E5C6ED] via-[#a156b4] to-[#E5C6ED] ${
                    pathname === link.path ? "w-full" : "w-0"
                  } group-hover:w-full transition-all duration-300`}
                  initial={false}
                />

                {/* Hover glow */}
                <motion.span
                  className="absolute -inset-2 bg-gradient-to-r from-[#E5C6ED]/10 to-[#a156b4]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm"
                  initial={false}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" onClick={scrollToTop}>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block relative p-2 text-purple-700 hover:text-purple-900 transition-colors group"
              >
                <Heart className="w-6 h-6" />
                <motion.span
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={wishlistCount}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {wishlistCount}
                </motion.span>
                <span className="absolute inset-0 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur" />
              </motion.button>
            </Link>

            {/* Cart */}
            <Link href="/cart" onClick={scrollToTop}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-purple-700 hover:text-purple-900 transition-colors group"
              >
                <ShoppingBag className="w-6 h-6" />
                <motion.span
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[#E5C6ED] to-[#a156b4] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartCount}
                </motion.span>
                <span className="absolute inset-0 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur" />
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 text-purple-900 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-purple-100/50 overflow-hidden"
          >
            <nav className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToTop();
                    }}
                    style={{ fontFamily: "var(--font-heading)" }}
                    className={`block py-3 px-6 rounded-xl text-lg transition-all font-body ${
                      pathname === link.path
                        ? "bg-gradient-to-r from-[#E5C6ED]/30 to-[#a156b4]/20 text-purple-900 shadow-sm"
                        : "text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-purple-100 space-y-2">
                <Link
                  href="/wishlist"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="w-full flex items-center space-x-3 py-3 px-6 rounded-xl text-gray-700 hover:bg-purple-50 transition-colors font-body"
                  >
                    <Heart className="w-5 h-5" />
                    <span style={{ fontFamily: "var(--font-heading)" }}>
                      Wishlist ({wishlistCount})
                    </span>
                  </motion.button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
