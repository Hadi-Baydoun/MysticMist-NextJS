"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconDroplet,
  IconFlask2,
  IconGift,
  IconLayoutGrid,
  IconRefresh,
  IconSearch,
  IconSparkles,
  IconTag,
  IconWind,
} from "@tabler/icons-react";

import type { ShopCategoryFilterIconHint } from "@/lib/categories-data";

const ICON_BY_HINT: Record<
  ShopCategoryFilterIconHint,
  typeof IconLayoutGrid
> = {
  grid: IconLayoutGrid,
  wind: IconWind,
  droplet: IconDroplet,
  flask: IconFlask2,
  gift: IconGift,
};

export type ShopFilterCategoryRow = {
  id: string;
  label: string;
  count: number;
  iconHint: ShopCategoryFilterIconHint;
};

type SortOption = {
  value: string;
  label: string;
  Icon: typeof IconSparkles;
};

const SORT_OPTIONS: SortOption[] = [
  {
    value: "createdAt:desc",
    label: "Newest first",
    Icon: IconSparkles,
  },
  { value: "price:asc", label: "Price: low to high", Icon: IconArrowUp },
  { value: "price:desc", label: "Price: high to low", Icon: IconArrowDown },
];

const SIDEBAR_ACCENT = "#c87aaa";

type OpenMenu = null | "category" | "sort";

type LuxuryShopFilterSidebarProps = {
  categoryRows: ShopFilterCategoryRow[];
  categoryId: string;
  onCategoryChange: (id: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSale: boolean;
  onSaleToggle: () => void;
  onClearAll: () => void;
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8f5f8a]/90 mb-3">
      {children}
    </h3>
  );
}

export function LuxuryShopFilterSidebar({
  categoryRows,
  categoryId,
  onCategoryChange,
  sortBy,
  onSortByChange,
  searchQuery,
  onSearchChange,
  onSale,
  onSaleToggle,
  onClearAll,
}: LuxuryShopFilterSidebarProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const categoryRootRef = useRef<HTMLDivElement>(null);
  const sortRootRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => setOpenMenu(null);

  useEffect(() => {
    if (!openMenu) return;

    function onPointerDown(ev: PointerEvent) {
      const target = ev.target as Node | null;
      if (!target) return;

      const inCategory = categoryRootRef.current?.contains(target);
      const inSort = sortRootRef.current?.contains(target);
      if (inCategory || inSort) return;
      closeMenus();
    }

    function onDocKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") closeMenus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onDocKey);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onDocKey);
    };
  }, [openMenu]);

  const currentCategoryMeta =
    categoryRows.find((row) => row.id === categoryId) ?? categoryRows[0];
  const CurrentCatIcon =
    currentCategoryMeta != null
      ? ICON_BY_HINT[currentCategoryMeta.iconHint]
      : IconLayoutGrid;

  const currentSortMeta =
    SORT_OPTIONS.find((opt) => opt.value === sortBy) ?? SORT_OPTIONS[0];
  const CurrentSortIcon = currentSortMeta.Icon;

  function toggle(menu: Exclude<OpenMenu, null>) {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }

  return (
    <div className="rounded-[26px] border border-[color-mix(in_srgb,theme(colors.gray.950)_6%,transparent)] bg-gradient-to-br from-[#fffdfc] via-white to-[#fdf7fb] p-7 shadow-[0_28px_60px_-40px_rgb(169_66_154_/_42%)]">
      <div className="mb-8">
        <SectionLabel>Search</SectionLabel>
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <IconSearch
            className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#bbb1c9]"
            stroke={1.5}
          />
          <input
            type="search"
            value={searchQuery}
            autoComplete="off"
            placeholder="Search products..."
            className="w-full rounded-full border border-[color-mix(in_srgb,theme(colors.fuchsia.950)_7%,transparent)] bg-white/95 py-3 pl-[2.68rem] pr-4 text-sm text-[#3d2f3f] outline-none placeholder:text-neutral-400/90 transition-colors focus-visible:border-[#c87aaa] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,#c87aaa_32%,transparent)]"
            style={{ caretColor: SIDEBAR_ACCENT }}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={closeMenus}
          />
        </label>
      </div>

      <div className="mb-8">
        <SectionLabel>Category</SectionLabel>

        <div className="relative" ref={categoryRootRef}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openMenu === "category"}
            aria-label="Choose category filter"
            onClick={() => toggle("category")}
            className={`flex w-full items-center gap-3 border px-5 py-2.5 transition-[colors,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,#c87aaa_36%,transparent)] ${
              openMenu === "category"
                ? "rounded-t-[999px] rounded-b-none border-b-transparent border-[color-mix(in_srgb,theme(colors.fuchsia.950)_9%,transparent)] bg-white z-10 shadow-inner"
                : "rounded-full border-[color-mix(in_srgb,theme(colors.fuchsia.950)_8%,transparent)] bg-white hover:border-[color-mix(in_srgb,#c87aaa_25%,transparent)]"
            }`}
          >
            {currentCategoryMeta != null ? (
              <>
                <CurrentCatIcon
                  stroke={1.35}
                  className="size-[18px] shrink-0 text-[#a56b94]"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 text-left text-[15px] font-medium tracking-tight text-[#574055]">
                  {currentCategoryMeta.label}
                </span>
              </>
            ) : (
              <span className="min-w-0 flex-1 text-left text-[15px] font-medium tracking-tight text-[#574055]">
                Categories unavailable
              </span>
            )}
            <IconChevronDown
              stroke={1.8}
              className={`mr-1 size-[18px] shrink-0 text-[#98708e] transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                openMenu === "category" ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </button>

          {openMenu === "category" ? (
            <div
              role="listbox"
              aria-label="Categories"
              className="absolute left-0 right-0 top-[calc(100%-1px)] z-20 overflow-hidden rounded-b-[20px] border border-t-0 border-[color-mix(in_srgb,theme(colors.fuchsia.950)_9%,transparent)] bg-white shadow-[0_24px_48px_-32px_rgb(169_66_154_/_40%)]"
            >
              {categoryRows.map((row) => {
                const Icon = ICON_BY_HINT[row.iconHint];
                const selected = row.id === categoryId;

                return (
                  <button
                    key={row.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onCategoryChange(row.id);
                      setOpenMenu(null);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "bg-[color-mix(in_srgb,#c87aaa_09%,white)] text-[#4b3145]"
                        : "text-[#4b3145] hover:bg-[#fdf9fc]"
                    }`}
                  >
                    <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <span
                        aria-hidden
                        className={`h-2.5 w-2.5 rounded-full transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                          selected
                            ? "scale-100 bg-[#c87aaa] shadow-[0_0_0_3px_rgb(255_255_255_/_90%)]"
                            : "scale-[0.6] bg-white ring-2 ring-[#dfc9d6]"
                        }`}
                      />
                    </span>
                    <Icon
                      stroke={1.35}
                      className="size-[18px] shrink-0 text-[#986d8f]"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 font-medium">
                      {row.label}
                    </span>
                    <span className="shrink-0 rounded-full bg-[#faeef5] px-2 py-0.5 text-[11px] font-semibold tabular-nums tracking-tight text-[#8f5f86] ring-1 ring-[color-mix(in_srgb,#c87aaa_22%,transparent)]">
                      {row.count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mb-8">
        <SectionLabel>Sort by</SectionLabel>

        <div className="relative" ref={sortRootRef}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openMenu === "sort"}
            aria-label="Choose sort option"
            onClick={() => toggle("sort")}
            className={`flex w-full items-center gap-3 border px-5 py-2.5 transition-[colors] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,#c87aaa_36%,transparent)] ${
              openMenu === "sort"
                ? "rounded-t-[999px] rounded-b-none border-b-transparent border-[color-mix(in_srgb,theme(colors.fuchsia.950)_9%,transparent)] bg-white z-10 shadow-inner"
                : "rounded-full border-[color-mix(in_srgb,theme(colors.fuchsia.950)_8%,transparent)] bg-white hover:border-[color-mix(in_srgb,#c87aaa_25%,transparent)]"
            }`}
          >
            <CurrentSortIcon
              stroke={1.35}
              className="size-[18px] shrink-0 text-[#a56b94]"
              aria-hidden
            />
            <span className="min-w-0 flex-1 text-left text-[15px] font-medium tracking-tight text-[#574055]">
              {currentSortMeta.label}
            </span>
            <IconChevronDown
              stroke={1.8}
              className={`mr-1 size-[18px] shrink-0 text-[#98708e] transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                openMenu === "sort" ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </button>

          {openMenu === "sort" ? (
            <div
              role="listbox"
              aria-label="Sort products"
              className="absolute left-0 right-0 top-[calc(100%-1px)] z-20 overflow-hidden rounded-b-[20px] border border-t-0 border-[color-mix(in_srgb,theme(colors.fuchsia.950)_9%,transparent)] bg-white shadow-[0_24px_48px_-32px_rgb(169_66_154_/_40%)]"
            >
              {SORT_OPTIONS.map((opt) => {
                const Icon = opt.Icon;
                const selected = opt.value === sortBy;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onSortByChange(opt.value);
                      setOpenMenu(null);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "bg-[color-mix(in_srgb,#c87aaa_09%,white)] text-[#4b3145]"
                        : "text-[#4b3145] hover:bg-[#fdf9fc]"
                    }`}
                  >
                    <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <span
                        aria-hidden
                        className={`h-2.5 w-2.5 rounded-full transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                          selected
                            ? "scale-100 bg-[#c87aaa] shadow-[0_0_0_3px_rgb(255_255_255_/_90%)]"
                            : "scale-[0.6] bg-white ring-2 ring-[#dfc9d6]"
                        }`}
                      />
                    </span>
                    <Icon
                      stroke={1.35}
                      className="size-[18px] shrink-0 text-[#986d8f]"
                      aria-hidden
                    />
                    <span className="flex-1 font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mb-8">
        <SectionLabel>Offers</SectionLabel>
        <button
          type="button"
          role="switch"
          aria-checked={onSale}
          aria-label={
            onSale ? "Disable sale filter" : "Show on sale items only"
          }
          onClick={() => {
            closeMenus();
            onSaleToggle();
          }}
          className="flex w-full items-center justify-between gap-4 rounded-full border border-[color-mix(in_srgb,theme(colors.fuchsia.950)_8%,transparent)] bg-white px-5 py-2.5 text-left shadow-sm transition-colors hover:border-[color-mix(in_srgb,#c87aaa_25%,transparent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,#c87aaa_34%,transparent)]"
        >
          <span className="flex items-center gap-3 text-[14px] font-medium text-[#4b3145]">
            <IconTag
              stroke={1.35}
              className="size-[18px] shrink-0 text-[#a56b94]"
              aria-hidden
            />
            On sale only
          </span>
          <span
            className={`relative isolate h-[30px] w-[52px] shrink-0 rounded-full transition-colors duration-300 ease-out ${
              onSale ? "bg-[#c87aaa]" : "bg-[#e8d0e0]"
            }`}
          >
            <span
              className={`pointer-events-none absolute left-1 top-1 inline-block size-[22px] rounded-full bg-white shadow-[0_10px_20px_-10px_rgb(169_66_154_/_35%)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                onSale ? "translate-x-[22px]" : "translate-x-0"
              }`}
              aria-hidden
            />
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          closeMenus();
          onClearAll();
        }}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent py-3 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#8c5f86] transition-colors hover:bg-[#fdf0f6] hover:text-[#6d4566] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,#c87aaa_28%,transparent)]"
      >
        <IconRefresh
          stroke={1.65}
          className="size-[18px] text-[#a56b94]"
          aria-hidden
        />
        Clear all filters
      </button>
    </div>
  );
}
