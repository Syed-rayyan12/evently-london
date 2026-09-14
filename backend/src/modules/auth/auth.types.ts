import { z } from "zod";

export type AuthUserRole = "CUSTOMER" | "VENDOR" | "ADMIN";
export type SignupRole = "CUSTOMER" | "VENDOR";
export type AccountApprovalStatus = "PENDING" | "APPROVED" | "SUSPENDED";

export const signupValidator = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
  phone: z.string().trim().min(7).max(30).optional(),
  role: z.enum(["CUSTOMER", "VENDOR"])
});

export const loginValidator = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
  role: z.enum(["CUSTOMER", "VENDOR"])
});

export const adminLoginValidator = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1)
});

export const approvalStatusValidator = z.object({
  status: z.enum(["APPROVED", "SUSPENDED"])
});

export const customerProfileUpdateValidator = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().toLowerCase(),
  phone: z.string().trim().min(7).max(30).optional()
});

export const customerPasswordUpdateValidator = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number")
});

export type SignupRequest = z.infer<typeof signupValidator>;
export type LoginRequest = z.infer<typeof loginValidator>;
export type AdminLoginRequest = z.infer<typeof adminLoginValidator>;
export type ApprovalStatusRequest = z.infer<typeof approvalStatusValidator>;
export type CustomerProfileUpdateRequest = z.infer<typeof customerProfileUpdateValidator>;
export type CustomerPasswordUpdateRequest = z.infer<typeof customerPasswordUpdateValidator>;

export type AuthUserResponse = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: AuthUserRole;
  approvalStatus: AccountApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthAdminResponse = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
  token: string;
};

export type SignupResponse = {
  user: AuthUserResponse;
  token: string;
};

export type LoginResponse = {
  user: AuthUserResponse;
  token: string;
};

export type AdminLoginResponse = {
  admin: AuthAdminResponse;
};

export type PendingApprovalsResponse = {
  approvals: AuthUserResponse[];
};

export type ApprovalUpdateResponse = {
  user: AuthUserResponse;
};

export type CustomerProfileUpdateResponse = {
  user: AuthUserResponse;
};

export type CustomerProfileResponse = {
  user: AuthUserResponse;
};

export type CustomerPasswordUpdateResponse = {
  user: AuthUserResponse;
};
