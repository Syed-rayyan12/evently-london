export type AvailabilityStatus = "available" | "booked" | "pending" | "unavailable";

export type VendorService = {
  title: string;
  description: string;
};

export type VendorPackage = {
  name: string;
  description: string;
  price: string;
};

export type VendorPortfolioImage = {
  src: string;
  alt: string;
};

export type VendorReview = {
  name: string;
  rating: number;
  date: string;
  comment: string;
};

export type VendorOfferedService = {
  title: string;
  icon: string;
};

export type VendorProfile = {
  id: number;
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
  services: VendorService[];
  packages: VendorPackage[];
  portfolio: VendorPortfolioImage[];
  reviews: VendorReview[];
  servicesOffered: VendorOfferedService[];
  availability: Record<string, AvailabilityStatus>;
};

const portfolio: VendorPortfolioImage[] = [
  { src: "/images/mej.png", alt: "Wedding photography detail" },
  { src: "/images/card-4.png", alt: "Celebration catering setup" },
  { src: "/images/card-3.png", alt: "Bridal styling portrait" },
  { src: "/images/card-2.png", alt: "Decor and floral styling" },
  { src: "/images/card-1.png", alt: "Reception entertainment setup" },
  { src: "/images/venue.png", alt: "Elegant venue interior" },
];

const services: VendorService[] = [
  {
    title: "Wedding Photography",
    description:
      "Full-day professional coverage with edited high-resolution images and a curated online gallery.",
  },
  {
    title: "Engagement Shoot",
    description:
      "A relaxed pre-event session at your chosen location with edited digital images.",
  },
  {
    title: "Wedding Videography",
    description:
      "Cinematic highlight coverage for ceremonies, receptions, and family celebration moments.",
  },
];

const packages: VendorPackage[] = [
  {
    name: "Essential Package",
    description: "8 hours coverage, one photographer, 300 edited images, online gallery.",
    price: "GBP 1,500",
  },
  {
    name: "Classic Package",
    description: "Pre-session, one photographer, 400 edited images, and delivery gallery.",
    price: "GBP 1,850",
  },
  {
    name: "Premium Package",
    description: "Full-day coverage, two photographers, engagement shoot, and album.",
    price: "GBP 2,580",
  },
];

const servicesOffered: VendorOfferedService[] = [
  { title: "Wedding Photography", icon: "/images/cm-1.png" },
  { title: "Cinematic Videography", icon: "/images/cm-2.png" },
  { title: "Pre-Wedding Shoots", icon: "/images/cm-3.png" },
  { title: "Albums & Prints", icon: "/images/cm-4.png" },
   { title: "Albums & Prints", icon: "/images/cm-5.png" },
];

export const vendors: VendorProfile[] = [
  {
    id: 1,
    slug: "royal-moments-photography",
    name: "Royal Moments Photography",
    category: "Photography",
    rating: 4.9,
    reviewCount: 128,
    location: "London, UK",
    image: "/images/mej.png",
    verified: true,
    priceFrom: 1500,
    phone: "+44 7700 100103",
    website: "royalmoments.example.com",
    responseTime: "Within a few hours",
    tagline: "Timeless wedding photography and cinematic celebration films.",
    about:
      "Royal Moments Photography captures weddings, engagements, mehndi nights, and private celebrations with a calm documentary style and polished portrait direction.",
    services,
    packages,
    portfolio,
    reviews: [
      {
        name: "Asha Rahman",
        rating: 5,
        date: "2 Jul 2026",
        comment:
          "Absolutely flawless. They captured the emotion of every moment without ever feeling intrusive.",
      },
      {
        name: "Maha Farel",
        rating: 5,
        date: "18 Jun 2026",
        comment:
          "Warm and completely professional. The on-the-day experience made the final gallery even better.",
      },
      {
        name: "Priya Sharma",
        rating: 4,
        date: "3 May 2026",
        comment:
          "Beautiful engagement shoot experience. The photos were well worth the wait.",
      },
    ],
    servicesOffered,
    availability: {
      "2026-09-05": "booked",
      "2026-09-12": "pending",
      "2026-09-19": "available",
      "2026-09-26": "available",
    },
  },
  {
    id: 2,
    slug: "signature-flavours-catering",
    name: "Signature Flavours Catering",
    category: "Catering",
    rating: 4.9,
    reviewCount: 128,
    location: "Manchester, UK",
    image: "/images/card-4.png",
    verified: true,
    priceFrom: 1500,
    phone: "+44 7700 100104",
    website: "signatureflavours.example.com",
    responseTime: "Within one business day",
    tagline: "Polished menus for weddings, birthdays, and family celebrations.",
    about:
      "Signature Flavours Catering creates event menus with tasting support, buffet service, plated dinners, and dietary-friendly options.",
    services,
    packages,
    portfolio,
    reviews: [],
    servicesOffered,
    availability: {},
  },
  {
    id: 3,
    slug: "bhosh-bridal-studio",
    name: "Bhosh Bridal Studio",
    category: "Makeup Artist",
    rating: 4.9,
    reviewCount: 128,
    location: "Birmingham, UK",
    image: "/images/card-3.png",
    verified: true,
    priceFrom: 800,
    phone: "+44 7700 100105",
    website: "bhoshbridal.example.com",
    responseTime: "Within a few hours",
    tagline: "Bridal beauty with refined skin, hair, and finishing details.",
    about:
      "Bhosh Bridal Studio offers bridal and occasion makeup with a focus on long-wear finishes and calm event-morning preparation.",
    services,
    packages,
    portfolio,
    reviews: [],
    servicesOffered,
    availability: {},
  },
  {
    id: 4,
    slug: "golden-petals-events",
    name: "Golden Petals Events",
    category: "Decor & Styling",
    rating: 4.9,
    reviewCount: 116,
    location: "Leeds, UK",
    image: "/images/card-2.png",
    verified: true,
    priceFrom: 1200,
    phone: "+44 7700 100106",
    website: "goldenpetals.example.com",
    responseTime: "Within a few hours",
    tagline: "Floral-led event styling for refined celebration spaces.",
    about:
      "Golden Petals Events designs stages, tablescapes, entrances, and floral installations for weddings, engagements, birthdays, and private gatherings.",
    services,
    packages,
    portfolio,
    reviews: [],
    servicesOffered,
    availability: {},
  },
  {
    id: 5,
    slug: "dj-infinity",
    name: "DJ Infinity",
    category: "Entertainment",
    rating: 4.8,
    reviewCount: 92,
    location: "Bristol, UK",
    image: "/images/card-1.png",
    verified: true,
    priceFrom: 950,
    phone: "+44 7700 100107",
    website: "djinfinity.example.com",
    responseTime: "Within one business day",
    tagline: "High-energy music, hosting, and production for celebrations.",
    about:
      "DJ Infinity brings music planning, live mixing, lighting, and hosting support for receptions, mehndi nights, birthdays, and private parties.",
    services,
    packages,
    portfolio,
    reviews: [],
    servicesOffered,
    availability: {},
  },
  {
    id: 6,
    slug: "prime-venue-collection",
    name: "Prime Venue Collection",
    category: "Venue",
    rating: 4.8,
    reviewCount: 94,
    location: "Liverpool, UK",
    image: "/images/venue.png",
    verified: true,
    priceFrom: 2200,
    phone: "+44 7700 100108",
    website: "primevenue.example.com",
    responseTime: "Within one business day",
    tagline: "Characterful spaces for weddings, receptions, and private events.",
    about:
      "Prime Venue Collection helps families shortlist elegant venues with guest-flow planning, catering coordination, and supplier access.",
    services,
    packages,
    portfolio,
    reviews: [],
    servicesOffered,
    availability: {},
  },
  {
    id: 7,
    slug: "luxe-bridal-finish",
    name: "Luxe Bridal Finish",
    category: "Makeup Artist",
    rating: 4.9,
    reviewCount: 76,
    location: "Glasgow, UK",
    image: "/images/Makeup Artists.png",
    verified: true,
    priceFrom: 800,
    phone: "+44 7700 100109",
    website: "luxebridalfinish.example.com",
    responseTime: "Within a few hours",
    tagline: "Soft-glam bridal and party makeup with polished finishing.",
    about:
      "Luxe Bridal Finish creates bridal, bridesmaid, and occasion looks with detailed consultations and practical event-morning timelines.",
    services,
    packages,
    portfolio,
    reviews: [],
    servicesOffered,
    availability: {},
  },
];

export const vendor = vendors[0];

export function getVendorBySlug(slug: string) {
  return vendors.find((item) => item.slug === slug);
}

export function getVendorSlugs() {
  return vendors.map((item) => ({ slug: item.slug }));
}
