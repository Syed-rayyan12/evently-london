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
          className="border-b border-brand-line bg-white pb-5 last:border-b-0 last:pb-0"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-pt-serif text-[18px] font-normal text-ink">
                {service.title}
              </h3>
              {service.startingPrice ? (
                <p className="mt-1 font-inter text-sm font-semibold text-[#003224]">
                  Starting from {service.startingPrice}
                </p>
              ) : null}
              <p className="mt-3 font-inter text-[14px] leading-6 text-muted">
                {service.description || "Service details will be shared by the vendor."}
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-end">
              <button
                type="button"
                onClick={() => onRequestQuote?.(service)}
                className="rounded-[8px] border border-[#003224] bg-[#003224] px-5 py-2.5 font-inter text-[14px] font-medium text-white transition-colors hover:bg-[#003224] hover:text-white"
              >
                Request a Quote
              </button>
            </div>
          </div>

          {service.packages?.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {service.packages.map((packageItem) => (
                <div
                  key={packageItem.id ?? packageItem.name}
                  className="rounded-[8px] border border-brand-line bg-[#F9F8F4] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-inter text-sm font-semibold text-ink">
                      {packageItem.name}
                    </h4>
                    <span className="shrink-0 font-inter text-sm font-semibold text-[#003224]">
                      {packageItem.price}
                    </span>
                  </div>
                  <p className="mt-2 font-inter text-[13px] leading-5 text-muted">
                    {packageItem.description || "Package details available on request."}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
