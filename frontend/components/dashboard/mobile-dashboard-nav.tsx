"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type MobileDashboardNavProps = {
  links: Array<{
    label: string;
    href: string;
    icon: LucideIcon;
  }>;
  baseHref: string;
  label: string;
};

export function MobileDashboardNav({
  links,
  baseHref,
  label,
}: MobileDashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-white max-[520px]:block"
      aria-label={label}
    >
      <div className="mx-auto flex max-w-[420px] gap-1 overflow-x-auto overscroll-x-contain rounded-[22px] border border-white/10 bg-[#001B12] p-2 shadow-[0_-12px_30px_rgba(0,0,0,0.24)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === baseHref
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-[68px] flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-2 py-2 text-center font-inter text-[10px] font-semibold transition-colors ${
                isActive
                  ? "bg-white text-[#0D5B46]"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
