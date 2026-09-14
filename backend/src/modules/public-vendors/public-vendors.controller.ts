import type { NextFunction, Request, Response } from "express";
import { getPublicVendorBySlug, listPublicVendors } from "./public-vendors.service.js";
import {
  type PublicVendorDetailResponse,
  publicVendorsQueryValidator,
  type PublicVendorsQuery,
  type PublicVendorsResponse
} from "./public-vendors.types.js";

type ApiDataResponse<TData> = {
  data: TData;
};

export async function listPublicVendorsController(
  req: Request<unknown, ApiDataResponse<PublicVendorsResponse>, unknown, PublicVendorsQuery>,
  res: Response<ApiDataResponse<PublicVendorsResponse>>,
  next: NextFunction
) {
  try {
    const query = publicVendorsQueryValidator.parse(req.query);
    const vendors = await listPublicVendors(query);
    res.json({ data: vendors });
  } catch (error) {
    next(error);
  }
}

export async function getPublicVendorBySlugController(
  req: Request<{ slug: string }, ApiDataResponse<PublicVendorDetailResponse> | { error: string }>,
  res: Response<ApiDataResponse<PublicVendorDetailResponse> | { error: string }>,
  next: NextFunction
) {
  try {
    const vendor = await getPublicVendorBySlug(req.params.slug);

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    res.json({ data: vendor });
  } catch (error) {
    next(error);
  }
}
