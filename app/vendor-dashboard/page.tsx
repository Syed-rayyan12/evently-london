"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CircleDollarSign,
  ImagePlus,
  MessageSquareText,
  Pencil,
  Settings,
  Star,
  Store,
} from "lucide-react";
import {
  getVendorDashboardOverview,
  type VendorDashboardOverview,
  type VendorDashboardPeriod,
} from "@/lib/auth";
import { getVendorProfileSession } from "@/lib/vendor-session";

const quickActions = [
  { label: "Edit Profile", icon: Pencil, href: "/vendor-dashboard/profile/edit" },
  { label: "Manage Service", icon: Store, href: "/vendor-dashboard/services" },
  { label: "Add Photos", icon: ImagePlus, href: "/vendor-dashboard/portfolio" },
  { label: "View Enquires", icon: MessageSquareText, href: "/vendor-dashboard/enquires" },
  { label: "Reviews", icon: Star, href: "/vendor-dashboard" },
  { label: "Settings", icon: Settings, href: "/vendor-dashboard/settings" },
];

const tabs: Array<{ label: string; value: VendorDashboardPeriod }> = [
  { label: "This Week", value: "this-week" },
  { label: "This Month", value: "this-month" },
  { label: "This Year", value: "this-year" },
];

const emptyDashboard: VendorDashboardOverview = {
  stats: {
    totalEnquiries: 0,
    totalRevenue: 0,
  },
  recentEnquiries: [],
  bookingOverview: {
    period: "this-week",
    points: [
      { label: "Mon", value: 0 },
      { label: "Tue", value: 0 },
      { label: "Wed", value: 0 },
      { label: "Thu", value: 0 },
      { label: "Fri", value: 0 },
      { label: "Sat", value: 0 },
      { label: "Sun", value: 0 },
    ],
  },
};

export default function VendorDashboardPage() {
  const [period, setPeriod] = useState<VendorDashboardPeriod>("this-week");
  const [dashboard, setDashboard] = useState<VendorDashboardOverview>(emptyDashboard);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const session = getVendorProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Vendor login is required to load dashboard.");
      });
      return;
    }

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        return getVendorDashboardOverview(period, session);
      })
      .then((result) => {
        if (!active) {
          return;
        }

        setDashboard(result);
        setStatus("idle");
        setMessage("");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load dashboard.");
      });

    return () => {
      active = false;
    };
  }, [period]);

  const stats = [
    {
      label: "Total Enquiries",
      value: dashboard.stats.totalEnquiries.toLocaleString(),
      icon: MessageSquareText,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(dashboard.stats.totalRevenue),
      icon: CircleDollarSign,
    },
  ];

  const chartPoints = useMemo(() => createChartPoints(dashboard.bookingOverview.points), [dashboard]);
  const chartLine = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const chartArea = chartPoints.length
    ? `M ${chartPoints[0].x},190 L ${chartLine} L ${chartPoints[chartPoints.length - 1].x},190 Z`
    : "";

  return (
    <div className="space-y-7">
      <section className="shadow-[#0D5B46]/10">
        <div className="rounded-[16px] bg-white p-4 shadow-lg">
          <h2 className="mt-2 [font-family:var(--font-playfair)] text-[28px] font-normal leading-tight text-[#16231f]">
            Vendor Dashboard
          </h2>
          <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
            Track enquiries, bookings, revenue, and service activity from one overview.
          </p>
          {message ? (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 font-inter text-sm text-red-700" aria-live="polite">
              {message}
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-[12px] bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <p className="mt-1 font-inter text-[14px] font-semibold text-[#000]">{stat.label}</p>
                  <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#01241D] text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-5 font-inter text-[20px] font-semibold text-[#000]">
                  {status === "loading" ? "Loading..." : stat.value}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(520px,0.85fr)]">
        <section className="w-full rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-inter text-[16px] font-medium text-[#000]">Recent Enquiries</h2>
            <Link href="/vendor-dashboard/enquires" className="rounded-full px-5 py-2 font-inter text-sm font-medium text-[#01241D] transition-colors hover:text-[#01241D]">
              View All
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            {dashboard.recentEnquiries.length ? (
              <table className="w-full min-w-[540px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-[#f5f7f4]">
                    {["Customer", "Event", "Date", "Status"].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] font-medium text-[#16231f]">{enquiry.customer}</td>
                      <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">{enquiry.event}</td>
                      <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">{enquiry.date}</td>
                      <td className="border-b border-[#edf1ee] px-4 py-4">
                        <span className="rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-[13px] font-medium text-[#0D5B46]">{enquiry.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid min-h-[240px] place-items-center rounded-[12px] border border-dashed border-[#dfe7e2] bg-[#fbfcfa] px-4 text-center">
                <p className="font-inter text-sm font-medium text-[#68746e]">No enquiries yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="w-full rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-inter text-[16.61px] font-medium text-[#000000]">Booking Overview</h2>
            <div className="flex rounded-lg border border-[#0D5B46] p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setPeriod(tab.value)}
                  className={`rounded-lg px-4 py-2 font-inter text-[13px] font-medium transition-colors ${
                    period === tab.value
                      ? "bg-[#01241D] text-white"
                      : "text-[#0D5B46] hover:bg-[#0D5B46]/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 h-[260px] rounded-[12px] border border-[#dfe7e2] bg-[#fbfcfa] p-5">
            <svg className="h-full w-full" viewBox="0 0 600 220" role="img" aria-label="Booking overview line chart" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bookingLineFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0D5B46" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#0D5B46" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[55, 100, 145, 190].map((y) => (
                <line key={y} x1="36" x2="560" y1={y} y2={y} stroke="#dfe7e2" strokeDasharray="5 7" strokeWidth="1" />
              ))}
              {chartArea ? <path d={chartArea} fill="url(#bookingLineFill)" /> : null}
              <polyline fill="none" points={chartLine} stroke="#0D5B46" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              {chartPoints.map((point) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} fill="#fbfcfa" r="7" stroke="#0D5B46" strokeWidth="4" />
                  <text fill="#68746e" fontSize="13" fontWeight="600" textAnchor="middle" x={point.x} y="212">
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </section>
      </div>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10 lg:p-8">
        <h2 className="font-inter text-[16px] font-medium text-[#16231f]">Quick Actions</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.label} href={action.href} className="group flex min-h-24 items-center gap-4 rounded-[14px] border border-[#dfe7e2] p-5 transition-colors">
                <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#01241D] text-[#0D5B46] transition-colors">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <span className="font-inter text-[14px] font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function createChartPoints(points: VendorDashboardOverview["bookingOverview"]["points"]) {
  const safePoints = points.length ? points : [{ label: "", value: 0 }];
  const maxValue = Math.max(1, ...safePoints.map((point) => point.value));
  const spacing = safePoints.length > 1 ? 520 / (safePoints.length - 1) : 0;

  return safePoints.map((point, index) => ({
    label: point.label,
    value: point.value,
    x: 40 + index * spacing,
    y: 190 - (point.value / maxValue) * 135,
  }));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}
