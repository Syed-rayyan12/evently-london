import { prisma } from "../../lib/prisma.js";
import {
  listNotifications,
  markNotificationReviewed,
  type AppNotificationStatus
} from "../notifications/notification.service.js";
import type {
  AdminAnalyticsResponse,
  AdminBookingsResponse,
  AdminCustomerResponse,
  AdminDashboardPeriod,
  AdminDashboardResponse,
  AdminEnquiriesResponse,
  AdminNotificationsResponse,
  AdminReviewsResponse,
  AdminVendorResponse
} from "./admin.types.js";

const dashboardChartLabels: Record<AdminDashboardPeriod, string[]> = {
  "this-week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "this-month": ["Week 1", "Week 2", "Week 3", "Week 4"],
  "this-year": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

const adminUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  approvalStatus: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      customerSavedVendors: true,
      customerEnquiries: true
    }
  }
} as const;

const adminVendorUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  approvalStatus: true,
  createdAt: true,
  updatedAt: true
} as const;

const adminVendorSelect = {
  ...adminVendorUserSelect,
  vendorProfile: {
    select: {
      id: true,
      userId: true,
      ownerName: true,
      vendorName: true,
      category: true,
      location: true,
      about: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true
    }
  }
} as const;

const adminEnquirySelect = {
  id: true,
  customerId: true,
  vendorId: true,
  packageId: true,
  packageName: true,
  message: true,
  vendorResponse: true,
  respondedAt: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true
    }
  },
  vendor: {
    select: {
      id: true,
      name: true,
      email: true,
      vendorProfile: {
        select: {
          vendorName: true,
          category: true
        }
      }
    }
  }
} as const;

export function listUsers(): Promise<AdminCustomerResponse[]> {
  return prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: adminUserSelect,
    orderBy: { createdAt: "desc" }
  });
}

export function listVendors(): Promise<AdminVendorResponse[]> {
  return prisma.user.findMany({
    where: { role: "VENDOR" },
    select: adminVendorSelect,
    orderBy: { createdAt: "desc" }
  });
}

export async function getAdminDashboardOverview(
  period: AdminDashboardPeriod = "this-month"
): Promise<AdminDashboardResponse> {
  const periodStart = getPeriodStart(period);
  const [
    totalVendors,
    totalUsers,
    totalEnquiries,
    totalReviews,
    enquiriesForChart,
    categoryRows,
    recentEnquiries
  ] = await Promise.all([
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.customerEnquiry.count(),
    prisma.customerReview.count(),
    prisma.customerEnquiry.findMany({
      where: {
        createdAt: {
          gte: periodStart
        }
      },
      select: {
        createdAt: true
      }
    }),
    prisma.vendorProfile.groupBy({
      by: ["category"],
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: "desc"
        }
      },
      take: 4
    }),
    prisma.customerEnquiry.findMany({
      select: {
        id: true,
        createdAt: true,
        packageName: true,
        customer: {
          select: {
            name: true
          }
        },
        vendor: {
          select: {
            vendorProfile: {
              select: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const categoryTotal = categoryRows.reduce((sum, item) => sum + item._count.category, 0);

  return {
    stats: {
      totalVendors,
      totalUsers,
      totalEnquiries,
      totalReviews
    },
    enquiryOverview: {
      period,
      points: createChartPoints(period, enquiriesForChart.map((enquiry) => enquiry.createdAt))
    },
    categories: categoryRows.map((item) => ({
      label: item.category,
      count: item._count.category,
      percent: categoryTotal ? Math.round((item._count.category / categoryTotal) * 100) : 0
    })),
    recentEnquiries: recentEnquiries.map((enquiry) => ({
      id: enquiry.id,
      customer: enquiry.customer.name,
      category: enquiry.vendor.vendorProfile?.category ?? enquiry.packageName ?? "Quote request",
      time: enquiry.createdAt
    }))
  };
}

export async function listAdminReviews(): Promise<AdminReviewsResponse> {
  const reviews = await prisma.customerReview.findMany({
    select: {
      id: true,
      customerId: true,
      vendorId: true,
      rating: true,
      message: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      vendor: {
        select: {
          id: true,
          name: true,
          email: true,
          vendorProfile: {
            select: {
              vendorName: true
            }
          }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return {
    reviews: reviews.map((review) => ({
      id: review.id,
      customerId: review.customerId,
      vendorId: review.vendorId,
      customer: review.customer,
      vendor: {
        id: review.vendor.id,
        name: review.vendor.name,
        email: review.vendor.email,
        vendorName: review.vendor.vendorProfile?.vendorName ?? review.vendor.name
      },
      rating: review.rating,
      message: review.message,
      status: "Published",
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    }))
  };
}

export async function listAdminEnquiries(): Promise<AdminEnquiriesResponse> {
  const enquiries = await prisma.customerEnquiry.findMany({
    select: adminEnquirySelect,
    orderBy: { createdAt: "desc" }
  });

  return {
    enquiries: enquiries.map(mapAdminEnquiry)
  };
}

export async function listAdminBookings(): Promise<AdminBookingsResponse> {
  const bookings = await prisma.customerEnquiry.findMany({
    where: { status: "booked" },
    select: adminEnquirySelect,
    orderBy: { updatedAt: "desc" }
  });

  return {
    bookings: bookings.map(mapAdminEnquiry)
  };
}

export async function getAdminAnalytics(
  period: AdminDashboardPeriod = "this-month"
): Promise<AdminAnalyticsResponse> {
  const periodStart = getPeriodStart(period);
  const [totalVendors, totalUsers, allEnquiries, periodEnquiries, vendorProfiles, reviews] =
    await Promise.all([
      prisma.user.count({ where: { role: "VENDOR" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.customerEnquiry.findMany({
        select: {
          id: true,
          vendorId: true,
          package: {
            select: {
              price: true
            }
          }
        }
      }),
      prisma.customerEnquiry.findMany({
        where: {
          createdAt: {
            gte: periodStart
          }
        },
        select: {
          createdAt: true,
          package: {
            select: {
              price: true
            }
          }
        }
      }),
      prisma.vendorProfile.findMany({
        select: {
          userId: true,
          category: true
        }
      }),
      prisma.customerReview.findMany({
        select: {
          vendorId: true
        }
      })
    ]);

  const categoryByVendorId = new Map(
    vendorProfiles.map((profile) => [profile.userId, profile.category])
  );
  const categoryMap = new Map<
    string,
    {
      label: string;
      vendors: number;
      enquiries: number;
      reviews: number;
      revenue: number;
    }
  >();

  vendorProfiles.forEach((profile) => {
    const item = getCategoryMetric(categoryMap, profile.category);
    item.vendors += 1;
  });

  allEnquiries.forEach((enquiry) => {
    const category = categoryByVendorId.get(enquiry.vendorId) ?? "Uncategorized";
    const item = getCategoryMetric(categoryMap, category);
    item.enquiries += 1;
    item.revenue += parseAmount(enquiry.package?.price);
  });

  reviews.forEach((review) => {
    const category = categoryByVendorId.get(review.vendorId) ?? "Uncategorized";
    const item = getCategoryMetric(categoryMap, category);
    item.reviews += 1;
  });

  const totalRevenue = allEnquiries.reduce(
    (sum, enquiry) => sum + parseAmount(enquiry.package?.price),
    0
  );
  const categoryTotal = Array.from(categoryMap.values()).reduce(
    (sum, item) => sum + item.enquiries,
    0
  );
  const categoryPerformance = Array.from(categoryMap.values())
    .map((item) => ({
      ...item,
      percent: categoryTotal ? Math.round((item.enquiries / categoryTotal) * 100) : 0,
      performance: getCategoryPerformance(item, totalVendors)
    }))
    .sort((a, b) => b.performance - a.performance);

  return {
    stats: {
      totalVendors,
      totalUsers,
      totalEnquiries: allEnquiries.length,
      totalRevenue
    },
    revenueOverview: {
      period,
      points: createValueChartPoints(
        period,
        periodEnquiries.map((enquiry) => ({
          date: enquiry.createdAt,
          value: parseAmount(enquiry.package?.price)
        }))
      )
    },
    topCategories: categoryPerformance.slice(0, 4),
    categoryPerformance
  };
}

export async function listAdminNotifications(
  status: AppNotificationStatus | "ALL" = "PENDING"
): Promise<AdminNotificationsResponse> {
  const notifications = await listNotifications({
    audience: "ADMIN",
    status
  });

  return {
    notifications: notifications.map((notification) => ({
      ...notification,
      kind: getAdminNotificationKind(notification.kind)
    }))
  };
}

export async function reviewAdminNotification(notificationId: string) {
  const notification = await markNotificationReviewed({
    id: notificationId,
    audience: "ADMIN"
  });

  return {
    notification: {
      ...notification,
      kind: getAdminNotificationKind(notification.kind)
    }
  };
}

function getAdminNotificationKind(kind: string) {
  if (kind === "customer" || kind === "vendor" || kind === "review" || kind === "booking") {
    return kind;
  }

  return "enquiry";
}

function mapAdminEnquiry(enquiry: {
  id: string;
  customerId: string;
  vendorId: string;
  packageId: string | null;
  packageName: string | null;
  message: string;
  vendorResponse: string | null;
  respondedAt: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  vendor: {
    id: string;
    name: string;
    email: string;
    vendorProfile: {
      vendorName: string;
      category: string;
    } | null;
  };
}) {
  return {
    ...enquiry,
    vendor: {
      id: enquiry.vendor.id,
      name: enquiry.vendor.name,
      email: enquiry.vendor.email,
      vendorName: enquiry.vendor.vendorProfile?.vendorName ?? enquiry.vendor.name,
      category: enquiry.vendor.vendorProfile?.category ?? "Vendor"
    }
  };
}

function getPeriodStart(period: AdminDashboardPeriod) {
  const now = new Date();
  const start = new Date(now);

  if (period === "this-week") {
    const day = start.getDay();
    const offset = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - offset);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (period === "this-month") {
    return new Date(start.getFullYear(), start.getMonth(), 1);
  }

  return new Date(start.getFullYear(), 0, 1);
}

function createChartPoints(period: AdminDashboardPeriod, dates: Date[]) {
  const labels = dashboardChartLabels[period];
  const values = labels.map(() => 0);

  dates.forEach((date) => {
    const index = getChartIndex(period, date);

    if (index >= 0 && index < values.length) {
      values[index] += 1;
    }
  });

  return labels.map((label, index) => ({
    label,
    value: values[index]
  }));
}

function getChartIndex(period: AdminDashboardPeriod, date: Date) {
  if (period === "this-week") {
    const day = date.getDay();

    return day === 0 ? 6 : day - 1;
  }

  if (period === "this-month") {
    return Math.min(3, Math.floor((date.getDate() - 1) / 7));
  }

  return date.getMonth();
}

function createValueChartPoints(
  period: AdminDashboardPeriod,
  items: Array<{ date: Date; value: number }>
) {
  const labels = dashboardChartLabels[period];
  const values = labels.map(() => 0);

  items.forEach((item) => {
    const index = getChartIndex(period, item.date);

    if (index >= 0 && index < values.length) {
      values[index] += item.value;
    }
  });

  return labels.map((label, index) => ({
    label,
    value: values[index]
  }));
}

function getCategoryMetric(
  metrics: Map<string, { label: string; vendors: number; enquiries: number; reviews: number; revenue: number }>,
  label: string
) {
  const current = metrics.get(label);

  if (current) {
    return current;
  }

  const next = {
    label,
    vendors: 0,
    enquiries: 0,
    reviews: 0,
    revenue: 0
  };

  metrics.set(label, next);
  return next;
}

function getCategoryPerformance(
  item: { vendors: number; enquiries: number; reviews: number; revenue: number },
  totalVendors: number
) {
  const vendorWeight = totalVendors ? (item.vendors / totalVendors) * 25 : 0;
  const activityWeight = Math.min(45, item.enquiries * 6);
  const reviewWeight = Math.min(20, item.reviews * 5);
  const revenueWeight = Math.min(10, item.revenue / 100);

  return Math.round(Math.min(100, vendorWeight + activityWeight + reviewWeight + revenueWeight));
}

function parseAmount(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/,/g, "").match(/\d+(\.\d+)?/);

  return normalized ? Number(normalized[0]) : 0;
}
