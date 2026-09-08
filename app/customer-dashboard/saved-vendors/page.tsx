"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Trash2 } from "lucide-react";
import VendorCard from "@/components/vendor/directory/vendor-card";
import { vendors } from "@/data/vendor-data";

const initialSavedVendors = vendors.slice(0, 6);

export default function SavedVendorsPage() {
  const [savedVendors, setSavedVendors] = useState(initialSavedVendors);

  const removeSavedVendor = (vendorId: number) => {
    setSavedVendors((currentVendors) =>
      currentVendors.filter((vendor) => vendor.id !== vendorId),
    );
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
              Saved Vendors
            </h2>
            <p className="mt-2 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Review the vendors you saved while planning your events and open
              their profiles when you are ready to compare details.
            </p>
          </div>
        
        </div>
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search saved vendors"
              className="w-full bg-transparent font-inter text-sm text-[#16231f] outline-none placeholder:text-[#68746e]"
            />
          </label>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            Filter
          </button>
        </div>
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
            Saved Vendor Cards
          </h3>
          <p className="font-inter text-[14px] font-medium text-[#68746e]">
            {savedVendors.length} saved
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {savedVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              action={
                <button
                  type="button"
                  onClick={() => removeSavedVendor(vendor.id)}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-[#b42318] bg-transparent px-3 font-inter text-[14px] font-semibold text-[#b42318] transition-colors hover:bg-[#b42318] hover:text-white"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Remove
                </button>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

