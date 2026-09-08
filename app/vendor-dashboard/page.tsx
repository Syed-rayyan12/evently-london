import Image from "next/image";
import Link from "next/link";
import {
  CircleDollarSign,
  ImagePlus,
  MessageSquareText,
  Pencil,
  Settings,
  Star,
  Store,
  Users,
} from "lucide-react";

const stats = [
  { label: "Total Vendor", value: "128", icon: Store },
  { label: "Total Users", value: "2,840", icon: Users },
  { label: "Total Enquire", value: "356", icon: MessageSquareText },
  { label: "Total Revenue", value: "48,500", icon: CircleDollarSign },
];

const enquiries = [
  {
    customer: "Ayesha Khan",
    image: "/images/profile-1.png",
    event: "Wedding",
    date: "12 Sep 2026",
    status: "New",
  },
  {
    customer: "Hamza Malik",
    image: "/images/profile-2.png",
    event: "Engagement",
    date: "18 Sep 2026",
    status: "Pending",
  },
  {
    customer: "Sara Ahmed",
    image: "/images/profile-3.png",
    event: "Baby Shower",
    date: "24 Sep 2026",
    status: "Confirmed",
  },
  {
    customer: "Bilal Raza",
    image: "/images/profile-1.png",
    event: "Birthday",
    date: "02 Oct 2026",
    status: "Review",
  },
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

const quickActions = [
  { label: "Edit Profile", icon: Pencil, href: "/vendor-dashboard/profile/edit" },
  { label: "Manage Service", icon: Store, href: "/vendor-dashboard/services" },
  { label: "Add Photos", icon: ImagePlus, href: "/vendor-dashboard/portfolio" },
  { label: "View Enquires", icon: MessageSquareText, href: "/vendor-dashboard/enquires" },
  { label: "Reviews", icon: Star, href: "/vendor-dashboard" },
  { label: "Settings", icon: Settings, href: "/vendor-dashboard/settings" },
];

export default function VendorDashboardPage() {
  return (
    <div className="space-y-7">
      <section className=" shadow-[#0D5B46]/10 ">
     
          <div className="bg-white shadow-lg p-4 rounded-[16px]">
          
            <h2 className="mt-2 [font-family:var(--font-playfair)] text-[28px] font-normal leading-tight text-[#16231f]">
              Vendor Dashboard
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Track your vendors, enquiries, bookings, revenue, and service
              activity from one clean overview.
            </p>
          </div>


        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[12px] shadow-lg bg-[#fff] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                <p className="mt-1 font-inter text-[14px] font-semibold text-[#000]">
                  {stat.label}
                </p>
                  <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#01241D] text-[#fff]">
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

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(520px,0.85fr)]">
        <section className="rounded-[14px] w-[100%] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-inter text-[16px] font-medium text-[#000]">
              Recent Enquiries
            </h2>
            <Link
              href="/vendor-dashboard/enquires"
              className="rounded-full  px-5 py-2 font-inter text-sm font-medium text-[#01241D] transition-colors  hover:text-[#01241D]"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[540px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-[#f5f7f4]">
                  {["Customer", "Event", "Date", "Status"].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-[#68746e]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={`${enquiry.customer}-${enquiry.date}`}>
                    <td className="border-b border-[#edf1ee] py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative h-11 w-11 flex-none overflow-hidden rounded-full bg-[#f5f7f4]">
                          <Image
                            src={enquiry.image}
                            alt={enquiry.customer}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </span>
                        <span className="font-inter text-[15px] font-medium text-[#16231f]">
                          {enquiry.customer}
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                      {enquiry.event}
                    </td>
                    <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                      {enquiry.date}
                    </td>
                    <td className="border-b border-[#edf1ee] px-4 py-4">
                      <span className="rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-[13px] font-medium text-[#0D5B46]">
                        {enquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[14px] w-[100%] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-inter text-[16.61px] font-medium text-[#000000]">
              Booking Overview
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
              aria-label="Booking overview line chart"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="bookingLineFill" x1="0" x2="0" y1="0" y2="1">
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
              <path d={chartArea} fill="url(#bookingLineFill)" />
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
      </div>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10 lg:p-8">
        <div className="flex items-center gap-3">
        
          <h2 className="font-inter text-[16px] font-medium text-[#16231f]">
            Quick Actions
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex min-h-24 items-center gap-4 rounded-[14px] border border-[#dfe7e2]  p-5 transition-colors"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#01241D] text-[#0D5B46] transition-colors">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <span className="font-inter text-[14px] font-medium">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
