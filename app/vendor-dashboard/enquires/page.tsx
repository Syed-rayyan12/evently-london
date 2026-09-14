"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Eye, ListFilter, Search, Send, Trash2, X } from "lucide-react";
import {
  deleteVendorEnquiry,
  listVendorEnquiries,
  respondToVendorEnquiry,
  type VendorEnquiry
} from "@/lib/auth";
import { getVendorProfileSession } from "@/lib/vendor-session";

type Enquire = {
  id: string;
  customer: string;
  image: string;
  email: string;
  phone: string;
  service: string;
  packageName: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  location: string;
  submitted: string;
  status: string;
  message: string;
  vendorResponse: string;
  respondedAt: string;
};

export default function EnquiresPage() {
  const [enquireRows, setEnquireRows] = useState<Enquire[]>([]);
  const [query, setQuery] = useState("");
  const [selectedEnquire, setSelectedEnquire] = useState<Enquire | null>(null);
  const [responseEnquire, setResponseEnquire] = useState<Enquire | null>(null);
  const [enquireToDelete, setEnquireToDelete] = useState<Enquire | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Vendor login is required to load enquiries.");
      });
      return;
    }

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        return listVendorEnquiries(session);
      })
      .then((result) => {
        setEnquireRows(result.enquiries.map(mapVendorEnquiry));
        setStatus("success");
        setMessage("");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load enquiries.");
      });
  }, []);

  const filteredEnquires = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return enquireRows;
    }

    return enquireRows.filter((enquire) =>
      [
        enquire.customer,
        enquire.email,
        enquire.phone,
        enquire.service,
        enquire.packageName,
        enquire.eventType,
        enquire.eventDate,
        enquire.guestCount,
        enquire.location,
        enquire.message,
        enquire.submitted,
        enquire.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [enquireRows, query]);

  const deleteEnquire = async () => {
    if (!enquireToDelete) {
      return;
    }

    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to delete enquiries.");
      return;
    }

    try {
      await deleteVendorEnquiry(enquireToDelete.id, session);
      setEnquireRows((currentRows) =>
        currentRows.filter((row) => row.id !== enquireToDelete.id),
      );
      if (selectedEnquire?.id === enquireToDelete.id) {
        setSelectedEnquire(null);
      }
      if (responseEnquire?.id === enquireToDelete.id) {
        setResponseEnquire(null);
      }
      setEnquireToDelete(null);
      setStatus("success");
      setMessage("Enquiry deleted.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to delete enquiry.");
    }
  };

  const sendResponse = async () => {
    if (!responseEnquire) {
      return;
    }

    const session = getVendorProfileSession();
    const trimmedMessage = responseMessage.trim();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to respond to enquiries.");
      return;
    }

    if (!trimmedMessage) {
      setStatus("error");
      setMessage("Please write a response message before sending.");
      return;
    }

    try {
      const result = await respondToVendorEnquiry(
        responseEnquire.id,
        { message: trimmedMessage },
        session
      );
      const nextRow = mapVendorEnquiry(result.enquiry);

      setEnquireRows((currentRows) =>
        currentRows.map((row) => (row.id === nextRow.id ? nextRow : row))
      );
      if (selectedEnquire?.id === nextRow.id) {
        setSelectedEnquire(nextRow);
      }
      setResponseEnquire(null);
      setResponseMessage("");
      setStatus("success");
      setMessage("Response sent to customer.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send response.");
    }
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">
          Enquiries
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Review customer enquiries, service requests, submitted dates, and
          event details from one clear table.
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
              placeholder="Search enquires"
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
            status === "error"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
          aria-live="polite"
        >
          {message}
        </section>
      ) : null}

      <section className="rounded-[16px] bg-white rounded-lg shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] border-separate rounded-md border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Customer",
                  "Service",
                  "Package",
                  "Event Type",
                  "Event Date",
                  "Guests",
                  "Location",
                  "Submitted",
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
              {filteredEnquires.map((enquire) => (
                <tr key={enquire.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="relative h-11 w-11 flex-none overflow-hidden rounded-full bg-[#f5f7f4]">
                        <Image
                          src={enquire.image}
                          alt={enquire.customer}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                      <span className="font-inter text-[15px] font-medium text-[#16231f]">
                        {enquire.customer}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.service}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.packageName}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.eventType}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.eventDate}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.guestCount}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.location}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.submitted}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <span className="rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-[13px] font-medium text-[#0D5B46]">
                      {enquire.status}
                    </span>
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquire(enquire)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#0D5B46] bg-transparent text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                        aria-label={`View ${enquire.customer} enquire`}
                      >
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setResponseEnquire(enquire)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#0D5B46] bg-transparent text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                        aria-label={`Respond to ${enquire.customer} message`}
                      >
                        <Send className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnquireToDelete(enquire)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                        aria-label={`Delete ${enquire.customer} enquire`}
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEnquires.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="border-b border-[#edf1ee] px-4 py-10 text-center font-inter text-sm font-medium text-[#68746e]"
                  >
                    {status === "loading" ? "Loading enquiries..." : "No enquiries found."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {selectedEnquire ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-5">
          <div className="w-full max-w-xl rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-inter text-[20px] font-semibold text-[#16231f]">
                  Enquire Detail
                </h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">
                  {selectedEnquire.customer}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquire(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]"
                aria-label="Close enquire detail"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Email", selectedEnquire.email],
                ["Phone Number", selectedEnquire.phone],
                ["Service", selectedEnquire.service],
                ["Package", selectedEnquire.packageName],
                ["Event Type", selectedEnquire.eventType],
                ["Event Date", selectedEnquire.eventDate],
                ["Guest Count", selectedEnquire.guestCount],
                ["Location", selectedEnquire.location],
                ["Submitted", selectedEnquire.submitted],
                ["Responded", selectedEnquire.respondedAt],
                ["Status", selectedEnquire.status],
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

            {selectedEnquire.vendorResponse !== "Not replied yet" ? (
              <div className="mt-4 rounded-[10px] border border-[#dfe7e2] p-4">
                <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                  Your Response
                </p>
                <p className="mt-2 font-inter text-[15px] leading-7 text-[#16231f]">
                  {selectedEnquire.vendorResponse}
                </p>
              </div>
            ) : null}

            <div className="mt-4 rounded-[10px] border border-[#dfe7e2] p-4">
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                Requirements
              </p>
              <p className="mt-2 font-inter text-[15px] leading-7 text-[#16231f]">
                {selectedEnquire.message}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {responseEnquire ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5">
          <div className="w-full max-w-lg rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-inter text-[20px] font-semibold text-[#16231f]">
                 Respond to Enquiry
                </h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">
                  Replying to {responseEnquire.customer}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResponseEnquire(null);
                  setResponseMessage("");
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]"
                aria-label="Close response modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <label className="mt-6 block">
              <span className="font-inter text-sm font-medium text-[#16231f]">
                Message
              </span>
              <textarea
                value={responseMessage}
                onChange={(event) => setResponseMessage(event.target.value)}
                placeholder="Write your response..."
                className="mt-2 min-h-36 w-full resize-none rounded-[10px] border border-[#0D5B46] bg-white px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none placeholder:text-[#68746e]"
              />
            </label>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setResponseEnquire(null);
                  setResponseMessage("");
                }}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendResponse}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#001B12]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send Response
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {enquireToDelete ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl">
            <h3 className="font-inter text-[20px] font-semibold text-[#16231f]">
              Delete Enquire
            </h3>
            <p className="mt-3 font-inter text-[15px] leading-7 text-[#68746e]">
              Are you sure you want to delete the enquiry from{" "}
              <span className="font-semibold text-[#16231f]">
                {enquireToDelete.customer}
              </span>
              ? This will remove the row from the table.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEnquireToDelete(null)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteEnquire}
                className="rounded-md bg-red-600 px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
               Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mapVendorEnquiry(enquiry: VendorEnquiry): Enquire {
  const details = getEnquiryDetails(enquiry.message);

  return {
    id: enquiry.id,
    customer: enquiry.customer.name,
    image: "/images/profile-2.png",
    email: enquiry.customer.email,
    phone: enquiry.customer.phone ?? "Not provided",
    service: details.service ?? details.vendor ?? "Quote request",
    packageName: enquiry.packageName ?? details.packageName ?? "Custom quote",
    eventType: details.eventType ?? "Not provided",
    eventDate: details.eventDate ?? "Not provided",
    guestCount: details.guestCount ?? "Not provided",
    location: details.location ?? "Not provided",
    submitted: formatDate(enquiry.createdAt),
    status: formatStatus(enquiry.status),
    message: details.requirements ?? details.customerRequest ?? enquiry.message,
    vendorResponse: enquiry.vendorResponse ?? "Not replied yet",
    respondedAt: enquiry.respondedAt ? formatDate(enquiry.respondedAt) : "Not replied yet"
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
    customerRequest: getCustomerRequest(message)
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}
