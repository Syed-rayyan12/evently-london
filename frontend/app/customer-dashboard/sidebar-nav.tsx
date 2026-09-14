"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarCheck2,
  Heart,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Ticket,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/customer-dashboard", icon: LayoutDashboard },
  { label: "Notifications", href: "/customer-dashboard/notifications", icon: Bell },
  { label: "My Events", href: "/customer-dashboard/events", icon: Ticket },
  { label: "Saved Vendors", href: "/customer-dashboard/saved-vendors", icon: Heart },
  {
    label: "Enquiries",
    href: "/customer-dashboard/enquiries",
    icon: MessageSquareText,
  },
  { label: "Bookings", href: "/customer-dashboard/bookings", icon: CalendarCheck2 },
  { label: "Settings", href: "/customer-dashboard/settings", icon: Settings },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2" aria-label="Customer dashboard navigation">
      {sidebarLinks.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/customer-dashboard"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex min-h-12 items-center gap-3 rounded-[10px] px-4 font-inter text-[15px] font-medium transition-colors ${
              isActive
                ? "bg-white text-[#0D5B46]"
                : "text-white/78 hover:bg-white/12 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

