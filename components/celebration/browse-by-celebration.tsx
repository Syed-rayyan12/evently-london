import Image from "next/image";
import Link from "next/link";

const celebrations = [
  {
    name: "Wedding",
    image: "/images/wedding.png",
    description:
      "Plan a refined wedding with vendors for venues, styling, beauty, catering, and photography.",
  },
  {
    name: "Engagement",
    image: "/images/engagement.png",
    description:
      "Create an elegant engagement celebration with polished details and trusted local suppliers.",
  },
  {
    name: "Mehndi",
    image: "/images/mehndi.png",
    description:
      "Bring colour, music, decor, and hospitality together for a memorable mehndi event.",
  },
  {
    name: "Birthday",
    image: "/images/birthday.png",
    description:
      "Find creative vendors for birthday styling, entertainment, cakes, venues, and guest experiences.",
  },
  {
    name: "Baby Shower",
    image: "/images/baby-shower.png",
    description:
      "Arrange a warm baby shower with thoughtful decor, catering, photography, and planning support.",
  },
  {
    name: "Venue",
    image: "/images/venue.png",
    description:
      "Explore polished venues with the setting, service, and flow your celebration needs.",
  },
];

export function BrowseByCelebration() {
  return (
    <section
      id="celebrations"
      className="relative overflow-hidden bg-home px-5 py-20 lg:px-8"
    >
      <div
        className="absolute right-0 top-5 z-10 animate-shape-float"
        aria-hidden="true"
      >
        <Image
          src="/images/blog-shape.png"
          alt=""
          width={103}
          height={424}
          className="h-auto w-auto object-cover"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-[90%]">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-pt-serif text-[44px] font-normal capitalize text-ink sm:text-5xl">
            Browse by celebration
          </h2>
          <p className="mt-4 font-inter text-[18px] font-normal text-black">
            Explore vendors by the celebration you are planning.
          </p>
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
