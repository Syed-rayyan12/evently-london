const revenueStats = [
  { label: "This Week", value: "8,400" },
  { label: "This Month", value: "32,700" },
  { label: "This Year", value: "148,500" },
];

export default function RevenuePage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
          Revenue
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Track booking revenue, recent earnings, and vendor income performance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {revenueStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10"
          >
            <p className="font-inter text-[14px] font-semibold text-[#68746e]">
              {stat.label}
            </p>
            <h3 className="mt-4 font-inter text-[28px] font-semibold text-[#16231f]">
              {stat.value}
            </h3>
          </div>
        ))}
      </section>
    </div>
  );
}
