"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FiltersProps = {
  categories?: string[];
  selected?: string[];
  onChange?: (nextSelected: string[]) => void;
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
  visibleCount = 4,
}: FiltersProps) {
  const [expanded, setExpanded] = useState(false);

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
    </aside>
  );
}
