"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import type { AccountApprovalStatus, AuthUser } from "@/lib/auth";
import { listAdminVendors } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-session";

type VendorStatus = "Active" | "Pending" | "Blocked";

type Vendor = {
  id: string;
  name: string;
  category: string;
  image: string;
  location: string;
  rating: string;
  enquiries: number;
  bookings: number;
  status: VendorStatus;
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [deleteVendor, setDeleteVendor] = useState<Vendor | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function loadVendors(token: string) {
    setStatus("loading");
    setMessage("");

    try {
      const result = await listAdminVendors(token);
      setVendors(result.vendors.map(mapUserToVendor));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to load vendors");
    }
  }

  useEffect(() => {
    const session = getAdminSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Admin login is required to view vendors.");
      return;
    }

    void loadVendors(session.token);
  }, []);

  const filteredVendors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return vendors.filter((vendor) => {
      const matchesQuery = [
        vendor.name,
        vendor.category,
        vendor.location,
        vendor.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter =
        filterBy === "all" || vendor.status.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [filterBy, query, vendors]);

  const removeVendor = () => {
    if (!deleteVendor) {
      return;
    }

    setVendors((current) =>
      current.filter((vendor) => vendor.id !== deleteVendor.id),
    );
    setDeleteVendor(null);
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Vendors
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Manage vendor profiles, categories, enquiry volume, bookings, and
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
              placeholder="Search vendors"
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
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
        </div>
      </section>

      {message ? (
        <section className="rounded-[12px] bg-rose-50 px-4 py-3 font-inter text-sm font-semibold text-rose-700">
          {message}
          <Link href="/login" className="ml-2 underline">
            Go to admin login
          </Link>
        </section>
      ) : null}

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Vendor",
                  "Category",
                  "Location",
                  "Rating",
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
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <ProfileCell
                      image={vendor.image}
                      name={vendor.name}
                      detail={vendor.category}
                    />
                  </td>
                  <TableCell>{vendor.category}</TableCell>
                  <TableCell>{vendor.location}</TableCell>
                  <TableCell>{vendor.rating}</TableCell>
                  <TableCell>{vendor.enquiries}</TableCell>
                  <TableCell>{vendor.bookings}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={vendor.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVendor(vendor)}
                        className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteVendor(vendor)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#b42318] text-white transition-colors hover:bg-[#8f1d14]"
                        aria-label={`Remove ${vendor.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredVendors.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border-b border-[#edf1ee] px-4 py-10 text-center font-inter text-sm font-medium text-[#68746e]"
                  >
                    {status === "loading" ? "Loading vendors..." : "No vendors found."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {selectedVendor ? (
        <Modal title="Vendor Details" onClose={() => setSelectedVendor(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <ProfileCell
              image={selectedVendor.image}
              name={selectedVendor.name}
              detail={selectedVendor.category}
              large
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Category" value={selectedVendor.category} />
            <DetailItem label="Location" value={selectedVendor.location} />
            <DetailItem label="Rating" value={selectedVendor.rating} />
            <DetailItem label="Enquiries" value={String(selectedVendor.enquiries)} />
            <DetailItem label="Bookings" value={String(selectedVendor.bookings)} />
            <DetailItem label="Status" value={selectedVendor.status} />
          </div>
          <ModalClose onClick={() => setSelectedVendor(null)} />
        </Modal>
      ) : null}

      {deleteVendor ? (
        <Modal title="Remove Vendor" onClose={() => setDeleteVendor(null)}>
          <p className="font-inter text-[15px] leading-7 text-[#68746e]">
            Remove <span className="font-semibold text-[#16231f]">{deleteVendor.name}</span> from
            the admin vendor list?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteVendor(null)}
              className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={removeVendor}
              className="rounded-md bg-[#b42318] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#8f1d14]"
            >
              Remove
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function mapUserToVendor(user: AuthUser): Vendor {
  const vendor = user as AuthUser & {
    vendorProfile?: {
      vendorName: string;
      category: string;
      location: string;
    } | null;
  };

  return {
    id: user.id,
    name: vendor.vendorProfile?.vendorName ?? user.name,
    category: vendor.vendorProfile?.category ?? "Vendor Account",
    image: "/images/mej.png",
    location: vendor.vendorProfile?.location ?? "Not provided",
    rating: "-",
    enquiries: 0,
    bookings: 0,
    status: mapVendorStatus(user.approvalStatus)
  };
}

function mapVendorStatus(status: AccountApprovalStatus): VendorStatus {
  if (status === "APPROVED") {
    return "Active";
  }

  if (status === "SUSPENDED") {
    return "Blocked";
  }

  return "Pending";
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
        className={`relative flex-none overflow-hidden rounded-[12px] bg-[#f5f7f4] ${
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

function StatusBadge({ status }: { status: VendorStatus }) {
  const className =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Pending"
        ? "bg-amber-50 text-amber-700"
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
