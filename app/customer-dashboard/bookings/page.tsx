"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarCheck2,
  Eye,
  MapPin,
  Package,
  Search,
  SlidersHorizontal,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type BookingStatus = "Confirmed" | "Completed" | "Pending";

type Booking = {
  id: number;
  vendor: string;
  vendorType: string;
  image: string;
  status: BookingStatus;
  date: string;
  location: string;
  packageName: string;
  serviceName: string;
  time: string;
  guests: string;
  price: string;
};

const bookings: Booking[] = [
  {
    id: 1,
    vendor: "Royal Moments Photography",
    vendorType: "Photography",
    image: "/images/mej.png",
    status: "Confirmed",
    date: "12 Sep 2026",
    location: "Mayfair, London",
    packageName: "Premium Wedding Package",
    serviceName: "Wedding Photography",
    time: "10:00 AM - 10:00 PM",
    guests: "180",
    price: "GBP 1,500",
  },
  {
    id: 2,
    vendor: "Prime Venue Collection",
    vendorType: "Venue",
    image: "/images/venue.png",
    status: "Completed",
    date: "18 Sep 2026",
    location: "Pearl Suite, Manchester",
    packageName: "Grand Hall Booking",
    serviceName: "Venue Booking",
    time: "05:00 PM - 11:30 PM",
    guests: "120",
    price: "GBP 2,200",
  },
  {
    id: 3,
    vendor: "Signature Flavours Catering",
    vendorType: "Catering",
    image: "/images/card-4.png",
    status: "Confirmed",
    date: "02 Oct 2026",
    location: "Private Residence, Bristol",
    packageName: "Classic Dinner Buffet",
    serviceName: "Dinner Catering",
    time: "07:00 PM - 10:00 PM",
    guests: "75",
    price: "GBP 4,200",
  },
];

export default function AdminBookingsPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const visibleRows = normalizedQuery
      ? bookings.filter((booking) =>
          [
            booking.vendor,
            booking.vendorType,
            booking.status,
            booking.date,
            booking.location,
            booking.packageName,
            booking.serviceName,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : bookings;

    return [...visibleRows].sort((a, b) => {
      if (sortBy === "name") {
        return a.vendor.localeCompare(b.vendor);
      }

      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }

      return b.id - a.id;
    });
  }, [query, sortBy]);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Bookings
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Review confirmed and completed bookings, package details, service
          timing, location, and booking price.
        </p>
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="flex min-h-12 w-full max-w-[680px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search bookings"
              className="w-full bg-transparent font-inter text-sm text-[#16231f] outline-none placeholder:text-[#68746e]"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-h-12 items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
              <SlidersHorizontal className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="bg-transparent font-inter text-sm font-medium text-[#0D5B46] outline-none"
              >
                <option value="latest">Filter</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {filteredBookings.map((booking) => (
          <article
            key={booking.id}
            className="rounded-[16px] bg-white p-4 shadow-lg shadow-[#0D5B46]/10"
          >
            <div className="flex h-full flex-col gap-4">
              <div className="relative h-40 w-full overflow-hidden rounded-[12px] bg-[#f5f7f4]">
                <Image
                  src={booking.image}
                  alt={booking.vendor}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
                      {booking.vendor}
                    </h3>
                    <p className="mt-1 font-inter text-[14px] font-medium text-[#C07C22]">
                      {booking.vendorType}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-4 grid gap-3">
                  <CardMeta icon={CalendarCheck2} label="Date" value={booking.date} />
                  <CardMeta icon={MapPin} label="Location" value={booking.location} />
                  <CardMeta icon={Package} label="Package" value={booking.packageName} />
                  <CardMeta icon={Users} label="Price" value={booking.price} />
                </div>
              </div>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(booking)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0D5B46] px-4 font-inter text-[14px] font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View Detail
                </button>
                <button
                  type="button"
                  onClick={() => setCancelBooking(booking)}
                  className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-gray-300 px-4 font-inter text-[14px] font-semibold text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {selectedBooking ? (
        <Modal title="View Booking" onClose={() => setSelectedBooking(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-16 flex-none overflow-hidden rounded-[12px] bg-[#f5f7f4]">
                <Image
                  src={selectedBooking.image}
                  alt={selectedBooking.vendor}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div>
                <h3 className="mt-1 font-inter text-[18px] font-semibold text-[#16231f]">
                  {selectedBooking.vendor}
                </h3>
                <p className="font-inter text-[13px] font-semibold text-gray-700/80">
                  {selectedBooking.vendorType}
                </p>
              </div>
            </div>
          </div>

          <h3 className="mt-5 font-inter text-[18px] font-semibold text-[#16231f]">
            Event
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Date" value={selectedBooking.date} />
            <DetailItem label="Location" value={selectedBooking.location} />
            <DetailItem label="Guests" value={`${selectedBooking.guests} guests`} />
            <DetailItem label="Status" value={selectedBooking.status} />
          </div>

          <h3 className="mt-5 font-inter text-[18px] font-semibold text-[#16231f]">
            Booking Service
          </h3>
          <div className="mt-3 rounded-[12px] border border-[#dfe7e2] p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Service Name" value={selectedBooking.serviceName} compact />
              <DetailItem label="Package Name" value={selectedBooking.packageName} compact />
              <DetailItem label="Time" value={selectedBooking.time} compact />
              <DetailItem label="Location" value={selectedBooking.location} compact />
              <DetailItem label="Date" value={selectedBooking.date} compact />
              <DetailItem label="Guest" value={selectedBooking.guests} compact />
            </div>
            <div className="mt-5 text-right font-inter text-[22px] font-semibold text-[#01241D]">
              {selectedBooking.price}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              Close
            </button>
          </div>
        </Modal>
      ) : null}

      {cancelBooking ? (
        <Modal title="Cancel Booking" onClose={() => setCancelBooking(null)}>
          <p className="font-inter text-[15px] leading-7 text-[#68746e]">
            Are you sure you want to cancel this booking with{" "}
            <span className="font-semibold text-[#16231f]">
              {cancelBooking.vendor}
            </span>
            ?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCancelBooking(null)}
              className="rounded-md border border-gray-300 px-5 py-2.5 font-inter text-sm font-medium text-gray-400 transition-colors hover:bg-gray-50"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={() => setCancelBooking(null)}
              className="rounded-md bg-[#b42318] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#8f1d14]"
            >
              Cancel Booking
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function CardMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-[#0D5B46]" aria-hidden="true" />
      <div>
        <p className="font-inter text-[12px] font-semibold uppercase tracking-[0.12em] text-[#68746e]">
          {label}
        </p>
        <p className="mt-1 font-inter text-[14px] font-semibold text-[#16231f]">
          {value}
        </p>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "rounded-[10px] border border-[#dfe7e2] p-4"}>
      <p className="font-inter text-[14px] font-medium capitalize tracking-[0.14em] text-[#000]">
        {label}
      </p>
      <p className="mt-1 font-inter text-[14px] font-medium text-gray-700/50">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const className =
    status === "Confirmed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Completed"
        ? "bg-blue-50 text-blue-700"
        : "bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 font-inter text-xs font-semibold ${className}`}>
      {status}
    </span>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 py-8">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-inter text-[22px] font-semibold text-[#16231f]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]"
            aria-label={`Close ${title}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

