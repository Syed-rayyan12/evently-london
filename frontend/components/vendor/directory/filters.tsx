"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FiltersProps = {
  categories?: string[];
  selected?: string[];
  onChange?: (nextSelected: string[]) => void;
  priceMin?: number;
  priceMax?: number;
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  onPriceChange?: (range: { minPrice: number; maxPrice: number }) => void;
  visibleCount?: number;
};

export default function Filters({
  categories = [
    "Photography",
    "Venue",
    "Catering",
    "Makeup Artist",
    "Decor & Styling",
    "Entertainment",
    "Events",
    "DJ Infinity",
  ],
  selected = [],
  onChange,
  priceMin = 0,
  priceMax = 5000,
  selectedMaxPrice = priceMax,
  onPriceChange,
  visibleCount = 4,
}: FiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const safeMax = Math.max(priceMax, priceMin + 1);
  const currentMinPrice = priceMin;
  const currentMaxPrice = Math.min(Math.max(selectedMaxPrice, currentMinPrice), safeMax);

  const toggleCategory = (category: string) => {
    const next = selected.includes(category)
      ? selected.filter((item) => item !== category)
      : [...selected, category];

    onChange?.(next);
  };

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, visibleCount);

  return (
    <aside className="w-full rounded-[10px] rounded-tl-lg border border-brand-line bg-white sm:w-[220px] lg:w-[20%]">
        <div className="  bg-[#173d33] rounded-tl-lg rounded-tr-lg pt-1.5 pb-1.5 px-3">

      <h3 className=" font-pt-serif text-[22px] font-bold text-white">
        Categories
      </h3>
        </div>

      <ul className="space-y-3 p-3">
        {visibleCategories.map((category) => (
          <li key={category}>
            <label className="group flex cursor-pointer justify-between items-center gap-3">
              <span className="font-inter text-sm text-[#323130] transition-colors  ">
                {category}
              </span>
              <input
                type="checkbox"
                checked={selected.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4  text-[#003224] border-2 border-[#173d33] rounded-xl accent-[#003224] focus:ring-[#003224]"
              />
            </label>
          </li>
        ))}
      </ul>

      {categories.length > visibleCount && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="group mb-4 ml-3 mt-1 flex items-center gap-1 font-inter text-sm font-medium text-[#D79D42]"
        >
          <span className="text-hover-underline">
            {expanded ? "Show Less" : "Read More"}
          </span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
      <div className="border-t border-brand-line p-3">
        <h3 className="font-pt-serif text-[20px] font-bold text-[#173d33]">
          Price Range
        </h3>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2 font-inter text-xs font-semibold text-[#323130]">
            <span>Min &pound;{currentMinPrice.toLocaleString()}</span>
            <span>Max &pound;{safeMax.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={priceMin}
            max={safeMax}
            value={currentMaxPrice}
            onChange={(event) =>
              onPriceChange?.({
                minPrice: currentMinPrice,
                maxPrice: Number(event.target.value)
              })
            }
            className="w-full accent-[#173d33]"
            aria-label="Maximum price"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 font-inter text-xs font-semibold text-[#323130]">
          <span>Showing from &pound;{currentMinPrice.toLocaleString()}</span>
          <span>Up to &pound;{currentMaxPrice.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}
