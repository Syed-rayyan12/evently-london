"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center bg-white rounded-full border border-[#003224] text-[#003224] transition-colors  hover:text-white "
        aria-label="Previous page"
      >
        <ArrowLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center bg-white rounded-full font-inter text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-black border border-brand-line"
              : "border border-brand-line text-[#003224] hover:bg-[#D79D42]/10"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white  border border-[#003224] text-[#003224] transition-colors hover:bg-[#003224] hover:text-white "
        aria-label="Next page"
      >
        <ArrowRight size={16} />
      </button>
    </nav>
  );
}
