import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import {
  bookCustomerEnquiryController,
  createCustomerEnquiryController,
  createCustomerReviewController,
  listCustomerEnquiriesController,
  listCustomerNotificationsController,
  listSavedVendorsController,
  removeSavedVendorController,
  reviewCustomerNotificationController,
  saveVendorController
} from "./customer.controller.js";
import {
  customerEnquiryValidator,
  customerReviewValidator,
  savedVendorValidator
} from "./customer.types.js";

export const customerRouter = Router();

customerRouter.get("/saved-vendors", listSavedVendorsController);
customerRouter.get("/enquiries", listCustomerEnquiriesController);
customerRouter.get("/notifications", listCustomerNotificationsController);
customerRouter.patch("/notifications/:id/reviewed", reviewCustomerNotificationController);
customerRouter.post("/saved-vendors", validateBody(savedVendorValidator), saveVendorController);
customerRouter.delete("/saved-vendors/:vendorId", removeSavedVendorController);
customerRouter.post("/enquiries", validateBody(customerEnquiryValidator), createCustomerEnquiryController);
customerRouter.patch("/enquiries/:id/book", bookCustomerEnquiryController);
customerRouter.post("/reviews", validateBody(customerReviewValidator), createCustomerReviewController);
