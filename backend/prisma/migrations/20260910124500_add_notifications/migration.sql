CREATE TYPE "NotificationAudience" AS ENUM ('ADMIN', 'CUSTOMER', 'VENDOR');

CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'REVIEWED');

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "audience" "NotificationAudience" NOT NULL,
    "recipientId" TEXT,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notification_audience_recipientId_status_idx" ON "Notification"("audience", "recipientId", "status");

CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
