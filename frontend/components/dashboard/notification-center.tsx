"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Star,
  UserPlus,
} from "lucide-react";
import {
  listAdminNotifications,
  listVendorNotifications,
  markAdminNotificationReviewed,
  markVendorNotificationReviewed,
  type AppNotification,
} from "@/lib/auth";
import {
  listCustomerNotifications,
  markCustomerNotificationReviewed,
  type CustomerNotification,
} from "@/lib/customer";
import { getAdminSession } from "@/lib/admin-session";
import { getCustomerProfileSession } from "@/lib/customer-session";
import { getVendorProfileSession } from "@/lib/vendor-session";

type NotificationScope = "admin" | "customer" | "vendor";
type NotificationTab = "pending" | "reviewed";
type DashboardNotification = AppNotification | CustomerNotification;

type NotificationCenterProps = {
  scope: NotificationScope;
};

const scopeCopy: Record<NotificationScope, { title: string; description: string; loginMessage: string }> = {
  admin: {
    title: "Notifications",
    description: "Review customer accounts, vendor accounts, enquiries, and customer reviews.",
    loginMessage: "Admin login is required to load notifications.",
  },
  customer: {
    title: "Notifications",
    description: "Track your enquiries and reviews from one place.",
    loginMessage: "Customer login is required to load notifications.",
  },
  vendor: {
    title: "Notifications",
    description: "Review customer enquiries and ratings sent to your vendor account.",
    loginMessage: "Vendor login is required to load notifications.",
  },
};

export function NotificationCenter({ scope }: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<NotificationTab>("pending");
  const [notifications, setNotifications] = useState<Record<NotificationTab, DashboardNotification[]>>({
    pending: [],
    reviewed: [],
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [message, setMessage] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const copy = scopeCopy[scope];
  const activeNotifications = notifications[activeTab];
  const totalCount = useMemo(
    () => notifications.pending.length + notifications.reviewed.length,
    [notifications]
  );

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        setStatus("loading");
        setMessage("");

        const [pendingResult, reviewedResult] = await Promise.all([
          listScopedNotifications(scope, "pending"),
          listScopedNotifications(scope, "reviewed"),
        ]);

        if (!active) {
          return;
        }

        setNotifications({
          pending: pendingResult.notifications,
          reviewed: reviewedResult.notifications,
        });
        setStatus("idle");
      } catch (error) {
        if (!active) {
          return;
        }

        setNotifications({ pending: [], reviewed: [] });
        setStatus("error");
        setMessage(error instanceof Error ? error.message : copy.loginMessage);
      }
    }

    void loadNotifications();

    return () => {
      active = false;
    };
  }, [copy.loginMessage, scope]);

  async function handleMarkReviewed(notificationId: string) {
    try {
      setReviewingId(notificationId);
      const result = await markScopedNotificationReviewed(scope, notificationId);
      setNotifications((current) => ({
        pending: current.pending.filter((notification) => notification.id !== notificationId),
        reviewed: [result.notification, ...current.reviewed.filter((notification) => notification.id !== notificationId)],
      }));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to review notification.");
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              {copy.description}
            </p>
          </div>
          <div className="inline-flex w-fit btx-width items-center gap-2 rounded-[10px] bg-[#0D5B46]/10 px-4 py-3 font-inter text-sm font-semibold text-[#0D5B46]">
            <Bell className="h-4 w-4" aria-hidden="true" />
            {notifications.pending.length} pending
          </div>
        </div>
        {message ? (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 font-inter text-sm font-semibold text-rose-700">
            {message}
          </p>
        ) : null}
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid w-full max-w-md grid-cols-2 rounded-[10px] border border-[#dfe7e2] bg-[#f5f7f4] p-1">
            <TabButton
              count={notifications.pending.length}
              isActive={activeTab === "pending"}
              label="Pending"
              onClick={() => setActiveTab("pending")}
            />
            <TabButton
              count={notifications.reviewed.length}
              isActive={activeTab === "reviewed"}
              label="Reviewed"
              onClick={() => setActiveTab("reviewed")}
            />
          </div>
          <p className="font-inter text-sm font-semibold text-[#68746e]">
            {totalCount} total notifications
          </p>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-5 py-4">
          <h3 className="font-inter text-[16px] font-semibold text-[#16231f]">
            {activeTab === "pending" ? "Pending Notifications" : "Reviewed Notifications"}
          </h3>
        </div>

        <div className="divide-y divide-[#edf1ee]">
          {activeNotifications.length ? activeNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.kind);

            return (
              <article
                key={notification.id}
                className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="flex min-w-0 gap-3">
                  <span className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-[10px] bg-[#0D5B46]/10 text-[#0D5B46]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-inter text-[15px] font-semibold text-[#16231f]">
                        {notification.title}
                      </p>
                      <StatusBadge status={notification.status} />
                    </div>
                    <p className="mt-1 font-inter text-[14px] leading-6 text-[#68746e]">
                      {notification.detail}
                    </p>
                    <p className="mt-2 font-inter text-[12px] font-medium text-[#0D5B46]">
                      {formatNotificationDate(notification.createdAt)}
                    </p>
                  </div>
                </div>

                {activeTab === "pending" ? (
                  <button
                    type="button"
                    onClick={() => handleMarkReviewed(notification.id)}
                    disabled={reviewingId === notification.id}
                    className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-4 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#C07C22] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {reviewingId === notification.id ? "Saving" : "Mark Reviewed"}
                  </button>
                ) : null}
              </article>
            );
          }) : (
            <p className="px-5 py-12 text-center font-inter text-sm font-semibold text-[#68746e]">
              {status === "loading" ? "Loading notifications..." : `No ${activeTab} notifications.`}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function TabButton({
  count,
  isActive,
  label,
  onClick,
}: {
  count: number;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-10 items-center justify-center gap-2 rounded-md px-3 font-inter text-sm font-semibold transition-colors ${
        isActive
          ? "bg-white text-[#0D5B46] shadow-sm"
          : "text-[#68746e] hover:bg-white/70 hover:text-[#0D5B46]"
      }`}
    >
      {label}
      <span className="rounded-full bg-[#0D5B46]/10 px-2 py-0.5 text-[11px] text-[#0D5B46]">
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ status }: { status: DashboardNotification["status"] }) {
  const isReviewed = status === "REVIEWED";
  const Icon = isReviewed ? CheckCircle2 : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${
        isReviewed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {isReviewed ? "Reviewed" : "Pending"}
    </span>
  );
}

function getNotificationIcon(kind: string) {
  if (kind === "review") {
    return Star;
  }

  if (kind === "customer" || kind === "vendor") {
    return UserPlus;
  }

  if (kind === "booking") {
    return CalendarCheck2;
  }

  return MessageSquareText;
}

function formatNotificationDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function listScopedNotifications(scope: NotificationScope, status: NotificationTab) {
  if (scope === "admin") {
    const session = getAdminSession();

    if (!session?.token) {
      throw new Error(scopeCopy.admin.loginMessage);
    }

    return listAdminNotifications(session.token, status);
  }

  if (scope === "customer") {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      throw new Error(scopeCopy.customer.loginMessage);
    }

    return listCustomerNotifications(session, status);
  }

  const session = getVendorProfileSession();

  if (!session?.token) {
    throw new Error(scopeCopy.vendor.loginMessage);
  }

  return listVendorNotifications(session, status);
}

async function markScopedNotificationReviewed(scope: NotificationScope, notificationId: string) {
  if (scope === "admin") {
    const session = getAdminSession();

    if (!session?.token) {
      throw new Error(scopeCopy.admin.loginMessage);
    }

    return markAdminNotificationReviewed(notificationId, session.token);
  }

  if (scope === "customer") {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      throw new Error(scopeCopy.customer.loginMessage);
    }

    return markCustomerNotificationReviewed(notificationId, session);
  }

  const session = getVendorProfileSession();

  if (!session?.token) {
    throw new Error(scopeCopy.vendor.loginMessage);
  }

  return markVendorNotificationReviewed(notificationId, session);
}
