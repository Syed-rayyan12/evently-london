import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const celebrations = [
  {
    name: "Wedding",
    image: "/images/mek-1.png",
    description: "Plan a refined wedding with vendors for venues, styling, beauty, catering, and photography.",
  },
  {
    name: "Engagement",
    image: "/images/mek-2.png",
    description: "Create an elegant engagement celebration with polished details and trusted local suppliers.",
  },
  {
    name: "Mehndi",
    image: "/images/mek-3.png",
    description: "Bring colour, music, decor, and hospitality together for a memorable mehndi event.",
  },
  {
    name: "Birthday",
    image: "/images/mek-4.png",
    description: "Find creative vendors for birthday styling, entertainment, cakes, venues, and guest experiences.",
  },
  {
    name: "Baby Shower",
    image: "/images/mek-5.png",
    description: "Arrange a warm baby shower with thoughtful decor, catering, photography, and planning support.",
  },
  {
    name: "Religious Event",
    image: "/images/occasion.png",
    description: "Coordinate respectful religious gatherings with venues, catering, decor, and dependable event teams.",
  },
];

export function BrowseByCelebration() {
  return (
    <section
      id="celebrations"
      className="relative overflow-hidden bg-home px-5 py-20 lg:px-8"
    >
      <div
        className="absolute left-0 top-0 z-10 animate-shape-float"
        aria-hidden="true"
      >
        <Image
          src="/images/how-shape.png"
          alt=""
          width={103}
          height={424}
          className="h-auto w-auto object-cover"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-[90%]">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mt-3 font-pt-serif text-[44px] font-normal capitalize text-ink sm:text-5xl">
              Browse by celebration
            </h2>
            <p className="mt-4 font-inter text-[18px] font-normal text-black">
              Explore vendors by the celebration you are planning.
            </p>
          </div>

          <Link
            href="#celebrations"
            className="group inline-flex items-center gap-2 self-start font-inter text-[16px] font-normal text-ink transition-colors hover:text-gold sm:self-auto"
          >
            <span className="text-hover-underline capitalize">
              View all celebrations
            </span>
            <ArrowRight
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {celebrations.map((celebration) => (
            <Link
              key={celebration.name}
              href="#celebrations"
              className="group block overflow-hidden rounded-[10px] border border-brand-gold/35 bg-white"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={celebration.image}
                  alt={celebration.name}
                  fill
                  sizes="(min-width: 1024px) 15vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-4 py-4 text-center">
                <h3 className="font-inter text-[18px] font-normal capitalize text-ink">
                  {celebration.name}
                </h3>
                <p className="mt-2 font-inter text-[13px] font-normal leading-5 text-muted">
                  {celebration.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
