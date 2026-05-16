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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ShopCategoryTile } from "@/lib/categories-data";
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

function resolvedShopCategory(
  raw: string | null,
  list: ShopCategoryTile[],
): string {
  if (raw == null || raw === "") return "all";
  return list.some((c) => String(c.id) === String(raw)) ? raw : "all";
}

function sortProducts(
  list: ShopCatalogProduct[],
  sortBy: string,
): ShopCatalogProduct[] {
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
  categories,
}: {
  initialProducts: ShopCatalogProduct[];
  categories: ShopCategoryTile[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [allProducts] = useState<ShopCatalogProduct[]>(() => initialProducts);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [filters, setFilters] = useState<Filters>({
    category: resolvedShopCategory(searchParams.get("category"), categories),
    priceRange: { min: "", max: "" },
    sortBy: "createdAt:desc",
    searchQuery: "",
    onSale: false,
    page: 1,
  });

  useEffect(() => {
    const categoryParam = resolvedShopCategory(
      searchParams.get("category"),
      categories,
    );

    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      page: 1,
    }));
  }, [searchParams, categories]);

  const categoryOptions = useMemo(
    () =>
      [...categories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    [categories],
  );

  const updateCategoryQuery = (value: string) => {
    const category =
      value === "all" ? "all" : resolvedShopCategory(value, categories);

    setFilters((prev) => ({
      ...prev,
      category,
      page: 1,
    }));

    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

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
      list = list.filter((p) => p.hasPriceAfterSale === true);
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-20 pb-12">
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
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        searchQuery: e.target.value,
                        page: 1,
                      }))
                    }
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E5C6ED]"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl text-[#a156b4] mb-4">Category</h3>
                <select
                  value={filters.category}
                  onChange={(e) => updateCategoryQuery(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#E5C6ED] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a156b4]/30"
                >
                  <option value="all">All categories</option>
                  {categoryOptions.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <h3 className="text-xl text-[#a156b4] mb-4">Sort by</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full py-2 px-3 rounded-lg border border-[#E5C6ED] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a156b4]/30"
                >
                  <option value="createdAt:desc">Newest first</option>
                  <option value="price:asc">Price: low to high</option>
                  <option value="price:desc">Price: high to low</option>
                </select>
              </div>

              <div className="mb-8">
                <h3 className="text-xl text-[#a156b4] mb-4">Offers</h3>
                <button
                  type="button"
                  role="switch"
                  aria-checked={filters.onSale}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      onSale: !prev.onSale,
                      page: 1,
                    }))
                  }
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors ${
                    filters.onSale
                      ? "border-[#a156b4] bg-[#a156b4]/10 text-[#a156b4]"
                      : "border-[#E5C6ED] bg-white text-gray-700 hover:border-[#E5C6ED]"
                  }`}
                >
                  <span className="text-sm font-medium text-left">
                    On sale only
                  </span>
                  <span
                    className={`shrink-0 h-6 w-11 rounded-full relative transition-colors ${
                      filters.onSale ? "bg-[#a156b4]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        filters.onSale ? "translate-x-5" : ""
                      }`}
                    />
                  </span>
                </button>
              </div>
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
  categories,
}: {
  initialProducts: ShopCatalogProduct[];
  categories: ShopCategoryTile[];
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] pt-20 pb-24 text-center text-[#a156b4]/80">
          Loading shop…
        </div>
      }
    >
      <ShopContent initialProducts={initialProducts} categories={categories} />
    </Suspense>
  );
}
