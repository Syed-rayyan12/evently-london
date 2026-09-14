import { prisma } from "../../lib/prisma.js";
import type {
  PublicVendorDetailResponse,
  PublicVendor,
  PublicVendorsQuery,
  PublicVendorsResponse
} from "./public-vendors.types.js";

export const publicVendorSelect = {
  id: true,
  email: true,
  phone: true,
  approvalStatus: true,
  vendorProfile: {
    select: {
      ownerName: true,
      vendorName: true,
      category: true,
      location: true,
      about: true,
      imageUrl: true
    }
  },
  vendorServices: {
    select: {
      id: true,
      name: true,
      startingPrice: true,
      description: true,
      packages: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  },
  vendorPackages: {
    select: {
      id: true,
      serviceId: true,
      name: true,
      description: true,
      price: true
    }
  },
  vendorPortfolioItems: {
    select: {
      imageUrl: true,
      name: true
    },
    orderBy: { createdAt: "desc" }
  },
  vendorAvailabilityEvents: {
    select: {
      date: true,
      status: true,
      eventName: true
    },
    orderBy: { date: "asc" }
  },
  vendorReviews: {
    select: {
      id: true,
      rating: true,
      message: true,
      createdAt: true,
      customer: {
        select: {
          name: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  }
} as const;

export async function listPublicVendors(query: PublicVendorsQuery): Promise<PublicVendorsResponse> {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const selectedCategories = parseCsv(query.category);
  const normalizedQuery = normalize(query.query);
  const normalizedLocation = normalize(query.location);

  const users = await prisma.user.findMany({
    where: {
      role: "VENDOR",
      approvalStatus: {
        not: "SUSPENDED"
      },
      vendorProfile: {
        isNot: null
      }
    },
    select: publicVendorSelect,
    orderBy: { createdAt: "desc" }
  });

  const allVendors = users
    .filter((user) => user.vendorProfile)
    .map(mapUserToPublicVendor);

  const categories = Array.from(new Set(allVendors.map((vendor) => vendor.category).filter(Boolean))).sort();
  const priceValues = allVendors.map((vendor) => vendor.priceFrom).filter((price) => price > 0);
  const priceMin = priceValues.length ? Math.min(...priceValues) : 0;
  const priceMax = priceValues.length ? Math.max(...priceValues) : 5000;

  const filteredVendors = allVendors.filter((vendor) => {
    const matchesQuery =
      !normalizedQuery ||
      normalize(vendor.name).includes(normalizedQuery) ||
      normalize(vendor.category).includes(normalizedQuery) ||
      normalize(vendor.about).includes(normalizedQuery);
    const matchesLocation =
      !normalizedLocation || normalize(vendor.location).includes(normalizedLocation);
    const matchesCategory =
      !selectedCategories.length || selectedCategories.includes(vendor.category);
    const matchesMinPrice = query.minPrice === undefined || vendor.priceFrom >= query.minPrice;
    const matchesMaxPrice = query.maxPrice === undefined || vendor.priceFrom <= query.maxPrice;

    return matchesQuery && matchesLocation && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const total = filteredVendors.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    vendors: filteredVendors.slice(skip, skip + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      skip
    },
    filters: {
      categories,
      priceMin,
      priceMax
    }
  };
}

export async function getPublicVendorBySlug(slug: string): Promise<PublicVendorDetailResponse | null> {
  const users = await prisma.user.findMany({
    where: {
      role: "VENDOR",
      approvalStatus: {
        not: "SUSPENDED"
      },
      vendorProfile: {
        isNot: null
      }
    },
    select: publicVendorSelect,
    orderBy: { createdAt: "desc" }
  });

  const user = users.find((item) => {
    const name = item.vendorProfile?.vendorName ?? "Vendor";

    return createVendorSlug(name, item.id) === slug;
  });

  if (!user) {
    return null;
  }

  const vendor = mapUserToPublicVendor(user);

  return {
    vendor: {
      ...vendor,
      services: user.vendorServices.map((service) => ({
        id: service.id,
        title: service.name,
        description: service.description ?? "",
        startingPrice: service.startingPrice,
        packages: service.packages.map((packageItem) => ({
          id: packageItem.id,
          name: packageItem.name,
          description: packageItem.description ?? "",
          price: packageItem.price
        }))
      })),
      packages: user.vendorPackages.map((packageItem) => ({
        id: packageItem.id,
        serviceId: packageItem.serviceId,
        name: packageItem.name,
        description: packageItem.description ?? "",
        price: packageItem.price
      })),
      portfolio: user.vendorPortfolioItems.map((item) => ({
        src: item.imageUrl,
        alt: item.name
      })),
      reviews: user.vendorReviews.map((review) => ({
        name: review.customer.name,
        rating: review.rating,
        date: formatReviewDate(review.createdAt),
        comment: review.message
      })),
      servicesOffered: user.vendorServices.map((service, index) => ({
        title: service.name,
        icon: `/images/cm-${(index % 5) + 1}.png`
      })),
      availability: Object.fromEntries(
        user.vendorAvailabilityEvents.map((event) => [
          event.date,
          normalizeAvailabilityStatus(event.status)
        ])
      ),
      availabilityLabels: Object.fromEntries(
        user.vendorAvailabilityEvents.map((event) => [
          event.date,
          formatAvailabilityLabel(event.eventName, event.status)
        ])
      )
    }
  };
}

export function mapUserToPublicVendor(user: {
  id: string;
  email: string;
  phone: string | null;
  approvalStatus: string;
  vendorProfile: {
    ownerName: string;
    vendorName: string;
    category: string;
    location: string;
    about: string | null;
    imageUrl: string | null;
  } | null;
  vendorServices: Array<{
    id: string;
    name: string;
    startingPrice: string;
    description: string | null;
    packages: Array<{ id: string; name: string; description: string | null; price: string }>;
  }>;
  vendorPackages: Array<{
    id: string;
    serviceId: string | null;
    name: string;
    description: string | null;
    price: string;
  }>;
  vendorPortfolioItems?: Array<{ imageUrl: string; name: string }>;
  vendorAvailabilityEvents?: Array<{ date: string; status: string; eventName: string }>;
  vendorReviews?: Array<{
    id: string;
    rating: number;
    message: string;
    createdAt: Date;
    customer: { name: string };
  }>;
}): PublicVendor {
  const profile = user.vendorProfile;
  const name = profile?.vendorName ?? "Vendor";
  const priceFrom = getPriceFrom(user.vendorServices, user.vendorPackages);
  const rating = getAverageRating(user.vendorReviews ?? []);
  const reviewCount = user.vendorReviews?.length ?? 0;

  return {
    id: user.id,
    slug: createVendorSlug(name, user.id),
    name,
    category: profile?.category ?? "Vendor",
    rating,
    reviewCount,
    location: profile?.location ?? "",
    image: profile?.imageUrl ?? "/images/Photography.png",
    verified: user.approvalStatus === "APPROVED",
    priceFrom,
    phone: user.phone ?? "",
    website: "",
    responseTime: "Within one business day",
    tagline: profile?.about ?? `${name} vendor profile`,
    about: profile?.about ?? ""
  };
}

function getAverageRating(reviews: Array<{ rating: number }>) {
  if (!reviews.length) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return Math.round((total / reviews.length) * 10) / 10;
}

function formatReviewDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function getPriceFrom(
  services: Array<{ startingPrice: string }>,
  packages: Array<{ price: string }>
) {
  const prices = [
    ...services.map((service) => parsePrice(service.startingPrice)),
    ...packages.map((packageItem) => parsePrice(packageItem.price))
  ].filter((price) => price > 0);

  return prices.length ? Math.min(...prices) : 0;
}

function parsePrice(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));

  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function parseCsv(value: string | undefined) {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function createVendorSlug(name: string, id: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "vendor"}-${id.slice(0, 8)}`;
}

function normalizeAvailabilityStatus(value: string) {
  const normalized = value.toLowerCase();

  if (
    normalized === "available" ||
    normalized === "booked" ||
    normalized === "pending" ||
    normalized === "unavailable"
  ) {
    return normalized;
  }

  return "booked";
}

function formatAvailabilityStatus(value: string) {
  const status = normalizeAvailabilityStatus(value);

  return status.slice(0, 1).toUpperCase() + status.slice(1);
}

function formatAvailabilityLabel(eventName: string | null | undefined, status: string) {
  const statusLabel = formatAvailabilityStatus(status);
  const trimmedEventName = eventName?.trim();

  return trimmedEventName ? `${trimmedEventName} - ${statusLabel}` : statusLabel;
}
