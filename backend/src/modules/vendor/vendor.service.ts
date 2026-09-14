import bcrypt from "bcrypt";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "../../env.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error.js";
import type { AuthUserResponse } from "../auth/auth.types.js";
import {
  createNotification,
  listNotifications,
  markNotificationReviewed,
  type AppNotificationStatus
} from "../notifications/notification.service.js";
import type {
  VendorAuthResponse,
  VendorAvailabilityEventsResponse,
  VendorAvailabilityRequest,
  VendorAvailabilityResponse,
  VendorDashboardQuery,
  VendorDashboardResponse,
  VendorEnquiriesResponse,
  VendorEnquiryResponseRequest,
  VendorNotificationsResponse,
  VendorLoginRequest,
  VendorPackageRequest,
  VendorPackageResponse,
  VendorPasswordUpdateRequest,
  VendorPortfolioItemsResponse,
  VendorPortfolioRequest,
  VendorPortfolioResponse,
  VendorProfileResponse,
  VendorProfileUpdateResponse,
  VendorProfileUpdateRequest,
  VendorReviewsResponse,
  VendorServiceRequest,
  VendorServiceResponse,
  VendorServicesResponse,
  VendorSignupRequest
} from "./vendor.types.js";

const vendorSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  approvalStatus: true,
  createdAt: true,
  updatedAt: true
} as const;

const vendorProfileSelect = {
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
} as const;

const vendorPackageSelect = {
  id: true,
  userId: true,
  serviceId: true,
  name: true,
  price: true,
  description: true,
  createdAt: true,
  updatedAt: true
} as const;

const vendorServiceSelect = {
  id: true,
  userId: true,
  name: true,
  category: true,
  startingPrice: true,
  description: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  packages: {
    select: vendorPackageSelect,
    orderBy: { createdAt: "desc" }
  }
} as const;

const vendorPortfolioSelect = {
  id: true,
  userId: true,
  imageUrl: true,
  name: true,
  category: true,
  createdAt: true,
  updatedAt: true
} as const;

const vendorAvailabilitySelect = {
  id: true,
  userId: true,
  date: true,
  status: true,
  eventName: true,
  serviceName: true,
  packageName: true,
  location: true,
  guests: true,
  notes: true,
  createdAt: true,
  updatedAt: true
} as const;

const dashboardChartLabels: Record<VendorDashboardQuery["period"], string[]> = {
  "this-week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "this-month": ["Week 1", "Week 2", "Week 3", "Week 4"],
  "this-year": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

const vendorEnquirySelect = {
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
  }
} as const;

const vendorReviewSelect = {
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
  }
} as const;

type VendorSessionPayload = {
  sub: string;
  email: string;
  role: "VENDOR";
  iat: number;
  exp: number;
};

function signTokenPayload(payload: string) {
  return createHmac("sha256", env.AUTH_TOKEN_SECRET).update(payload).digest("base64url");
}

function createVendorSessionToken(user: AuthUserResponse) {
  if (user.role !== "VENDOR") {
    throw new AppError("Invalid vendor role", 403);
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: "VENDOR",
      iat: issuedAt,
      exp: issuedAt + env.AUTH_TOKEN_TTL_SECONDS
    } satisfies VendorSessionPayload)
  ).toString("base64url");

  return `${payload}.${signTokenPayload(payload)}`;
}

function getBearerToken(authorization: string | undefined) {
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim();
}

function assertVendorSession(authorization: string | undefined) {
  const token = getBearerToken(authorization);

  if (!token) {
    throw new AppError("Vendor login required", 401);
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    throw new AppError("Invalid vendor session", 401);
  }

  const expectedSignature = signTokenPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    throw new AppError("Invalid vendor session", 401);
  }

  let session: VendorSessionPayload;

  try {
    session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as VendorSessionPayload;
  } catch {
    throw new AppError("Invalid vendor session", 401);
  }

  if (session.role !== "VENDOR") {
    throw new AppError("Invalid vendor role", 403);
  }

  if (!session.exp || session.exp <= Math.floor(Date.now() / 1000)) {
    throw new AppError("Vendor session expired", 401);
  }

  return session;
}

async function resolveVendorUserId(authorization: string | undefined) {
  const userId = assertVendorSession(authorization).sub;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "VENDOR"
    },
    select: { id: true, approvalStatus: true }
  });

  if (!user) {
    throw new AppError("Vendor account not found", 404);
  }

  if (user.approvalStatus === "SUSPENDED") {
    throw new AppError("Vendor account is blocked", 403);
  }

  return user.id;
}

async function assertOwnedService(userId: string, serviceId: string) {
  const service = await prisma.vendorService.findFirst({
    where: { id: serviceId, userId },
    select: { id: true }
  });

  if (!service) {
    throw new AppError("Vendor service not found", 404);
  }
}

export async function signupVendor(input: VendorSignupRequest): Promise<VendorAuthResponse> {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.fullName,
      passwordHash,
      phone: input.phone,
      role: "VENDOR",
      approvalStatus: "PENDING"
    },
    select: vendorSelect
  });

  await createNotification({
    audience: "ADMIN",
    kind: "vendor",
    title: "Vendor created",
    detail: `${user.name} created a vendor account.`
  });

  return {
    user,
    token: createVendorSessionToken(user),
    profile: null
  };
}

export async function loginVendor(input: VendorLoginRequest): Promise<VendorAuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      ...vendorSelect,
      passwordHash: true
    }
  });

  if (!user || user.role !== "VENDOR") {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.approvalStatus === "SUSPENDED") {
    throw new AppError("Your vendor account is blocked", 403);
  }

  const authUser: AuthUserResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    approvalStatus: user.approvalStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  const profile = await prisma.vendorProfile.findUnique({
    where: { userId: authUser.id },
    select: vendorProfileSelect
  });

  return {
    user: authUser,
    token: createVendorSessionToken(authUser),
    profile
  };
}

export async function getVendorProfile(authorization: string | undefined): Promise<VendorProfileResponse> {
  const userId = assertVendorSession(authorization).sub;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "VENDOR"
    },
    select: vendorSelect
  });

  if (!user) {
    throw new AppError("Vendor account not found", 404);
  }

  if (user.approvalStatus === "SUSPENDED") {
    throw new AppError("Vendor account is blocked", 403);
  }

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
    select: vendorProfileSelect
  });

  return { user, profile };
}

export async function updateVendorProfile(
  authorization: string | undefined,
  input: VendorProfileUpdateRequest
): Promise<VendorProfileUpdateResponse> {
  const userId = assertVendorSession(authorization).sub;
  const currentUser = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "VENDOR"
    },
    select: { id: true, approvalStatus: true }
  });

  if (!currentUser) {
    throw new AppError("Vendor account not found", 404);
  }

  if (currentUser.approvalStatus === "SUSPENDED") {
    throw new AppError("Vendor account is blocked", 403);
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
      role: "VENDOR"
    },
    data: {
      name: input.ownerName,
      email: input.email,
      phone: input.phone ?? null
    },
    select: vendorSelect
  });

  const profile = await prisma.vendorProfile.upsert({
    where: { userId },
    create: {
      userId,
      ownerName: input.ownerName,
      vendorName: input.vendorName,
      category: input.category,
      location: input.location,
      about: input.about ?? null,
      imageUrl: input.imageUrl ?? null
    },
    update: {
      ownerName: input.ownerName,
      vendorName: input.vendorName,
      category: input.category,
      location: input.location,
      about: input.about ?? null,
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || null } : {})
    },
    select: vendorProfileSelect
  });

  return { user, profile };
}

export async function updateVendorPassword(
  authorization: string | undefined,
  input: VendorPasswordUpdateRequest
): Promise<AuthUserResponse> {
  const userId = assertVendorSession(authorization).sub;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      role: "VENDOR"
    },
    select: {
      ...vendorSelect,
      passwordHash: true
    }
  });

  if (!user) {
    throw new AppError("Vendor account not found", 404);
  }

  if (user.approvalStatus === "SUSPENDED") {
    throw new AppError("Vendor account is blocked", 403);
  }

  const passwordMatches = await bcrypt.compare(input.currentPassword, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Current password is incorrect", 401);
  }

  const passwordHash = await bcrypt.hash(input.newPassword, 12);

  return prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
    select: vendorSelect
  });
}

export async function listVendorServices(
  authorization: string | undefined
): Promise<VendorServicesResponse> {
  const userId = await resolveVendorUserId(authorization);
  const services = await prisma.vendorService.findMany({
    where: { userId },
    select: vendorServiceSelect,
    orderBy: { createdAt: "desc" }
  });

  return { services };
}

export async function createVendorService(
  authorization: string | undefined,
  input: VendorServiceRequest
): Promise<VendorServiceResponse> {
  const userId = await resolveVendorUserId(authorization);

  return prisma.vendorService.create({
    data: {
      userId,
      name: input.name,
      category: input.category,
      startingPrice: input.startingPrice,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null
    },
    select: vendorServiceSelect
  });
}

export async function updateVendorService(
  authorization: string | undefined,
  serviceId: string,
  input: VendorServiceRequest
): Promise<VendorServiceResponse> {
  const userId = await resolveVendorUserId(authorization);
  await assertOwnedService(userId, serviceId);

  return prisma.vendorService.update({
    where: { id: serviceId },
    data: {
      name: input.name,
      category: input.category,
      startingPrice: input.startingPrice,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null
    },
    select: vendorServiceSelect
  });
}

export async function deleteVendorService(authorization: string | undefined, serviceId: string) {
  const userId = await resolveVendorUserId(authorization);
  await assertOwnedService(userId, serviceId);
  await prisma.vendorService.delete({ where: { id: serviceId } });

  return { id: serviceId };
}

export async function listVendorPackages(
  authorization: string | undefined
): Promise<{ packages: VendorPackageResponse[] }> {
  const userId = await resolveVendorUserId(authorization);
  const packages = await prisma.vendorPackage.findMany({
    where: { userId },
    select: vendorPackageSelect,
    orderBy: { createdAt: "desc" }
  });

  return { packages };
}

export async function createVendorPackage(
  authorization: string | undefined,
  input: VendorPackageRequest
): Promise<VendorPackageResponse> {
  const userId = await resolveVendorUserId(authorization);

  if (input.serviceId) {
    await assertOwnedService(userId, input.serviceId);
  }

  return prisma.vendorPackage.create({
    data: {
      userId,
      serviceId: input.serviceId ?? null,
      name: input.name,
      price: input.price,
      description: input.description ?? null
    },
    select: vendorPackageSelect
  });
}

export async function updateVendorPackage(
  authorization: string | undefined,
  packageId: string,
  input: VendorPackageRequest
): Promise<VendorPackageResponse> {
  const userId = await resolveVendorUserId(authorization);
  const packageItem = await prisma.vendorPackage.findFirst({
    where: { id: packageId, userId },
    select: { id: true }
  });

  if (!packageItem) {
    throw new AppError("Vendor package not found", 404);
  }

  if (input.serviceId) {
    await assertOwnedService(userId, input.serviceId);
  }

  return prisma.vendorPackage.update({
    where: { id: packageId },
    data: {
      serviceId: input.serviceId ?? null,
      name: input.name,
      price: input.price,
      description: input.description ?? null
    },
    select: vendorPackageSelect
  });
}

export async function deleteVendorPackage(authorization: string | undefined, packageId: string) {
  const userId = await resolveVendorUserId(authorization);
  const packageItem = await prisma.vendorPackage.findFirst({
    where: { id: packageId, userId },
    select: { id: true }
  });

  if (!packageItem) {
    throw new AppError("Vendor package not found", 404);
  }

  await prisma.vendorPackage.delete({ where: { id: packageId } });

  return { id: packageId };
}

export async function listVendorPortfolio(
  authorization: string | undefined
): Promise<VendorPortfolioItemsResponse> {
  const userId = await resolveVendorUserId(authorization);
  const portfolio = await prisma.vendorPortfolioItem.findMany({
    where: { userId },
    select: vendorPortfolioSelect,
    orderBy: { createdAt: "desc" }
  });

  return { portfolio };
}

export async function createVendorPortfolioItem(
  authorization: string | undefined,
  input: VendorPortfolioRequest
): Promise<VendorPortfolioResponse> {
  const userId = await resolveVendorUserId(authorization);

  return prisma.vendorPortfolioItem.create({
    data: {
      userId,
      imageUrl: input.imageUrl,
      name: input.name,
      category: input.category
    },
    select: vendorPortfolioSelect
  });
}

export async function deleteVendorPortfolioItem(authorization: string | undefined, itemId: string) {
  const userId = await resolveVendorUserId(authorization);
  const item = await prisma.vendorPortfolioItem.findFirst({
    where: { id: itemId, userId },
    select: { id: true }
  });

  if (!item) {
    throw new AppError("Vendor portfolio item not found", 404);
  }

  await prisma.vendorPortfolioItem.delete({ where: { id: itemId } });

  return { id: itemId };
}

export async function listVendorAvailability(
  authorization: string | undefined
): Promise<VendorAvailabilityEventsResponse> {
  const userId = await resolveVendorUserId(authorization);
  const events = await prisma.vendorAvailabilityEvent.findMany({
    where: { userId },
    select: vendorAvailabilitySelect,
    orderBy: { date: "asc" }
  });

  return { events };
}

export async function upsertVendorAvailabilityEvent(
  authorization: string | undefined,
  input: VendorAvailabilityRequest
): Promise<VendorAvailabilityResponse> {
  const userId = await resolveVendorUserId(authorization);

  return prisma.vendorAvailabilityEvent.upsert({
    where: {
      userId_date: {
        userId,
        date: input.date
      }
    },
    create: {
      userId,
      date: input.date,
      status: input.status,
      eventName: input.eventName,
      serviceName: input.serviceName ?? null,
      packageName: input.packageName ?? null,
      location: input.location ?? null,
      guests: input.guests ?? null,
      notes: input.notes ?? null
    },
    update: {
      status: input.status,
      eventName: input.eventName,
      serviceName: input.serviceName ?? null,
      packageName: input.packageName ?? null,
      location: input.location ?? null,
      guests: input.guests ?? null,
      notes: input.notes ?? null
    },
    select: vendorAvailabilitySelect
  });
}

export async function listVendorEnquiries(
  authorization: string | undefined
): Promise<VendorEnquiriesResponse> {
  const userId = await resolveVendorUserId(authorization);
  const enquiries = await prisma.customerEnquiry.findMany({
    where: { vendorId: userId },
    select: vendorEnquirySelect,
    orderBy: { createdAt: "desc" }
  });

  return { enquiries };
}

export async function deleteVendorEnquiry(authorization: string | undefined, enquiryId: string) {
  const userId = await resolveVendorUserId(authorization);
  const enquiry = await prisma.customerEnquiry.findFirst({
    where: { id: enquiryId, vendorId: userId },
    select: { id: true }
  });

  if (!enquiry) {
    throw new AppError("Vendor enquiry not found", 404);
  }

  await prisma.customerEnquiry.delete({ where: { id: enquiryId } });

  return { id: enquiryId };
}

export async function respondToVendorEnquiry(
  authorization: string | undefined,
  enquiryId: string,
  input: VendorEnquiryResponseRequest
) {
  const userId = await resolveVendorUserId(authorization);
  const existing = await prisma.customerEnquiry.findFirst({
    where: { id: enquiryId, vendorId: userId },
    select: {
      id: true,
      customerId: true,
      packageName: true,
      customer: {
        select: {
          name: true
        }
      },
      vendor: {
        select: {
          email: true,
          vendorProfile: {
            select: {
              vendorName: true
            }
          }
        }
      }
    }
  });

  if (!existing) {
    throw new AppError("Vendor enquiry not found", 404);
  }

  const enquiry = await prisma.customerEnquiry.update({
    where: { id: enquiryId },
    data: {
      vendorResponse: input.message,
      respondedAt: new Date(),
      status: "replied"
    },
    select: vendorEnquirySelect
  });

  const vendorName = existing.vendor.vendorProfile?.vendorName ?? existing.vendor.email;
  await Promise.all([
    createNotification({
      audience: "CUSTOMER",
      recipientId: existing.customerId,
      kind: "enquiry",
      title: "Vendor response received",
      detail: `${vendorName} responded to your enquiry${existing.packageName ? ` for ${existing.packageName}` : ""}.`
    }),
    createNotification({
      audience: "ADMIN",
      kind: "enquiry",
      title: "Vendor responded to enquiry",
      detail: `${vendorName} responded to ${existing.customer.name}'s enquiry.`
    })
  ]);

  return { enquiry };
}

export async function listVendorReviews(
  authorization: string | undefined
): Promise<VendorReviewsResponse> {
  const userId = await resolveVendorUserId(authorization);
  const reviews = await prisma.customerReview.findMany({
    where: { vendorId: userId },
    select: vendorReviewSelect,
    orderBy: { updatedAt: "desc" }
  });

  return { reviews };
}

export async function listVendorNotifications(
  authorization: string | undefined,
  status: AppNotificationStatus | "ALL" = "PENDING"
): Promise<VendorNotificationsResponse> {
  const userId = await resolveVendorUserId(authorization);
  const notifications = await listNotifications({
    audience: "VENDOR",
    recipientId: userId,
    status
  });

  return {
    notifications: notifications.map((notification) => ({
      ...notification,
      kind: getVendorNotificationKind(notification.kind)
    }))
  };
}

export async function reviewVendorNotification(
  authorization: string | undefined,
  notificationId: string
) {
  const userId = await resolveVendorUserId(authorization);
  const notification = await markNotificationReviewed({
    id: notificationId,
    audience: "VENDOR",
    recipientId: userId
  });

  return {
    notification: {
      ...notification,
      kind: getVendorNotificationKind(notification.kind)
    }
  };
}

function getVendorNotificationKind(kind: string) {
  if (kind === "review" || kind === "booking") {
    return kind;
  }

  return "enquiry";
}

export async function getVendorDashboardOverview(
  authorization: string | undefined,
  period: VendorDashboardQuery["period"]
): Promise<VendorDashboardResponse> {
  const userId = await resolveVendorUserId(authorization);
  const [totalEnquiries, recentEnquiries, enquiriesForChart] = await Promise.all([
    prisma.customerEnquiry.count({
      where: { vendorId: userId }
    }),
    prisma.customerEnquiry.findMany({
      where: { vendorId: userId },
      select: vendorEnquirySelect,
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.customerEnquiry.findMany({
      where: {
        vendorId: userId,
        createdAt: {
          gte: getPeriodStart(period)
        }
      },
      select: {
        createdAt: true
      }
    })
  ]);

  return {
    stats: {
      totalEnquiries,
      totalRevenue: 0
    },
    recentEnquiries: recentEnquiries.map((enquiry) => ({
      id: enquiry.id,
      customer: enquiry.customer.name,
      event: getEnquirySummary(enquiry.message, enquiry.packageName),
      date: formatShortDate(enquiry.createdAt),
      status: formatEnquiryStatus(enquiry.status)
    })),
    bookingOverview: {
      period,
      points: createEnquiryChartPoints(period, enquiriesForChart.map((enquiry) => enquiry.createdAt))
    }
  };
}

function getPeriodStart(period: VendorDashboardQuery["period"]) {
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

function createEnquiryChartPoints(period: VendorDashboardQuery["period"], dates: Date[]) {
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

function getChartIndex(period: VendorDashboardQuery["period"], date: Date) {
  if (period === "this-week") {
    const day = date.getDay();

    return day === 0 ? 6 : day - 1;
  }

  if (period === "this-month") {
    return Math.min(3, Math.floor((date.getDate() - 1) / 7));
  }

  return date.getMonth();
}

function getEnquirySummary(message: string, packageName: string | null) {
  const serviceLine = message
    .split("\n")
    .find((line) => line.toLowerCase().startsWith("service:"))
    ?.replace(/^service:\s*/i, "")
    .trim();

  if (serviceLine && packageName) {
    return `${serviceLine} - ${packageName}`;
  }

  return serviceLine || packageName || "Quote request";
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatEnquiryStatus(status: string) {
  return status.slice(0, 1).toUpperCase() + status.slice(1);
}
