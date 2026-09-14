"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Eye, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { listAdminReviews, type AdminReview } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-session";

type ReviewStatus = "Published";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const session = getAdminSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Admin login is required to load reviews.");
        setReviews([]);
      });
      return;
    }

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        setMessage("");
        return listAdminReviews(session.token);
      })
      .then((result) => {
        if (!active) {
          return;
        }

        setReviews(result.reviews);
        setStatus("idle");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setReviews([]);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load reviews.");
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesQuery = [
        review.customer.name,
        review.customer.email,
        review.vendor.vendorName,
        review.vendor.email,
        review.rating,
        review.message,
        review.status,
        formatReviewDate(review.updatedAt),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter = filterBy === "all" || review.status.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [filterBy, query, reviews]);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Reviews
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Manage platform customer reviews, ratings, dates, vendors, and review messages.
        </p>
        {message ? (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 font-inter text-sm font-semibold text-rose-700">
            {message}
          </p>
        ) : null}
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reviews"
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
              <option value="all">All Reviews</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {["Customer", "Vendor", "Rating", "Review", "Date", "Status", "Action"].map((heading) => (
                  <TableHead key={heading}>{heading}</TableHead>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length ? filteredReviews.map((review) => (
                <tr key={review.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <ProfileCell image="/images/profile-2.png" name={review.customer.name} detail={review.customer.email} />
                  </td>
                  <TableCell>{review.vendor.vendorName}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#C07C22] text-[#C07C22]" aria-hidden="true" />
                      {review.rating.toFixed(1)}
                    </span>
                  </TableCell>
                  <td className="max-w-[280px] truncate border-b border-[#edf1ee] px-4 py-3 font-inter text-[13px] font-medium text-[#16231f]">
                    {review.message}
                  </td>
                  <TableCell>{formatReviewDate(review.updatedAt)}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <ViewButton onClick={() => setSelectedReview(review)} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center font-inter text-sm font-semibold text-[#68746e]">
                    {status === "loading" ? "Loading reviews..." : "No reviews found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedReview ? (
        <Modal title="Review Details" onClose={() => setSelectedReview(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <ProfileCell image="/images/profile-2.png" name={selectedReview.customer.name} detail={selectedReview.customer.email} large />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Vendor" value={selectedReview.vendor.vendorName} />
            <DetailItem label="Vendor Email" value={selectedReview.vendor.email} />
            <DetailItem label="Rating" value={selectedReview.rating.toFixed(1)} />
            <DetailItem label="Date" value={formatReviewDate(selectedReview.updatedAt)} />
            <DetailItem label="Status" value={selectedReview.status} />
          </div>
          <div className="mt-4 rounded-[12px] bg-blue-50 p-4">
            <p className="font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-700">
              Review
            </p>
            <p className="mt-2 font-inter text-[15px] leading-7 text-blue-950">
              {selectedReview.message}
            </p>
          </div>
          <ModalClose onClick={() => setSelectedReview(null)} />
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
      <span className={`relative flex-none overflow-hidden rounded-full bg-[#f5f7f4] ${large ? "h-16 w-16" : "h-11 w-11"}`}>
        <Image src={image} alt={name} fill sizes={large ? "64px" : "44px"} className="object-cover" />
      </span>
      <span>
        <span className="block max-w-[180px] truncate whitespace-nowrap font-inter text-[14px] font-semibold text-[#16231f]">
          {name}
        </span>
        <span className="block max-w-[220px] truncate whitespace-nowrap font-inter text-[12px] font-semibold text-gray-700/80">
          {detail}
        </span>
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
      <p className="mt-1 break-words font-inter text-[14px] font-medium text-gray-700/70">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 font-inter text-[11px] font-semibold text-emerald-700">
      {status}
    </span>
  );
}

function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10"
    >
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

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
