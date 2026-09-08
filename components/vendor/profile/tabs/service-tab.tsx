import type { VendorService } from "@/data/vendor-data";
import ServiceGridVendor from "../service-grid-vendor";

type ServicesTabProps = {
  services: VendorService[];
  onRequestQuote?: (service: VendorService) => void;
};

export default function ServicesTab({
  services,
  onRequestQuote,
}: ServicesTabProps) {
  return (
    <div className="p-6">
      
      <ServiceGridVendor services={services} onRequestQuote={onRequestQuote} />
    </div>
  );
}
