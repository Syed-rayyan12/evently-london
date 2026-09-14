import type { ReactNode } from "react";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { VendorProfile } from "@/data/vendor-data";
import type { PublicVendor } from "@/lib/public-vendors";

export type Vendor = VendorProfile | PublicVendor;

type VendorCardProps = {
  vendor: Vendor;
  onViewProfile?: (vendor: Vendor) => void;
  action?: ReactNode;
};

export default function VendorCard({
  vendor,
  onViewProfile,
  action,
}: VendorCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[10px] border border-brand-line bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-40 w-full">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          sizes="(min-width: 1024px) 26vw, (min-width: 640px) 42vw, 90vw"
          className="object-cover"
          unoptimized={vendor.image.startsWith("data:")}
        />
       
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-inter text-[12px] font-medium text-[#01241D]">
          {vendor.category}
        </p>
        <h4 className="font-pt-serif text-[18px] font-normal text-black">
          {vendor.name}
        </h4>


        <div className="flex items-center gap-1 text-gray-500">
          <MapPin size={14} />
          <span className="font-inter text-[14px]">{vendor.location}</span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-[#D79D42] text-[#D79D42]" />
            <span className="font-inter text-sm font-semibold text-[#003224]">
              {vendor.rating}
            </span>
            <span className="font-inter text-sm text-gray-400">
              ({vendor.reviewCount})
            </span>
          </div>
          <span className="font-inter text-sm font-medium text-black/60">
            From &pound;{vendor.priceFrom}
          </span>
        </div>

        <div className={`mt-3 grid grid-cols-1 gap-2 ${action ? "sm:grid-cols-2" : ""}`}>
          {onViewProfile ? (
            <button
              type="button"
              onClick={() => onViewProfile(vendor)}
              className="btn-slide group min-h-10 w-full rounded-lg bg-[#003224] px-3 font-inter text-sm font-medium text-white"
            >
              <span className="btn-slide-overlay btn-slide-overlay-gold" />
              <span className="btn-slide-label">View Profile</span>
            </button>
          ) : (
            <Link
              href={`/vendor/${vendor.slug}`}
              className="btn-slide group min-h-10 w-full rounded-lg bg-[#003224] px-3 font-inter text-sm font-medium text-white"
            >
              <span className="btn-slide-overlay btn-slide-overlay-gold" />
              <span className="btn-slide-label">View Profile</span>
            </Link>
          )}
          {action}
        </div>
      </div>
    </div>
  );
}
