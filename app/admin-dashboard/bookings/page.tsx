"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, Search, SlidersHorizontal, X } from "lucide-react";

type BookingStatus = "Confirmed" | "Completed" | "Pending";

type Booking = {
  id: string;
  customer: string;
  customerImage: string;
  vendor: string;
  event: string;
  eventDate: string;
  status: BookingStatus;
  amount: string;
  location: string;
};

const bookings: Booking[] = [
  {
    id: "BK-1024",
    customer: "Ayesha Khan",
    customerImage: "/images/profile-2.png",
    vendor: "Royal Moments Photography",
    event: "Sharma Wedding",
    eventDate: "12 Sep 2026",
    status: "Confirmed",
    amount: "GBP 1,500",
    location: "Mayfair, London",
  },
  {
    id: "BK-1025",
    customer: "Rohan Mehta",
    customerImage: "/images/couple.png",
    vendor: "Prime Venue Collection",
    event: "Engagement Celebration",
    eventDate: "18 Sep 2026",
    status: "Completed",
    amount: "GBP 2,200",
    location: "Manchester",
  },
  {
    id: "BK-1026",
    customer: "Sara Malik",
    customerImage: "/images/cm-2.png",
    vendor: "Signature Flavours Catering",
    event: "Birthday Celebration",
    eventDate: "02 Oct 2026",
    status: "Pending",
    amount: "GBP 4,200",
    location: "Bristol",
  },
];

export default function AdminBookingsPage() {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesQuery = [
        booking.id,
        booking.customer,
        booking.vendor,
        booking.event,
        booking.eventDate,
        booking.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter =
        filterBy === "all" || booking.status.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [filterBy, query]);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Bookings
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Track platform bookings by customer, vendor, event, date, and status.
        </p>
      </section>

      <SearchFilter
        query={query}
        setQuery={setQuery}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        placeholder="Search bookings"
        options={["Confirmed", "Completed", "Pending"]}
      />

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {["Booking Id", "Customer", "Vendor", "Event", "Event Date", "Status", "Action"].map((heading) => (
                  <TableHead key={heading}>{heading}</TableHead>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <ProfileCell image={booking.customerImage} name={booking.customer} detail="Customer" />
                  </td>
                  <TableCell>{booking.vendor}</TableCell>
                  <TableCell>{booking.event}</TableCell>
                  <TableCell>{booking.eventDate}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <ViewButton onClick={() => setSelectedBooking(booking)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedBooking ? (
        <Modal title="Booking Details" onClose={() => setSelectedBooking(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <ProfileCell
              image={selectedBooking.customerImage}
              name={selectedBooking.customer}
              detail="Customer"
              large
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Booking Id" value={selectedBooking.id} />
            <DetailItem label="Vendor" value={selectedBooking.vendor} />
            <DetailItem label="Event" value={selectedBooking.event} />
            <DetailItem label="Event Date" value={selectedBooking.eventDate} />
            <DetailItem label="Location" value={selectedBooking.location} />
            <DetailItem label="Amount" value={selectedBooking.amount} />
            <DetailItem label="Status" value={selectedBooking.status} />
          </div>
          <ModalClose onClick={() => setSelectedBooking(null)} />
        </Modal>
      ) : null}
    </div>
  );
}

function SearchFilter({
  query,
  setQuery,
  filterBy,
  setFilterBy,
  placeholder,
  options,
}: {
  query: string;
  setQuery: (value: string) => void;
  filterBy: string;
  setFilterBy: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
          <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent font-inter text-sm text-[#16231f] outline-none placeholder:text-[#68746e]"
          />
        </label>
        <label className="flex min-h-12 items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
          <SlidersHorizontal className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
          <select
            value={filterBy}
            onChange={(event) => setFilterBy(event.target.value)}
            className="bg-transparent font-inter text-sm font-medium text-[#0D5B46] outline-none"
          >
            <option value="all">Filter</option>
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

function ProfileCell({ image, name, detail, large = false }: { image: string; name: string; detail: string; large?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`relative flex-none overflow-hidden rounded-full bg-[#f5f7f4] ${large ? "h-16 w-16" : "h-11 w-11"}`}>
        <Image src={image} alt={name} fill sizes={large ? "64px" : "44px"} className="object-cover" />
      </span>
      <span>
        <span className="block whitespace-nowrap font-inter text-[14px] font-semibold text-[#16231f]">{name}</span>
        <span className="block whitespace-nowrap font-inter text-[12px] font-semibold text-gray-700/80">{detail}</span>
      </span>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-inter text-[13px] font-semibold capitalize text-black">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="whitespace-nowrap border-b border-[#edf1ee] px-4 py-3 font-inter text-[13px] font-medium text-[#16231f]">{children}</td>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#dfe7e2] p-4">
      <p className="font-inter text-[14px] font-medium capitalize tracking-[0.14em] text-black">{label}</p>
      <p className="mt-1 font-inter text-[14px] font-medium text-gray-700/50">{value}</p>
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

  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${className}`}>{status}</span>;
}

function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10">
      <Eye className="h-4 w-4" aria-hidden="true" />
      View
    </button>
  );
}

function ModalClose({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-6 flex justify-end">
      <button type="button" onClick={onClick} className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]">
        Close
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 py-8">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-inter text-[22px] font-semibold text-[#16231f]">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]" aria-label={`Close ${title}`}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
