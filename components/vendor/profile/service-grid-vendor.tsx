import type { VendorService } from "@/data/vendor-data";

type ServiceGridVendorProps = {
  services: VendorService[];
  onRequestQuote?: (service: VendorService) => void;
};

export default function ServiceGridVendor({
  services,
  onRequestQuote,
}: ServiceGridVendorProps) {
  return (
    <div className="flex flex-col gap-4 ">
      {services.map((service) => (
        <article
          key={service.title}
          className="flex flex-col gap-5   bg-white  sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-pt-serif text-[18px] font-normal text-ink">
              {service.title}
            </h3>
            <p className="mt-3 font-inter text-[14px] leading-6 text-muted">
              {service.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={() => onRequestQuote?.(service)}
              className="rounded-[8px] border border-[#003224] px-5 py-2.5 font-inter text-[14px] font-medium bg-[#003224] text-white transition-colors hover:bg-[#003224] hover:text-white"
            >
              Request a Quote
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
