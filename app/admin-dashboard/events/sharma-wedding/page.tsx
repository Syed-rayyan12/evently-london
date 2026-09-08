"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const initialEvent = {
  name: "Sharma Wedding",
  type: "Wedding",
  vendor: "Royal Moments Photography",
  date: "12 Sep 2026",
  location: "Mayfair, London",
  guests: "180",
  budget: "GBP 24,000",
};

const vendorOptions = [
  "Royal Moments Photography",
  "Prime Venue Collection",
  "Signature Flavours Catering",
  "Golden Petals Events",
  "DJ Infinity",
];

const vendors = [
  {
    name: "Royal Moments Photography",
    service: "Photography",
    status: "Confirmed",
    image: "/images/mej.png",
  },
  {
    name: "Prime Venue Collection",
    service: "Venue",
    status: "New",
    image: "/images/venue.png",
  },
  {
    name: "Signature Flavours Catering",
    service: "Catering",
    status: "Confirmed",
    image: "/images/card-4.png",
  },
  {
    name: "Golden Petals Events",
    service: "Decor & Styling",
    status: "New",
    image: "/images/card-2.png",
  },
];

const enquiries = [
  {
    vendor: "Royal Moments Photography",
    service: "Photography",
    submitted: "01 Sep 2026",
    status: "New",
  },
  {
    vendor: "Prime Venue Collection",
    service: "Venue",
    submitted: "31 Aug 2026",
    status: "Replied",
  },
  {
    vendor: "Signature Flavours Catering",
    service: "Catering",
    submitted: "30 Aug 2026",
    status: "Closed",
  },
];

const bookings = [
  {
    vendor: "Royal Moments Photography",
    service: "Photography",
    date: "12 Sep 2026",
    amount: "GBP 1,500",
    status: "Confirmed",
  },
  {
    vendor: "Signature Flavours Catering",
    service: "Catering",
    date: "12 Sep 2026",
    amount: "GBP 4,200",
    status: "Pending",
  },
  {
    vendor: "Golden Petals Events",
    service: "Decor & Styling",
    date: "11 Sep 2026",
    amount: "GBP 2,800",
    status: "Confirmed",
  },
];

export default function EventDetailPage() {
  const [eventInfo, setEventInfo] = useState(initialEvent);
  const [editInfo, setEditInfo] = useState(initialEvent);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openEditModal = () => {
    setEditInfo(eventInfo);
    setIsEditOpen(true);
  };

  const saveEvent = () => {
    setEventInfo(editInfo);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin-dashboard/events"
              className="mb-4 inline-flex items-center gap-2 font-inter text-[14px] font-semibold text-[#0D5B46] underline decoration-[#0D5B46] decoration-2 underline-offset-4"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              My Events
            </Link>
            <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
              {eventInfo.name}
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              View event details, assigned vendors, enquiry status, and booking
              information for this plan.
            </p>
          </div>
          <div className="flex flex-row flex-nowrap items-center gap-3">
            <button
              type="button"
              onClick={openEditModal}
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-[#0D5B46] px-5 font-inter text-[14px] font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit Event
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-[#b42318] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#8f1d14]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete Event
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
          Event Overview
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <OverviewItem label="Event Name" value={eventInfo.name} />
          <OverviewItem label="Event Type" value={eventInfo.type} noBorder />
          <OverviewItem label="Choose Vendor" value={eventInfo.vendor} />
          <OverviewItem label="Date" value={eventInfo.date} />
          <OverviewItem label="Location" value={eventInfo.location} />
          <OverviewItem label="Guests" value={`${eventInfo.guests} guests`} />
          <OverviewItem label="Budget" value={eventInfo.budget} />
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
            Event Vendors
          </h3>
          <p className="font-inter text-[14px] font-semibold text-[#0D5B46]">
            Total Count: 4 Vendors Involved
          </p>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {vendors.map((vendor) => (
            <article
              key={vendor.name}
              className="flex gap-4 rounded-[12px] border border-[#dfe7e2] p-4"
            >
              <div className="relative h-24 w-24 flex-none overflow-hidden rounded-[10px] bg-[#f5f7f4]">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-inter text-[16px] font-semibold text-[#16231f]">
                      {vendor.name}
                    </h4>
                    <p className="mt-1 font-inter text-[14px] text-[#68746e]">
                      {vendor.service}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-inter text-xs font-semibold ${
                      vendor.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>
                <Link
                  href="/vendor/royal-moments-photography"
                  className="mt-4 inline-flex rounded-[10px] border border-black px-4 py-2 font-inter text-[13px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
                >
                  View Profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[14px] bg-white shadow-xl shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-5 py-4">
          <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
            Event Enquiries
          </h3>
        </div>
        <DashboardTable
          headings={["Vendor", "Service", "Submitted", "Status"]}
          rows={enquiries.map((enquiry) => [
            enquiry.vendor,
            enquiry.service,
            enquiry.submitted,
            <StatusBadge key={enquiry.vendor} status={enquiry.status} />,
          ])}
        />
      </section>

      <section className="rounded-[14px] bg-white shadow-xl shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-5 py-4">
          <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
            Event Bookings
          </h3>
        </div>
        <DashboardTable
          headings={["Vendor", "Service", "Date", "Amount", "Status"]}
          rows={bookings.map((booking) => [
            booking.vendor,
            booking.service,
            booking.date,
            booking.amount,
            <StatusBadge key={booking.vendor} status={booking.status} />,
          ])}
        />
      </section>

      {isEditOpen ? (
        <EventModal title="Edit Event" onClose={() => setIsEditOpen(false)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalInput
              label="What are you planning?"
              value={editInfo.type}
              onChange={(value) =>
                setEditInfo((current) => ({ ...current, type: value }))
              }
            />
            <ModalInput
              label="Event Name"
              value={editInfo.name}
              onChange={(value) =>
                setEditInfo((current) => ({ ...current, name: value }))
              }
            />
            <label className="block">
              <span className="font-inter text-[13px] font-semibold text-[#16231f]">
                Choose Vendor
              </span>
              <select
                value={editInfo.vendor}
                onChange={(event) =>
                  setEditInfo((current) => ({
                    ...current,
                    vendor: event.target.value,
                  }))
                }
                className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
              >
                {vendorOptions.map((vendor) => (
                  <option key={vendor} value={vendor}>
                    {vendor}
                  </option>
                ))}
              </select>
            </label>
            <ModalInput
              label="Event Date"
              value={editInfo.date}
              onChange={(value) =>
                setEditInfo((current) => ({ ...current, date: value }))
              }
            />
            <ModalInput
              label="Location"
              value={editInfo.location}
              onChange={(value) =>
                setEditInfo((current) => ({ ...current, location: value }))
              }
            />
            <ModalInput
              label="Number of Guests"
              value={editInfo.guests}
              onChange={(value) =>
                setEditInfo((current) => ({ ...current, guests: value }))
              }
            />
            <ModalInput
              label="Estimated Budget"
              value={editInfo.budget}
              onChange={(value) =>
                setEditInfo((current) => ({ ...current, budget: value }))
              }
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#f5f7f4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEvent}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              Save Event
            </button>
          </div>
        </EventModal>
      ) : null}

      {isDeleteOpen ? (
        <EventModal title="Delete Event" onClose={() => setIsDeleteOpen(false)}>
          <p className="font-inter text-[15px] leading-7 text-[#68746e]">
            Are you sure you want to delete {eventInfo.name}? This action cannot
            be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#f5f7f4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-md bg-[#b42318] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#8f1d14]"
            >
              Delete Event
            </button>
          </div>
        </EventModal>
      ) : null}
    </div>
  );
}

function OverviewItem({
  label,
  value,
  noBorder = false,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) {
  return (
    <div className={`rounded-[12px] p-4 ${noBorder ? "" : "border border-[#dfe7e2]"}`}>
      <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
        {label}
      </p>
      <p className="mt-1 font-inter text-[15px] font-semibold text-[#16231f]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "New"
      ? "bg-rose-50 text-rose-700"
      : status === "Replied"
        ? "bg-blue-50 text-blue-700"
        : status === "Closed"
          ? "bg-gray-100 text-gray-500"
          : status === "Confirmed"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 font-inter text-xs font-semibold ${className}`}>
      {status}
    </span>
  );
}

function DashboardTable({
  headings,
  rows,
}: {
  headings: string[];
  rows: Array<Array<string | ReactNode>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
        <thead>
          <tr className="bg-[#f5f7f4]">
            {headings.map((heading) => (
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
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-[#edf1ee] px-5 py-4 font-inter text-[15px] font-medium text-[#16231f]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventModal({
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
          <h3 className="font-inter text-[22px] font-semibold text-[#16231f]">
            {title}
          </h3>
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

function ModalInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-inter text-[13px] font-semibold text-[#16231f]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      />
    </label>
  );
}
