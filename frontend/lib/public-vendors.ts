import { apiRequest } from "./request";

export type PublicVendor = {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  verified: boolean;
  priceFrom: number;
  phone: string;
  website: string;
  responseTime: string;
  tagline: string;
  about: string;
};

export type PublicVendorDetail = PublicVendor & {
  services: Array<{
    id?: string;
    title: string;
    description: string;
    startingPrice?: string;
    packages: Array<{ id?: string; name: string; description: string; price: string }>;
  }>;
  packages: Array<{
    id?: string;
    serviceId?: string | null;
    name: string;
    description: string;
    price: string;
  }>;
  portfolio: Array<{ src: string; alt: string }>;
  reviews: Array<{ name: string; rating: number; date: string; comment: string }>;
  servicesOffered: Array<{ title: string; icon: string }>;
  availability: Record<string, "available" | "booked" | "pending" | "unavailable">;
  availabilityLabels?: Record<string, string>;
};

export type PublicVendorsQuery = {
  page?: number;
  limit?: number;
  query?: string;
  location?: string;
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
};

export type PublicVendorsResult = {
  vendors: PublicVendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    skip: number;
  };
  filters: {
    categories: string[];
    priceMin: number;
    priceMax: number;
  };
};

export function listPublicVendors(query: PublicVendorsQuery = {}) {
  const params = new URLSearchParams();

  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 20));

  if (query.query?.trim()) {
    params.set("query", query.query.trim());
  }

  if (query.location?.trim()) {
    params.set("location", query.location.trim());
  }

  if (query.category?.length) {
    params.set("category", query.category.join(","));
  }

  if (query.minPrice !== undefined) {
    params.set("minPrice", String(query.minPrice));
  }

  if (query.maxPrice !== undefined) {
    params.set("maxPrice", String(query.maxPrice));
  }

  return apiRequest<PublicVendorsResult>(`/api/vendors?${params.toString()}`, {
    method: "GET"
  });
}

export function getPublicVendorBySlug(slug: string) {
  return apiRequest<{ vendor: PublicVendorDetail }>(`/api/vendors/${slug}`, {
    method: "GET"
  });
}
