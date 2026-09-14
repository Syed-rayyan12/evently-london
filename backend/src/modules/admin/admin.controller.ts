import type { NextFunction, Request, Response } from "express";
import { assertAdminSession } from "../auth/auth.service.js";
import { parseNotificationStatus } from "../notifications/notification.service.js";
import {
  getAdminAnalytics,
  getAdminDashboardOverview,
  listAdminBookings,
  listAdminEnquiries,
  listAdminNotifications,
  listAdminReviews,
  listUsers,
  listVendors,
  reviewAdminNotification
} from "./admin.service.js";
import type {
  AdminAnalyticsResponse,
  AdminBookingsResponse,
  AdminDashboardPeriod,
  AdminDashboardResponse,
  AdminEnquiriesResponse,
  AdminNotificationsResponse,
  AdminReviewsResponse,
  AdminUsersResponse,
  AdminVendorsResponse
} from "./admin.types.js";

type ApiDataResponse<TData> = {
  data: TData;
};

export async function listUsersController(
  req: Request,
  res: Response<ApiDataResponse<AdminUsersResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const users = await listUsers();
    res.json({ data: { users } });
  } catch (error) {
    next(error);
  }
}

export async function listVendorsController(
  req: Request,
  res: Response<ApiDataResponse<AdminVendorsResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const vendors = await listVendors();
    res.json({ data: { vendors } });
  } catch (error) {
    next(error);
  }
}

export async function getAdminAnalyticsController(
  req: Request<unknown, ApiDataResponse<AdminAnalyticsResponse>, unknown, { period?: string }>,
  res: Response<ApiDataResponse<AdminAnalyticsResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const analytics = await getAdminAnalytics(parseDashboardPeriod(req.query.period));
    res.json({ data: analytics });
  } catch (error) {
    next(error);
  }
}

export async function getAdminDashboardOverviewController(
  req: Request<unknown, ApiDataResponse<AdminDashboardResponse>, unknown, { period?: string }>,
  res: Response<ApiDataResponse<AdminDashboardResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const dashboard = await getAdminDashboardOverview(parseDashboardPeriod(req.query.period));
    res.json({ data: dashboard });
  } catch (error) {
    next(error);
  }
}

export async function listAdminReviewsController(
  req: Request,
  res: Response<ApiDataResponse<AdminReviewsResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const reviews = await listAdminReviews();
    res.json({ data: reviews });
  } catch (error) {
    next(error);
  }
}

export async function listAdminEnquiriesController(
  req: Request,
  res: Response<ApiDataResponse<AdminEnquiriesResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const enquiries = await listAdminEnquiries();
    res.json({ data: enquiries });
  } catch (error) {
    next(error);
  }
}

export async function listAdminBookingsController(
  req: Request,
  res: Response<ApiDataResponse<AdminBookingsResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const bookings = await listAdminBookings();
    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
}

export async function listAdminNotificationsController(
  req: Request<unknown, ApiDataResponse<AdminNotificationsResponse>, unknown, { status?: string }>,
  res: Response<ApiDataResponse<AdminNotificationsResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const notifications = await listAdminNotifications(parseNotificationStatus(req.query.status));
    res.json({ data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function reviewAdminNotificationController(
  req: Request<{ id: string }>,
  res: Response<ApiDataResponse<Awaited<ReturnType<typeof reviewAdminNotification>>>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const notification = await reviewAdminNotification(req.params.id);
    res.json({ data: notification });
  } catch (error) {
    next(error);
  }
}

function parseDashboardPeriod(value: unknown): AdminDashboardPeriod {
  if (value === "this-week" || value === "this-year") {
    return value;
  }

  return "this-month";
}
