"use client";

import { useMemo, useState } from "react";
import { Eye, ListFilter, Search, Trash2, X } from "lucide-react";

type Booking = {
  id: number;
  customer: string;
  event: string;
  location: string;
  eventDate: string;
  status: string;
  notes: string;
};

const initialBookings: Booking[] = [
  {
    id: 1,
    customer: "Ayesha Khan",
    event: "Wedding",
    location: "London Banquet Hall",
    eventDate: "12 Sep 2026",
    status: "Confirmed",
    notes: "Full-day photography booking with reception coverage.",
  },
  {
    id: 2,
    customer: "Hamza Malik",
    event: "Engagement",
    location: "Pearl Suite",
    eventDate: "18 Sep 2026",
    status: "Pending",
    notes: "Venue booking awaiting final guest count confirmation.",
  },
  {
    id: 3,
    customer: "Sara Ahmed",
    event: "Baby Shower",
    location: "Garden Lounge",
    eventDate: "24 Sep 2026",
    status: "Confirmed",
    notes: "Decor and dessert table setup confirmed for afternoon event.",
  },
  {
    id: 4,
    customer: "Bilal Raza",
    event: "Birthday",
    location: "Private Residence",
    eventDate: "02 Oct 2026",
    status: "Review",
    notes: "Entertainment package under review before final approval.",
  },
];

export default function BookingPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [query, setQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

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
        booking.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [bookings, query]);

  const cancelBooking = () => {
    if (!bookingToCancel) {
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.filter((booking) => booking.id !== bookingToCancel.id),
    );
    setBookingToCancel(null);
  };

  const cancelSelectedBooking = () => {
    if (!selectedBooking) {
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.filter((booking) => booking.id !== selectedBooking.id),
    );
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">
          Booking
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Manage customer bookings, event locations, dates, status updates, and
          cancellation requests from a focused dashboard table.
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

      <section className="rounded-[16px] bg-white rounded-lg shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Customer",
                  "Event",
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
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] font-medium text-[#16231f]">
                    {booking.customer}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {booking.event}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {booking.location}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {booking.eventDate}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <span className="rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-[13px] font-medium text-[#0D5B46]">
                      {booking.status}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#0D5B46] bg-transparent text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                        aria-label={`View ${booking.customer} booking`}
                      >
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingToCancel(booking)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                        aria-label={`Cancel ${booking.customer} booking`}
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedBooking ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-5">
          <div className="w-full max-w-xl rounded-[16px] bg-white p-6 shadow-2xl">
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
                ["Location", selectedBooking.location],
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

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelSelectedBooking}
                className="rounded-md bg-red-600 px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Cancel Booking
              </button>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {bookingToCancel ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl">
            <h3 className="font-inter text-[20px] font-semibold text-[#16231f]">
              Delete Booking
            </h3>
            <p className="mt-3 font-inter text-[15px] leading-7 text-[#68746e]">
              Are you sure you want to delete the booking for{" "}
              <span className="font-semibold text-[#16231f]">
                {bookingToCancel.customer}
              </span>
              ? This will remove the row from the table.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={cancelBooking}
                className="rounded-md bg-red-600 px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatBookingId(id: number) {
  return `BK-${String(id).padStart(3, "0")}`;
}
