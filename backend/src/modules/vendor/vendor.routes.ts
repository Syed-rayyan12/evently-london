import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import {
  createVendorPackageController,
  createVendorPortfolioController,
  createVendorServiceController,
  deleteVendorEnquiryController,
  deleteVendorPackageController,
  deleteVendorPortfolioController,
  deleteVendorServiceController,
  getVendorDashboardOverviewController,
  listVendorEnquiriesController,
  listVendorNotificationsController,
  listVendorReviewsController,
  listVendorAvailabilityController,
  listVendorPackagesController,
  listVendorPortfolioController,
  listVendorServicesController,
  getVendorProfileController,
  loginVendorController,
  respondToVendorEnquiryController,
  reviewVendorNotificationController,
  signupVendorController,
  updateVendorPackageController,
  updateVendorPasswordController,
  updateVendorProfileController,
  updateVendorServiceController,
  upsertVendorAvailabilityController
} from "./vendor.controller.js";
import {
  vendorAvailabilityValidator,
  vendorEnquiryResponseValidator,
  vendorLoginValidator,
  vendorPackageValidator,
  vendorPasswordUpdateValidator,
  vendorPortfolioValidator,
  vendorProfileUpdateValidator,
  vendorServiceValidator,
  vendorSignupValidator
} from "./vendor.types.js";

export const vendorRouter = Router();

vendorRouter.post("/signup", validateBody(vendorSignupValidator), signupVendorController);
vendorRouter.post("/login", validateBody(vendorLoginValidator), loginVendorController);
vendorRouter.get("/me", getVendorProfileController);
vendorRouter.get("/dashboard", getVendorDashboardOverviewController);
vendorRouter.get("/enquiries", listVendorEnquiriesController);
vendorRouter.patch("/enquiries/:id/response", validateBody(vendorEnquiryResponseValidator), respondToVendorEnquiryController);
vendorRouter.delete("/enquiries/:id", deleteVendorEnquiryController);
vendorRouter.get("/reviews", listVendorReviewsController);
vendorRouter.get("/notifications", listVendorNotificationsController);
vendorRouter.patch("/notifications/:id/reviewed", reviewVendorNotificationController);
vendorRouter.patch("/profile", validateBody(vendorProfileUpdateValidator), updateVendorProfileController);
vendorRouter.patch("/password", validateBody(vendorPasswordUpdateValidator), updateVendorPasswordController);
vendorRouter.get("/services", listVendorServicesController);
vendorRouter.post("/services", validateBody(vendorServiceValidator), createVendorServiceController);
vendorRouter.patch("/services/:id", validateBody(vendorServiceValidator), updateVendorServiceController);
vendorRouter.delete("/services/:id", deleteVendorServiceController);
vendorRouter.get("/packages", listVendorPackagesController);
vendorRouter.post("/packages", validateBody(vendorPackageValidator), createVendorPackageController);
vendorRouter.patch("/packages/:id", validateBody(vendorPackageValidator), updateVendorPackageController);
vendorRouter.delete("/packages/:id", deleteVendorPackageController);
vendorRouter.get("/portfolio", listVendorPortfolioController);
vendorRouter.post("/portfolio", validateBody(vendorPortfolioValidator), createVendorPortfolioController);
vendorRouter.delete("/portfolio/:id", deleteVendorPortfolioController);
vendorRouter.get("/availability", listVendorAvailabilityController);
vendorRouter.patch("/availability", validateBody(vendorAvailabilityValidator), upsertVendorAvailabilityController);
