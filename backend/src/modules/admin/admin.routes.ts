import { Router } from "express";
import {
  getAdminAnalyticsController,
  getAdminDashboardOverviewController,
  listAdminBookingsController,
  listAdminEnquiriesController,
  listAdminNotificationsController,
  listAdminReviewsController,
  listUsersController,
  listVendorsController,
  reviewAdminNotificationController
} from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.get("/dashboard", getAdminDashboardOverviewController);
adminRouter.get("/analytics", getAdminAnalyticsController);
adminRouter.get("/users", listUsersController);
adminRouter.get("/vendors", listVendorsController);
adminRouter.get("/enquiries", listAdminEnquiriesController);
adminRouter.get("/bookings", listAdminBookingsController);
adminRouter.get("/reviews", listAdminReviewsController);
adminRouter.get("/notifications", listAdminNotificationsController);
adminRouter.patch("/notifications/:id/reviewed", reviewAdminNotificationController);
