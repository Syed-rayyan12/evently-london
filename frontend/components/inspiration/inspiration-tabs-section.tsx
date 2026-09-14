"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, LocateIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["All", "Weddings", "Engagements", "Mehndi", "Birthdays", "Baby Showers"];

const SLIDES = [
  {
    id: 1,
    src: "/images/mek-1.png",
    alt: "Wedding reception decor",
    title: "Wedding Reception",
    text: "Elegant styling, warm lighting and layered details for a polished celebration.",
  },
  {
    id: 2,
    src: "/images/mek-2.png",
    alt: "Wedding aisle with florals",
    title: "Floral Aisle",
    text: "Soft florals and refined seating for a calm, romantic ceremony setting.",
  },
  {
    id: 3,
    src: "/images/mek-3.png",
    alt: "Mehndi celebration outfit",
    title: "Mehndi Moments",
    text: "Bright colour, texture and celebratory details for a memorable pre-wedding event.",
  },
  {
    id: 4,
    src: "/images/mek-4.png",
    alt: "Birthday celebration with balloons",
    title: "Birthday Styling",
    text: "A composed celebration setup with statement decor and clean visual balance.",
  },
  {
    id: 5,
    src: "/images/mek-5.png",
    alt: "Family celebration",
    title: "Family Celebration",
    text: "Thoughtful event styling designed around comfort, atmosphere and shared moments.",
  },
  {
    id: 6,
    src: "/images/blog-1.png",
    alt: "Celebration table inspiration",
    title: "Table Details",
    text: "Tablescapes, textures and finishing touches that bring the room together.",
  },
  {
    id: 7,
    src: "/images/blog-2.png",
    alt: "Decor inspiration",
    title: "Decor Direction",
    text: "Ideas for building a cohesive event mood from entry to main space.",
  },
  {
    id: 8,
    src: "/images/blog-3.png",
    alt: "Event inspiration",
    title: "Event Finish",
    text: "Final details that make the celebration feel intentional and complete.",
  },
];

const GALLERY_ITEMS = Array.from({ length: 12 }, (_, index) => SLIDES[index % SLIDES.length]);

export default function InspirationTabsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const showGallery = activeCategory === "All";

  const activeSlide = useMemo(
    () => (activeIndex === null ? null : SLIDES[activeIndex]),
    [activeIndex],
  );

  function showPrevious() {
    setActiveIndex((current) =>
      current === null ? 0 : (current - 1 + SLIDES.length) % SLIDES.length,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? 0 : (current + 1) % SLIDES.length,
    );
  }

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <section className="relative w-full overflow-hidden bg-[#faf9f6] px-6 py-8  md:px-12 lg:px-20">
      <div className="relative mx-auto max-w-6xl">
        {/* <div className="text-center">
          <h2 className="font-pt-serif text-[44px] font-normal text-black">
            Get Inspired
          </h2>
          <p className="mt-2 font-inter text-sm text-neutral-500">
            Ideas, Themes And Real Celebrations
          </p>
        </div> */}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`btn-slide group gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${isActive
                    ? "border-[#173d33] bg-[#173d33] text-white"
                    : "border-neutral-300 bg-white text-neutral-600 hover:border-[#173d33]"
                  }`}
              >
                <span className={`btn-slide-overlay ${isActive ? "btn-slide-overlay-gold" : "btn-slide-overlay-green"}`} />
                <span className={`btn-slide-label transition-colors duration-300 ${isActive ? "" : "group-hover:text-white group-focus-visible:text-white"}`}>
                  {category}
                </span>
              </button>
            );
          })}
        </div>

        {showGallery ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY_ITEMS.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index % SLIDES.length)}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-sm outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-gold"
                aria-label={`Open ${item.title}`}
              >
               
               
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-lg border border-brand-line bg-white px-6 text-center">
            <div>
              <h3 className="font-pt-serif text-[30px] font-normal text-ink">
                More inspiration is coming soon
              </h3>
              <p className="mt-3 max-w-xl font-inter text-[16px] leading-7 text-muted">
                Other categories will be added when the vendor section is up.
              </p>
            </div>
          </div>
        )}
      </div>

      {activeSlide && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-2xl animate-[inspirationModal_220ms_ease-out] overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              aria-label="Close inspiration popup"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="grid max-h-[78vh] overflow-y-auto lg:grid-cols-1">
              <div className="relative bg-black sm:min-h-[320px]">
                <Image
                  key={activeSlide.src}
                  src={activeSlide.src}
                  alt={activeSlide.alt}
                  fill
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="animate-[inspirationImage_260ms_ease-out] object-cover"
                  unoptimized
                />

                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex min-h-[60px]  justify-between items-center bg-white p-6">
                <div className="flex flex-col gap-2">
                  <h3 className=" font-pt-serif text-[24px] font-normal leading-tight text-black">
                    {activeSlide.title}
                  </h3>
                  <p className="font-inter text-[14px] font-medium uppercase text-gold">
                    Inspiration
                  </p>
                  {/* <p className=" font-inter text-[16px] leading-7 text-muted">
                    {activeSlide.text}
                  </p> */}
                  <div className="flex items-center  gap-2">
                    <div className="flex gap-2">
                      <LocateIcon />
                      <span className="font-inter text-[14.27px] font-normal text-black/70">London, UK</span>
                    </div>
                    <div className="flex gap-2">
                      <LocateIcon />
                      <span className="font-inter text-[14.27px] font-normal text-black/70">24 Aug 2026</span>
                    </div>
                    <div className="flex gap-2">
                      <LocateIcon />
                      <span className="font-inter text-[14.27px] font-normal text-black/70">2 Hours ago</span>
                    </div>
                  </div>
                </div>
                <div className="text-[18px] text-[#2A5344] font-pt-serif font-normal text-[20px]">
                  {activeIndex + 1} <span className="text-[#D79D42]">/</span>{SLIDES.length}
                </div>


              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
