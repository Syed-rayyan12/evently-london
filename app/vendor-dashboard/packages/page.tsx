const packages = [
  { name: "Essential Package", price: "£1,500" },
  { name: "Classic Package", price: "£1,850" },
  { name: "Premium Package", price: "£2,580" },
];

export default function PackagesPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
          Manage Package
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Keep your vendor packages and package pricing accurate for customers.
        </p>
      </section>
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        {packages.map((pkg) => (
          <div key={pkg.name} className="flex items-center justify-between gap-4 border-b border-[#edf1ee] py-4">
            <p className="font-inter text-[15px] font-semibold text-[#16231f]">{pkg.name}</p>
            <p className="font-inter text-[15px] font-semibold text-[#0D5B46]">{pkg.price}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
