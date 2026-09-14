"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Trash2 } from "lucide-react";
import VendorCard from "@/components/vendor/directory/vendor-card";
import {
  listSavedVendors,
  removeVendorFromShortlist,
  type SavedVendor,
} from "@/lib/customer";
import { getCustomerProfileSession } from "@/lib/customer-session";

export default function SavedVendorsPage() {
  const [savedVendors, setSavedVendors] = useState<SavedVendor[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Please login as a customer to view saved vendors.");
      });
      return;
    }

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        return listSavedVendors(session);
      })
      .then((result) => {
        setSavedVendors(result.savedVendors);
        setStatus("success");
        setMessage("");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load saved vendors.");
      });
  }, []);

  const filteredVendors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return savedVendors;
    }

    return savedVendors.filter((vendor) =>
      [vendor.name, vendor.category, vendor.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query, savedVendors]);

  const removeSavedVendor = async (vendorId: string) => {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Please login as a customer to update saved vendors.");
      return;
    }

    try {
      await removeVendorFromShortlist(vendorId, session);
      setSavedVendors((currentVendors) =>
        currentVendors.filter((vendor) => vendor.id !== vendorId)
      );
      setMessage("Vendor removed from saved vendors.");
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to remove saved vendor.");
    }
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
          <Link
            href="/vendor"
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[#003224] px-5 font-inter text-sm font-semibold text-white"
          >
            Browse Vendors
          </Link>
        </div>
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
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

        {message ? (
          <p
            className={`mb-4 rounded-[10px] px-4 py-3 font-inter text-sm font-semibold ${
              status === "error"
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}

        {status === "loading" ? (
          <p className="py-12 text-center font-inter text-sm font-semibold text-[#68746e]">
            Loading saved vendors...
          </p>
        ) : filteredVendors.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVendors.map((vendor) => (
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
        ) : (
          <div className="rounded-[12px] border border-dashed border-brand-line px-5 py-12 text-center">
            <h4 className="font-pt-serif text-[26px] font-normal text-[#003224]">
              No saved vendors yet
            </h4>
            <p className="mx-auto mt-2 max-w-md font-inter text-sm leading-6 text-[#68746e]">
              Browse the vendor directory and open a vendor profile to save it with the heart button.
            </p>
            <Link
              href="/vendor"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[#003224] px-5 font-inter text-sm font-semibold text-white"
            >
              Browse Vendors
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

