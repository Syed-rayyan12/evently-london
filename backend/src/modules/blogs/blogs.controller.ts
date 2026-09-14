import type { NextFunction, Request, Response } from "express";
import { assertAdminSession } from "../auth/auth.service.js";
import {
  createAdminBlog,
  deleteAdminBlog,
  getPublicBlogBySlug,
  listAdminBlogs,
  listPublicBlogs,
  updateAdminBlogStatus
} from "./blogs.service.js";
import type {
  BlogPostDetailResponse,
  BlogPostRequest,
  BlogPostsResponse,
  BlogStatusUpdateRequest
} from "./blogs.types.js";

type ApiDataResponse<TData> = {
  data: TData;
};

export async function listPublicBlogsController(
  _req: Request,
  res: Response<ApiDataResponse<BlogPostsResponse>>,
  next: NextFunction
) {
  try {
    const blogs = await listPublicBlogs();
    res.json({ data: blogs });
  } catch (error) {
    next(error);
  }
}

export async function getPublicBlogController(
  req: Request<{ slug: string }>,
  res: Response<ApiDataResponse<BlogPostDetailResponse>>,
  next: NextFunction
) {
  try {
    const blog = await getPublicBlogBySlug(req.params.slug);
    res.json({ data: blog });
  } catch (error) {
    next(error);
  }
}

export async function listAdminBlogsController(
  req: Request,
  res: Response<ApiDataResponse<BlogPostsResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const blogs = await listAdminBlogs();
    res.json({ data: blogs });
  } catch (error) {
    next(error);
  }
}

export async function createAdminBlogController(
  req: Request<unknown, ApiDataResponse<BlogPostDetailResponse>, BlogPostRequest>,
  res: Response<ApiDataResponse<BlogPostDetailResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const blog = await createAdminBlog(req.body);
    res.status(201).json({ data: blog });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminBlogController(
  req: Request<{ id: string }>,
  res: Response<ApiDataResponse<{ id: string }>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const result = await deleteAdminBlog(req.params.id);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminBlogStatusController(
  req: Request<{ id: string }, ApiDataResponse<BlogPostDetailResponse>, BlogStatusUpdateRequest>,
  res: Response<ApiDataResponse<BlogPostDetailResponse>>,
  next: NextFunction
) {
  try {
    assertAdminSession(req.get("x-admin-token"));
    const blog = await updateAdminBlogStatus(req.params.id, req.body);
    res.json({ data: blog });
  } catch (error) {
    next(error);
  }
}
