"use client";

import { useState } from "react";
import Image from "next/image";

const CATEGORIES = ["All", "Weddings", "Engagements", "Mehndi", "Birthdays", "Baby Showers"];

// Placeholder images — swap the `src` values with real photos later.
const GALLERY_ITEMS = [
  { id: 1, category: "Weddings", src: "/images/mek-1.png", alt: "Wedding reception decor" },
  { id: 2, category: "Weddings", src: "/images/mek-2.png", alt: "Wedding aisle with florals" },
  { id: 3, category: "Mehndi", src: "/images/mek-3.png", alt: "Mehndi celebration outfit" },
  { id: 4, category: "Weddings", src: "/images/mek-1.png", alt: "Candlelit wedding aisle" },
  { id: 5, category: "Engagements", src: "/images/mek-1.png", alt: "Engagement venue decor" },
  { id: 6, category: "Weddings", src: "/images/mek-2.png", alt: "Wedding stage decor" },
  { id: 7, category: "Birthdays", src: "/images/mek-4.png", alt: "Birthday celebration with balloons" },
  { id: 8, category: "Baby Showers", src: "/images/mek-5.png", alt: "Family celebration" },
];

export default function GetInspiredSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Keep a stable 2-row / 4-column-ish layout: first item spans two rows.
  const featured = GALLERY_ITEMS[3] ?? GALLERY_ITEMS[0];
  const gridItems = GALLERY_ITEMS.filter((item) => item.id !== featured?.id).slice(0, 6);
  const showGallery = activeCategory === "All";

  return (
    <section className="relative w-full overflow-hidden bg-[#faf9f6] px-6  pb-12 md:px-12 lg:px-20">
      {/* decorative floral corners */}
      <div
        className="absolute right-0 bottom-10 z-10 animate-shape-float"
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
      <div className="pointer-events-none absolute -top-8 -left-10 h-40 w-40 bg-[url('/images/floral.png')] bg-contain bg-no-repeat opacity-90" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 bg-[url('/images/floral.png')] bg-contain bg-no-repeat opacity-90" />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-[44px] font-pt-serif font-normal text-black">
            Discover Event Inspirations
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Beautiful ideas to spark your celebration planning.
          </p>
        </div>

        {/* Category tabs */}
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
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="grid grid-cols-1 gap-3 sm:col-span-3 sm:grid-cols-3">
              {gridItems.map((item) => (
                <div
                  key={item.id}
                  className="relative h-32 overflow-hidden rounded-lg sm:h-40"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            {featured && (
              <div className="relative h-64 overflow-hidden rounded-lg sm:col-span-1 sm:h-full sm:min-h-[17rem]">
                <Image
                  src={featured.src}
                  alt={featured.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 flex min-h-[280px] items-center justify-center rounded-lg border border-brand-line bg-white px-6 text-center">
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

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="btn-slide group rounded-[10px] bg-gold px-14 py-3.5 text-[18px] font-normal text-white"
          >
            <span className="btn-slide-overlay btn-slide-overlay-green" />
            <span className="btn-slide-label">View More Inspired</span>
          </button>
        </div>

        {/* Trust row */}
        {/* <div className="mt-14 grid grid-cols-1 gap-8 border-t border-neutral-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map(({ icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-[60px] w-[60px] flex-none items-center justify-center">
                <Image
                  src={icon}
                  alt=""
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px] object-contain"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="text-[16px] font-normal text-black">
                  {title}
                </h3>
                <p className="mt-1 text-[14px] leading-relaxed text-neutral-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
