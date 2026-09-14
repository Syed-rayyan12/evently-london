import type { VendorPortfolioImage } from "@/data/vendor-data";
import VendorGallery from "../vendor-gallery";

type PortfolioTabProps = {
  images: VendorPortfolioImage[];
};

export default function PortfolioTab({ images }: PortfolioTabProps) {
  return (
    <div className="p-6">
      <VendorGallery images={images} variant="full" />
    </div>
  );
}
