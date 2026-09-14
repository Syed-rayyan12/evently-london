"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Building2,
  MessageSquareText,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getAdminAnalytics,
  type AdminAnalyticsOverview,
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

const categoryColors = ["#01241D", "#C07C22", "#0D5B46", "#E0A84B", "#5B806F", "#8B6B2E"];

const revenueChartConfig = {
  revenue: {
    label: "Estimated revenue",
    color: "#0D5B46",
  },
} satisfies ChartConfig;

const categoryChartConfig = {
  enquiries: {
    label: "Enquiries",
  },
} satisfies ChartConfig;

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<AdminDashboardPeriod>("this-month");
  const [analytics, setAnalytics] = useState<AdminAnalyticsOverview | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const session = getAdminSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Admin login is required to load analytics.");
        setAnalytics(null);
      });
      return;
    }

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        setMessage("");
        return getAdminAnalytics(session.token, period);
      })
      .then((result) => {
        if (!active) {
          return;
        }

        setAnalytics(result);
        setStatus("idle");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setAnalytics(null);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load analytics.");
      });

    return () => {
      active = false;
    };
  }, [period]);

  const stats = useMemo(
    () => [
      { label: "Total Vendors", value: formatNumber(analytics?.stats.totalVendors ?? 0), icon: Building2 },
      { label: "Total Users", value: formatNumber(analytics?.stats.totalUsers ?? 0), icon: Users },
      { label: "Total Enquiries", value: formatNumber(analytics?.stats.totalEnquiries ?? 0), icon: MessageSquareText },
      { label: "Estimated Revenue", value: formatCurrency(analytics?.stats.totalRevenue ?? 0), icon: BadgeDollarSign },
    ],
    [analytics]
  );
  const revenueChartData = useMemo(
    () =>
      (analytics?.revenueOverview.points ?? []).map((point) => ({
        label: point.label,
        revenue: point.value,
      })),
    [analytics]
  );
  const topCategoryData = useMemo(
    () =>
      (analytics?.topCategories ?? []).map((category, index) => ({
        category: category.label,
        enquiries: category.enquiries,
        percent: category.percent,
        fill: categoryColors[index % categoryColors.length],
      })),
    [analytics]
  );

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Analytics
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Monitor platform stats, estimated revenue, category demand, reviews, and vendor performance.
        </p>
        {message ? (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 font-inter text-sm font-semibold text-rose-700">
            {message}
          </p>
        ) : null}
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
            <div>
              <h3 className="font-inter text-[22px] font-semibold text-black">
                Revenue Overview
              </h3>
              <p className="mt-1 font-inter text-sm font-medium text-[#68746e]">
                Estimated from package prices attached to enquiries.
              </p>
            </div>
            <div className="flex rounded-[10px] border border-[#dfe7e2] bg-[#f5f7f4] p-1">
              {periodTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setPeriod(tab.value)}
                  className={`min-h-9 rounded-[8px] px-3 font-inter text-[13px] font-semibold ${
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

          <div className="mt-6 h-[300px] rounded-[12px] border border-[#edf1ee] bg-[#fbfcfa] p-5">
            {revenueChartData.length ? (
              <ChartContainer
                config={revenueChartConfig}
                className="h-full w-full aspect-auto"
              >
                <LineChart
                  accessibilityLayer
                  data={revenueChartData}
                  margin={{ left: 4, right: 18, top: 18, bottom: 8 }}
                >
                  <CartesianGrid vertical={false} stroke="#dfe7e2" strokeDasharray="5 7" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={12} />
                  <YAxis
                    axisLine={false}
                    tickFormatter={(value) => formatCompactCurrency(Number(value))}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#C07C22", strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: "#C07C22", strokeWidth: 0 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <EmptyChartText status={status} label="revenue" />
            )}
          </div>
        </div>

        <div className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-inter text-[22px] font-semibold text-black">
              Top Categories
            </h3>
            <TrendingUp className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
          </div>

          <div className="mt-7 grid items-center gap-6 sm:grid-cols-[190px_1fr] xl:grid-cols-1">
            {topCategoryData.length ? (
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
                      data={topCategoryData}
                      dataKey="enquiries"
                      nameKey="category"
                      innerRadius={58}
                      outerRadius={86}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {topCategoryData.map((item) => (
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
                    {analytics?.topCategories[0]?.percent ?? 0}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-dashed border-[#dfe7e2] text-center font-inter text-sm font-semibold text-[#68746e]">
                {status === "loading" ? "Loading chart..." : "No chart data"}
              </div>
            )}

            <div className="space-y-3">
              {analytics?.topCategories.length ? analytics.topCategories.map((category, index) => (
                <div
                  key={category.label}
                  className="flex items-center justify-between gap-4 rounded-[10px] border border-[#edf1ee] px-3 py-2.5"
                >
                  <span className="flex min-w-0 items-center gap-2 font-inter text-[14px] font-semibold text-[#16231f]">
                    <span
                      className="h-3 w-3 flex-none rounded-full"
                      style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                    />
                    <span className="truncate">{category.label}</span>
                  </span>
                  <span className="whitespace-nowrap font-inter text-[14px] font-semibold text-[#01241D]">
                    {category.percent}% ({category.enquiries})
                  </span>
                </div>
              )) : (
                <p className="rounded-[12px] border border-dashed border-[#dfe7e2] px-4 py-8 text-center font-inter text-sm font-semibold text-[#68746e]">
                  {status === "loading" ? "Loading categories..." : "No vendor categories yet."}
                </p>
              )}
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
          {analytics?.categoryPerformance.length ? analytics.categoryPerformance.map((item, index) => (
            <div key={item.label}>
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-inter text-[14px] font-medium text-[#16231f]">
                  {item.label}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-inter text-[14px] font-semibold text-black">
                  <span>Vendors {item.vendors}</span>
                  <span>Enquiries {item.enquiries}</span>
                  <span>Reviews {item.reviews}</span>
                  <span>{formatCurrency(item.revenue)}</span>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full origin-left rounded-full"
                  style={{
                    width: `${item.performance}%`,
                    backgroundColor: categoryColors[index % categoryColors.length],
                    animation: `adminAnalyticsProgressGrow 900ms ease-out ${index * 120}ms both`,
                  }}
                />
              </div>
            </div>
          )) : (
            <p className="rounded-[12px] border border-dashed border-[#dfe7e2] px-4 py-10 text-center font-inter text-sm font-semibold text-[#68746e]">
              {status === "loading" ? "Loading category performance..." : "No category performance data yet."}
            </p>
          )}
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

function EmptyChartText({ status, label }: { status: "idle" | "loading" | "error"; label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-center font-inter text-sm font-semibold text-[#68746e]">
      {status === "loading" ? `Loading ${label} chart...` : `No ${label} chart data yet.`}
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    maximumFractionDigits: 0,
    notation: "compact",
    style: "currency",
  }).format(value);
}
