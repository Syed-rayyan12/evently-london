import { apiRequest } from "./request";

export type CustomerSignupPayload = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: SignupRole;
};

export type AuthUserRole = "CUSTOMER" | "VENDOR" | "ADMIN";
export type SignupRole = "CUSTOMER" | "VENDOR";
export type AccountApprovalStatus = "PENDING" | "APPROVED" | "SUSPENDED";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: AuthUserRole;
  approvalStatus: AccountApprovalStatus;
  createdAt: string;
  updatedAt: string;
};

export type VendorProfileDetails = {
  id: string;
  userId: string;
  ownerName: string;
  vendorName: string;
  category: string;
  location: string;
  about: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerSignupResult = {
  user: AuthUser;
  token: string;
  profile?: VendorProfileDetails | null;
};

export type LoginPayload = {
  email: string;
  password: string;
  role: SignupRole;
};

export type LoginResult = {
  user: AuthUser;
  token: string;
  profile?: VendorProfileDetails | null;
};

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
  token: string;
};

export type AdminLoginResult = {
  admin: AdminUser;
};

export function signupCustomer(payload: CustomerSignupPayload) {
  return apiRequest<CustomerSignupResult, CustomerSignupPayload>("/api/auth/signup", {
    method: "POST",
    body: payload
  });
}

export function signupVendor(payload: Omit<CustomerSignupPayload, "role">) {
  return apiRequest<CustomerSignupResult, Omit<CustomerSignupPayload, "role">>("/api/vendor/signup", {
    method: "POST",
    body: payload
  });
}

export function loginAccount(payload: LoginPayload) {
  return apiRequest<LoginResult, LoginPayload>("/api/auth/login", {
    method: "POST",
    body: payload
  });
}

export function loginVendor(payload: Omit<LoginPayload, "role">) {
  return apiRequest<LoginResult, Omit<LoginPayload, "role">>("/api/vendor/login", {
    method: "POST",
    body: payload
  });
}

export function loginAdmin(payload: AdminLoginPayload) {
  return apiRequest<AdminLoginResult, AdminLoginPayload>("/api/auth/admin/login", {
    method: "POST",
    body: payload
  });
}

export type PendingApprovalsResult = {
  approvals: AuthUser[];
};

export type ApprovalStatusPayload = {
  status: Extract<AccountApprovalStatus, "APPROVED" | "SUSPENDED">;
};

export type ApprovalUpdateResult = {
  user: AuthUser;
};

export function listPendingApprovals(adminToken: string) {
  return apiRequest<PendingApprovalsResult>("/api/auth/approvals", {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export function updateApprovalStatus(
  userId: string,
  payload: ApprovalStatusPayload,
  adminToken: string
) {
  return apiRequest<ApprovalUpdateResult, ApprovalStatusPayload>(`/api/auth/approvals/${userId}`, {
    method: "PATCH",
    headers: {
      "x-admin-token": adminToken
    },
    body: payload
  });
}

export type AdminUsersResult = {
  users: Array<
    AuthUser & {
      _count?: {
        customerSavedVendors?: number;
        customerEnquiries?: number;
      };
    }
  >;
};

export type AdminVendorsResult = {
  vendors: Array<AuthUser & { vendorProfile: VendorProfileDetails | null }>;
};

export function listAdminUsers(adminToken: string) {
  return apiRequest<AdminUsersResult>("/api/admin/users", {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export function listAdminVendors(adminToken: string) {
  return apiRequest<AdminVendorsResult>("/api/admin/vendors", {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export type AdminDashboardPeriod = "this-week" | "this-month" | "this-year";

export type AdminDashboardOverview = {
  stats: {
    totalVendors: number;
    totalUsers: number;
    totalEnquiries: number;
    totalReviews: number;
  };
  enquiryOverview: {
    period: AdminDashboardPeriod;
    points: Array<{
      label: string;
      value: number;
    }>;
  };
  categories: Array<{
    label: string;
    count: number;
    percent: number;
  }>;
  recentEnquiries: Array<{
    id: string;
    customer: string;
    category: string;
    time: string;
  }>;
};

export type AdminReview = {
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
  createdAt: string;
  updatedAt: string;
};

export type AdminEnquiry = {
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

export type AdminAnalyticsOverview = {
  stats: {
    totalVendors: number;
    totalUsers: number;
    totalEnquiries: number;
    totalRevenue: number;
  };
  revenueOverview: {
    period: AdminDashboardPeriod;
    points: Array<{
      label: string;
      value: number;
    }>;
  };
  topCategories: Array<{
    label: string;
    vendors: number;
    enquiries: number;
    reviews: number;
    revenue: number;
    percent: number;
    performance: number;
  }>;
  categoryPerformance: Array<{
    label: string;
    vendors: number;
    enquiries: number;
    reviews: number;
    revenue: number;
    percent: number;
    performance: number;
  }>;
};

export function getAdminDashboardOverview(
  adminToken: string,
  period: AdminDashboardPeriod = "this-month"
) {
  return apiRequest<AdminDashboardOverview>(`/api/admin/dashboard?period=${period}`, {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export function getAdminAnalytics(
  adminToken: string,
  period: AdminDashboardPeriod = "this-month"
) {
  return apiRequest<AdminAnalyticsOverview>(`/api/admin/analytics?period=${period}`, {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export function listAdminReviews(adminToken: string) {
  return apiRequest<{ reviews: AdminReview[] }>("/api/admin/reviews", {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export function listAdminEnquiries(adminToken: string) {
  return apiRequest<{ enquiries: AdminEnquiry[] }>("/api/admin/enquiries", {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export function listAdminBookings(adminToken: string) {
  return apiRequest<{ bookings: AdminEnquiry[] }>("/api/admin/bookings", {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export type CustomerProfileUpdatePayload = {
  fullName: string;
  email: string;
  phone?: string;
};

export type CustomerProfileUpdateResult = {
  user: AuthUser;
};

export type CustomerProfileResult = {
  user: AuthUser;
};

export type CustomerPasswordUpdatePayload = {
  currentPassword: string;
  newPassword: string;
};

export type CustomerPasswordUpdateResult = {
  user: AuthUser;
};

export function getCustomerProfile(session: { token?: string }) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return apiRequest<CustomerProfileResult>("/api/auth/customer/me", {
    method: "GET",
    headers
  });
}

export function updateCustomerProfile(
  payload: CustomerProfileUpdatePayload,
  session: { token?: string }
) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return apiRequest<CustomerProfileUpdateResult, CustomerProfileUpdatePayload>(
    "/api/auth/customer/profile",
    {
      method: "PUT",
      headers,
      body: payload
    }
  );
}

export function updateCustomerPassword(
  payload: CustomerPasswordUpdatePayload,
  session: { token?: string }
) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return apiRequest<CustomerPasswordUpdateResult, CustomerPasswordUpdatePayload>(
    "/api/auth/customer/password",
    {
      method: "PUT",
      headers,
      body: payload
    }
  );
}

export type VendorProfileUpdatePayload = {
  ownerName: string;
  vendorName: string;
  category: string;
  location: string;
  email: string;
  phone?: string;
  about?: string;
  imageUrl?: string;
};

export type VendorProfileUpdateResult = {
  user: AuthUser;
  profile: VendorProfileDetails;
};

export type VendorProfileResult = {
  user: AuthUser;
  profile: VendorProfileDetails | null;
};
export type VendorPasswordUpdatePayload = CustomerPasswordUpdatePayload;
export type VendorPasswordUpdateResult = CustomerPasswordUpdateResult;

export function getVendorProfile(session: { token?: string }) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return apiRequest<VendorProfileResult>("/api/vendor/me", {
    method: "GET",
    headers
  });
}

export function updateVendorProfile(
  payload: VendorProfileUpdatePayload,
  session: { token?: string }
) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return apiRequest<VendorProfileUpdateResult, VendorProfileUpdatePayload>("/api/vendor/profile", {
    method: "PATCH",
    headers,
    body: payload
  });
}

export function updateVendorPassword(
  payload: VendorPasswordUpdatePayload,
  session: { token?: string }
) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return apiRequest<VendorPasswordUpdateResult, VendorPasswordUpdatePayload>("/api/vendor/password", {
    method: "PATCH",
    headers,
    body: payload
  });
}

export type VendorPackage = {
  id: string;
  userId: string;
  serviceId: string | null;
  name: string;
  price: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VendorService = {
  id: string;
  userId: string;
  name: string;
  category: string;
  startingPrice: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  packages: VendorPackage[];
};

export type VendorPortfolioItem = {
  id: string;
  userId: string;
  imageUrl: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type VendorAvailabilityEvent = {
  id: string;
  userId: string;
  date: string;
  status: "available" | "booked" | "pending" | "unavailable";
  eventName: string;
  serviceName: string | null;
  packageName: string | null;
  location: string | null;
  guests: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VendorServicePayload = {
  name: string;
  category: string;
  startingPrice: string;
  description?: string;
  imageUrl?: string;
};

export type VendorPackagePayload = {
  serviceId?: string;
  name: string;
  price: string;
  description?: string;
};

export type VendorPortfolioPayload = {
  imageUrl: string;
  name: string;
  category: string;
};

export type VendorAvailabilityPayload = {
  date: string;
  status: VendorAvailabilityEvent["status"];
  eventName: string;
  serviceName?: string;
  packageName?: string;
  location?: string;
  guests?: string;
  notes?: string;
};

export type VendorDashboardPeriod = "this-week" | "this-month" | "this-year";

export type VendorDashboardOverview = {
  stats: {
    totalEnquiries: number;
    totalRevenue: number;
  };
  recentEnquiries: Array<{
    id: string;
    customer: string;
    event: string;
    date: string;
    status: string;
  }>;
  bookingOverview: {
    period: VendorDashboardPeriod;
    points: Array<{
      label: string;
      value: number;
    }>;
  };
};

export type VendorEnquiry = {
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
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
};

export type VendorReview = {
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
    phone: string | null;
  };
};

export type AppNotification = {
  id: string;
  kind: string;
  title: string;
  detail: string;
  status: "PENDING" | "REVIEWED";
  createdAt: string;
  updatedAt: string;
};

function getVendorHeaders(session: { token?: string }) {
  const headers: HeadersInit = {};

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return headers;
}

export function listVendorServices(session: { token?: string }) {
  return apiRequest<{ services: VendorService[] }>("/api/vendor/services", {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function createVendorService(payload: VendorServicePayload, session: { token?: string }) {
  return apiRequest<VendorService, VendorServicePayload>("/api/vendor/services", {
    method: "POST",
    headers: getVendorHeaders(session),
    body: payload
  });
}

export function updateVendorService(
  serviceId: string,
  payload: VendorServicePayload,
  session: { token?: string }
) {
  return apiRequest<VendorService, VendorServicePayload>(`/api/vendor/services/${serviceId}`, {
    method: "PATCH",
    headers: getVendorHeaders(session),
    body: payload
  });
}

export function deleteVendorService(serviceId: string, session: { token?: string }) {
  return apiRequest<{ id: string }>(`/api/vendor/services/${serviceId}`, {
    method: "DELETE",
    headers: getVendorHeaders(session)
  });
}

export function listVendorPackages(session: { token?: string }) {
  return apiRequest<{ packages: VendorPackage[] }>("/api/vendor/packages", {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function createVendorPackage(payload: VendorPackagePayload, session: { token?: string }) {
  return apiRequest<VendorPackage, VendorPackagePayload>("/api/vendor/packages", {
    method: "POST",
    headers: getVendorHeaders(session),
    body: payload
  });
}

export function updateVendorPackage(
  packageId: string,
  payload: VendorPackagePayload,
  session: { token?: string }
) {
  return apiRequest<VendorPackage, VendorPackagePayload>(`/api/vendor/packages/${packageId}`, {
    method: "PATCH",
    headers: getVendorHeaders(session),
    body: payload
  });
}

export function deleteVendorPackage(packageId: string, session: { token?: string }) {
  return apiRequest<{ id: string }>(`/api/vendor/packages/${packageId}`, {
    method: "DELETE",
    headers: getVendorHeaders(session)
  });
}

export function listVendorPortfolio(session: { token?: string }) {
  return apiRequest<{ portfolio: VendorPortfolioItem[] }>("/api/vendor/portfolio", {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function createVendorPortfolioItem(
  payload: VendorPortfolioPayload,
  session: { token?: string }
) {
  return apiRequest<VendorPortfolioItem, VendorPortfolioPayload>("/api/vendor/portfolio", {
    method: "POST",
    headers: getVendorHeaders(session),
    body: payload
  });
}

export function deleteVendorPortfolioItem(itemId: string, session: { token?: string }) {
  return apiRequest<{ id: string }>(`/api/vendor/portfolio/${itemId}`, {
    method: "DELETE",
    headers: getVendorHeaders(session)
  });
}

export function listVendorAvailability(session: { token?: string }) {
  return apiRequest<{ events: VendorAvailabilityEvent[] }>("/api/vendor/availability", {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function upsertVendorAvailability(
  payload: VendorAvailabilityPayload,
  session: { token?: string }
) {
  return apiRequest<VendorAvailabilityEvent, VendorAvailabilityPayload>("/api/vendor/availability", {
    method: "PATCH",
    headers: getVendorHeaders(session),
    body: payload
  });
}

export function getVendorDashboardOverview(
  period: VendorDashboardPeriod,
  session: { token?: string }
) {
  return apiRequest<VendorDashboardOverview>(`/api/vendor/dashboard?period=${period}`, {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function listVendorEnquiries(session: { token?: string }) {
  return apiRequest<{ enquiries: VendorEnquiry[] }>("/api/vendor/enquiries", {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function respondToVendorEnquiry(
  enquiryId: string,
  payload: { message: string },
  session: { token?: string }
) {
  return apiRequest<{ enquiry: VendorEnquiry }, { message: string }>(
    `/api/vendor/enquiries/${enquiryId}/response`,
    {
      method: "PATCH",
      headers: getVendorHeaders(session),
      body: payload
    }
  );
}

export function deleteVendorEnquiry(enquiryId: string, session: { token?: string }) {
  return apiRequest<{ id: string }>(`/api/vendor/enquiries/${enquiryId}`, {
    method: "DELETE",
    headers: getVendorHeaders(session)
  });
}

export function listVendorReviews(session: { token?: string }) {
  return apiRequest<{ reviews: VendorReview[] }>("/api/vendor/reviews", {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function listVendorNotifications(
  session: { token?: string },
  status: "pending" | "reviewed" | "all" = "pending"
) {
  return apiRequest<{ notifications: AppNotification[] }>(`/api/vendor/notifications?status=${status}`, {
    method: "GET",
    headers: getVendorHeaders(session)
  });
}

export function markVendorNotificationReviewed(notificationId: string, session: { token?: string }) {
  return apiRequest<{ notification: AppNotification }>(
    `/api/vendor/notifications/${notificationId}/reviewed`,
    {
      method: "PATCH",
      headers: getVendorHeaders(session)
    }
  );
}

export function listAdminNotifications(
  adminToken: string,
  status: "pending" | "reviewed" | "all" = "pending"
) {
  return apiRequest<{ notifications: AppNotification[] }>(`/api/admin/notifications?status=${status}`, {
    method: "GET",
    headers: {
      "x-admin-token": adminToken
    }
  });
}

export function markAdminNotificationReviewed(notificationId: string, adminToken: string) {
  return apiRequest<{ notification: AppNotification }>(
    `/api/admin/notifications/${notificationId}/reviewed`,
    {
      method: "PATCH",
      headers: {
        "x-admin-token": adminToken
      }
    }
  );
}
