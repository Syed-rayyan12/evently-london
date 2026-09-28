"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Weddings",
    image: "/images/wedding.png",
  },
  {
    name: "Engagements",
    image: "/images/engagement.png",
  },
  {
    name: "Mehndi / Sangeet",
    image: "/images/mehndi.png",
  },
  {
    name: "Birthdays",
    image: "/images/birthday.png",
  },
  {
    name: "Baby Showers",
    image: "/images/baby-shower.png",
  },
  {
    name: "Religious Events",
    image: "/images/venue.png",
  },
];

export function CategoryCards() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.18 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className={`home-category-section category-scroll-reveal relative overflow-hidden bg-home px-5 py-20 lg:px-8 ${
        isInView ? "is-in-view" : ""
      }`}
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
      <div className="home-section-inner mx-auto max-w-[90%]">
        <div className="home-section-heading-row mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="home-section-title category-heading-reveal mt-3 font-pt-serif text-[44px] capitalize font-normal text-ink sm:text-5xl">
              <span>Browse By Occasion</span>
            </h2>
            <p className="home-section-copy category-copy-reveal category-delay-1 mt-4 font-inter text-[18px] font-normal text-black">
              Browse curated categories for every celebration.
            </p>
          </div>

          <Link
            href="#categories"
            className="category-button-reveal category-delay-2 group inline-flex items-center gap-2 self-start font-inter text-[16px] font-normal text-ink transition-colors hover:text-gold sm:self-auto"
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

        <div className="home-category-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href="#categories"
              className={`home-category-card category-card-reveal category-delay-${
                index + 3
              } group block overflow-hidden rounded-[10px] border border-brand-gold/35 bg-white capitalize`}
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
              <h3 className="home-card-title px-4 py-4 text-center capitalize font-inter text-[18px] font-normal text-ink">
                {category.name}
              </h3>


            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
