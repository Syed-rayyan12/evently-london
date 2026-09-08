import type { VendorPackage } from "@/data/vendor-data";

type PackagesTabProps = {
  packages: VendorPackage[];
};

export default function PackagesTab({ packages }: PackagesTabProps) {
  return (
    <div className="flex flex-col gap-4 p-6">
      
      <div className="flex flex-col gap-4">
        {packages.map((item) => (
          <article
            key={item.name}
            className="flex flex-col gap-4 rounded-[8px] border border-brand-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-inter text-[14px] font-semibold text-black">
                {item.name}
              </h3>
              <p className=" font-inter text-[14px] leading-6 text-muted">
                {item.description}
              </p>
            </div>
            <p className="shrink-0 font-inter text-[16px] font-medium text-[#003224]">
              {item.price}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
