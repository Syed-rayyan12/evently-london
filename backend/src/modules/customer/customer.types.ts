import { z } from "zod";
import type { PublicVendor } from "../public-vendors/public-vendors.types.js";
import type { AppNotification } from "../notifications/notification.service.js";

export const savedVendorValidator = z.object({
  vendorId: z.string().trim().min(1)
});

export const customerEnquiryValidator = z.object({
  vendorId: z.string().trim().min(1),
  packageId: z.string().trim().min(1).optional(),
  packageName: z.string().trim().max(160).optional(),
  message: z.string().trim().min(3).max(2000)
});

export const customerReviewValidator = z.object({
  vendorId: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(3).max(2000)
});

export type SavedVendorRequest = z.infer<typeof savedVendorValidator>;
export type CustomerEnquiryRequest = z.infer<typeof customerEnquiryValidator>;
export type CustomerReviewRequest = z.infer<typeof customerReviewValidator>;

export type SavedVendorResponse = {
  savedVendor: PublicVendor & {
    savedAt: Date;
  };
};

export type SavedVendorsResponse = {
  savedVendors: SavedVendorResponse["savedVendor"][];
};

export type CustomerEnquiryResponse = {
  enquiry: {
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
  };
};

export type CustomerEnquiriesResponse = {
  enquiries: Array<CustomerEnquiryResponse["enquiry"] & {
    vendor: {
      id: string;
      email: string;
      name: string;
      vendorProfile: {
        vendorName: string;
        category: string;
        imageUrl: string | null;
      } | null;
    };
  }>;
};

export type CustomerBookEnquiryResponse = {
  enquiry: CustomerEnquiriesResponse["enquiries"][number];
};

export type CustomerReviewResponse = {
  review: {
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
    };
  };
};

export type CustomerNotification = {
  id: AppNotification["id"];
  kind: "enquiry" | "review" | "booking";
  title: AppNotification["title"];
  detail: AppNotification["detail"];
  status: AppNotification["status"];
  createdAt: AppNotification["createdAt"];
  updatedAt: AppNotification["updatedAt"];
};

export type CustomerNotificationsResponse = {
  notifications: CustomerNotification[];
};
