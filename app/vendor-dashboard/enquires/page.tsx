"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, ListFilter, Search, Send, Trash2, X } from "lucide-react";

type Enquire = {
  id: number;
  customer: string;
  image: string;
  email: string;
  phone: string;
  service: string;
  event: string;
  eventDate: string;
  submitted: string;
  status: string;
  message: string;
};

const initialEnquires: Enquire[] = [
  {
    id: 1,
    customer: "Ayesha Khan",
    image: "/images/profile-1.png",
    email: "ayesha.khan@example.com",
    phone: "+44 7700 900124",
    service: "Photography",
    event: "Wedding",
    eventDate: "12 Sep 2026",
    submitted: "31 Aug 2026",
    status: "New",
    message: "Looking for full-day wedding photography and cinematic highlights.",
  },
  {
    id: 2,
    customer: "Hamza Malik",
    image: "/images/profile-2.png",
    email: "hamza.malik@example.com",
    phone: "+44 7700 900247",
    service: "Venue",
    event: "Engagement",
    eventDate: "18 Sep 2026",
    submitted: "30 Aug 2026",
    status: "Pending",
    message: "Needs an elegant venue for 150 guests with catering options.",
  },
  {
    id: 3,
    customer: "Sara Ahmed",
    image: "/images/profile-3.png",
    email: "sara.ahmed@example.com",
    phone: "+44 7700 900368",
    service: "Decor & Styling",
    event: "Baby Shower",
    eventDate: "24 Sep 2026",
    submitted: "29 Aug 2026",
    status: "Confirmed",
    message: "Soft floral decor, dessert table styling, and a welcome backdrop.",
  },
  {
    id: 4,
    customer: "Bilal Raza",
    image: "/images/profile-1.png",
    email: "bilal.raza@example.com",
    phone: "+44 7700 900481",
    service: "Entertainment",
    event: "Birthday",
    eventDate: "02 Oct 2026",
    submitted: "28 Aug 2026",
    status: "Review",
    message: "Birthday entertainment and sound setup for an evening event.",
  },
];

export default function EnquiresPage() {
  const [enquireRows, setEnquireRows] = useState(initialEnquires);
  const [query, setQuery] = useState("");
  const [selectedEnquire, setSelectedEnquire] = useState<Enquire | null>(null);
  const [responseEnquire, setResponseEnquire] = useState<Enquire | null>(null);
  const [enquireToDelete, setEnquireToDelete] = useState<Enquire | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

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
        enquire.event,
        enquire.eventDate,
        enquire.submitted,
        enquire.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [enquireRows, query]);

  const deleteEnquire = () => {
    if (!enquireToDelete) {
      return;
    }

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

      <section className="rounded-[16px] bg-white rounded-lg shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate rounded-md border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Customer",
                  "Service",
                  "Event",
                  "Event Date",
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
                    {enquire.event}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {enquire.eventDate}
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
                ["Event", selectedEnquire.event],
                ["Event Date", selectedEnquire.eventDate],
                ["Submitted", selectedEnquire.submitted],
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

            <div className="mt-4 rounded-[10px] border border-[#dfe7e2] p-4">
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                Message
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
                onClick={() => {
                  setResponseEnquire(null);
                  setResponseMessage("");
                }}
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
