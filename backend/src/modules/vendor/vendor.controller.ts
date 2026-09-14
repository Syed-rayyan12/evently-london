import type { NextFunction, Request, Response } from "express";
import { parseNotificationStatus } from "../notifications/notification.service.js";
import {
  createVendorPackage,
  createVendorPortfolioItem,
  createVendorService,
  deleteVendorEnquiry,
  deleteVendorPackage,
  deleteVendorPortfolioItem,
  deleteVendorService,
  getVendorDashboardOverview,
  listVendorEnquiries,
  listVendorNotifications,
  listVendorReviews,
  listVendorAvailability,
  listVendorPackages,
  listVendorPortfolio,
  listVendorServices,
  getVendorProfile,
  loginVendor,
  respondToVendorEnquiry,
  reviewVendorNotification,
  signupVendor,
  updateVendorPackage,
  updateVendorPassword,
  updateVendorProfile,
  updateVendorService,
  upsertVendorAvailabilityEvent
} from "./vendor.service.js";
import { vendorDashboardQueryValidator } from "./vendor.types.js";
import type {
  VendorAvailabilityEventsResponse,
  VendorAvailabilityRequest,
  VendorAvailabilityResponse,
  VendorAuthResponse,
  VendorDashboardQuery,
  VendorDashboardResponse,
  VendorEnquiriesResponse,
  VendorEnquiryResponseRequest,
  VendorNotificationsResponse,
  VendorLoginRequest,
  VendorPackageRequest,
  VendorPackageResponse,
  VendorPasswordUpdateRequest,
  VendorPasswordUpdateResponse,
  VendorPortfolioItemsResponse,
  VendorPortfolioRequest,
  VendorPortfolioResponse,
  VendorProfileResponse,
  VendorProfileUpdateRequest,
  VendorProfileUpdateResponse,
  VendorReviewsResponse,
  VendorServiceRequest,
  VendorServiceResponse,
  VendorServicesResponse,
  VendorSignupRequest
} from "./vendor.types.js";

type ApiDataResponse<TData> = {
  data: TData;
};

export async function signupVendorController(
  req: Request<unknown, ApiDataResponse<VendorAuthResponse>, VendorSignupRequest>,
  res: Response<ApiDataResponse<VendorAuthResponse>>,
  next: NextFunction
) {
  try {
    const signup = await signupVendor(req.body);
    res.status(201).json({ data: signup });
  } catch (error) {
    next(error);
  }
}

export async function loginVendorController(
  req: Request<unknown, ApiDataResponse<VendorAuthResponse>, VendorLoginRequest>,
  res: Response<ApiDataResponse<VendorAuthResponse>>,
  next: NextFunction
) {
  try {
    const login = await loginVendor(req.body);
    res.json({ data: login });
  } catch (error) {
    next(error);
  }
}

export async function getVendorProfileController(
  req: Request<unknown, ApiDataResponse<VendorProfileResponse>>,
  res: Response<ApiDataResponse<VendorProfileResponse>>,
  next: NextFunction
) {
  try {
    const profile = await getVendorProfile(req.get("authorization"));
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorProfileController(
  req: Request<unknown, ApiDataResponse<VendorProfileUpdateResponse>, VendorProfileUpdateRequest>,
  res: Response<ApiDataResponse<VendorProfileUpdateResponse>>,
  next: NextFunction
) {
  try {
    const profile = await updateVendorProfile(req.get("authorization"), req.body);
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorPasswordController(
  req: Request<unknown, ApiDataResponse<VendorPasswordUpdateResponse>, VendorPasswordUpdateRequest>,
  res: Response<ApiDataResponse<VendorPasswordUpdateResponse>>,
  next: NextFunction
) {
  try {
    const user = await updateVendorPassword(req.get("authorization"), req.body);
    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function listVendorServicesController(
  req: Request<unknown, ApiDataResponse<VendorServicesResponse>>,
  res: Response<ApiDataResponse<VendorServicesResponse>>,
  next: NextFunction
) {
  try {
    const services = await listVendorServices(req.get("authorization"));
    res.json({ data: services });
  } catch (error) {
    next(error);
  }
}

export async function createVendorServiceController(
  req: Request<unknown, ApiDataResponse<VendorServiceResponse>, VendorServiceRequest>,
  res: Response<ApiDataResponse<VendorServiceResponse>>,
  next: NextFunction
) {
  try {
    const service = await createVendorService(req.get("authorization"), req.body);
    res.status(201).json({ data: service });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorServiceController(
  req: Request<{ id: string }, ApiDataResponse<VendorServiceResponse>, VendorServiceRequest>,
  res: Response<ApiDataResponse<VendorServiceResponse>>,
  next: NextFunction
) {
  try {
    const service = await updateVendorService(req.get("authorization"), req.params.id, req.body);
    res.json({ data: service });
  } catch (error) {
    next(error);
  }
}

export async function deleteVendorServiceController(
  req: Request<{ id: string }, ApiDataResponse<{ id: string }>>,
  res: Response<ApiDataResponse<{ id: string }>>,
  next: NextFunction
) {
  try {
    const result = await deleteVendorService(req.get("authorization"), req.params.id);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function listVendorPackagesController(
  req: Request<unknown, ApiDataResponse<{ packages: VendorPackageResponse[] }>>,
  res: Response<ApiDataResponse<{ packages: VendorPackageResponse[] }>>,
  next: NextFunction
) {
  try {
    const packages = await listVendorPackages(req.get("authorization"));
    res.json({ data: packages });
  } catch (error) {
    next(error);
  }
}

export async function createVendorPackageController(
  req: Request<unknown, ApiDataResponse<VendorPackageResponse>, VendorPackageRequest>,
  res: Response<ApiDataResponse<VendorPackageResponse>>,
  next: NextFunction
) {
  try {
    const packageItem = await createVendorPackage(req.get("authorization"), req.body);
    res.status(201).json({ data: packageItem });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorPackageController(
  req: Request<{ id: string }, ApiDataResponse<VendorPackageResponse>, VendorPackageRequest>,
  res: Response<ApiDataResponse<VendorPackageResponse>>,
  next: NextFunction
) {
  try {
    const packageItem = await updateVendorPackage(req.get("authorization"), req.params.id, req.body);
    res.json({ data: packageItem });
  } catch (error) {
    next(error);
  }
}

export async function deleteVendorPackageController(
  req: Request<{ id: string }, ApiDataResponse<{ id: string }>>,
  res: Response<ApiDataResponse<{ id: string }>>,
  next: NextFunction
) {
  try {
    const result = await deleteVendorPackage(req.get("authorization"), req.params.id);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function listVendorPortfolioController(
  req: Request<unknown, ApiDataResponse<VendorPortfolioItemsResponse>>,
  res: Response<ApiDataResponse<VendorPortfolioItemsResponse>>,
  next: NextFunction
) {
  try {
    const portfolio = await listVendorPortfolio(req.get("authorization"));
    res.json({ data: portfolio });
  } catch (error) {
    next(error);
  }
}

export async function createVendorPortfolioController(
  req: Request<unknown, ApiDataResponse<VendorPortfolioResponse>, VendorPortfolioRequest>,
  res: Response<ApiDataResponse<VendorPortfolioResponse>>,
  next: NextFunction
) {
  try {
    const item = await createVendorPortfolioItem(req.get("authorization"), req.body);
    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteVendorPortfolioController(
  req: Request<{ id: string }, ApiDataResponse<{ id: string }>>,
  res: Response<ApiDataResponse<{ id: string }>>,
  next: NextFunction
) {
  try {
    const result = await deleteVendorPortfolioItem(req.get("authorization"), req.params.id);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function listVendorAvailabilityController(
  req: Request<unknown, ApiDataResponse<VendorAvailabilityEventsResponse>>,
  res: Response<ApiDataResponse<VendorAvailabilityEventsResponse>>,
  next: NextFunction
) {
  try {
    const events = await listVendorAvailability(req.get("authorization"));
    res.json({ data: events });
  } catch (error) {
    next(error);
  }
}

export async function listVendorEnquiriesController(
  req: Request<unknown, ApiDataResponse<VendorEnquiriesResponse>>,
  res: Response<ApiDataResponse<VendorEnquiriesResponse>>,
  next: NextFunction
) {
  try {
    const enquiries = await listVendorEnquiries(req.get("authorization"));
    res.json({ data: enquiries });
  } catch (error) {
    next(error);
  }
}

export async function deleteVendorEnquiryController(
  req: Request<{ id: string }, ApiDataResponse<{ id: string }>>,
  res: Response<ApiDataResponse<{ id: string }>>,
  next: NextFunction
) {
  try {
    const result = await deleteVendorEnquiry(req.get("authorization"), req.params.id);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function respondToVendorEnquiryController(
  req: Request<{ id: string }, ApiDataResponse<Awaited<ReturnType<typeof respondToVendorEnquiry>>>, VendorEnquiryResponseRequest>,
  res: Response<ApiDataResponse<Awaited<ReturnType<typeof respondToVendorEnquiry>>>>,
  next: NextFunction
) {
  try {
    const result = await respondToVendorEnquiry(req.get("authorization"), req.params.id, req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function listVendorReviewsController(
  req: Request<unknown, ApiDataResponse<VendorReviewsResponse>>,
  res: Response<ApiDataResponse<VendorReviewsResponse>>,
  next: NextFunction
) {
  try {
    const reviews = await listVendorReviews(req.get("authorization"));
    res.json({ data: reviews });
  } catch (error) {
    next(error);
  }
}

export async function listVendorNotificationsController(
  req: Request<unknown, ApiDataResponse<VendorNotificationsResponse>, unknown, { status?: string }>,
  res: Response<ApiDataResponse<VendorNotificationsResponse>>,
  next: NextFunction
) {
  try {
    const notifications = await listVendorNotifications(
      req.get("authorization"),
      parseNotificationStatus(req.query.status)
    );
    res.json({ data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function reviewVendorNotificationController(
  req: Request<{ id: string }>,
  res: Response<ApiDataResponse<Awaited<ReturnType<typeof reviewVendorNotification>>>>,
  next: NextFunction
) {
  try {
    const notification = await reviewVendorNotification(req.get("authorization"), req.params.id);
    res.json({ data: notification });
  } catch (error) {
    next(error);
  }
}

export async function upsertVendorAvailabilityController(
  req: Request<unknown, ApiDataResponse<VendorAvailabilityResponse>, VendorAvailabilityRequest>,
  res: Response<ApiDataResponse<VendorAvailabilityResponse>>,
  next: NextFunction
) {
  try {
    const event = await upsertVendorAvailabilityEvent(req.get("authorization"), req.body);
    res.json({ data: event });
  } catch (error) {
    next(error);
  }
}

export async function getVendorDashboardOverviewController(
  req: Request<unknown, ApiDataResponse<VendorDashboardResponse>, unknown, VendorDashboardQuery>,
  res: Response<ApiDataResponse<VendorDashboardResponse>>,
  next: NextFunction
) {
  try {
    const query = vendorDashboardQueryValidator.parse(req.query);
    const dashboard = await getVendorDashboardOverview(req.get("authorization"), query.period);
    res.json({ data: dashboard });
  } catch (error) {
    next(error);
  }
}
