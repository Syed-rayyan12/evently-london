import VendorCard from "./vendor-card";
import type { Vendor } from "./vendor-card";

type VendorGridProps = {
  vendors?: Vendor[];
  onViewProfile?: (vendor: Vendor) => void;
  isLoading?: boolean;
};

export default function VendorGrid({
  vendors = [],
  onViewProfile,
  isLoading = false,
}: VendorGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <VendorCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <p className="font-pt-serif text-lg text-[#003224]">
          No vendors match your filters.
        </p>
        <p className="mt-1 font-inter text-sm text-gray-500">
          Try clearing a filter or searching a different location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
}

function VendorCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-[10px] border border-brand-line bg-white shadow-sm">
      <div className="h-40 w-full bg-neutral-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-neutral-200" />
        <div className="h-4 w-1/2 rounded bg-neutral-200" />
        <div className="h-4 w-2/3 rounded bg-neutral-200" />
        <div className="flex justify-between gap-4">
          <div className="h-4 w-20 rounded bg-neutral-200" />
          <div className="h-4 w-24 rounded bg-neutral-200" />
        </div>
        <div className="h-10 w-full rounded-lg bg-neutral-200" />
      </div>
    </div>
  );
}
