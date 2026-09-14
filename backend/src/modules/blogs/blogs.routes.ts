import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import {
  createAdminBlogController,
  deleteAdminBlogController,
  getPublicBlogController,
  listAdminBlogsController,
  listPublicBlogsController,
  updateAdminBlogStatusController
} from "./blogs.controller.js";
import { blogPostValidator, blogStatusUpdateValidator } from "./blogs.types.js";

export const publicBlogsRouter = Router();
export const adminBlogsRouter = Router();

publicBlogsRouter.get("/", listPublicBlogsController);
publicBlogsRouter.get("/:slug", getPublicBlogController);

adminBlogsRouter.get("/", listAdminBlogsController);
adminBlogsRouter.post("/", validateBody(blogPostValidator), createAdminBlogController);
adminBlogsRouter.patch("/:id/status", validateBody(blogStatusUpdateValidator), updateAdminBlogStatusController);
adminBlogsRouter.delete("/:id", deleteAdminBlogController);
