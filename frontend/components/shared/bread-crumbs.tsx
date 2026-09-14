import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

/**
 * Breadcrumbs
 * Generic, reusable breadcrumb trail. Works on any page — just pass the
 * trail as data, the component doesn't know about vendors specifically.
 *
 * Props:
 * - items: { label: string, href?: string }[]
 *     Every item except the last should have an href. The last item
 *     renders as plain (non-clickable) text since it's the current page.
 *
 * Usage:
 * <Breadcrumbs
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Vendors", href: "/vendors" },
 *     { label: "Royal Moments Photography Vendor Profile" }, // current page, no href
 *   ]}
 * />
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 font-sans text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[#003224] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-gray-500" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={14} className="text-gray-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
