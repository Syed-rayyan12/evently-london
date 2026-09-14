"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
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
import { listCustomerEnquiries, type CustomerEnquiry } from "@/lib/customer";
import { getCustomerProfileSession } from "@/lib/customer-session";

type BookingStatus = "Confirmed" | "Completed" | "Pending";

type Booking = {
  id: string;
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
  notes: string;
};

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Customer login is required to load bookings.");
      });
      return;
    }

    void listCustomerEnquiries(session)
      .then((result) => {
        setBookings(
          result.enquiries
            .filter((enquiry) => enquiry.status.toLowerCase() === "booked")
            .map(mapCustomerBooking)
        );
        setStatus("idle");
        setMessage("");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load bookings.");
      });
  }, []);

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

      return b.id.localeCompare(a.id);
    });
  }, [bookings, query, sortBy]);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Bookings
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Review your booked enquiries, package details, event timing, and vendor information.
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
      </section>

      {message ? (
        <section
          className={`rounded-[12px] px-4 py-3 font-inter text-sm font-semibold ${
            status === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
          }`}
          aria-live="polite"
        >
          {message}
        </section>
      ) : null}

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
                  unoptimized={isUnoptimizedImage(booking.image)}
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
                  <CardMeta icon={Users} label="Guests" value={booking.guests} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(booking)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0D5B46] px-4 font-inter text-[14px] font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                View Detail
              </button>
            </div>
          </article>
        ))}

        {filteredBookings.length === 0 ? (
          <div className="rounded-[16px] bg-white px-4 py-12 text-center font-inter text-sm font-semibold text-[#68746e] shadow-lg shadow-[#0D5B46]/10 lg:col-span-2">
            {status === "loading" ? "Loading bookings..." : "No booked enquiries found."}
          </div>
        ) : null}
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
                  unoptimized={isUnoptimizedImage(selectedBooking.image)}
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
            <DetailItem label="Guests" value={selectedBooking.guests} />
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
            <div className="mt-5 text-right font-inter text-[18px] font-semibold text-[#01241D]">
              {selectedBooking.price}
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#dfe7e2] p-4">
            <p className="font-inter text-[14px] font-medium capitalize tracking-[0.14em] text-[#000]">
              Notes
            </p>
            <p className="mt-2 font-inter text-[15px] leading-7 text-gray-700/70">
              {selectedBooking.notes}
            </p>
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
    </div>
  );
}

function mapCustomerBooking(enquiry: CustomerEnquiry): Booking {
  const details = getEnquiryDetails(enquiry.message);
  const vendorProfile = enquiry.vendor?.vendorProfile;

  return {
    id: enquiry.id,
    vendor: vendorProfile?.vendorName ?? enquiry.vendor?.name ?? enquiry.vendor?.email ?? "Vendor",
    vendorType: vendorProfile?.category ?? "Vendor",
    image: vendorProfile?.imageUrl ?? "/images/profile-2.png",
    status: "Confirmed",
    date: details.eventDate ?? "Not provided",
    location: details.location ?? "Not provided",
    packageName: enquiry.packageName ?? details.packageName ?? "Custom quote",
    serviceName: details.service ?? details.vendor ?? "Quote request",
    time: "To be confirmed",
    guests: details.guestCount ?? "Not provided",
    price: "Confirmed by vendor response",
    notes: details.requirements ?? details.customerRequest ?? enquiry.message,
  };
}

function getEnquiryDetails(message: string) {
  return {
    service: getMessageField(message, "Service"),
    vendor: getMessageField(message, "Vendor"),
    packageName: getMessageField(message, "Package"),
    eventDate: getMessageField(message, "Event Date"),
    guestCount: getMessageField(message, "Guest Count"),
    location: getMessageField(message, "Location"),
    requirements: getMessageField(message, "Requirements"),
    customerRequest: getCustomerRequest(message),
  };
}

function getMessageField(message: string, label: string) {
  const line = message
    .split("\n")
    .find((item) => item.toLowerCase().startsWith(`${label.toLowerCase()}:`));

  return line?.replace(new RegExp(`^${label}:\\s*`, "i"), "").trim() || undefined;
}

function getCustomerRequest(message: string) {
  const marker = "Customer request:";
  const markerIndex = message.toLowerCase().indexOf(marker.toLowerCase());

  if (markerIndex === -1) {
    return undefined;
  }

  return message.slice(markerIndex + marker.length).trim() || undefined;
}

function isUnoptimizedImage(src: string) {
  return src.startsWith("blob:") || src.startsWith("data:");
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/45 px-5 py-8 sm:py-10">
      <div className="my-auto max-h-[calc(100vh-4rem)] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
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
