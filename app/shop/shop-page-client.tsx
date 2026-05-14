"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  Suspense,
  type ReactNode,
} from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { ShopCatalogProduct } from "@/lib/products-data";

type Filters = {
  category: string;
  priceRange: { min: string; max: string };
  sortBy: string;
  searchQuery: string;
  onSale: boolean;
  page: number;
};

const PAGE_SIZE = 6;

function sortProducts(list: ShopCatalogProduct[], sortBy: string): ShopCatalogProduct[] {
  const next = [...list];
  const displayPrice = (p: ShopCatalogProduct) => p.salePrice ?? p.price;

  switch (sortBy) {
    case "createdAt:asc":
      return next.sort((a, b) =>
        (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
      );
    case "price:asc":
      return next.sort((a, b) => displayPrice(a) - displayPrice(b));
    case "price:desc":
      return next.sort((a, b) => displayPrice(b) - displayPrice(a));
    case "createdAt:desc":
    default:
      return next.sort((a, b) =>
        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      );
  }
}

function FadeInSection({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ShopContent({
  initialProducts,
}: {
  initialProducts: ShopCatalogProduct[];
}) {
  const searchParams = useSearchParams();

  const [allProducts] = useState<ShopCatalogProduct[]>(() => initialProducts);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const categoryFromUrl = searchParams.get("category") ?? "all";

  const [filters, setFilters] = useState<Filters>({
    category: categoryFromUrl,
    priceRange: { min: "", max: "" },
    sortBy: "createdAt:desc",
    searchQuery: "",
    onSale: false,
    page: 1,
  });

  const [draftFilters, setDraftFilters] = useState<Omit<Filters, "page">>({
    category: categoryFromUrl,
    priceRange: { min: "", max: "" },
    sortBy: "createdAt:desc",
    searchQuery: "",
    onSale: false,
  });

  useEffect(() => {
    const categoryParam = searchParams.get("category") ?? "all";

    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      page: 1,
    }));

    setDraftFilters((prev) => ({
      ...prev,
      category: categoryParam,
    }));
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let list = allProducts;

    if (filters.category !== "all") {
      list = list.filter(
        (p) => String(p.categoryId ?? "") === String(filters.category),
      );
    }

    const q = filters.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (filters.onSale) {
      list = list.filter((p) => p.salePrice != null && p.salePrice < p.price);
    }

    const minP = filters.priceRange.min
      ? parseFloat(filters.priceRange.min)
      : null;
    const maxP = filters.priceRange.max
      ? parseFloat(filters.priceRange.max)
      : null;
    if (minP != null && !Number.isNaN(minP)) {
      list = list.filter((p) => p.price >= minP);
    }
    if (maxP != null && !Number.isNaN(maxP)) {
      list = list.filter((p) => p.price <= maxP);
    }

    return sortProducts(list, filters.sortBy);
  }, [
    allProducts,
    filters.category,
    filters.searchQuery,
    filters.onSale,
    filters.priceRange.min,
    filters.priceRange.max,
    filters.sortBy,
  ]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, filters.page), pageCount);

  const products = useMemo(
    () =>
      filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredProducts, safePage],
  );

  useEffect(() => {
    if (filters.page > pageCount) {
      setFilters((prev) => ({ ...prev, page: pageCount }));
    }
  }, [pageCount, filters.page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  const handleDraftChange = <K extends keyof typeof draftFilters>(
    key: K,
    value: (typeof draftFilters)[K],
  ) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...draftFilters,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-40 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <FadeInSection>
          <div className="text-center">
            <motion.div
              className="inline-flex items-center gap-2 mb-4"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-5 h-5 text-[#a156b4]" />
              <p className="text-[#a156b4]/70 tracking-[0.4em] uppercase text-sm font-light">
                Our Collection
              </p>
              <Sparkles className="w-5 h-5 text-[#a156b4]" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl text-[#a156b4] mb-6">
              Shop All Products
            </h1>

            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#E5C6ED] to-transparent mx-auto" />
          </div>
        </FadeInSection>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-[#E5C6ED] text-[#a156b4]"
            >
              <span className="flex items-center gap-2 font-medium">
                <Filter className="w-5 h-5" /> Filters
              </span>
              {showFilters ? (
                <X className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          <aside
            className={`lg:w-1/4 space-y-8 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white p-6 rounded-3xl border border-[#E5C6ED]/50 shadow-sm sticky top-24">
              <div className="mb-8">
                <h3 className="text-xl text-[#a156b4] mb-4">Search</h3>

                <div className="relative">
                  <input
                    type="text"
                    value={draftFilters.searchQuery}
                    onChange={(e) =>
                      handleDraftChange("searchQuery", e.target.value)
                    }
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E5C6ED]"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <button
                type="button"
                onClick={applyFilters}
                className="w-full py-3 bg-[#a156b4] text-white rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={String(product.id)}
                  href={`/product/${product.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E5C6ED]/50 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-[#a156b4]">
                        {product.name}
                      </h3>
                      {product.category ? (
                        <p className="text-sm text-gray-500 mb-2">
                          {product.category}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <span className="text-[#a156b4] font-semibold">
                          ${product.salePrice ?? product.price}
                        </span>
                        {product.salePrice != null &&
                          product.salePrice < product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.price}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500 py-16">
                No products match your filters.
              </p>
            )}

            {pageCount > 1 && (
              <div className="mt-10 flex justify-center items-center gap-4">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={safePage <= 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  className="p-2 rounded-full border border-[#E5C6ED] text-[#a156b4] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft />
                </button>

                <span className="text-sm text-gray-600">
                  Page {safePage} of {pageCount}
                </span>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={safePage >= pageCount}
                  onClick={() => handlePageChange(safePage + 1)}
                  className="p-2 rounded-full border border-[#E5C6ED] text-[#a156b4] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPageClient({
  initialProducts,
}: {
  initialProducts: ShopCatalogProduct[];
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] pt-40 pb-24 text-center text-[#a156b4]/80">
          Loading shop…
        </div>
      }
    >
      <ShopContent initialProducts={initialProducts} />
    </Suspense>
  );
}
