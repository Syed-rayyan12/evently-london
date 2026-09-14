"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarCheck2,
  Eye,
  MessageSquareText,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  bookCustomerEnquiry,
  listCustomerEnquiries,
  type CustomerEnquiry
} from "@/lib/customer";
import { getCustomerProfileSession } from "@/lib/customer-session";

type EnquiryStatus = "New" | "Replied" | "Booked" | "Closed";

type Enquiry = {
  id: string;
  vendor: string;
  vendorType: string;
  vendorImage: string;
  eventType: string;
  packageName: string;
  service: string;
  eventDate: string;
  submitted: string;
  status: EnquiryStatus;
  requirement: string;
  vendorResponse: string;
  respondedAt: string;
};

export default function CustomerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "idle" | "error">("loading");
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setLoadStatus("error");
        setMessage("Customer login is required to load enquiries.");
      });
      return;
    }

    void listCustomerEnquiries(session)
      .then((result) => {
        setEnquiries(result.enquiries.map(mapCustomerEnquiry));
        setLoadStatus("idle");
        setMessage("");
      })
      .catch((error) => {
        setLoadStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load enquiries.");
      });
  }, []);

  const filteredEnquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const visibleRows = normalizedQuery
      ? enquiries.filter((enquiry) =>
          [
            enquiry.vendor,
            enquiry.vendorType,
            enquiry.eventType,
            enquiry.packageName,
            enquiry.service,
            enquiry.eventDate,
            enquiry.submitted,
            enquiry.status,
            enquiry.vendorResponse,
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

      return b.submitted.localeCompare(a.submitted);
    });
  }, [enquiries, query, sortBy]);

  async function handleBookNow(enquiry: Enquiry) {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      setLoadStatus("error");
      setMessage("Customer login is required to book an enquiry.");
      return;
    }

    setBookingId(enquiry.id);
    setMessage("");

    try {
      const result = await bookCustomerEnquiry(enquiry.id, session);
      const bookedEnquiry = mapCustomerEnquiry(result.enquiry);

      setEnquiries((current) =>
        current.map((item) => (item.id === bookedEnquiry.id ? bookedEnquiry : item))
      );
      setSelectedEnquiry((current) =>
        current?.id === bookedEnquiry.id ? bookedEnquiry : current
      );
      setLoadStatus("idle");
      setMessage("Booking sent to the vendor.");
      window.dispatchEvent(new Event("evently.customer.updated"));
    } catch (error) {
      setLoadStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to book this enquiry.");
    } finally {
      setBookingId(null);
    }
  }

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

      {message ? (
        <section
          className={`rounded-[12px] px-4 py-3 font-inter text-sm font-semibold ${
            loadStatus === "error"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
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
                  "Vendor",
                  "Event Type",
                  "Package",
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
                          unoptimized={isUnoptimizedImage(enquiry.vendorImage)}
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
                  <TableCell>{enquiry.eventType}</TableCell>
                  <TableCell>{enquiry.packageName}</TableCell>
                  <TableCell>{enquiry.service}</TableCell>
                  <TableCell>{enquiry.eventDate}</TableCell>
                  <TableCell>{enquiry.submitted}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={enquiry.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        View
                      </button>
                      {canBookEnquiry(enquiry) ? (
                        <button
                          type="button"
                          onClick={() => handleBookNow(enquiry)}
                          disabled={bookingId === enquiry.id}
                          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-3 font-inter text-[13px] font-semibold text-white transition-colors hover:bg-[#C07C22] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
                          {bookingId === enquiry.id ? "Booking..." : "Book Now"}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border-b border-[#edf1ee] px-4 py-10 text-center font-inter text-sm font-medium text-[#68746e]"
                  >
                    {loadStatus === "loading" ? "Loading enquiries..." : "No enquiries found."}
                  </td>
                </tr>
              ) : null}
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
                  unoptimized={isUnoptimizedImage(selectedEnquiry.vendorImage)}
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
            <DetailItem label="Event Type" value={selectedEnquiry.eventType} />
            <DetailItem label="Package" value={selectedEnquiry.packageName} />
            <DetailItem label="Service" value={selectedEnquiry.service} />
            <DetailItem label="Event Date" value={selectedEnquiry.eventDate} />
            <DetailItem label="Submitted" value={selectedEnquiry.submitted} />
            <DetailItem label="Responded" value={selectedEnquiry.respondedAt} />
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

          <div className="mt-4 rounded-[12px] bg-emerald-50 p-4">
            <p className="flex items-center gap-2 font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Vendor Response
            </p>
            <p className="mt-2 font-inter text-[15px] leading-7 text-emerald-950">
              {selectedEnquiry.vendorResponse}
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              Close
            </button>
            {canBookEnquiry(selectedEnquiry) ? (
              <button
                type="button"
                onClick={() => handleBookNow(selectedEnquiry)}
                disabled={bookingId === selectedEnquiry.id}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C07C22] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#01241D] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
                {bookingId === selectedEnquiry.id ? "Booking..." : "Book Now"}
              </button>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function mapCustomerEnquiry(enquiry: CustomerEnquiry): Enquiry {
  const details = getEnquiryDetails(enquiry.message);
  const vendorProfile = enquiry.vendor?.vendorProfile;

  return {
    id: enquiry.id,
    vendor: vendorProfile?.vendorName ?? enquiry.vendor?.name ?? enquiry.vendor?.email ?? "Vendor",
    vendorType: vendorProfile?.category ?? "Vendor",
    vendorImage: vendorProfile?.imageUrl ?? "/images/profile-2.png",
    eventType: details.eventType ?? "Not provided",
    packageName: enquiry.packageName ?? details.packageName ?? "Custom quote",
    service: details.service ?? details.vendor ?? "Quote request",
    eventDate: details.eventDate ?? "Not provided",
    submitted: formatDate(enquiry.createdAt),
    status: mapStatus(enquiry.status, enquiry.vendorResponse),
    requirement: details.requirements ?? details.customerRequest ?? enquiry.message,
    vendorResponse: enquiry.vendorResponse ?? "No vendor response yet.",
    respondedAt: enquiry.respondedAt ? formatDate(enquiry.respondedAt) : "Not replied yet",
  };
}

function getEnquiryDetails(message: string) {
  return {
    service: getMessageField(message, "Service"),
    vendor: getMessageField(message, "Vendor"),
    packageName: getMessageField(message, "Package"),
    eventType: getMessageField(message, "Event Type"),
    eventDate: getMessageField(message, "Event Date"),
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

function mapStatus(status: string, vendorResponse: string | null): EnquiryStatus {
  if (status.toLowerCase() === "booked") {
    return "Booked";
  }

  if (vendorResponse || status.toLowerCase() === "replied") {
    return "Replied";
  }

  if (status.toLowerCase() === "closed") {
    return "Closed";
  }

  return "New";
}

function canBookEnquiry(enquiry: Enquiry) {
  return enquiry.status === "Replied" && enquiry.vendorResponse !== "No vendor response yet.";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function isUnoptimizedImage(src: string) {
  return src.startsWith("blob:") || src.startsWith("data:");
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
      <p className="font-inter text-[14px] font-medium capitalize tracking-[0.14em] text-[#000]">
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
        : status === "Booked"
          ? "bg-emerald-50 text-emerald-700"
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
