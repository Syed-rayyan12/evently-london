import Link from "next/link";
import {
  BadgeDollarSign,
  Building2,
  Eye,
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

const linePoints = [
  "M 0 140",
  "L 70 118",
  "L 140 128",
  "L 210 74",
  "L 280 92",
  "L 350 48",
  "L 420 62",
  "L 490 28",
  "L 560 42",
].join(" ");

const categories = [
  { label: "Venues", value: "38%", color: "#01241D" },
  { label: "Catering", value: "26%", color: "#C07C22" },
  { label: "Photography", value: "21%", color: "#0D5B46" },
  { label: "Makeup Artists", value: "15%", color: "#7c8790" },
];

const enquiries = [
  {
    customer: "Ayesha Khan",
    category: "Venue",
    time: "12 min ago",
    action: "View",
  },
  {
    customer: "Rohan Mehta",
    category: "Catering",
    time: "38 min ago",
    action: "View",
  },
  {
    customer: "Sara Malik",
    category: "Photography",
    time: "Today",
    action: "View",
  },
];

const bookings = [
  {
    event: "Wedding Reception",
    vendor: "Golden Events",
    date: "12 Sep 2026",
    price: "GBP 4,800",
  },
  {
    event: "Engagement Dinner",
    vendor: "Pearl Venue Co.",
    date: "18 Sep 2026",
    price: "GBP 2,200",
  },
  {
    event: "Birthday Celebration",
    vendor: "Signature Flavours",
    date: "02 Oct 2026",
    price: "GBP 1,150",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Admin Dashboard
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Monitor platform vendors, customers, enquiries, bookings, revenue, and
          category performance from one dashboard.
        </p>
      </section>

      <section
        id="vendors"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
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

      <section
        id="analytics"
        className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]"
      >
        <div className="rounded-[14px] bg-white p-5 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-inter text-[22px] font-semibold text-black">
                Revenue Overview
              </h3>
            
            </div>
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

          <div className="mt-6 h-[270px] rounded-[12px] border border-[#edf1ee] p-4">
            <svg
              viewBox="0 0 560 180"
              className="h-full w-full"
              role="img"
              aria-label="Revenue line chart"
            >
              {[40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="560"
                  y1={y}
                  y2={y}
                  stroke="#edf1ee"
                  strokeWidth="2"
                />
              ))}
              <path
                d={`${linePoints} L 560 180 L 0 180 Z`}
                fill="#0D5B46"
                opacity="0.08"
              />
              <path
                d={linePoints}
                fill="none"
                stroke="#01241D"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="5"
              />
              {[0, 70, 140, 210, 280, 350, 420, 490, 560].map((x) => (
                <circle
                  key={x}
                  cx={x}
                  cy={[140, 118, 128, 74, 92, 48, 62, 28, 42][x / 70]}
                  r="5"
                  fill="#C07C22"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="rounded-[14px] bg-white p-5 shadow-xl shadow-[#0D5B46]/10">
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
              aria-label="Top categories pie chart"
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
              {categories.map((category) => (
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

          <Link
            href="/admin-dashboard/analytics"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
          >
            View Analytics
          </Link>
        </div>
      </section>

      <section
        id="enquiries"
        className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]"
      >
        <div className="rounded-[14px] bg-white shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center justify-between gap-4 border-b border-[#edf1ee] px-5 py-4">
            <h3 className="font-inter text-[22px] font-semibold text-black">
              Recent Enquiries
            </h3>
            <Link
              href="/admin-dashboard"
              className="font-inter text-[14px] font-semibold text-[#0D5B46] underline decoration-[#0D5B46]/40 underline-offset-4"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-[#f5f7f4]">
                  {["Customer", "Category", "Time", "Action"].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 font-inter text-[13px] font-semibold capitalize text-black"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={`${enquiry.customer}-${enquiry.time}`}>
                    <TableCell>{enquiry.customer}</TableCell>
                    <TableCell>{enquiry.category}</TableCell>
                    <TableCell>{enquiry.time}</TableCell>
                    <td className="border-b border-[#edf1ee] px-5 py-4">
                      <button
                        type="button"
                        className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D]"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        {enquiry.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          id="bookings"
          className="rounded-[14px] bg-white p-5 shadow-xl shadow-[#0D5B46]/10"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-inter text-[22px] font-semibold text-black">
              Recent Booking
            </h3>
            <Link
              href="/admin-dashboard"
              className="font-inter text-[14px] font-semibold text-[#0D5B46] underline decoration-[#0D5B46]/40 underline-offset-4"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {bookings.map((booking) => (
              <div
                key={`${booking.event}-${booking.date}`}
                className="rounded-[12px] border border-[#edf1ee] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-inter text-[15px] font-semibold text-[#16231f]">
                      {booking.event}
                    </p>
                    <p className="mt-1 font-inter text-[13px] font-medium text-[#68746e]">
                      {booking.vendor}
                    </p>
                    <p className="mt-3 font-inter text-[13px] font-medium text-[#0D5B46]">
                      {booking.date}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-inter text-[15px] font-semibold text-[#01241D]">
                    {booking.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="border-b border-[#edf1ee] px-5 py-4 font-inter text-[14px] font-medium text-[#16231f]">
      {children}
    </td>
  );
}
