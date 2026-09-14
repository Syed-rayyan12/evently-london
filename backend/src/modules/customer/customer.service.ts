import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error.js";
import { assertCustomerSession } from "../auth/auth.service.js";
import {
  createNotification,
  listNotifications,
  markNotificationReviewed,
  type AppNotificationStatus
} from "../notifications/notification.service.js";
import {
  mapUserToPublicVendor,
  publicVendorSelect
} from "../public-vendors/public-vendors.service.js";
import type {
  CustomerBookEnquiryResponse,
  CustomerEnquiryRequest,
  CustomerEnquiriesResponse,
  CustomerEnquiryResponse,
  CustomerNotification,
  CustomerNotificationsResponse,
  CustomerReviewRequest,
  CustomerReviewResponse,
  SavedVendorRequest,
  SavedVendorResponse,
  SavedVendorsResponse
} from "./customer.types.js";

async function resolveCustomerUserId(authorization: string | undefined) {
  const userId = assertCustomerSession(authorization).sub;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "CUSTOMER",
      approvalStatus: {
        not: "SUSPENDED"
      }
    },
    select: { id: true }
  });

  if (!user) {
    throw new AppError("Customer account not found", 404);
  }

  return user.id;
}

async function assertPublicVendor(vendorId: string) {
  const vendor = await prisma.user.findFirst({
    where: {
      id: vendorId,
      role: "VENDOR",
      approvalStatus: {
        not: "SUSPENDED"
      },
      vendorProfile: {
        isNot: null
      }
    },
    select: publicVendorSelect
  });

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  return vendor;
}

export async function listSavedVendors(
  authorization: string | undefined
): Promise<SavedVendorsResponse> {
  const customerId = await resolveCustomerUserId(authorization);
  const savedVendors = await prisma.customerSavedVendor.findMany({
    where: { customerId },
    select: {
      createdAt: true,
      vendor: {
        select: publicVendorSelect
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return {
    savedVendors: savedVendors.map((item) => ({
      ...mapUserToPublicVendor(item.vendor),
      savedAt: item.createdAt
    }))
  };
}

export async function saveVendor(
  authorization: string | undefined,
  input: SavedVendorRequest
): Promise<SavedVendorResponse> {
  const customerId = await resolveCustomerUserId(authorization);
  await assertPublicVendor(input.vendorId);

  const savedVendor = await prisma.customerSavedVendor.upsert({
    where: {
      customerId_vendorId: {
        customerId,
        vendorId: input.vendorId
      }
    },
    create: {
      customerId,
      vendorId: input.vendorId
    },
    update: {},
    select: {
      createdAt: true,
      vendor: {
        select: publicVendorSelect
      }
    }
  });

  return {
    savedVendor: {
      ...mapUserToPublicVendor(savedVendor.vendor),
      savedAt: savedVendor.createdAt
    }
  };
}

export async function removeSavedVendor(
  authorization: string | undefined,
  vendorId: string
) {
  const customerId = await resolveCustomerUserId(authorization);

  await prisma.customerSavedVendor.deleteMany({
    where: {
      customerId,
      vendorId
    }
  });

  return { vendorId };
}

export async function listCustomerEnquiries(
  authorization: string | undefined
): Promise<CustomerEnquiriesResponse> {
  const customerId = await resolveCustomerUserId(authorization);
  const enquiries = await prisma.customerEnquiry.findMany({
    where: { customerId },
    select: {
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
      vendor: {
        select: {
          id: true,
          email: true,
          name: true,
          vendorProfile: {
            select: {
              vendorName: true,
              category: true,
              imageUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return { enquiries };
}

export async function createCustomerEnquiry(
  authorization: string | undefined,
  input: CustomerEnquiryRequest
): Promise<CustomerEnquiryResponse> {
  const customerId = await resolveCustomerUserId(authorization);
  const vendor = await assertPublicVendor(input.vendorId);
  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    select: { name: true }
  });

  let packageName = input.packageName ?? null;

  if (input.packageId) {
    const packageItem = await prisma.vendorPackage.findFirst({
      where: {
        id: input.packageId,
        userId: input.vendorId
      },
      select: {
        id: true,
        name: true
      }
    });

    if (!packageItem) {
      throw new AppError("Vendor package not found", 404);
    }

    packageName = packageItem.name;
  }

  const enquiry = await prisma.customerEnquiry.create({
    data: {
      customerId,
      vendorId: input.vendorId,
      packageId: input.packageId ?? null,
      packageName,
      message: input.message
    },
    select: {
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
      updatedAt: true
    }
  });

  const vendorName = vendor.vendorProfile?.vendorName ?? vendor.email;
  const customerName = customer?.name ?? "A customer";
  await Promise.all([
    createNotification({
      audience: "CUSTOMER",
      recipientId: customerId,
      kind: "enquiry",
      title: "Enquiry sent",
      detail: `You sent ${vendorName} a request${packageName ? ` for ${packageName}` : ""}.`
    }),
    createNotification({
      audience: "VENDOR",
      recipientId: input.vendorId,
      kind: "enquiry",
      title: "New enquiry received",
      detail: `${customerName} requested ${packageName ? packageName : "a custom quote"}.`
    }),
    createNotification({
      audience: "ADMIN",
      kind: "enquiry",
      title: "Customer enquiry placed",
      detail: `${customerName} sent an enquiry to ${vendorName}${packageName ? ` for ${packageName}` : ""}.`
    })
  ]);

  return { enquiry };
}

export async function bookCustomerEnquiry(
  authorization: string | undefined,
  enquiryId: string
): Promise<CustomerBookEnquiryResponse> {
  const customerId = await resolveCustomerUserId(authorization);
  const existing = await prisma.customerEnquiry.findFirst({
    where: {
      id: enquiryId,
      customerId
    },
    select: {
      id: true,
      packageName: true,
      vendorResponse: true,
      status: true,
      customer: {
        select: {
          name: true
        }
      },
      vendor: {
        select: {
          id: true,
          email: true,
          name: true,
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
    throw new AppError("Customer enquiry not found", 404);
  }

  if (!existing.vendorResponse) {
    throw new AppError("You can book only after the vendor replies to your enquiry.", 400);
  }

  if (existing.status === "booked") {
    throw new AppError("This enquiry is already booked.", 400);
  }

  const enquiry = await prisma.customerEnquiry.update({
    where: { id: enquiryId },
    data: {
      status: "booked"
    },
    select: {
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
      vendor: {
        select: {
          id: true,
          email: true,
          name: true,
          vendorProfile: {
            select: {
              vendorName: true,
              category: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });

  const vendorName = existing.vendor.vendorProfile?.vendorName ?? existing.vendor.email;
  const packageDetail = existing.packageName ? ` for ${existing.packageName}` : "";
  await Promise.all([
    createNotification({
      audience: "CUSTOMER",
      recipientId: customerId,
      kind: "booking",
      title: "Enquiry booked",
      detail: `You booked ${vendorName}${packageDetail}.`
    }),
    createNotification({
      audience: "VENDOR",
      recipientId: existing.vendor.id,
      kind: "booking",
      title: "Enquiry booked",
      detail: `${existing.customer.name} booked your enquiry${packageDetail}.`
    }),
    createNotification({
      audience: "ADMIN",
      kind: "booking",
      title: "Customer booked enquiry",
      detail: `${existing.customer.name} booked ${vendorName}${packageDetail}.`
    })
  ]);

  return { enquiry };
}

export async function createCustomerReview(
  authorization: string | undefined,
  input: CustomerReviewRequest
): Promise<CustomerReviewResponse> {
  const customerId = await resolveCustomerUserId(authorization);
  const vendor = await assertPublicVendor(input.vendorId);

  const review = await prisma.customerReview.upsert({
    where: {
      customerId_vendorId: {
        customerId,
        vendorId: input.vendorId
      }
    },
    create: {
      customerId,
      vendorId: input.vendorId,
      rating: input.rating,
      message: input.message
    },
    update: {
      rating: input.rating,
      message: input.message
    },
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
          email: true
        }
      }
    }
  });

  const vendorName = vendor.vendorProfile?.vendorName ?? vendor.email;
  await Promise.all([
    createNotification({
      audience: "CUSTOMER",
      recipientId: customerId,
      kind: "review",
      title: "Review placed",
      detail: `You rated ${vendorName} ${input.rating} star${input.rating === 1 ? "" : "s"}.`
    }),
    createNotification({
      audience: "VENDOR",
      recipientId: input.vendorId,
      kind: "review",
      title: "New review received",
      detail: `${review.customer.name} rated you ${input.rating} star${input.rating === 1 ? "" : "s"}.`
    }),
    createNotification({
      audience: "ADMIN",
      kind: "review",
      title: "Review placed",
      detail: `${review.customer.name} placed a ${input.rating}-star review for ${vendorName}.`
    })
  ]);

  return { review };
}

export async function listCustomerNotifications(
  authorization: string | undefined,
  status: AppNotificationStatus | "ALL" = "PENDING"
): Promise<CustomerNotificationsResponse> {
  const customerId = await resolveCustomerUserId(authorization);
  const notifications = await listNotifications({
    audience: "CUSTOMER",
    recipientId: customerId,
    status
  });

  return {
    notifications: notifications.map((notification) => ({
      ...notification,
      kind: getCustomerNotificationKind(notification.kind)
    }))
  };
}

export async function reviewCustomerNotification(
  authorization: string | undefined,
  notificationId: string
) {
  const customerId = await resolveCustomerUserId(authorization);
  const notification = await markNotificationReviewed({
    id: notificationId,
    audience: "CUSTOMER",
    recipientId: customerId
  });

  return {
    notification: {
      ...notification,
      kind: getCustomerNotificationKind(notification.kind)
    }
  };
}

function getCustomerNotificationKind(kind: string) {
  if (kind === "review" || kind === "booking") {
    return kind;
  }

  return "enquiry";
}
