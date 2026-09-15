import {
  CalendarDays,
  Camera,
  MapPin,
  Music,
  Search,
  Utensils,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { WebsiteHeader } from "./header";
import { HeroCarousel } from "./hero-carousel";

const slides = [
  {
    src: "/images/slide-1.png",
    alt: "Elegant event table setting with warm lights",
  },
  {
    src: "/images/slide-2.png",
    alt: "Luxury celebration venue prepared for guests",
  },
  {
    src: "/images/slide-3.png",
    alt: "Decorated event space with refined floral details",
  },
  {
    src: "/images/slide-4.png",
    alt: "Premium gathering setup with polished hospitality details",
  },
];

const categoryLinks = [
  { label: "Handpicked Vendors", icon: Camera },
  { label: "Effortless Search", icon: Utensils },
  { label: "Cultural Insight", icon: Music },
  { label: "Exclusive Perks", icon: Users },
];

export function HeroBanner() {
  return (
    <section className="hero-banner-section relative min-h-[100vh] overflow-hidden bg-ink text-white">
      <WebsiteHeader overlay />

      <HeroCarousel slides={slides} />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72),rgba(0,0,0,0.42)_42%,rgba(0,0,0,0.12))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.02)_38%,rgba(0,0,0,0.46))]" />

      <div className="hero-banner-copy relative z-10 mx-auto flex min-h-[88vh] container-header w-full max-w-7xl items-center px-5 pb-12 pt-36 lg:min-h-screen lg:px-8 lg:pb-[280px] lg:pt-40">
        <div className="max-w-5xl">
          {/* <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-gold">
          Curated Celebrations.<span>Elevated experiences.</span>

          </p> */}
          <h1 className="font-pt-serif text-[72px] capitalize font-normal  leading-[1.1] text-white ">
            Celebrate Love In <br /><span className="font-pt-serif text-[74px] font-normal capitalize text-gold">Luxury.</span>
          </h1>
          <p className="mt-7 font-inter font-normal max-w-2xl text-[26px] leading-8 text-white/82 sm:text-xl">
           Hire a South Indian wedding planner in London with confidence, bringing life and luxury to your events.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="btn-slide group rounded-[10px] bg-[#003224] px-10 py-4 font-inter text-[16px] font-normal capitalize text-white"
            >
              <span className="btn-slide-overlay btn-slide-overlay-gold" />
              <span className="btn-slide-label">Find Vendor</span>
            </Link>
            <Link
              href="#services"
              className="btn-slide group rounded-[10px] bg-gold px-10 py-4 font-inter text-[16px] font-normal capitalize text-white"
            >
              <span className="btn-slide-overlay btn-slide-overlay-green" />
              <span className="btn-slide-label">Explore services</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-search-panel relative z-20 mx-auto mb-6  container-sub max-w-[90%] rounded-[14px] bg-white p-3 shadow-2xl shadow-black/25 lg:absolute lg:bottom-24 lg:left-1/2 lg:mb-0 lg:-translate-x-1/2">
        <form>
          <div className="hero-search-grid grid gap-3 px-3 pb-2 pt-8 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <div>
              <label
                htmlFor="hero-event-type"
                className="mb-2 block font-inter text-[13.27px] font-normal leading-none text-ink"
              >
                What are you Planning?
              </label>
              <div className="flex min-h-14 items-center gap-3 rounded-[10px] border border-brand-line px-4">
                <Search className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <input
                  id="hero-event-type"
                  type="text"
                  name="eventType"
                  placeholder="Wedding, party, corporate"
                  className="w-full bg-transparent font-inter text-base font-normal text-ink outline-none placeholder:text-muted/70"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="hero-location"
                className="mb-2 block font-inter text-[13.27px] font-normal leading-none text-ink"
              >
                Location
              </label>
              <div className="flex min-h-14 items-center gap-3 rounded-[10px] border border-brand-line px-4">
                <MapPin className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <input
                  id="hero-location"
                  type="text"
                  name="location"
                  placeholder="City or area"
                  className="w-full bg-transparent font-inter text-base font-normal text-ink outline-none placeholder:text-muted/70"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="hero-date"
                className="mb-2 block font-inter text-[13.27px] font-normal leading-none text-ink"
              >
                Event Date
              </label>
              <div className="flex min-h-14 items-center gap-3 rounded-[10px] border border-brand-line px-4">
                <CalendarDays className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <input
                  id="hero-date"
                  type="date"
                  name="date"
                  className="w-full bg-transparent font-inter text-base font-normal text-ink outline-none"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="hero-budget"
                className="mb-2 block font-inter text-[13.27px] font-normal leading-none text-ink"
              >
                Budget
              </label>
              <div className="flex min-h-14 items-center gap-3 rounded-[10px] border border-brand-line px-4">
                <Wallet className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <input
                  id="hero-budget"
                  type="text"
                  name="budget"
                  placeholder="$2,000 - $8,000"
                  className="w-full bg-transparent font-inter text-base font-normal text-ink outline-none placeholder:text-muted/70"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-slide group mt-[5px] min-h-14 gap-2 rounded-[10px] bg-[#003224] px-8 font-inter font-normal text-white"
            >
              <span className="btn-slide-overlay btn-slide-overlay-gold" />
              <span className="btn-slide-label">Search Vendors</span>
            </button>
          </div>
        </form>
      </div>
      <ul className="hero-proof-list relative z-20 mx-auto mb-8 grid w-[calc(100%-40px)] max-w-[95%] gap-3 sm:grid-cols-2 lg:absolute lg:bottom-4 lg:left-1/2 lg:mb-0  lg:-translate-x-1/2 lg:grid-cols-4">
        {categoryLinks.map((item) => {

          const Icon = item.icon;

          return (
            <li key={item.label}>
              <Link
                href="#services"
                className="group flex min-h-12 items-center justify-center gap-3 rounded-[10px] font-inter text-[14px] font-normal text-white transition-colors"
              >
                <Icon
                  className="h-5 w-5 text-gold transition-colors group-hover:text-white"
                  aria-hidden="true"
                />
                <span className="text-hover-underline font-inter text-[18px] font-normal">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
