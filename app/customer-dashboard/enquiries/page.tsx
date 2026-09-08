"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Eye,
  MessageSquareText,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type EnquiryStatus = "New" | "Replied" | "Closed";

type Enquiry = {
  id: number;
  vendor: string;
  vendorType: string;
  vendorImage: string;
  event: string;
  service: string;
  eventDate: string;
  submitted: string;
  status: EnquiryStatus;
  requirement: string;
};

const enquiries: Enquiry[] = [
  {
    id: 1,
    vendor: "Royal Moments Photography",
    vendorType: "Photography",
    vendorImage: "/images/mej.png",
    event: "Sharma Wedding",
    service: "Wedding Photography",
    eventDate: "12 Sep 2026",
    submitted: "01 Sep 2026",
    status: "New",
    requirement:
      "Need full-day wedding coverage, couple portraits, family sessions, and a cinematic highlight video.",
  },
  {
    id: 2,
    vendor: "Prime Venue Collection",
    vendorType: "Venue",
    vendorImage: "/images/venue.png",
    event: "Engagement Celebration",
    service: "Venue Booking",
    eventDate: "18 Sep 2026",
    submitted: "31 Aug 2026",
    status: "Replied",
    requirement:
      "Looking for a refined hall with seating for 120 guests, stage area, and parking access.",
  },
  {
    id: 3,
    vendor: "Signature Flavours Catering",
    vendorType: "Catering",
    vendorImage: "/images/card-4.png",
    event: "Birthday Celebration",
    service: "Dinner Catering",
    eventDate: "02 Oct 2026",
    submitted: "30 Aug 2026",
    status: "Closed",
    requirement:
      "Buffet menu for 75 guests with vegetarian options and dessert table service.",
  },
];

export default function AdminEnquiriesPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filteredEnquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const visibleRows = normalizedQuery
      ? enquiries.filter((enquiry) =>
          [
            enquiry.vendor,
            enquiry.vendorType,
            enquiry.event,
            enquiry.service,
            enquiry.eventDate,
            enquiry.submitted,
            enquiry.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : enquiries;

    return [...visibleRows].sort((a, b) => {
      if (sortBy === "vendor") {
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
          My Enquiries
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Track vendor enquiries, submitted dates, event services, and response
          status from one dashboard table.
        </p>
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search enquiries"
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
              <option value="vendor">Vendor</option>
              <option value="status">Status</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Vendor",
                  "Events",
                  "Services",
                  "Event Date",
                  "Submitted",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-4 py-2.5 font-inter text-[12px] font-semibold capitalize text-black"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 flex-none overflow-hidden rounded-[10px] bg-[#f5f7f4]">
                        <Image
                          src={enquiry.vendorImage}
                          alt={enquiry.vendor}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block whitespace-nowrap font-inter text-[13px] font-semibold text-[#16231f]">
                          {enquiry.vendor}
                        </span>
                        <span className="block whitespace-nowrap font-inter text-[12px] text-[#68746e]">
                          {enquiry.vendorType}
                        </span>
                      </span>
                    </div>
                  </td>
                  <TableCell>{enquiry.event}</TableCell>
                  <TableCell>{enquiry.service}</TableCell>
                  <TableCell>{enquiry.eventDate}</TableCell>
                  <TableCell>{enquiry.submitted}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={enquiry.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedEnquiry ? (
        <Modal title="View Enquiry" onClose={() => setSelectedEnquiry(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-16 flex-none overflow-hidden rounded-[12px] bg-[#f5f7f4]">
                <Image
                  src={selectedEnquiry.vendorImage}
                  alt={selectedEnquiry.vendor}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div>
                <h3 className="mt-1 font-inter text-[18px] font-semibold text-[#16231f]">
                  {selectedEnquiry.vendor}
                </h3>
                <p className="font-inter text-[13px] font-semibold text-gray-700/80">
                  {selectedEnquiry.vendorType}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Event" value={selectedEnquiry.event} />
            <DetailItem label="Service" value={selectedEnquiry.service} />
            <DetailItem label="Event Date" value={selectedEnquiry.eventDate} />
            <DetailItem label="Submitted" value={selectedEnquiry.submitted} />
            <DetailItem label="Status" value={selectedEnquiry.status} />
          </div>

          <div className="mt-4 rounded-[12px] bg-blue-50 p-4">
            <p className="flex items-center gap-2 font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-700">
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Requirement
            </p>
            <p className="mt-2 font-inter text-[15px] leading-7 text-blue-950">
              {selectedEnquiry.requirement}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
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

function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="whitespace-nowrap border-b border-[#edf1ee] px-4 py-3 font-inter text-[13px] font-medium text-[#16231f]">
      {children}
    </td>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#dfe7e2] p-4">
      <p className="font-inter text-[14px] font-medium captialize tracking-[0.14em] text-[#000]">
        {label}
      </p>
      <p className="mt-1 font-inter text-[14px] font-medium text-gray-700/50">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
  const className =
    status === "New"
      ? "bg-rose-50 text-rose-700"
      : status === "Replied"
        ? "bg-blue-50 text-blue-700"
        : "bg-gray-100 text-gray-500";

  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${className}`}>
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

