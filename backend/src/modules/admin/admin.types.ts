import type { AuthUserResponse } from "../auth/auth.types.js";
import type { AppNotification } from "../notifications/notification.service.js";
import type { VendorProfileDetailsResponse } from "../vendor/vendor.types.js";

export type AdminCustomerResponse = AuthUserResponse & {
  _count: {
    customerSavedVendors: number;
    customerEnquiries: number;
  };
};

export type AdminVendorResponse = AuthUserResponse & {
  vendorProfile: VendorProfileDetailsResponse | null;
};

export type AdminUsersResponse = {
  users: AdminCustomerResponse[];
};

export type AdminVendorsResponse = {
  vendors: AdminVendorResponse[];
};

export type AdminNotification = {
  id: AppNotification["id"];
  kind: "customer" | "vendor" | "enquiry" | "review" | "booking";
  title: AppNotification["title"];
  detail: AppNotification["detail"];
  status: AppNotification["status"];
  createdAt: AppNotification["createdAt"];
  updatedAt: AppNotification["updatedAt"];
};

export type AdminNotificationsResponse = {
  notifications: AdminNotification[];
};

export type AdminDashboardPeriod = "this-week" | "this-month" | "this-year";

export type AdminDashboardStat = {
  totalVendors: number;
  totalUsers: number;
  totalEnquiries: number;
  totalReviews: number;
};

export type AdminDashboardChartPoint = {
  label: string;
  value: number;
};

export type AdminDashboardCategory = {
  label: string;
  count: number;
  percent: number;
};

export type AdminDashboardRecentEnquiry = {
  id: string;
  customer: string;
  category: string;
  time: Date;
};

export type AdminDashboardResponse = {
  stats: AdminDashboardStat;
  enquiryOverview: {
    period: AdminDashboardPeriod;
    points: AdminDashboardChartPoint[];
  };
  categories: AdminDashboardCategory[];
  recentEnquiries: AdminDashboardRecentEnquiry[];
};

export type AdminReviewResponse = {
  id: string;
  customerId: string;
  vendorId: string;
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
    vendorName: string;
  };
  rating: number;
  message: string;
  status: "Published";
  createdAt: Date;
  updatedAt: Date;
};

export type AdminReviewsResponse = {
  reviews: AdminReviewResponse[];
};

export type AdminEnquiryResponse = {
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
    vendorName: string;
    category: string;
  };
};

export type AdminEnquiriesResponse = {
  enquiries: AdminEnquiryResponse[];
};

export type AdminBookingsResponse = {
  bookings: AdminEnquiryResponse[];
};

export type AdminAnalyticsStat = {
  totalVendors: number;
  totalUsers: number;
  totalEnquiries: number;
  totalRevenue: number;
};

export type AdminAnalyticsCategory = {
  label: string;
  vendors: number;
  enquiries: number;
  reviews: number;
  revenue: number;
  percent: number;
  performance: number;
};

export type AdminAnalyticsResponse = {
  stats: AdminAnalyticsStat;
  revenueOverview: {
    period: AdminDashboardPeriod;
    points: AdminDashboardChartPoint[];
  };
  topCategories: AdminAnalyticsCategory[];
  categoryPerformance: AdminAnalyticsCategory[];
};
