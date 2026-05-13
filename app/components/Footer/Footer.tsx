"use client";

import Link from "next/link";
import { useState, SVGProps } from "react";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";
// API disabled — running as frontend only
// import { getCategories } from "@/utils/api";

// Custom WhatsApp Icon Component
const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default WhatsAppIcon;

export function Footer() {
  // Static collections — API disabled, running as frontend only
  const [collections] = useState([
    { id: 1, name: "Women" },
    { id: 2, name: "Men" },
    { id: 3, name: "Unisex" },
    { id: 4, name: "Gift Sets" },
  ]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch categories from Strapi (disabled)
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const categories = await getCategories();
  //
  //       const mappedCollections = categories.slice(0, 4).map((category) => {
  //         return {
  //           id: category.id,
  //           name: category.attributes?.name || category.name || "",
  //           slug: category.attributes?.slug || category.slug || "",
  //         };
  //       });
  //
  //       setCollections(mappedCollections);
  //     } catch (error) {
  //       console.error("Error loading categories from Strapi:", error);
  //     }
  //   };
  //
  //   loadData();
  // }, []);

  return (
    <footer className="relative bg-gradient-to-b from-purple-50/50 via-purple-100/30 to-white border-t border-purple-200/50 overflow-hidden lg:pl-[9rem] lg:pr-[7rem]">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E5C6ED] to-transparent" />

      <div className="absolute top-0 right-4 sm:right-10 lg:right-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-[#E5C6ED]/20 to-[#a156b4]/10 rounded-full blur-3xl" />

      <div className="absolute bottom-0 left-4 sm:left-10 lg:left-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-[#a156b4]/20 to-[#E5C6ED]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        {/* Main Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-10 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-5">
            <div>
              <Link
                href="/"
                onClick={scrollToTop}
                className="inline-block mb-4 sm:mb-6 group"
              >
                <img
                  src="/logo.png"
                  alt="MysticMist"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </Link>

              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 max-w-md font-light"
              >
                Discover luxurious fragrances that define elegance and
                sophistication.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <div>
              <h4
                style={{ fontFamily: "var(--font-heading)" }}
                className="text-base sm:text-lg text-purple-900 mb-4 sm:mb-6"
              >
                Explore
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/shop", label: "Shop" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={scrollToTop}
                      className="text-gray-600 hover:text-purple-700 transition-colors text-base font-body group flex items-center"
                    >
                      <span className="w-0 h-px bg-purple-400 group-hover:w-4 transition-all mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Collections */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <div>
              <h4
                style={{ fontFamily: "var(--font-heading)" }}
                className="text-base sm:text-lg text-purple-900 mb-4 sm:mb-6"
              >
                Collections
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base font-body">
                {collections.length > 0 ? (
                  collections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(String(collection.id))}`}
                        onClick={scrollToTop}
                        className="group flex items-center cursor-pointer hover:text-purple-700 transition-colors"
                      >
                        <span className="w-0 h-px bg-purple-400 group-hover:w-4 transition-all mr-0 group-hover:mr-2" />
                        {collection.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="group flex items-center cursor-pointer hover:text-purple-700 transition-colors">
                      <span className="w-0 h-px bg-purple-400 group-hover:w-4 transition-all mr-0 group-hover:mr-2" />
                      Loading...
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-3 mt-6 sm:mt-0">
            <div>
              <h4
                style={{ fontFamily: "var(--font-heading)" }}
                className="text-base sm:text-lg text-purple-900 mb-4 sm:mb-6"
              >
                Get in Touch
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start space-x-3 text-gray-600 font-body">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Beirut, Lebanon</span>
                </li>
                <li className="flex items-start space-x-3 text-gray-600 font-body">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <a
                    href="mailto:hello@mysticmist.com"
                    className="text-sm sm:text-base hover:text-purple-700 transition-colors break-all"
                  >
                    hello@mysticmist.com
                  </a>
                </li>
                <li className="flex items-start space-x-3 text-gray-600 font-body">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">+961 76 936 883</span>
                </li>
              </ul>

              {/* Social Links */}
              <div className="mt-4 sm:mt-6 flex space-x-3">
                {[
                  //   {
                  //     icon: Instagram,
                  //     href: "https://instagram.com/mystic.mist.lb",
                  //     label: "Instagram",
                  //   },
                  {
                    icon: WhatsAppIcon,
                    href: "https://wa.me/+96176936883",
                    label: "WhatsApp",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#E5C6ED]/30 to-[#a156b4]/20 backdrop-blur-sm flex items-center justify-center text-purple-700 hover:from-[#E5C6ED] hover:to-[#a156b4] hover:text-white transition-all shadow-md hover:shadow-lg"
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent mb-6 sm:mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 gap-4">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#a156b4] flex-shrink-0" />

            <p
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-lg sm:text-xl lg:text-2xl text-[#a156b4] italic"
            >
              Where magic meets your senses
            </p>
          </div>

          <div className="flex space-x-4 sm:space-x-8 text-xs sm:text-sm text-gray-500 font-body">
            <a
              href="https://www.linkedin.com/in/hadi-baydoun-54431621b/"
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-colors duration-300"
            >
              Powered By{" "}
              <span className="font-semibold group-hover:text-[#a156b4] transition-colors duration-300">
                Hadi Baydoun
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
