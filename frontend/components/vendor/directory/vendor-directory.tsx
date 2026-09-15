"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/shared/pagination";
import { listPublicVendors, type PublicVendor } from "@/lib/public-vendors";
import Filters from "./filters";
import SearchBar from "./search-bar";
import type { VendorSearchValues } from "./search-bar";
import VendorGrid from "./vendor-grid";

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

const PAGE_SIZE = 20;
const DEFAULT_PRICE_MAX = 5000;

export default function VendorDirectory() {
  const [vendors, setVendors] = useState<PublicVendor[]>([]);
  const [availableCategories, setAvailableCategories] = useState(FILTER_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState<VendorSearchValues>({
    query: "",
    location: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: DEFAULT_PRICE_MAX });
  const [availablePriceRange, setAvailablePriceRange] = useState({
    minPrice: 0,
    maxPrice: DEFAULT_PRICE_MAX
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridLoading, setIsGridLoading] = useState(false);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    let active = true;

    setIsGridLoading(true);
    listPublicVendors({
      page: currentPage,
      limit: PAGE_SIZE,
      query: searchTerm.query,
      location: searchTerm.location,
      category: selectedCategories,
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
    })
      .then((result) => {
        if (!active) {
          return;
        }

        setVendors(result.vendors);
        setTotalPages(result.pagination.totalPages);
        setTotalVendors(result.pagination.total);
        setAvailableCategories(result.filters.categories.length ? result.filters.categories : FILTER_CATEGORIES);
        setAvailablePriceRange({
          minPrice: result.filters.priceMin,
          maxPrice: Math.max(result.filters.priceMax, priceRange.maxPrice),
        });
        setMessage("");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setVendors([]);
        setTotalPages(1);
        setTotalVendors(0);
        setMessage(error instanceof Error ? error.message : "Unable to load vendors.");
      })
      .finally(() => {
        if (active) {
          setIsGridLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [currentPage, priceRange, searchTerm, selectedCategories]);

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

  const handlePriceChange = (range: { minPrice: number; maxPrice: number }) => {
    showGridLoader();
    setPriceRange({
      minPrice: Math.min(range.minPrice, range.maxPrice),
      maxPrice: Math.max(range.minPrice, range.maxPrice),
    });
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
          Find Your Perfect Vendor
        </h2>
        <p className="mb-6 text-[26px] max-w-xl font-inter font-normal text-gray-500 capitalize">
          Discover trusted professionals who bring your celebration to life with care and style.
        </p>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row items-start">
          <Filters
            categories={availableCategories}
            selected={selectedCategories}
            onChange={handleFilterChange}
            priceMin={availablePriceRange.minPrice}
            priceMax={availablePriceRange.maxPrice}
            selectedMinPrice={priceRange.minPrice}
            selectedMaxPrice={priceRange.maxPrice}
            onPriceChange={handlePriceChange}
            />

          
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between gap-3 font-inter text-sm text-gray-500">
              <p>{isGridLoading ? "Loading vendors..." : `${totalVendors} vendors found`}</p>
              {message ? <p className="text-red-600">{message}</p> : null}
            </div>
            <VendorGrid vendors={vendors} isLoading={isGridLoading} />

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
