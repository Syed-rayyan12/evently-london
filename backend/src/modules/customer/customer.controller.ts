import type { NextFunction, Request, Response } from "express";
import { parseNotificationStatus } from "../notifications/notification.service.js";
import {
  bookCustomerEnquiry,
  createCustomerEnquiry,
  createCustomerReview,
  listCustomerEnquiries,
  listCustomerNotifications,
  listSavedVendors,
  removeSavedVendor,
  reviewCustomerNotification,
  saveVendor
} from "./customer.service.js";
import type {
  CustomerEnquiryRequest,
  CustomerEnquiriesResponse,
  CustomerEnquiryResponse,
  CustomerBookEnquiryResponse,
  CustomerNotificationsResponse,
  CustomerReviewRequest,
  CustomerReviewResponse,
  SavedVendorRequest,
  SavedVendorResponse,
  SavedVendorsResponse
} from "./customer.types.js";

type ApiDataResponse<TData> = {
  data: TData;
};

export async function listSavedVendorsController(
  req: Request<unknown, ApiDataResponse<SavedVendorsResponse>>,
  res: Response<ApiDataResponse<SavedVendorsResponse>>,
  next: NextFunction
) {
  try {
    const savedVendors = await listSavedVendors(req.get("authorization"));
    res.json({ data: savedVendors });
  } catch (error) {
    next(error);
  }
}

export async function saveVendorController(
  req: Request<unknown, ApiDataResponse<SavedVendorResponse>, SavedVendorRequest>,
  res: Response<ApiDataResponse<SavedVendorResponse>>,
  next: NextFunction
) {
  try {
    const savedVendor = await saveVendor(req.get("authorization"), req.body);
    res.status(201).json({ data: savedVendor });
  } catch (error) {
    next(error);
  }
}

export async function removeSavedVendorController(
  req: Request<{ vendorId: string }, ApiDataResponse<{ vendorId: string }>>,
  res: Response<ApiDataResponse<{ vendorId: string }>>,
  next: NextFunction
) {
  try {
    const result = await removeSavedVendor(req.get("authorization"), req.params.vendorId);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function createCustomerEnquiryController(
  req: Request<unknown, ApiDataResponse<CustomerEnquiryResponse>, CustomerEnquiryRequest>,
  res: Response<ApiDataResponse<CustomerEnquiryResponse>>,
  next: NextFunction
) {
  try {
    const enquiry = await createCustomerEnquiry(req.get("authorization"), req.body);
    res.status(201).json({ data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function listCustomerEnquiriesController(
  req: Request<unknown, ApiDataResponse<CustomerEnquiriesResponse>>,
  res: Response<ApiDataResponse<CustomerEnquiriesResponse>>,
  next: NextFunction
) {
  try {
    const enquiries = await listCustomerEnquiries(req.get("authorization"));
    res.json({ data: enquiries });
  } catch (error) {
    next(error);
  }
}

export async function bookCustomerEnquiryController(
  req: Request<{ id: string }, ApiDataResponse<CustomerBookEnquiryResponse>>,
  res: Response<ApiDataResponse<CustomerBookEnquiryResponse>>,
  next: NextFunction
) {
  try {
    const enquiry = await bookCustomerEnquiry(req.get("authorization"), req.params.id);
    res.json({ data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function createCustomerReviewController(
  req: Request<unknown, ApiDataResponse<CustomerReviewResponse>, CustomerReviewRequest>,
  res: Response<ApiDataResponse<CustomerReviewResponse>>,
  next: NextFunction
) {
  try {
    const review = await createCustomerReview(req.get("authorization"), req.body);
    res.status(201).json({ data: review });
  } catch (error) {
    next(error);
  }
}

export async function listCustomerNotificationsController(
  req: Request<unknown, ApiDataResponse<CustomerNotificationsResponse>, unknown, { status?: string }>,
  res: Response<ApiDataResponse<CustomerNotificationsResponse>>,
  next: NextFunction
) {
  try {
    const notifications = await listCustomerNotifications(
      req.get("authorization"),
      parseNotificationStatus(req.query.status)
    );
    res.json({ data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function reviewCustomerNotificationController(
  req: Request<{ id: string }>,
  res: Response<ApiDataResponse<Awaited<ReturnType<typeof reviewCustomerNotification>>>>,
  next: NextFunction
) {
  try {
    const notification = await reviewCustomerNotification(req.get("authorization"), req.params.id);
    res.json({ data: notification });
  } catch (error) {
    next(error);
  }
}
