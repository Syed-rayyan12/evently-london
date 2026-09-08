import Image from "next/image";
import { BadgeCheck, Heart, MapPin, Share2, Star } from "lucide-react";
import type { VendorProfile } from "@/data/vendor-data";
import VendorGallery from "./vendor-gallery";

type VendorHeaderProps = {
  vendor: VendorProfile;
  onRequestQuote?: () => void;
  onSaveVendor?: () => void;
  onShare?: () => void;
};

export default function VendorHeader({
  vendor,
  onRequestQuote,
  onSaveVendor,
  onShare,
}: VendorHeaderProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-[10px] border border-brand-line bg-white">
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <div className="relative min-h-[280px] overflow-hidden rounded-[8px] lg:min-h-[360px] lg:w-[46%]">
          <Image
            src={vendor.image}
            alt={vendor.name}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          {vendor.verified && (
            <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#173d33] px-4 py-2 font-inter text-[14px] text-white">
              <BadgeCheck size={17} />
              Verified
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center py-2">
          <p className="font-inter text-[15px] text-[#D79D42]">
            {vendor.category}
          </p>
          <h1 className="mt-2 font-pt-serif text-[38px] font-normal leading-tight text-black sm:text-[48px]">
            {vendor.name}
          </h1>
          <p className="mt-3 max-w-3xl font-inter text-[17px] leading-7 text-muted">
            {vendor.tagline}
          </p>
          <p className="mt-4 max-w-3xl font-inter text-[15px] leading-7 text-muted">
            {vendor.about}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 font-inter text-[14px] text-muted">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              {vendor.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={16} className="fill-[#D79D42] text-[#D79D42]" />
              {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSaveVendor}
              className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-brand-line text-ink transition-colors hover:border-[#003224] hover:bg-[#003224] hover:text-white"
              aria-label="Save vendor"
            >
              <Heart size={18} />
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-brand-line text-ink transition-colors hover:border-[#003224] hover:bg-[#003224] hover:text-white"
              aria-label="Share vendor"
            >
              <Share2 size={18} />
            </button>
            <button
              type="button"
              onClick={onRequestQuote}
              className="btn-slide group rounded-[8px] bg-gold px-7 py-3 font-inter text-[15px] font-medium text-white"
            >
              <span className="btn-slide-overlay btn-slide-overlay-green" />
              <span className="btn-slide-label">Request Quote</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-line p-4 lg:p-6">
        <VendorGallery images={vendor.portfolio} />
      </div>
    </section>
  );
}
