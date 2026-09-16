"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpenText,
  Building2,
  CalendarCheck2,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Star,
  UserCheck,
  Users,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Notifications", href: "/admin-dashboard/notifications", icon: Bell },
  { label: "Approvals", href: "/admin-dashboard/approvals", icon: UserCheck },
  { label: "Vendors", href: "/admin-dashboard/vendors", icon: Building2 },
  { label: "Users", href: "/admin-dashboard/users", icon: Users },
  {
    label: "Enquiries",
    href: "/admin-dashboard/enquiries",
    icon: MessageSquareText,
  },
  { label: "Bookings", href: "/admin-dashboard/bookings", icon: CalendarCheck2 },
  { label: "Reviews", href: "/admin-dashboard/reviews", icon: Star },
  { label: "Blogs", href: "/admin-dashboard/blog-posts", icon: BookOpenText },
  { label: "Analytics", href: "/admin-dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin-dashboard/settings", icon: Settings },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2" aria-label="Admin dashboard navigation">
      {sidebarLinks.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin-dashboard"
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
