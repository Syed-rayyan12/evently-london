import {
  BadgeDollarSign,
  Building2,
  MessageSquareText,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  { label: "Total Vendors", value: "1,284", icon: Building2 },
  { label: "Total Users", value: "18,420", icon: Users },
  { label: "Total Enquiries", value: "4,956", icon: MessageSquareText },
  { label: "Total Revenue", value: "GBP 248K", icon: BadgeDollarSign },
];

const chartValues = [52, 68, 59, 82, 74, 96, 88];
const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const chartPoints = chartValues.map((value, index) => ({
  label: chartLabels[index],
  value,
  x: 40 + index * 86,
  y: 190 - value * 1.55,
}));
const chartLine = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
const chartArea = `M ${chartPoints[0].x},190 L ${chartLine} L ${
  chartPoints[chartPoints.length - 1].x
},190 Z`;

const topCategories = [
  { label: "Venues", value: "38%", color: "#01241D" },
  { label: "Catering", value: "26%", color: "#C07C22" },
  { label: "Photography", value: "21%", color: "#0D5B46" },
  { label: "Makeup Artists", value: "15%", color: "#7c8790" },
];

const categoryPerformance = [
  { label: "Venue", value: 88 },
  { label: "Catering", value: 76 },
  { label: "Photography", value: 69 },
  { label: "Makeup Artist", value: 61 },
  { label: "Decor and Styling", value: 54 },
  { label: "Entertainment", value: 47 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Analytics
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Monitor platform revenue, top categories, recent activity, reviews,
          bookings, and category performance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[12px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-inter text-[14px] font-semibold text-black">
                  {stat.label}
                </p>
                <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#01241D] text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-5 font-inter text-[28px] font-semibold leading-tight text-black">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-inter text-[22px] font-semibold text-black">
              Revenue Overview
            </h3>
            <div className="flex rounded-[10px] border border-[#dfe7e2] bg-[#f5f7f4] p-1">
              {["This Week", "This Month", "This Year"].map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`min-h-9 rounded-[8px] px-3 font-inter text-[13px] font-semibold ${
                    index === 1
                      ? "bg-[#01241D] text-white"
                      : "text-[#68746e] hover:text-[#01241D]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 h-[270px] rounded-[12px] border border-[#edf1ee] bg-[#fbfcfa] p-5">
            <svg
              className="h-full w-full"
              viewBox="0 0 600 220"
              role="img"
              aria-label="Admin revenue overview line chart"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="adminRevenueFill" x1="0" x2="0" y1="0" y2="1">
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
              <path d={chartArea} fill="url(#adminRevenueFill)" />
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
        </div>

        <div className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-inter text-[22px] font-semibold text-black">
              Top Categories
            </h3>
            <TrendingUp className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
          </div>

          <div className="mt-7 grid items-center gap-6 sm:grid-cols-[180px_1fr] xl:grid-cols-1">
            <div
              className="mx-auto flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#01241D 0deg 137deg, #C07C22 137deg 231deg, #0D5B46 231deg 307deg, #7c8790 307deg 360deg)",
              }}
              role="img"
              aria-label="Admin top categories chart"
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                <span className="font-inter text-[12px] font-medium text-[#68746e]">
                  Top
                </span>
                <span className="font-inter text-[24px] font-semibold text-[#16231f]">
                  38%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {topCategories.map((category) => (
                <div
                  key={category.label}
                  className="flex items-center justify-between gap-4 rounded-[10px] border border-[#edf1ee] px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 font-inter text-[14px] font-semibold text-[#16231f]">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.label}
                  </span>
                  <span className="font-inter text-[14px] font-semibold text-[#01241D]">
                    {category.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf1ee] pb-4">
          <h3 className="font-inter text-[22px] font-semibold text-black">
            Category Performance
          </h3>
          <TrendingUp className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
        </div>

        <div className="mt-6 grid gap-5">
          {categoryPerformance.map((item, index) => (
            <div key={item.label}>
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-inter text-[14px] font-medium text-[#16231f]">
                  {item.label}
                </p>
                <div className="flex items-center gap-5 font-inter text-[14px] font-semibold text-black">
                  <span>Reviews 345</span>
                  <span>Booking 5</span>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full origin-left rounded-full bg-[#0D5B46]"
                  style={{
                    width: `${item.value}%`,
                    animation: `adminAnalyticsProgressGrow 900ms ease-out ${
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
          @keyframes adminAnalyticsProgressGrow {
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
