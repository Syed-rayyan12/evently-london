import { z } from "zod";

export const publicVendorsQueryValidator = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  query: z.string().trim().optional(),
  location: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional()
});

export type PublicVendorsQuery = z.infer<typeof publicVendorsQueryValidator>;

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
    packages: Array<{
      id?: string;
      name: string;
      description: string;
      price: string;
    }>;
  }>;
  packages: Array<{
    id?: string;
    serviceId?: string | null;
    name: string;
    description: string;
    price: string;
  }>;
  portfolio: Array<{
    src: string;
    alt: string;
  }>;
  reviews: Array<{
    name: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  servicesOffered: Array<{
    title: string;
    icon: string;
  }>;
  availability: Record<string, "available" | "booked" | "pending" | "unavailable">;
  availabilityLabels: Record<string, string>;
};

export type PublicVendorsResponse = {
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

export type PublicVendorDetailResponse = {
  vendor: PublicVendorDetail;
};
