import { Router } from "express";
import {
  getPublicVendorBySlugController,
  listPublicVendorsController
} from "./public-vendors.controller.js";

export const publicVendorsRouter = Router();

publicVendorsRouter.get("/", listPublicVendorsController);
publicVendorsRouter.get("/:slug", getPublicVendorBySlugController);
