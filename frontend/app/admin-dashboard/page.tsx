"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Eye,
  MessageSquareText,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getAdminDashboardOverview,
  type AdminDashboardOverview,
  type AdminDashboardPeriod,
} from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-session";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const periodTabs: Array<{ label: string; value: AdminDashboardPeriod }> = [
  { label: "This Week", value: "this-week" },
  { label: "This Month", value: "this-month" },
  { label: "This Year", value: "this-year" },
];

const categoryColors = ["#01241D", "#C07C22", "#0D5B46", "#7c8790"];

const enquiryChartConfig = {
  enquiries: {
    label: "Enquiries",
    color: "#01241D",
  },
} satisfies ChartConfig;

const categoryChartConfig = {
  vendors: {
    label: "Vendors",
  },
} satisfies ChartConfig;

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<AdminDashboardPeriod>("this-month");
  const [dashboard, setDashboard] = useState<AdminDashboardOverview | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const session = getAdminSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Admin login is required to load dashboard stats.");
        setDashboard(null);
      });
      return;
    }

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        setMessage("");
        return getAdminDashboardOverview(session.token, period);
      })
      .then((result) => {
        if (!active) {
          return;
        }

        setDashboard(result);
        setStatus("idle");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setDashboard(null);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load dashboard stats.");
      });

    return () => {
      active = false;
    };
  }, [period]);

  const stats = useMemo(
    () => [
      { label: "Total Vendors", value: dashboard?.stats.totalVendors ?? 0, icon: Building2 },
      { label: "Total Users", value: dashboard?.stats.totalUsers ?? 0, icon: Users },
      { label: "Total Enquiries", value: dashboard?.stats.totalEnquiries ?? 0, icon: MessageSquareText },
      { label: "Total Reviews", value: dashboard?.stats.totalReviews ?? 0, icon: Star },
    ],
    [dashboard]
  );

  const enquiryChartData = useMemo(
    () =>
      (dashboard?.enquiryOverview.points ?? []).map((point) => ({
        label: point.label,
        enquiries: point.value,
      })),
    [dashboard]
  );
  const categoryChartData = useMemo(
    () =>
      (dashboard?.categories ?? []).map((category, index) => ({
        category: category.label,
        vendors: category.count,
        percent: category.percent,
        fill: categoryColors[index % categoryColors.length],
      })),
    [dashboard]
  );

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] main-heading text-[40px] font-normal leading-tight text-[#16231f]">
          Admin 
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Monitor live platform vendors, customers, enquiries, reviews, and category performance.
        </p>
        {message ? (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 font-inter text-sm font-semibold text-rose-700">
            {message}
          </p>
        ) : null}
      </section>

      <section id="vendors" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                {formatNumber(stat.value)}
              </p>
            </div>
          );
        })}
      </section>

      <section id="analytics" className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[14px] bg-white p-5 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-4 sm:flex-row broken sm:items-center sm:justify-between">
            <div>
              <h3 className="font-inter text-[22px] font-semibold text-black">
                Enquiry Overview
              </h3>
              <p className="mt-1 font-inter text-sm font-medium text-[#68746e]">
                Live customer enquiry volume by selected period.
              </p>
            </div>
            <div className="inline-flex w-fit max-w-full rounded-[10px] border border-[#dfe7e2] bg-[#f5f7f4] p-1">
              {periodTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setPeriod(tab.value)}
                  className={`min-h-9 whitespace-nowrap rounded-[8px] px-3 font-inter text-[13px] font-semibold ${
                    period === tab.value
                      ? "bg-[#01241D] text-white"
                      : "text-[#68746e] hover:text-[#01241D]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 h-[300px] rounded-[12px] border border-[#edf1ee] p-4">
            {enquiryChartData.length ? (
              <ChartContainer
                config={enquiryChartConfig}
                className="h-full w-full aspect-auto"
              >
                <LineChart
                  accessibilityLayer
                  data={enquiryChartData}
                  margin={{ left: 4, right: 16, top: 18, bottom: 8 }}
                >
                  <CartesianGrid vertical={false} stroke="#edf1ee" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    type="monotone"
                    dataKey="enquiries"
                    stroke="var(--color-enquiries)"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#C07C22", strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: "#C07C22", strokeWidth: 0 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-center font-inter text-sm font-semibold text-[#68746e]">
                {status === "loading" ? "Loading chart..." : "No enquiry chart data yet."}
              </div>
            )}
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
            {categoryChartData.length ? (
              <div className="relative mx-auto h-52 w-52">
                <ChartContainer
                  config={categoryChartConfig}
                  className="h-full w-full aspect-square"
                >
                  <PieChart accessibilityLayer>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel nameKey="category" />}
                    />
                    <Pie
                      data={categoryChartData}
                      dataKey="vendors"
                      nameKey="category"
                      innerRadius={58}
                      outerRadius={86}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {categoryChartData.map((item) => (
                        <Cell key={item.category} fill={item.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-inter text-[12px] font-medium text-[#68746e]">
                    Top
                  </span>
                  <span className="font-inter text-[24px] font-semibold text-[#16231f]">
                    {dashboard?.categories[0]?.percent ?? 0}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-dashed border-[#dfe7e2] text-center font-inter text-sm font-semibold text-[#68746e]">
                {status === "loading" ? "Loading chart..." : "No chart data"}
              </div>
            )}

            <div className="space-y-3">
              {dashboard?.categories.length ? dashboard.categories.map((category, index) => (
                <div
                  key={category.label}
                  className="flex items-center justify-between gap-4 rounded-[10px] border border-[#edf1ee] px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 font-inter text-[14px] font-semibold text-[#16231f]">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                    />
                    {category.label}
                  </span>
                  <span className="font-inter text-[14px] font-semibold text-[#01241D]">
                    {category.percent}% ({category.count})
                  </span>
                </div>
              )) : (
                <p className="rounded-[12px] border border-dashed border-[#dfe7e2] px-4 py-8 text-center font-inter text-sm font-semibold text-[#68746e]">
                  {status === "loading" ? "Loading categories..." : "No vendor categories yet."}
                </p>
              )}
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

      <section id="enquiries" className="rounded-[14px] bg-white shadow-xl shadow-[#0D5B46]/10">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf1ee] px-5 py-4">
          <h3 className="font-inter text-[22px] font-semibold text-black">
            Recent Enquiries
          </h3>
          <Link
            href="/admin-dashboard/enquiries"
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
              {dashboard?.recentEnquiries.length ? dashboard.recentEnquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <TableCell>{enquiry.customer}</TableCell>
                  <TableCell>{enquiry.category}</TableCell>
                  <TableCell>{formatDateTime(enquiry.time)}</TableCell>
                  <td className="border-b border-[#edf1ee] px-5 py-4">
                    <Link
                      href="/admin-dashboard/enquiries"
                      className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      View
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center font-inter text-sm font-semibold text-[#68746e]">
                    {status === "loading" ? "Loading enquiries..." : "No enquiries yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
