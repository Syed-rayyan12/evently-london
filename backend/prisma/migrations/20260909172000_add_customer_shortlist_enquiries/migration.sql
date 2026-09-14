-- CreateTable
CREATE TABLE "CustomerSavedVendor" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerSavedVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerEnquiry" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "packageId" TEXT,
    "packageName" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSavedVendor_customerId_vendorId_key" ON "CustomerSavedVendor"("customerId", "vendorId");

-- CreateIndex
CREATE INDEX "CustomerSavedVendor_vendorId_idx" ON "CustomerSavedVendor"("vendorId");

-- CreateIndex
CREATE INDEX "CustomerEnquiry_customerId_idx" ON "CustomerEnquiry"("customerId");

-- CreateIndex
CREATE INDEX "CustomerEnquiry_vendorId_idx" ON "CustomerEnquiry"("vendorId");

-- CreateIndex
CREATE INDEX "CustomerEnquiry_packageId_idx" ON "CustomerEnquiry"("packageId");

-- AddForeignKey
ALTER TABLE "CustomerSavedVendor" ADD CONSTRAINT "CustomerSavedVendor_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSavedVendor" ADD CONSTRAINT "CustomerSavedVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEnquiry" ADD CONSTRAINT "CustomerEnquiry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEnquiry" ADD CONSTRAINT "CustomerEnquiry_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEnquiry" ADD CONSTRAINT "CustomerEnquiry_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "VendorPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
