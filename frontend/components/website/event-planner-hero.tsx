import Image from "next/image";
import { Check } from "lucide-react";
import { AnimatedShapeImage } from "./animated-shape-image";

const FEATURES = [
  " Thoughtful vendors for every moment",
  "Luxury touches without the stress",
  "Cultural details handled with respect",
  "Simple tools to save favourites",
  "Support from start to finish",
];

const BUDGET_ITEMS = [
  { label: "Venue", range: "£7000 - £8000" },
  { label: "Catering", range: "£5000 - £7000" },
  { label: "Photography", range: "£2100 - £2700" },
  { label: "Decor", range: "£1800 - £2200" },
  { label: "Entertainment", range: "£1000 - £1400" },
  { label: "Makeup", range: "£800 - £1200" },
];

const BUDGET_ICONS = {
  Venue: "/images/Venue-1.png",
  Catering: "/images/Catering-1.png",
  Photography: "/images/Photography-1.png",
  Decor: "/images/decor-1.png",
  Entertainment: "/images/Entertainment-1.png",
  Makeup: "/images/Makeup-1.png",
};

export default function EventPlannerHero() {
  return (
    <section className="home-event-planner relative w-full overflow-hidden bg-[#F5F0EA] px-6 py-16">
        <AnimatedShapeImage
          src="/images/flower-1.png"
          width={103}
          height={424}
          className="absolute right-0 top-16 z-9999"
          imageClassName="h-auto w-auto object-cover"
        />
      <div className="home-section-inner home-event-grid mx-auto grid max-w-[88%] grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr_1fr]">
        {/* Left column: copy + features + CTA */}
        <div className="relative">
          {/* dotted vertical guide, decorative */}
          <span className="pointer-events-none absolute -right-5 top-0 hidden h-full  border-amber-400/70 lg:block" />

          <p className="home-eyebrow text-[20px] font-normal font-inter  text-neutral-500">
         Every Celebration Deserves Care
          </p>

          <h1 className="home-event-title mt-2 text-[38px] font-serif font-normal leading-tight text-neutral-900 ">
            Design Your Perfect Celebration{" "}
            <span className="text-[#D79D42]">Event</span>
          </h1>

          <p className="home-event-copy mt-4 max-w-md text-[18px] font-normal font-inter  text-neutral-600">
          We help you build a beautiful event with genuine care and beauty, adding meaning to each occasion.
          </p>

          <ul className="home-feature-list mt-6 space-y-3">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="home-feature-item flex items-center gap-3 text-[15px] font-medium text-neutral-600"
              >
            <span className="flex h-5 w-5 text-neutral-600 font-normal items-center justify-center rounded-full border-2 border-[#D79D42]">
                  <Check className="h-3 w-3 text-[#D79D42]" strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="home-event-cta btn-slide group mt-8 rounded-md bg-[#D79D42] px-7 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <span className="btn-slide-overlay btn-slide-overlay-green" />
            <span className="btn-slide-label">Let’s Organise Your Event</span>
          </button>
        </div>

        {/* Center column: couple image */}
        <div className="home-event-image-wrap relative mx-auto w-full max-w-sm">
          <span className="pointer-events-none absolute -right-5 top-0 hidden h-full  lg:block" />
          <div className="overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/images/couple.png"
              alt="Bride and groom embracing at their wedding"
              width={371}
              height={461}
              className="home-event-image h-[525px] w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Right column: event plan card */}
        <div className="home-event-plan mx-auto w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <h2 className="text-[20px] font-pt-serif  font-normal text-neutral-900">
              Your Event Plan
            </h2>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600">
              Estimated Budget
            </span>
          </div>

          <p className="mt-1 text-[20px] text-start font-pt-serif font-normal text-neutral-900">
            £18,000 - £23,000
          </p>

          <ul className="mt-5 divide-y divide-neutral-100">
            {BUDGET_ITEMS.map((item) => {
              const icon = BUDGET_ICONS[item.label as keyof typeof BUDGET_ICONS];

              return (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4 py-2.5 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-3 text-neutral-600">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#D79D42]">
                      <Image
                        src={icon}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="shrink-0 font-normal font-inter text-neutral-600">
                    {item.range}
                  </span>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="btn-slide group mt-6 w-full rounded-md bg-[#173d33] py-3 text-[18px] font-normal text-white"
          >
            <span className="btn-slide-overlay btn-slide-overlay-gold" />
            <span className="btn-slide-label">View Matching Vendors</span>
          </button>
        </div>
      </div>
    </section>
  );
}

