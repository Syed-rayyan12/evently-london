"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, Search, SlidersHorizontal, X } from "lucide-react";

type UserStatus = "Active" | "Inactive" | "Blocked";

type Customer = {
  id: number;
  name: string;
  image: string;
  joinDate: string;
  email: string;
  events: number;
  savedVendors: number;
  enquiries: number;
  bookings: number;
  status: UserStatus;
};

const customers: Customer[] = [
  {
    id: 1,
    name: "Ayesha Khan",
    image: "/images/profile-2.png",
    joinDate: "12 Jan 2026",
    email: "ayesha@example.com",
    events: 3,
    savedVendors: 18,
    enquiries: 9,
    bookings: 4,
    status: "Active",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    image: "/images/couple.png",
    joinDate: "04 Mar 2026",
    email: "rohan@example.com",
    events: 2,
    savedVendors: 11,
    enquiries: 6,
    bookings: 2,
    status: "Active",
  },
  {
    id: 3,
    name: "Sara Malik",
    image: "/images/cm-2.png",
    joinDate: "19 May 2026",
    email: "sara@example.com",
    events: 1,
    savedVendors: 7,
    enquiries: 4,
    bookings: 1,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Daniel Carter",
    image: "/images/cm-3.png",
    joinDate: "22 Jun 2026",
    email: "daniel@example.com",
    events: 4,
    savedVendors: 21,
    enquiries: 12,
    bookings: 5,
    status: "Blocked",
  },
];

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesQuery = [
        customer.name,
        customer.email,
        customer.joinDate,
        customer.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter =
        filterBy === "all" || customer.status.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [filterBy, query]);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Users
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Review customer activity, saved vendors, enquiries, bookings, and
          account status.
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
              placeholder="Search users"
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Customer",
                  "Join Date",
                  "Email",
                  "Events",
                  "Saved Vendors",
                  "Enquiries",
                  "Bookings",
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <ProfileCell
                      image={customer.image}
                      name={customer.name}
                      detail="Customer"
                    />
                  </td>
                  <TableCell>{customer.joinDate}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.events}</TableCell>
                  <TableCell>{customer.savedVendors}</TableCell>
                  <TableCell>{customer.enquiries}</TableCell>
                  <TableCell>{customer.bookings}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(customer)}
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

      {selectedCustomer ? (
        <Modal title="User Details" onClose={() => setSelectedCustomer(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <ProfileCell
              image={selectedCustomer.image}
              name={selectedCustomer.name}
              detail="Customer"
              large
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Join Date" value={selectedCustomer.joinDate} />
            <DetailItem label="Email" value={selectedCustomer.email} />
            <DetailItem label="Events" value={String(selectedCustomer.events)} />
            <DetailItem
              label="Saved Vendors"
              value={String(selectedCustomer.savedVendors)}
            />
            <DetailItem label="Enquiries" value={String(selectedCustomer.enquiries)} />
            <DetailItem label="Bookings" value={String(selectedCustomer.bookings)} />
            <DetailItem label="Status" value={selectedCustomer.status} />
          </div>
          <ModalClose onClick={() => setSelectedCustomer(null)} />
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

function StatusBadge({ status }: { status: UserStatus }) {
  const className =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Inactive"
        ? "bg-gray-100 text-gray-500"
        : "bg-rose-50 text-rose-700";

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
