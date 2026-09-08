"use client";

import { FormEvent, useState } from "react";
import { MapPin, Search } from "lucide-react";

export type VendorSearchValues = {
  query: string;
  location: string;
};

type SearchBarProps = {
  onSearch?: (values: VendorSearchValues) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.({ query, location });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-stretch gap-3 rounded-[10px] border border-brand-line bg-white p-3 shadow-sm sm:flex-row"
    >
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-brand-line px-3 py-2">
        <Search size={18} className="shrink-0 text-[#003224]" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search service or vendor name..."
          className="w-full bg-transparent font-inter text-sm text-[#003224] outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-brand-line px-3 py-2 sm:w-56">
        <MapPin size={18} className="shrink-0 text-[#003224]" />
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location, UK"
          className="w-full bg-transparent font-inter text-sm text-[#003224] outline-none placeholder:text-gray-400"
        />
      </div>

      <button
        type="submit"
        className="btn-slide group whitespace-nowrap rounded-lg bg-[#003224] px-6 py-3 font-inter text-sm font-medium text-white"
      >
        <span className="btn-slide-overlay btn-slide-overlay-gold" />
        <span className="btn-slide-label">Search Vendors</span>
      </button>
    </form>
  );
}
