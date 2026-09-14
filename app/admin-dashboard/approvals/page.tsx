"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Eye,
  RefreshCcw,
  Search,
  ShieldX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { AccountApprovalStatus, AuthUser } from "@/lib/auth";
import { listPendingApprovals, updateApprovalStatus } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-session";

type ApprovalRole = "Customer" | "Vendor";
type ApprovalStatus = "Pending" | "Approved" | "Blocked";

type ApprovalRequest = {
  id: string;
  name: string;
  role: ApprovalRole;
  category: string;
  location: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: ApprovalStatus;
};

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function loadApprovals(token: string) {
    setStatus("loading");
    setMessage("");

    try {
      const result = await listPendingApprovals(token);
      setApprovals(result.approvals.map(mapUserToApproval));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to load approvals");
    }
  }

  useEffect(() => {
    const session = getAdminSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Admin login is required to manage approvals.");
      return;
    }

    setAdminToken(session.token);
    void loadApprovals(session.token);
  }, []);

  const filteredApprovals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return approvals.filter((approval) => {
      const matchesQuery = [
        approval.name,
        approval.role,
        approval.category,
        approval.location,
        approval.email,
        approval.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter =
        filterBy === "all" || approval.role.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [approvals, filterBy, query]);

  async function handleApproval(id: string, nextStatus: Extract<AccountApprovalStatus, "APPROVED" | "SUSPENDED">) {
    if (!adminToken) {
      setStatus("error");
      setMessage("Admin login is required to manage approvals.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await updateApprovalStatus(id, { status: nextStatus }, adminToken);
      const mappedUser = mapUserToApproval(result.user);

      setApprovals((current) => current.filter((approval) => approval.id !== id));
      setSelectedApproval(null);
      setStatus("success");
      setMessage(`${mappedUser.name} was ${nextStatus === "APPROVED" ? "approved" : "blocked"}.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update approval");
    }
  }

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
              Approvals
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Review real customer and vendor signup requests from the database.
            </p>
          </div>
          <button
            type="button"
            onClick={() => adminToken && loadApprovals(adminToken)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[#0D5B46] px-4 font-inter text-sm font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46]/10"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        </div>
      </section>

      {message ? (
        <section
          className={`rounded-[12px] px-4 py-3 font-inter text-sm font-semibold ${
            status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
          aria-live="polite"
        >
          {message}
          {!adminToken ? (
            <Link href="/login" className="ml-2 underline">
              Go to admin login
            </Link>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search approvals"
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
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {[
                  "Applicant",
                  "Role",
                  "Category",
                  "Location",
                  "Email",
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
              {filteredApprovals.map((approval) => (
                <tr key={approval.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <ProfileCell name={approval.name} detail={approval.phone || "No phone"} />
                  </td>
                  <TableCell>{approval.role}</TableCell>
                  <TableCell>{approval.category}</TableCell>
                  <TableCell>{approval.location}</TableCell>
                  <TableCell>{approval.email}</TableCell>
                  <TableCell>{approval.submittedAt}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={approval.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedApproval(approval)}
                        className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproval(approval.id, "APPROVED")}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
                        aria-label={`Approve ${approval.name}`}
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproval(approval.id, "SUSPENDED")}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#b42318] text-white transition-colors hover:bg-[#8f1d14]"
                        aria-label={`Block ${approval.name}`}
                      >
                        <ShieldX className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApprovals.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border-b border-[#edf1ee] px-4 py-10 text-center font-inter text-sm font-medium text-[#68746e]"
                  >
                    {status === "loading" ? "Loading approvals..." : "No pending approvals found."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {selectedApproval ? (
        <Modal title="Approval Details" onClose={() => setSelectedApproval(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <ProfileCell name={selectedApproval.name} detail={selectedApproval.role} large />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Role" value={selectedApproval.role} />
            <DetailItem label="Category" value={selectedApproval.category} />
            <DetailItem label="Location" value={selectedApproval.location} />
            <DetailItem label="Email" value={selectedApproval.email} />
            <DetailItem label="Phone" value={selectedApproval.phone || "No phone"} />
            <DetailItem label="Submitted" value={selectedApproval.submittedAt} />
            <DetailItem label="Status" value={selectedApproval.status} />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => handleApproval(selectedApproval.id, "SUSPENDED")}
              className="rounded-md bg-[#b42318] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#8f1d14]"
            >
              Block
            </button>
            <button
              type="button"
              onClick={() => handleApproval(selectedApproval.id, "APPROVED")}
              className="rounded-md bg-emerald-600 px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-emerald-700"
            >
              Approve
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function mapUserToApproval(user: AuthUser): ApprovalRequest {
  return {
    id: user.id,
    name: user.name,
    role: user.role === "VENDOR" ? "Vendor" : "Customer",
    category: user.role === "VENDOR" ? "Vendor Account" : "Customer Account",
    location: "Not provided",
    email: user.email,
    phone: user.phone ?? "",
    submittedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(user.createdAt)),
    status: mapApprovalStatus(user.approvalStatus)
  };
}

function mapApprovalStatus(status: AccountApprovalStatus): ApprovalStatus {
  if (status === "APPROVED") {
    return "Approved";
  }

  if (status === "SUSPENDED") {
    return "Blocked";
  }

  return "Pending";
}

function ProfileCell({
  name,
  detail,
  large = false,
}: {
  name: string;
  detail: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid flex-none place-items-center rounded-[12px] bg-[#f5f7f4] font-inter font-semibold text-[#0D5B46] ${
          large ? "h-16 w-16 text-xl" : "h-11 w-11 text-sm"
        }`}
      >
        {name.slice(0, 1).toUpperCase()}
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

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const className =
    status === "Approved"
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
