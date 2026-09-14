import Image from "next/image";
import type { VendorOfferedService } from "@/data/vendor-data";

type ServicesOfferedGridProps = {
  services: VendorOfferedService[];
};

export default function ServicesOfferedGrid({
  services,
}: ServicesOfferedGridProps) {
  return (
    <section className="rounded-[10px] border border-brand-line bg-white p-6">
      <h2 className="font-pt-serif text-[44px] font-normal text-black">
        Services Offered
      </h2>

      <div className="mt-5 flex justify-between gap-x-8 gap-y-4">
        {services.map((service) => (
          <div key={service.title} className="flex flex-col border rounded-lg border border-black/10 p-7 items-center gap-6">
            <Image
              src={service.icon}
              alt=""
              width={500}
              height={500}
              className="h-10 w-10 shrink-0 object-cover"
            />
            <h3 className="font-inter text-center text-[20px] font-semibold text-ink">
              {service.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
