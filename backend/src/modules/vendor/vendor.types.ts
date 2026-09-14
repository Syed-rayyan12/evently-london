import { z } from "zod";
import type { AuthUserResponse } from "../auth/auth.types.js";
import type { AppNotification } from "../notifications/notification.service.js";

export const vendorSignupValidator = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
  phone: z.string().trim().min(7).max(30).optional()
});

export const vendorLoginValidator = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1)
});

export const vendorProfileUpdateValidator = z.object({
  ownerName: z.string().trim().min(2).max(120),
  vendorName: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(160),
  email: z.email().toLowerCase(),
  phone: z.string().trim().min(7).max(30).optional(),
  about: z.string().trim().max(2000).optional(),
  imageUrl: z.string().trim().max(2_000_000).optional()
});

export const vendorPasswordUpdateValidator = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number")
});

export type VendorSignupRequest = z.infer<typeof vendorSignupValidator>;
export type VendorLoginRequest = z.infer<typeof vendorLoginValidator>;
export type VendorProfileUpdateRequest = z.infer<typeof vendorProfileUpdateValidator>;
export type VendorPasswordUpdateRequest = z.infer<typeof vendorPasswordUpdateValidator>;

export const vendorServiceValidator = z.object({
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(120),
  startingPrice: z.string().trim().min(1).max(80),
  description: z.string().trim().max(1200).optional(),
  imageUrl: z.string().trim().max(2_000_000).optional()
});

export const vendorPackageValidator = z.object({
  serviceId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(2).max(160),
  price: z.string().trim().min(1).max(80),
  description: z.string().trim().max(1200).optional()
});

export const vendorPortfolioValidator = z.object({
  imageUrl: z.string().trim().min(1).max(2_000_000),
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(120)
});

export const vendorAvailabilityValidator = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["available", "booked", "pending", "unavailable"]),
  eventName: z.string().trim().max(160),
  serviceName: z.string().trim().max(160).optional(),
  packageName: z.string().trim().max(160).optional(),
  location: z.string().trim().max(160).optional(),
  guests: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(1200).optional()
});

export const vendorEnquiryResponseValidator = z.object({
  message: z.string().trim().min(1).max(2000)
});

export const vendorDashboardQueryValidator = z.object({
  period: z.enum(["this-week", "this-month", "this-year"]).default("this-week")
});

export type VendorServiceRequest = z.infer<typeof vendorServiceValidator>;
export type VendorPackageRequest = z.infer<typeof vendorPackageValidator>;
export type VendorPortfolioRequest = z.infer<typeof vendorPortfolioValidator>;
export type VendorAvailabilityRequest = z.infer<typeof vendorAvailabilityValidator>;
export type VendorEnquiryResponseRequest = z.infer<typeof vendorEnquiryResponseValidator>;
export type VendorDashboardQuery = z.infer<typeof vendorDashboardQueryValidator>;

export type VendorProfileDetailsResponse = {
  id: string;
  userId: string;
  ownerName: string;
  vendorName: string;
  category: string;
  location: string;
  about: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorPackageResponse = {
  id: string;
  userId: string;
  serviceId: string | null;
  name: string;
  price: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorServiceResponse = {
  id: string;
  userId: string;
  name: string;
  category: string;
  startingPrice: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  packages: VendorPackageResponse[];
};

export type VendorPortfolioResponse = {
  id: string;
  userId: string;
  imageUrl: string;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorAvailabilityResponse = {
  id: string;
  userId: string;
  date: string;
  status: string;
  eventName: string;
  serviceName: string | null;
  packageName: string | null;
  location: string | null;
  guests: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorAuthResponse = {
  user: AuthUserResponse;
  token: string;
  profile: VendorProfileDetailsResponse | null;
};

export type VendorProfileResponse = {
  user: AuthUserResponse;
  profile: VendorProfileDetailsResponse | null;
};

export type VendorProfileUpdateResponse = {
  user: AuthUserResponse;
  profile: VendorProfileDetailsResponse;
};

export type VendorPasswordUpdateResponse = {
  user: AuthUserResponse;
};

export type VendorServicesResponse = {
  services: VendorServiceResponse[];
};

export type VendorPackagesResponse = {
  packages: VendorPackageResponse[];
};

export type VendorPortfolioItemsResponse = {
  portfolio: VendorPortfolioResponse[];
};

export type VendorAvailabilityEventsResponse = {
  events: VendorAvailabilityResponse[];
};

export type VendorDashboardRecentEnquiry = {
  id: string;
  customer: string;
  event: string;
  date: string;
  status: string;
};

export type VendorEnquiryResponse = {
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
};

export type VendorEnquiriesResponse = {
  enquiries: VendorEnquiryResponse[];
};

export type VendorReviewResponse = {
  id: string;
  customerId: string;
  vendorId: string;
  rating: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
};

export type VendorReviewsResponse = {
  reviews: VendorReviewResponse[];
};

export type VendorNotification = {
  id: AppNotification["id"];
  kind: "enquiry" | "review" | "booking";
  title: AppNotification["title"];
  detail: AppNotification["detail"];
  status: AppNotification["status"];
  createdAt: AppNotification["createdAt"];
  updatedAt: AppNotification["updatedAt"];
};

export type VendorNotificationsResponse = {
  notifications: VendorNotification[];
};

export type VendorDashboardChartPoint = {
  label: string;
  value: number;
};

export type VendorDashboardResponse = {
  stats: {
    totalEnquiries: number;
    totalRevenue: number;
  };
  recentEnquiries: VendorDashboardRecentEnquiry[];
  bookingOverview: {
    period: VendorDashboardQuery["period"];
    points: VendorDashboardChartPoint[];
  };
};
