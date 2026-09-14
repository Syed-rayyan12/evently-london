"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, ListFilter, Search, X } from "lucide-react";
import { listVendorEnquiries, type VendorEnquiry } from "@/lib/auth";
import { getVendorProfileSession } from "@/lib/vendor-session";

type Booking = {
  id: string;
  customer: string;
  event: string;
  location: string;
  eventDate: string;
  packageName: string;
  service: string;
  guests: string;
  status: string;
  notes: string;
};

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Vendor login is required to load bookings.");
      });
      return;
    }

    void listVendorEnquiries(session)
      .then((result) => {
        setBookings(
          result.enquiries
            .filter((enquiry) => enquiry.status.toLowerCase() === "booked")
            .map(mapVendorBooking)
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

    if (!normalizedQuery) {
      return bookings;
    }

    return bookings.filter((booking) =>
      [
        booking.customer,
        booking.event,
        booking.location,
        booking.eventDate,
        booking.packageName,
        booking.service,
        booking.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [bookings, query]);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">
          Booking
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Manage booked customer enquiries, event details, packages, and dates.
        </p>
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search bookings"
              className="w-full bg-transparent font-inter text-sm text-[#16231f] outline-none placeholder:text-[#68746e]"
            />
          </label>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
          >
            <ListFilter className="h-5 w-5" aria-hidden="true" />
            Filter
          </button>
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

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Customer",
                  "Event",
                  "Service",
                  "Package",
                  "Location",
                  "Event Date",
                  "Status",
                  "Action",
                ].map((heading) => (
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <TableCell strong>{booking.customer}</TableCell>
                  <TableCell>{booking.event}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.packageName}</TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>{booking.eventDate}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-inter text-[13px] font-medium text-emerald-700">
                      {booking.status}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#0D5B46] bg-transparent text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                      aria-label={`View ${booking.customer} booking`}
                    >
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border-b border-[#edf1ee] px-4 py-10 text-center font-inter text-sm font-medium text-[#68746e]"
                  >
                    {status === "loading" ? "Loading bookings..." : "No booked enquiries found."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {selectedBooking ? (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/45 px-5 py-8 sm:py-10">
          <div className="my-auto max-h-[calc(100vh-4rem)] w-full max-w-xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-inter text-[20px] font-semibold text-[#16231f]">
                  Booking Detail
                </h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">
                  {selectedBooking.customer}
                </p>
                <p className="mt-1 font-inter text-sm font-semibold text-[#0D5B46]">
                  {formatBookingId(selectedBooking.id)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]"
                aria-label="Close booking detail"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Booking ID", formatBookingId(selectedBooking.id)],
                ["Customer", selectedBooking.customer],
                ["Event", selectedBooking.event],
                ["Service", selectedBooking.service],
                ["Package", selectedBooking.packageName],
                ["Location", selectedBooking.location],
                ["Guest Count", selectedBooking.guests],
                ["Event Date", selectedBooking.eventDate],
                ["Status", selectedBooking.status],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[10px] border border-[#dfe7e2] p-4">
                  <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                    {label}
                  </p>
                  <p className="mt-1 font-inter text-[15px] font-medium text-[#16231f]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[10px] border border-[#dfe7e2] p-4">
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                Notes
              </p>
              <p className="mt-2 font-inter text-[15px] leading-7 text-[#16231f]">
                {selectedBooking.notes}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mapVendorBooking(enquiry: VendorEnquiry): Booking {
  const details = getEnquiryDetails(enquiry.message);

  return {
    id: enquiry.id,
    customer: enquiry.customer.name,
    event: details.eventType ?? "Booked event",
    location: details.location ?? "Not provided",
    eventDate: details.eventDate ?? "Not provided",
    packageName: enquiry.packageName ?? details.packageName ?? "Custom quote",
    service: details.service ?? details.vendor ?? "Quote request",
    guests: details.guestCount ?? "Not provided",
    status: "Confirmed",
    notes: details.requirements ?? details.customerRequest ?? enquiry.message,
  };
}

function getEnquiryDetails(message: string) {
  return {
    service: getMessageField(message, "Service"),
    vendor: getMessageField(message, "Vendor"),
    packageName: getMessageField(message, "Package"),
    eventType: getMessageField(message, "Event Type"),
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

function formatBookingId(id: string) {
  return `BK-${id.slice(-6).toUpperCase()}`;
}

function TableCell({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <td
      className={`border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] ${
        strong ? "font-medium text-[#16231f]" : "text-[#68746e]"
      }`}
    >
      {children}
    </td>
  );
}
