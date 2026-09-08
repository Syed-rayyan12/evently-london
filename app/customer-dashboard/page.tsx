import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck2,
  Heart,
  MapPin,
  MessageSquareText,
  PoundSterling,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";

const stats = [
  { label: "My Events", value: "08", icon: Ticket },
  { label: "Saved Vendors", value: "24", icon: Heart },
  { label: "Enquiries", value: "16", icon: MessageSquareText },
  { label: "Bookings", value: "05", icon: CalendarCheck2 },
];

const upcomingEvent = {
  image: "/images/wedding.png",
  service: "Wedding Photography",
  location: "Mayfair, London",
  date: "12 Sep 2026",
  guests: "180 Guests",
};

const recentActivities = [
  {
    message: "New enquiry sent to Royal Moments Photography",
    time: "10 min ago",
  },
  {
    message: "Venue shortlist updated for Wedding Reception",
    time: "1 hour ago",
  },
  {
    message: "Catering vendor replied with package details",
    time: "Today",
  },
  {
    message: "Booking request created for Decor & Styling",
    time: "Yesterday",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Welcome, Customer
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Track your event plans, saved vendors, enquiries, bookings, budget,
          and recent activity from one clean overview.
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
                <p className="font-inter text-[14px] font-semibold text-[#000]">
                  {stat.label}
                </p>
                <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#01241D] text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-5 font-inter text-[28px] font-semibold leading-tight text-[#000]">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-[14px] bg-white shadow-xl shadow-[#0D5B46]/10">
          <div className=" px-5 py-4">
            <h3 className="font-inter text-[22px] font-semibold text-[#000]">
              My Upcoming Event
            </h3>
          </div>
          <div className="grid gap-5 p-3 grid-cols-1">
            <div className="relative min-h-[220px] overflow-hidden rounded-[12px] bg-[#f5f7f4]">
              <Image
                src={upcomingEvent.image}
                alt={upcomingEvent.service}
                fill
                sizes="(min-width: 1024px) 260px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
             
              <h3 className="[font-family:var(--font-playfair)] text-[30px] font-semibold leading-tight text-[#000]">
                {upcomingEvent.service}
              </h3>
              <div className="mt-5 grid gap-4 grid-cols-3">
                <EventMeta icon={MapPin} label="Location" value={upcomingEvent.location} />
                <EventMeta icon={CalendarCheck2} label="Date" value={upcomingEvent.date} />
                <EventMeta icon={Users} label="Guests" value={upcomingEvent.guests} />
                
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] bg-white p-4 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-inter text-[22px] font-semibold text-[#000]">
              Budget Overview
            </h3>
            <PoundSterling className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
          </div>

          <div className="mt-7 flex justify-center">
            <div
              className="relative flex h-48 w-48 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#01241D 0deg 218deg, #C07C22 218deg 300deg, #dfe7e2 300deg 360deg)",
              }}
              role="img"
              aria-label="Budget overview pie chart"
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                <span className="font-inter text-[13px] font-medium text-[#68746e]">
                  Spent
                </span>
                <span className="font-inter text-[24px] font-semibold text-[#16231f]">
                  61%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3">
            <BudgetRow label="Total Budget" value="GBP 24,000" />
            <BudgetRow label="Spent" value="GBP 14,650" />
            <BudgetRow label="Remaining" value="GBP 9,350" />
          </div>

          <Link
            href="/customer-dashboard/events"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
          >
            View All Full Plan
          </Link>
        </div>
      </section>

      <section className="rounded-[14px] bg-white shadow-xl shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-3 border-b border-[#edf1ee] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-inter text-[22px] font-semibold text-[#000]">
            Recent Activity
          </h3>
          <Link
            href="/customer-dashboard/enquiries"
            className="self-start font-inter text-[14px] font-semibold text-[#0D5B46] underline decoration-[#000]/50 decoration-2 underline-offset-4 sm:self-auto"
          >
            View Enquires
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left">
            {/* <thead>
              <tr className="bg-[#f5f7f4]">
                <th className="px-5 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                  Enquiry Message
                </th>
                <th className="px-5 py-3 text-right font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                  Enquiry Time
                </th>
              </tr>
            </thead> */}
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.message}>
                  <td className="border-b border-[#edf1ee] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-[#01241D] text-white">
                        <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-inter text-[15px] font-medium text-[#16231f]">
                        {activity.message}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-[#edf1ee] px-5 py-4 text-right font-inter text-[14px] font-medium text-[#68746e]">
                    {activity.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function EventMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[12px]  p-4">
     
        

      <div className="flex flex-col gap-3">
        <p className="font-inter text-[12px] font-semibold capitalize tracking-[0.12em] text-[#68746e]">
          {label}
        </p>
        <div className="flex items-center gap-3">

        <Icon className="h-5 w-5" aria-hidden="true" />
        <p className=" font-inter text-[13px] font-medium text-gray-700/50">
          {value}
        </p>
        </div>
      </div>
    </div>
  );
}

function BudgetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] border border-[#dfe7e2] px-4 py-3">
      <span className="font-inter text-[14px] font-medium text-[#68746e]">
        {label}
      </span>
      <span className="font-inter text-[14px] font-semibold text-[#16231f]">
        {value}
      </span>
    </div>
  );
}

