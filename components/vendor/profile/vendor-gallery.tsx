import Image from "next/image";
import type { VendorPortfolioImage } from "@/data/vendor-data";

type VendorGalleryProps = {
  images: VendorPortfolioImage[];
  onSelect?: (index: number) => void;
};

export default function VendorGallery({ images, onSelect }: VendorGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {images.slice(0, 6).map((image, index) => (
        <button
          key={`${image.src}-${image.alt}`}
          type="button"
          onClick={() => onSelect?.(index)}
          className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-brand-line"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 14vw, (min-width: 640px) 28vw, 45vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}
