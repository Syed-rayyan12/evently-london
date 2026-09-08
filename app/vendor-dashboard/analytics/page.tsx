import {
  CalendarCheck2,
  CircleDollarSign,
  MessageSquareText,
  Star,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "48,500", icon: CircleDollarSign },
  { label: "Reviews", value: "345", icon: Star },
  { label: "Enquiries", value: "356", icon: MessageSquareText, muted: true },
  { label: "Bookings", value: "74", icon: CalendarCheck2 },
];

const chartValues = [42, 64, 48, 76, 58, 86, 70];
const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const chartPoints = chartValues.map((value, index) => ({
  label: chartLabels[index],
  value,
  x: 40 + index * 86,
  y: 190 - value * 1.65,
}));
const chartLine = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
const chartArea = `M ${chartPoints[0].x},190 L ${chartLine} L ${
  chartPoints[chartPoints.length - 1].x
},190 Z`;

const categoryPerformance = [
  { label: "Venue", value: 88 },
  { label: "Catering", value: 76 },
  { label: "Photography", value: 69 },
  { label: "Makeup Artist", value: 61 },
  { label: "Decor and Styling", value: 54 },
  { label: "Entertainment", value: 47 },
];

const topCategories = [
  { label: "Venue", revenue: "14,200", share: "29%" },
  { label: "Catering", revenue: "11,850", share: "24%" },
  { label: "Photography", revenue: "8,900", share: "18%" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-7">
      <section className="shadow-[#0D5B46]/10">
        <div className="rounded-[16px] bg-white p-4 shadow-lg">
          <h2 className="mt-2 [font-family:var(--font-playfair)] text-[38px] font-normal leading-tight text-[#16231f]">
            Analytics
          </h2>
          <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
            Track top categories, bookings, revenue, reviews, and service
            performance from one clean overview.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`rounded-[12px] bg-white p-5 shadow-lg ${
                  stat.muted ? "opacity-55 grayscale" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="mt-1 font-inter text-[14px] font-semibold text-[#000]">
                    {stat.label}
                  </p>
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-[10px] text-white ${
                      stat.muted ? "bg-[#8a928e]" : "bg-[#01241D]"
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-5 font-inter text-[20px] font-semibold text-[#000]">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="w-full rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-inter text-[16.61px] font-medium text-[#000000]">
              Recent Overview Chart
            </h2>
            <div className="flex rounded-lg border border-[#0D5B46] p-1">
              {["This Week", "This Month", "This Year"].map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`rounded-lg px-4 py-2 font-inter text-[13px] font-medium transition-colors ${
                    index === 0
                      ? "bg-[#01241D] text-white"
                      : "text-[#0D5B46] hover:bg-[#0D5B46]/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 h-[260px] rounded-[12px] border border-[#dfe7e2] bg-[#fbfcfa] p-5">
            <svg
              className="h-full w-full"
              viewBox="0 0 600 220"
              role="img"
              aria-label="Recent overview line chart"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueLineFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0D5B46" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#0D5B46" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[55, 100, 145, 190].map((y) => (
                <line
                  key={y}
                  x1="36"
                  x2="560"
                  y1={y}
                  y2={y}
                  stroke="#dfe7e2"
                  strokeDasharray="5 7"
                  strokeWidth="1"
                />
              ))}
              <path d={chartArea} fill="url(#revenueLineFill)" />
              <polyline
                fill="none"
                points={chartLine}
                stroke="#0D5B46"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              {chartPoints.map((point) => (
                <g key={point.label}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill="#fbfcfa"
                    r="7"
                    stroke="#0D5B46"
                    strokeWidth="4"
                  />
                  <text
                    fill="#68746e"
                    fontSize="13"
                    fontWeight="600"
                    textAnchor="middle"
                    x={point.x}
                    y="212"
                  >
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </section>

        <aside className="space-y-7">
          <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
            <div className="flex items-center gap-3 border-b border-[#edf1ee] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#01241D] text-white">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-inter text-[16px] font-medium text-[#16231f]">
                Top Categories
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              {topCategories.map((category) => (
                <div
                  key={category.label}
                  className="rounded-[10px] border border-[#edf1ee] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-inter text-[14px] font-semibold text-[#16231f]">
                      {category.label}
                    </p>
                    <span className="font-inter text-[13px] font-semibold text-[#0D5B46]">
                      {category.share}
                    </span>
                  </div>
                  <p className="mt-2 font-inter text-[18px] font-semibold text-[#000]">
                    {category.revenue}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <div className="flex items-center gap-3 border-b border-[#edf1ee] pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#01241D] text-white">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="font-inter text-[16px] font-medium text-[#16231f]">
            Category Performance
          </h2>
        </div>

        <div className="mt-6 grid gap-5">
          {categoryPerformance.map((item, index) => (
            <div key={item.label}>
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-inter text-[14px] font-medium text-[#16231f]">
                  {item.label}
                </p>
                <div className="flex items-center gap-5 font-inter text-[14px] font-semibold text-[#000]">
                  <span>Reviews 345</span>
                  <span>Booking 5</span>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full origin-left rounded-full bg-[#0D5B46]"
                  style={{
                    width: `${item.value}%`,
                    animation: `analyticsProgressGrow 900ms ease-out ${
                      index * 120
                    }ms both`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>
        {`
          @keyframes analyticsProgressGrow {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
            }
          }
        `}
      </style>
    </div>
  );
}
