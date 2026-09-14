import type { NotificationAudience, NotificationStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error.js";

export type AppNotificationStatus = "PENDING" | "REVIEWED";

export type AppNotification = {
  id: string;
  kind: string;
  title: string;
  detail: string;
  status: AppNotificationStatus;
  createdAt: Date;
  updatedAt: Date;
};

type CreateNotificationInput = {
  audience: NotificationAudience;
  recipientId?: string | null;
  kind: string;
  title: string;
  detail: string;
};

type ListNotificationsInput = {
  audience: NotificationAudience;
  recipientId?: string | null;
  status?: NotificationStatus | "ALL";
};

const notificationSelect = {
  id: true,
  kind: true,
  title: true,
  detail: true,
  status: true,
  createdAt: true,
  updatedAt: true
} as const;

export function parseNotificationStatus(value: unknown): NotificationStatus | "ALL" {
  if (value === "reviewed") {
    return "REVIEWED";
  }

  if (value === "all") {
    return "ALL";
  }

  return "PENDING";
}

export function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      audience: input.audience,
      recipientId: input.recipientId ?? null,
      kind: input.kind,
      title: input.title,
      detail: input.detail
    },
    select: notificationSelect
  });
}

export async function listNotifications(
  input: ListNotificationsInput
): Promise<AppNotification[]> {
  return prisma.notification.findMany({
    where: {
      audience: input.audience,
      recipientId: input.recipientId ?? null,
      ...(input.status && input.status !== "ALL" ? { status: input.status } : {})
    },
    select: notificationSelect,
    orderBy: { createdAt: "desc" }
  });
}

export async function markNotificationReviewed(input: {
  id: string;
  audience: NotificationAudience;
  recipientId?: string | null;
}) {
  const notification = await prisma.notification.findFirst({
    where: {
      id: input.id,
      audience: input.audience,
      recipientId: input.recipientId ?? null
    },
    select: {
      id: true
    }
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return prisma.notification.update({
    where: { id: input.id },
    data: { status: "REVIEWED" },
    select: notificationSelect
  });
}
