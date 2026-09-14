import type { PublicVendor } from "./public-vendors";
import { apiRequest } from "./request";

type CustomerSession = {
  token?: string;
};

export type SavedVendor = PublicVendor & {
  savedAt: string;
};

export type CustomerEnquiryPayload = {
  vendorId: string;
  packageId?: string;
  packageName?: string;
  message: string;
};

export type CustomerEnquiry = {
  id: string;
  customerId: string;
  vendorId: string;
  packageId: string | null;
  packageName: string | null;
  message: string;
  vendorResponse: string | null;
  respondedAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  vendor?: {
    id: string;
    email: string;
    name: string;
    vendorProfile: {
      vendorName: string;
      category: string;
      imageUrl: string | null;
    } | null;
  };
};

export type CustomerReviewPayload = {
  vendorId: string;
  rating: number;
  message: string;
};

export type CustomerReview = {
  id: string;
  customerId: string;
  vendorId: string;
  rating: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
};

export type CustomerNotification = {
  id: string;
  kind: "enquiry" | "review" | "booking";
  title: string;
  detail: string;
  status: "PENDING" | "REVIEWED";
  createdAt: string;
  updatedAt: string;
};

function getCustomerHeaders(session: CustomerSession) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return headers;
}

export function listSavedVendors(session: CustomerSession) {
  return apiRequest<{ savedVendors: SavedVendor[] }>("/api/customer/saved-vendors", {
    method: "GET",
    headers: getCustomerHeaders(session)
  });
}

export function saveVendorToShortlist(vendorId: string, session: CustomerSession) {
  return apiRequest<{ savedVendor: SavedVendor }, { vendorId: string }>(
    "/api/customer/saved-vendors",
    {
      method: "POST",
      headers: getCustomerHeaders(session),
      body: { vendorId }
    }
  );
}

export function removeVendorFromShortlist(vendorId: string, session: CustomerSession) {
  return apiRequest<{ vendorId: string }>(`/api/customer/saved-vendors/${vendorId}`, {
    method: "DELETE",
    headers: getCustomerHeaders(session)
  });
}

export function createCustomerEnquiry(
  payload: CustomerEnquiryPayload,
  session: CustomerSession
) {
  return apiRequest<{ enquiry: CustomerEnquiry }, CustomerEnquiryPayload>("/api/customer/enquiries", {
    method: "POST",
    headers: getCustomerHeaders(session),
    body: payload
  });
}

export function listCustomerEnquiries(session: CustomerSession) {
  return apiRequest<{ enquiries: CustomerEnquiry[] }>("/api/customer/enquiries", {
    method: "GET",
    headers: getCustomerHeaders(session)
  });
}

export function bookCustomerEnquiry(enquiryId: string, session: CustomerSession) {
  return apiRequest<{ enquiry: CustomerEnquiry }>(`/api/customer/enquiries/${enquiryId}/book`, {
    method: "PATCH",
    headers: getCustomerHeaders(session)
  });
}

export function createCustomerReview(payload: CustomerReviewPayload, session: CustomerSession) {
  return apiRequest<{ review: CustomerReview }, CustomerReviewPayload>("/api/customer/reviews", {
    method: "POST",
    headers: getCustomerHeaders(session),
    body: payload
  });
}

export function listCustomerNotifications(
  session: CustomerSession,
  status: "pending" | "reviewed" | "all" = "pending"
) {
  return apiRequest<{ notifications: CustomerNotification[] }>(`/api/customer/notifications?status=${status}`, {
    method: "GET",
    headers: getCustomerHeaders(session)
  });
}

export function markCustomerNotificationReviewed(notificationId: string, session: CustomerSession) {
  return apiRequest<{ notification: CustomerNotification }>(
    `/api/customer/notifications/${notificationId}/reviewed`,
    {
      method: "PATCH",
      headers: getCustomerHeaders(session)
    }
  );
}
