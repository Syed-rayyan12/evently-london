"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChartLine,
  CalendarCheck2,
  Images,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Star,
  Store,
  UserRound,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/vendor-dashboard", icon: LayoutDashboard },
  { label: "Notifications", href: "/vendor-dashboard/notifications", icon: Bell },
  {
    label: "Enquiries",
    href: "/vendor-dashboard/enquires",
    icon: MessageSquareText,
  },
  { label: "Bookings", href: "/vendor-dashboard/booking", icon: CalendarCheck2 },
  { label: "Profile", href: "/vendor-dashboard/profile", icon: UserRound },
  { label: "Services", href: "/vendor-dashboard/services", icon: Store },
  { label: "Portfolio", href: "/vendor-dashboard/portfolio", icon: Images },
  { label: "Reviews", href: "/vendor-dashboard/reviews", icon: Star },
  { label: "Analytics", href: "/vendor-dashboard/analytics", icon: ChartLine },
  { label: "Settings", href: "/vendor-dashboard/settings", icon: Settings },

];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2" aria-label="Vendor dashboard navigation">
      {sidebarLinks.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/vendor-dashboard"
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
