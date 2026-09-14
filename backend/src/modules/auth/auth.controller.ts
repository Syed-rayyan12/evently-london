import type { NextFunction, Request, Response } from "express";
import {
  assertAdminSession,
  getCustomerProfile,
  listPendingApprovals,
  loginAccount,
  loginAdmin,
  signupAccount,
  updateApprovalStatus,
  updateCustomerPassword,
  updateCustomerProfile
} from "./auth.service.js";
import type {
  ApprovalStatusRequest,
  ApprovalUpdateResponse,
  AdminLoginRequest,
  AdminLoginResponse,
  CustomerPasswordUpdateRequest,
  CustomerPasswordUpdateResponse,
  CustomerProfileResponse,
  CustomerProfileUpdateRequest,
  CustomerProfileUpdateResponse,
  LoginRequest,
  LoginResponse,
  PendingApprovalsResponse,
  SignupRequest,
  SignupResponse
} from "./auth.types.js";

type ApiDataResponse<TData> = {
  data: TData;
};

export async function signupController(
  req: Request<unknown, ApiDataResponse<SignupResponse>, SignupRequest>,
  res: Response<ApiDataResponse<SignupResponse>>,
  next: NextFunction
) {
  try {
    const signup = await signupAccount(req.body);
    res.status(201).json({ data: signup });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request<unknown, ApiDataResponse<LoginResponse>, LoginRequest>,
  res: Response<ApiDataResponse<LoginResponse>>,
  next: NextFunction
) {
  try {
    const login = await loginAccount(req.body);
    res.json({ data: login });
  } catch (error) {
    next(error);
  }
}

export async function adminLoginController(
  req: Request<unknown, ApiDataResponse<AdminLoginResponse>, AdminLoginRequest>,
  res: Response<ApiDataResponse<AdminLoginResponse>>,
  next: NextFunction
) {
  try {
    const admin = await loginAdmin(req.body);
    res.json({ data: { admin } });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerProfileController(
  req: Request<unknown, ApiDataResponse<CustomerProfileResponse>>,
  res: Response<ApiDataResponse<CustomerProfileResponse>>,
  next: NextFunction
) {
  try {
    const user = await getCustomerProfile(req.get("authorization"));
    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomerProfileController(
  req: Request<unknown, ApiDataResponse<CustomerProfileUpdateResponse>, CustomerProfileUpdateRequest>,
  res: Response<ApiDataResponse<CustomerProfileUpdateResponse>>,
  next: NextFunction
) {
  try {
    const user = await updateCustomerProfile(
      req.get("authorization"),
      req.body
    );
    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomerPasswordController(
  req: Request<unknown, ApiDataResponse<CustomerPasswordUpdateResponse>, CustomerPasswordUpdateRequest>,
  res: Response<ApiDataResponse<CustomerPasswordUpdateResponse>>,
  next: NextFunction
) {
  try {
    const user = await updateCustomerPassword(
      req.get("authorization"),
      req.body
    );
    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function listPendingApprovalsController(
  req: Request,
  res: Response<ApiDataResponse<PendingApprovalsResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const approvals = await listPendingApprovals();
    res.json({ data: { approvals } });
  } catch (error) {
    next(error);
  }
}

export async function updateApprovalStatusController(
  req: Request<{ id: string }, ApiDataResponse<ApprovalUpdateResponse>, ApprovalStatusRequest>,
  res: Response<ApiDataResponse<ApprovalUpdateResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const user = await updateApprovalStatus(String(req.params.id), req.body);
    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
}
