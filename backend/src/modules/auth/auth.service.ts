import bcrypt from "bcrypt";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "../../env.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error.js";
import { createNotification } from "../notifications/notification.service.js";
import type {
  ApprovalStatusRequest,
  AdminLoginRequest,
  AdminLoginResponse,
  AuthUserResponse,
  CustomerPasswordUpdateRequest,
  CustomerProfileUpdateRequest,
  LoginResponse,
  LoginRequest,
  SignupResponse,
  SignupRequest
} from "./auth.types.js";

const authUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  approvalStatus: true,
  createdAt: true,
  updatedAt: true
} as const;

type AccountSessionPayload = {
  sub: string;
  email: string;
  role: "CUSTOMER" | "VENDOR";
  iat: number;
  exp: number;
};

type AdminSessionPayload = {
  sub: "admin";
  email: string;
  role: "ADMIN";
  iat: number;
  exp: number;
};

function signTokenPayload(payload: string) {
  return createHmac("sha256", env.AUTH_TOKEN_SECRET).update(payload).digest("base64url");
}

function encodeSignedPayload(payload: AccountSessionPayload | AdminSessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signTokenPayload(encodedPayload)}`;
}

function createAdminSessionToken() {
  const issuedAt = Math.floor(Date.now() / 1000);
  return encodeSignedPayload({
    sub: "admin",
    email: env.ADMIN_EMAIL.toLowerCase(),
    role: "ADMIN",
    iat: issuedAt,
    exp: issuedAt + env.AUTH_TOKEN_TTL_SECONDS
  });
}

function createAccountSessionToken(user: AuthUserResponse) {
  if (user.role !== "CUSTOMER" && user.role !== "VENDOR") {
    throw new AppError("Invalid account role", 403);
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  return encodeSignedPayload({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: issuedAt,
    exp: issuedAt + env.AUTH_TOKEN_TTL_SECONDS
  });
}

function getBearerToken(authorization: string | undefined) {
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim();
}

function assertAccountSession(
  authorization: string | undefined,
  expectedRole: AccountSessionPayload["role"]
) {
  const token = getBearerToken(authorization);

  if (!token) {
    throw new AppError("Login required", 401);
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    throw new AppError("Invalid session", 401);
  }

  const expectedSignature = signTokenPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    throw new AppError("Invalid session", 401);
  }

  let session: AccountSessionPayload;

  try {
    session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AccountSessionPayload;
  } catch {
    throw new AppError("Invalid session", 401);
  }

  if (session.role !== expectedRole) {
    throw new AppError("Invalid account role", 403);
  }

  if (!session.exp || session.exp <= Math.floor(Date.now() / 1000)) {
    throw new AppError("Session expired", 401);
  }

  return session;
}

export function assertCustomerSession(authorization: string | undefined) {
  return assertAccountSession(authorization, "CUSTOMER");
}

export function assertAdminSession(token: string | undefined) {
  if (!token) {
    throw new AppError("Admin login required", 401);
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    throw new AppError("Admin login required", 401);
  }

  const expectedSignature = signTokenPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    throw new AppError("Admin login required", 401);
  }

  let session: AdminSessionPayload;

  try {
    session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSessionPayload;
  } catch {
    throw new AppError("Admin login required", 401);
  }

  if (
    session.sub !== "admin" ||
    session.role !== "ADMIN" ||
    session.email !== env.ADMIN_EMAIL.toLowerCase() ||
    !session.exp ||
    session.exp <= Math.floor(Date.now() / 1000)
  ) {
    throw new AppError("Admin login required", 401);
  }
}

export async function signupAccount(input: SignupRequest): Promise<SignupResponse> {
  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.fullName,
      passwordHash,
      phone: input.phone,
      role: input.role,
      approvalStatus: "PENDING"
    },
    select: authUserSelect
  });

  await createNotification({
    audience: "ADMIN",
    kind: user.role === "CUSTOMER" ? "customer" : "vendor",
    title: user.role === "CUSTOMER" ? "Customer created" : "Vendor created",
    detail: `${user.name} created a ${user.role.toLowerCase()} account.`
  });

  return {
    user,
    token: createAccountSessionToken(user)
  };
}

export async function loginAccount(input: LoginRequest): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      ...authUserSelect,
      passwordHash: true
    }
  });

  if (!user || user.role !== input.role) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.approvalStatus !== "APPROVED") {
    throw new AppError("Your account is pending admin approval", 403);
  }

  const { passwordHash: _passwordHash, ...authUser } = user;
  return {
    user: authUser,
    token: createAccountSessionToken(authUser)
  };
}

export async function loginAdmin(input: AdminLoginRequest): Promise<AdminLoginResponse["admin"]> {
  const emailMatches = input.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
  const passwordMatches = input.password === env.ADMIN_PASSWORD;

  if (!emailMatches || !passwordMatches) {
    throw new AppError("Invalid admin credentials", 401);
  }

  return {
    id: "admin",
    email: env.ADMIN_EMAIL,
    name: "Evently Admin",
    role: "ADMIN",
    token: createAdminSessionToken()
  };
}

export async function listPendingApprovals(): Promise<AuthUserResponse[]> {
  return prisma.user.findMany({
    where: {
      approvalStatus: "PENDING",
      role: {
        in: ["CUSTOMER", "VENDOR"]
      }
    },
    select: authUserSelect,
    orderBy: { createdAt: "desc" }
  });
}

export async function updateApprovalStatus(
  userId: string,
  input: ApprovalStatusRequest
): Promise<AuthUserResponse> {
  return prisma.user.update({
    where: { id: userId },
    data: { approvalStatus: input.status },
    select: authUserSelect
  });
}

export async function getCustomerProfile(authorization: string | undefined): Promise<AuthUserResponse> {
  const userId = assertCustomerSession(authorization).sub;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "CUSTOMER",
      approvalStatus: "APPROVED"
    },
    select: authUserSelect
  });

  if (!user) {
    throw new AppError("Customer account not found", 404);
  }

  return user;
}

export async function updateCustomerProfile(
  authorization: string | undefined,
  input: CustomerProfileUpdateRequest
): Promise<AuthUserResponse> {
  const userId = assertCustomerSession(authorization).sub;

  return prisma.user.update({
    where: {
      id: userId,
      role: "CUSTOMER",
      approvalStatus: "APPROVED"
    },
    data: {
      name: input.fullName,
      email: input.email,
      phone: input.phone ?? null
    },
    select: authUserSelect
  });
}

export async function updateCustomerPassword(
  authorization: string | undefined,
  input: CustomerPasswordUpdateRequest
): Promise<AuthUserResponse> {
  const userId = assertCustomerSession(authorization).sub;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      role: "CUSTOMER",
      approvalStatus: "APPROVED"
    },
    select: {
      ...authUserSelect,
      passwordHash: true
    }
  });

  if (!user) {
    throw new AppError("Customer account not found", 404);
  }

  const passwordMatches = await bcrypt.compare(input.currentPassword, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Current password is incorrect", 401);
  }

  const passwordHash = await bcrypt.hash(input.newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
    select: authUserSelect
  });

  return updatedUser;
}
