import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Weddings",
    image: "/images/Photography.png",
  },
  {
    name: "Engagements",
    image: "/images/Catering.png",
  },
  {
    name: "Mehndi / Sangeet",
    image: "/images/venue.png",
  },
  {
    name: "Birthdays",
    image: "/images/decor-1.png",
  },
  {
    name: "Baby Showers",
    image: "/images/Entertainment.png",
  },
  {
    name: "Religious Events",
    image: "/images/Makeup Artists.png",
  },
];

export function CategoryCards() {
  return (
    <section
      id="categories"
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
      <div className="mx-auto max-w-[90%]">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mt-3 font-pt-serif text-[44px] capitalize font-normal text-ink sm:text-5xl">
              Browse By Occasion
            </h2>
            <p className="font-inter text-[18px] font-normal   text-black mt-4">
              Browse curated categories for every celebration.
            </p>
          </div>

          <Link
            href="#categories"
            className="group inline-flex items-center gap-2 self-start font-inter text-[16px] font-normal text-ink transition-colors hover:text-gold sm:self-auto"
          >
            <span className="text-hover-underline capitalize">
              View all categories
            </span>
            <ArrowRight
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="#categories"
              className="group block overflow-hidden capitalize rounded-[10px] border border-brand-gold/35 bg-white"
            >
              <div className="relative aspect-[1] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 15vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="px-4 py-4 text-center capitalize font-inter text-[18px] font-normal text-ink">
                {category.name}
              </h3>


            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
