import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import {
  adminLoginController,
  getCustomerProfileController,
  listPendingApprovalsController,
  loginController,
  signupController,
  updateApprovalStatusController,
  updateCustomerPasswordController,
  updateCustomerProfileController
} from "./auth.controller.js";
import {
  adminLoginValidator,
  approvalStatusValidator,
  customerPasswordUpdateValidator,
  customerProfileUpdateValidator,
  loginValidator,
  signupValidator
} from "./auth.types.js";

export const authRouter = Router();

authRouter.post("/signup", validateBody(signupValidator), signupController);
authRouter.post("/login", validateBody(loginValidator), loginController);
authRouter.post("/admin/login", validateBody(adminLoginValidator), adminLoginController);
authRouter.get("/approvals", listPendingApprovalsController);
authRouter.get("/customer/me", getCustomerProfileController);
authRouter.patch(
  "/approvals/:id",
  validateBody(approvalStatusValidator),
  updateApprovalStatusController
);
authRouter.put(
  "/customer/profile",
  validateBody(customerProfileUpdateValidator),
  updateCustomerProfileController
);
authRouter.put(
  "/customer/password",
  validateBody(customerPasswordUpdateValidator),
  updateCustomerPasswordController
);
