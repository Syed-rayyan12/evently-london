CREATE TABLE "CustomerReview" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "vendorId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CustomerReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomerReview_customerId_vendorId_key" ON "CustomerReview"("customerId", "vendorId");
CREATE INDEX "CustomerReview_vendorId_idx" ON "CustomerReview"("vendorId");

ALTER TABLE "CustomerReview" ADD CONSTRAINT "CustomerReview_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomerReview" ADD CONSTRAINT "CustomerReview_vendorId_fkey"
  FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
