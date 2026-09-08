"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

type HeroCarouselSlide = {
  src: string;
  alt: string;
};

type HeroCarouselProps = {
  slides: HeroCarouselSlide[];
};

const AUTO_ADVANCE_MS = 3000;

function formatSlideNumber(value: number) {
  return String(value).padStart(2, "0");
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [carouselState, setCarouselState] = useState({
    activeIndex: 0,
    previousIndex: null as number | null,
  });

  const { activeIndex, previousIndex } = carouselState;

  const goToSlide = (nextIndex: number) => {
    setCarouselState((current) => {
      if (nextIndex === current.activeIndex) {
        return current;
      }

      return {
        activeIndex: nextIndex,
        previousIndex: current.activeIndex,
      };
    });
  };

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setCarouselState((current) => ({
        activeIndex: (current.activeIndex + 1) % slides.length,
        previousIndex: current.activeIndex,
      }));
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goToPreviousSlide = () => {
    goToSlide((activeIndex - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    goToSlide((activeIndex + 1) % slides.length);
  };

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const isPrevious = index === previousIndex;

          return (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`hero-carousel-image select-none object-cover ${
                isActive
                  ? "hero-carousel-image-active"
                  : isPrevious
                    ? "hero-carousel-image-previous"
                    : "hero-carousel-image-idle"
              }`}
            />
          );
        })}
      </div>

      <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3 sm:right-6 lg:right-10">
        <button
          type="button"
          onClick={goToPreviousSlide}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/20 text-white backdrop-blur-md transition-colors hover:border-brand-gold hover:bg-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
          aria-label="Show previous hero slide"
        >
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex min-h-[116px] w-14 flex-col items-center justify-center rounded-full border border-white/30 bg-black/24 px-2 py-4 text-center shadow-xl shadow-black/20 backdrop-blur-md">
          <span className="font-pt-serif text-[30px] leading-none text-white">
            {formatSlideNumber(activeIndex + 1)}
          </span>
          <span className="my-2 h-8 w-px bg-brand-gold" aria-hidden="true" />
          <span className="font-inter text-[13px] leading-none text-white/78">
            {formatSlideNumber(slides.length)}
          </span>
        </div>

        <button
          type="button"
          onClick={goToNextSlide}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/20 text-white backdrop-blur-md transition-colors hover:border-brand-gold hover:bg-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
          aria-label="Show next hero slide"
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
