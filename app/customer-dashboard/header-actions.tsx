"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CalendarCheck2,
  ChevronDown,
  LogOut,
  MessageSquareText,
  Settings,
  UserRound,
  X,
} from "lucide-react";

const notifications = [
  {
    title: "New enquiry",
    detail: "A vendor replied to your decor package request.",
    time: "8 min ago",
    icon: MessageSquareText,
  },
  {
    title: "Event reminder",
    detail: "Mehndi Night planning checklist is due today.",
    time: "Today",
    icon: CalendarCheck2,
  },
  {
    title: "Budget update",
    detail: "Catering estimate was added to your full plan.",
    time: "Yesterday",
    icon: Settings,
  },
];

export function AdminHeaderActions() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <details className="group relative">
        <summary
          className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full bg-white text-[#001B12] transition-colors hover:bg-[#C07C22] hover:text-white [&::-webkit-details-marker]:hidden"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </summary>
        <div className="absolute right-0 mt-3 w-[330px] overflow-hidden rounded-[12px] border border-[#dfe7e2] bg-white text-[#16231f] shadow-xl">
          <div className="border-b border-[#edf1ee] px-4 py-3">
            <h2 className="font-inter text-[15px] font-semibold">
              Notifications
            </h2>
          </div>
          <div className="max-h-[340px] overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon;

              return (
                <div
                  key={notification.title}
                  className="flex gap-3 border-b border-[#edf1ee] px-4 py-3 last:border-b-0"
                >
                  <span className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-[#0D5B46]/10 text-[#0D5B46]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-inter text-[14px] font-semibold text-[#16231f]">
                      {notification.title}
                    </p>
                    <p className="mt-1 font-inter text-[13px] leading-5 text-[#68746e]">
                      {notification.detail}
                    </p>
                    <p className="mt-2 font-inter text-[12px] font-medium text-[#0D5B46]">
                      {notification.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </details>

      <details className="group relative">
        <summary className="flex h-11 cursor-pointer list-none items-center gap-3 rounded-[10px] px-3 text-[#0D5B46] shadow-sm transition-colors [&::-webkit-details-marker]:hidden">
          <span className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
            <Image
              src="/images/profile-2.png"
              alt="Customer profile"
              width={500}
              height={500}
              className="object-cover"
            />
          </span>
          <span className="hidden font-inter text-[18px] font-normal text-white sm:block">
            Customer
          </span>
          <ChevronDown
            className="h-4 w-4 text-white transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-[10px] border border-[#dfe7e2] bg-white py-2 text-[#16231f] shadow-xl">
          <Link
            href="/customer-dashboard/settings"
            className="flex items-center gap-2 px-4 py-2.5 font-inter text-sm hover:bg-[#f5f7f4]"
          >
            <UserRound className="h-4 w-4 text-[#0D5B46]" aria-hidden="true" />
            Profile
          </Link>
          <Link
            href="/customer-dashboard/settings"
            className="flex items-center gap-2 px-4 py-2.5 font-inter text-sm hover:bg-[#f5f7f4]"
          >
            <Settings className="h-4 w-4 text-[#0D5B46]" aria-hidden="true" />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-inter text-sm hover:bg-[#f5f7f4]"
          >
            <LogOut className="h-4 w-4 text-[#0D5B46]" aria-hidden="true" />
            Logout
          </button>
        </div>
      </details>

      {isLogoutOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6 text-[#16231f] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-inter text-[22px] font-semibold">
                  Logout
                </h2>
                <p className="mt-2 font-inter text-[15px] leading-7 text-[#68746e]">
                  Are you sure you want to logout from the customer dashboard?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLogoutOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]"
                aria-label="Close logout modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutOpen(false)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <Link
                href="/"
                className="inline-flex rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

