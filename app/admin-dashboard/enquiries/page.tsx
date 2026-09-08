"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, MessageSquareText, Search, SlidersHorizontal, X } from "lucide-react";

type EnquiryStatus = "New" | "Replied" | "Closed";

type Enquiry = {
  id: number;
  customer: string;
  customerImage: string;
  vendor: string;
  event: string;
  category: string;
  eventDate: string;
  submitted: string;
  status: EnquiryStatus;
  requirement: string;
};

const enquiries: Enquiry[] = [
  {
    id: 1,
    customer: "Ayesha Khan",
    customerImage: "/images/profile-2.png",
    vendor: "Royal Moments Photography",
    event: "Sharma Wedding",
    category: "Photography",
    eventDate: "12 Sep 2026",
    submitted: "01 Sep 2026",
    status: "New",
    requirement:
      "Customer requested full-day wedding photography, family portraits, and a cinematic highlight film.",
  },
  {
    id: 2,
    customer: "Rohan Mehta",
    customerImage: "/images/couple.png",
    vendor: "Prime Venue Collection",
    event: "Engagement Celebration",
    category: "Venue",
    eventDate: "18 Sep 2026",
    submitted: "31 Aug 2026",
    status: "Replied",
    requirement:
      "Customer needs a venue for 120 guests with stage setup, parking, and dinner service access.",
  },
  {
    id: 3,
    customer: "Sara Malik",
    customerImage: "/images/cm-2.png",
    vendor: "Signature Flavours Catering",
    event: "Birthday Celebration",
    category: "Catering",
    eventDate: "02 Oct 2026",
    submitted: "30 Aug 2026",
    status: "Closed",
    requirement:
      "Customer requested buffet catering with vegetarian options and dessert table service.",
  },
];

export default function AdminEnquiriesPage() {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filteredEnquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesQuery = [
        enquiry.customer,
        enquiry.vendor,
        enquiry.event,
        enquiry.category,
        enquiry.eventDate,
        enquiry.submitted,
        enquiry.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter =
        filterBy === "all" || enquiry.status.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [filterBy, query]);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Enquiries
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Track customer enquiries by vendor, event, category, submitted date,
          and status.
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
              value={filterBy}
              onChange={(event) => setFilterBy(event.target.value)}
              className="bg-transparent font-inter text-sm font-medium text-[#0D5B46] outline-none"
            >
              <option value="all">Filter</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Customer Name",
                  "Vendor Name",
                  "Events",
                  "Category",
                  "Event Date",
                  "Submitted",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-4 py-3 font-inter text-[13px] font-semibold capitalize text-black"
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
                    <ProfileCell
                      image={enquiry.customerImage}
                      name={enquiry.customer}
                      detail="Customer"
                    />
                  </td>
                  <TableCell>{enquiry.vendor}</TableCell>
                  <TableCell>{enquiry.event}</TableCell>
                  <TableCell>{enquiry.category}</TableCell>
                  <TableCell>{enquiry.eventDate}</TableCell>
                  <TableCell>{enquiry.submitted}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={enquiry.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10"
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
            <ProfileCell
              image={selectedEnquiry.customerImage}
              name={selectedEnquiry.customer}
              detail="Customer"
              large
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Vendor" value={selectedEnquiry.vendor} />
            <DetailItem label="Event" value={selectedEnquiry.event} />
            <DetailItem label="Category" value={selectedEnquiry.category} />
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

          <ModalClose onClick={() => setSelectedEnquiry(null)} />
        </Modal>
      ) : null}
    </div>
  );
}

function ProfileCell({
  image,
  name,
  detail,
  large = false,
}: {
  image: string;
  name: string;
  detail: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`relative flex-none overflow-hidden rounded-full bg-[#f5f7f4] ${
          large ? "h-16 w-16" : "h-11 w-11"
        }`}
      >
        <Image src={image} alt={name} fill sizes={large ? "64px" : "44px"} className="object-cover" />
      </span>
      <span>
        <span className="block whitespace-nowrap font-inter text-[14px] font-semibold text-[#16231f]">
          {name}
        </span>
        <span className="block whitespace-nowrap font-inter text-[12px] font-semibold text-gray-700/80">
          {detail}
        </span>
      </span>
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
      <p className="font-inter text-[14px] font-medium capitalize tracking-[0.14em] text-black">
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

function ModalClose({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-6 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
      >
        Close
      </button>
    </div>
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
