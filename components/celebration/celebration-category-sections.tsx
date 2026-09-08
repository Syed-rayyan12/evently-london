import Image from "next/image";
import Link from "next/link";

const celebrationSections = [
  {
    name: "Wedding",
    image: "/images/wedding.png",
    description:
      "Bring the full wedding journey together with trusted vendors for the venue, photography, catering, decor, bridal beauty, music, and guest experience.",
    types: [
      "Venue",
      "Photography",
      "Catering",
      "Decor & Styling",
      "Bridal Makeup",
      "Entertainment",
    ],
  },
  {
    name: "Engagement",
    image: "/images/engagement.png",
    description:
      "Plan a polished engagement with the right setting, refined styling, thoughtful food, family photography, and a smooth supplier team.",
    types: [
      "Venue",
      "Photography",
      "Catering",
      "Floral Decor",
      "Makeup Artist",
      "Dessert Table",
    ],
  },
  {
    name: "Mehndi",
    image: "/images/mehndi.png",
    description:
      "Shape a colourful mehndi celebration with music, stage decor, henna artists, catering, photography, and lively guest moments.",
    types: [
      "Henna Artist",
      "Dhol & Music",
      "Stage Decor",
      "Photography",
      "Catering",
      "Event Planner",
    ],
  },
  {
    name: "Birthday",
    image: "/images/birthday.png",
    description:
      "Build a birthday celebration around the right theme, venue, cake, entertainment, styling, and photo moments for guests of every age.",
    types: [
      "Venue",
      "Cake Designer",
      "Balloon Decor",
      "Entertainment",
      "Photography",
      "Catering",
    ],
  },
  {
    name: "Baby Shower",
    image: "/images/baby-shower.png",
    description:
      "Create a warm baby shower with soft styling, comfortable hosting, elegant catering, keepsake photography, and thoughtful details.",
    types: [
      "Venue",
      "Decor & Styling",
      "Catering",
      "Photography",
      "Desserts",
      "Event Planner",
    ],
  },
  {
    name: "Venue",
    image: "/images/venue.png",
    description:
      "Find celebration spaces that match your guest count, atmosphere, service needs, catering plans, and photography requirements.",
    types: [
      "Banquet Hall",
      "Hotel Venue",
      "Outdoor Space",
      "Private Dining",
      "Catering",
      "Decor Setup",
    ],
  },
];

export function CelebrationCategorySections() {
  return (
    <section className="bg-home px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-[90%] space-y-16">
        {celebrationSections.map((celebration, index) => {
          const isReversed = index % 2 === 1;

          return (
            <article
              key={celebration.name}
              className="grid items-center gap-4
               lg:grid-cols-2 lg:gap-12"
            >
              <div
                className={`relative min-h-[320px] overflow-hidden rounded-[14px]  bg-white sm:min-h-[420px] ${
                  isReversed ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={celebration.image}
                  alt={celebration.name}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>

              <div className={isReversed ? "lg:order-1" : ""}>
             
                <h2 className="mt-2 font-pt-serif text-[44px] font-normal capitalize leading-tight text-ink sm:text-5xl">
                  {celebration.name}
                </h2>
                <p className=" max-w-2xl font-inter text-[18px] font-normal leading-8 text-muted">
                  {celebration.description}
                </p>

                <div className="mt-7 rounded-[4px]">
                 
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {celebration.types.map((type) => (
                      <span
                        key={type}
                        className="rounded-[4px] border border-brand-line rounded-[20px] bg-white px-4 py-3 font-inter text-[15px] font-normal text-muted"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/vendor"
                  className="btn-slide group mt-7 inline-flex rounded-xl bg-gold px-10 py-4 font-inter text-[16px] font-normal capitalize text-white"
                >
                  <span className="btn-slide-overlay btn-slide-overlay-green" />
                  <span className="btn-slide-label">
                    Explore {celebration.name} Vendors
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
