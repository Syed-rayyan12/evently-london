"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "@/components/shared/pagination";
import Filters from "./filters";
import SearchBar from "./search-bar";
import type { VendorSearchValues } from "./search-bar";
import VendorGrid from "./vendor-grid";
import { vendors } from "@/data/vendor-data";

const ALL_VENDORS = vendors;
const FILTER_CATEGORIES = [
  "Photography",
  "Venue",
  "Catering",
  "Makeup Artist",
  "Decor & Styling",
  "Entertainment",
  "Event Planner",
  "Henna Artist",
];

const PAGE_SIZE = 6;

export default function VendorDirectory() {
  const [searchTerm, setSearchTerm] = useState<VendorSearchValues>({
    query: "",
    location: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridLoading, setIsGridLoading] = useState(false);
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimer.current) {
        clearTimeout(loadingTimer.current);
      }
    };
  }, []);

  const showGridLoader = () => {
    setIsGridLoading(true);

    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
    }

    loadingTimer.current = setTimeout(() => {
      setIsGridLoading(false);
      loadingTimer.current = null;
    }, 450);
  };

  const filteredVendors = useMemo(() => {
    return ALL_VENDORS.filter((vendor) => {
      const matchesQuery =
        !searchTerm.query ||
        vendor.name.toLowerCase().includes(searchTerm.query.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.query.toLowerCase());
      const matchesLocation =
        !searchTerm.location ||
        vendor.location
          .toLowerCase()
          .includes(searchTerm.location.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(vendor.category);

      return matchesQuery && matchesLocation && matchesCategory;
    });
  }, [searchTerm, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / PAGE_SIZE));
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (values: VendorSearchValues) => {
    showGridLoader();
    setSearchTerm(values);
    setCurrentPage(1);
  };

  const handleFilterChange = (nextSelected: string[]) => {
    showGridLoader();
    setSelectedCategories(nextSelected);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    showGridLoader();
    setCurrentPage(page);
  };

  return (
    <section className="bg-[#F9F8F4] px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-[90%]">
        <p className="mb-2 font-inter text-[17px] text-gray-700">
          Home &gt; Vendors
        </p>

        <h2 className="mb-2 font-pt-serif text-[64px] font-normal text-black">
          Find The Perfect Vendor
        </h2>
        <p className="mb-6 text-[26px] max-w-xl font-inter font-normal text-gray-500 capitalize">
          Browse our handpicked and verified vendors who all nale ya cirbraten exceptional
        </p>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row items-start">
          <Filters
            categories={FILTER_CATEGORIES}
            selected={selectedCategories}
            onChange={handleFilterChange}
            />

          
          <div className="flex-1">
            <VendorGrid vendors={paginatedVendors} isLoading={isGridLoading} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
