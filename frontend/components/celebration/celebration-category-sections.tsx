import Image from "next/image";
import Link from "next/link";

const celebrationSections = [
  {
    name: "Weddings",
    image: "/images/wedding.png",
    description:
      "Finding luxury wedding vendors in London becomes simple when you use a platform built around trust, elegance and genuine care.",
    types: [
      "Venue Selection",
      "Catering Services",
      "Photography Coverage",
      "Decor Styling",
      "Entertainment Booking",
      "Planning Support",
    ],
  },
  {
    name: "Engagements",
    image: "/images/engagement.png",
    description:
      "A private engagement party organiser can turn your special moment into something truly memorable with elegance and heartfelt attention.",
    types: [
      "Venue Booking",
      "Catering Menus",
      "Decor Design",
      "Photography Services",
      "Entertainment Options",
      "Planning Help",
    ],
  },
  {
    name: "Mehndi & Sangeet",
    image: "/images/mehndi.png",
    description:
      "Searching for a sangeet organiser near me should feel easy, and we connect you with vendors who honour every tradition beautifully.",
    types: [
      "Mehndi Artists",
      "Dhol Players",
      "Choreography Help",
      "Decor Setup",
      "Catering Options",
      "Venue Booking",
    ],
  },
  
  {
    name: "Birthdays",
    image: "/images/baby-shower.png",
    description:
      "Our birthday party vendors help you create a celebration filled with joy, laughter and beautiful details for every guest.",
    types: [
      "Venue Hire",
      "Cake Designers",
      "Decor Styling",
      "Entertainment Booking",
      "Catering Services",
      "Photography Coverage",
    ],
  },
  {
    name: "Baby Showers",
    image: "/images/venue.png",
    description:
      "Trusted baby shower organisers in London help you welcome your little one with warmth, beauty and thoughtful attention to detail.",
    types: [
      "Venue Booking",
      "Decor Design",
      "Catering Menus",
      "Cake Designers",
      "Photography Services",
      "Gift Planning",
    ],
  },
   {
    name: "Religious Celebrations",
    image: "/images/venue.png",
    description:
      "An interfaith wedding planner who respects every tradition helps you celebrate your faith with dignity and genuine cultural understanding.",
    types: [
      "Priest Booking",
      "Mandap Decor",
      "Halal Catering",
      "Ceremony Planning",
      "Ritual Setup",
      "Cultural Support",
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
