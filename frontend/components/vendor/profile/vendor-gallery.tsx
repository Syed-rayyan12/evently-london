import Image from "next/image";
import type { VendorPortfolioImage } from "@/data/vendor-data";

type VendorGalleryProps = {
  images: VendorPortfolioImage[];
  onSelect?: (index: number) => void;
  limit?: number;
  variant?: "compact" | "full";
};

export default function VendorGallery({
  images,
  limit,
  onSelect,
  variant = "compact",
}: VendorGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  const visibleImages = limit ? images.slice(0, limit) : images;
  const isFull = variant === "full";

  return (
    <div
      className={
        isFull
          ? "flex snap-x gap-5 overflow-x-auto pb-4"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {visibleImages.map((image, index) => (
        <button
          key={`${image.src}-${image.alt}`}
          type="button"
          onClick={() => onSelect?.(index)}
          className={`relative overflow-hidden rounded-[14px] border border-brand-line ${
            isFull
              ? "h-[320px] w-[82vw] flex-none snap-start sm:w-[430px] lg:w-[470px]"
              : "aspect-[16/10] min-h-[170px]"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized={image.src.startsWith("data:")}
            sizes={
              isFull
                ? "(min-width: 1280px) 28vw, (min-width: 640px) 44vw, 90vw"
                : "(min-width: 1024px) 17vw, (min-width: 640px) 44vw, 90vw"
            }
            className="object-cover transition duration-500 hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}
