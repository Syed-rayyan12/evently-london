"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const STEPS = [
  {
    title: "Create Account",
    description: "Sign up free and save your favourite vendors.",
    icon: "/images/grp-1.png",
  },
  {
    title: "Browse Vendors",
    description: "Explore handpicked vendors matched to your event needs.",
    icon: "/images/grp-2.png",
  },
  {
    title: "Save Favourites",
    description: "Shortlist vendors you love and compare them easily.",
    icon: "/images/grp-3.png",
  },
  {
    title: "Contact Directly",
    description: "Reach out and book your vendor with confidence",
    icon: "/images/grp-4.png",
  },
];

export function HowItWorks() {
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
      className={`home-how-section how-section-reveal relative overflow-hidden bg-ink px-5 pt-6 text-white lg:px-8 ${
        isInView ? "is-in-view" : ""
      }`}
    >
      <Image
        src="/images/how.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="home-section-inner relative z-10 mx-auto max-w-[95%]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="how-heading-reveal home-section-title font-pt-serif text-[44px] font-normal leading-tight text-white sm:text-5xl">
            <span>How It Works</span>
          </h2>
          <p className="how-copy-reveal how-delay-1 home-section-copy mt-4 font-inter text-[18px] font-normal leading-7 text-white/82">
            Finding luxury wedding vendors in London becomes truly simple when
            you use our trusted platform every single time.
          </p>
        </div>

        <div className="home-steps-grid mt-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`how-step-reveal how-delay-${
                index + 2
              } home-step-card flex w-full items-center gap-5 rounded-[8px] py-10`}
            >
              <span className="flex h-20 w-20 shrink-0 items-center justify-center">
                <Image
                  src={step.icon}
                  alt=""
                  width={500}
                  height={500}
                  className="h-20 w-20 shrink-0 object-cover"
                />
              </span>
              <div className="content-tx flex min-w-0 flex-col">
                <h3 className="font-pt-serif text-[16px] font-normal text-white">
                  {step.title}
                </h3>
                <p className="font-inter text-[12px] font-normal leading-6 text-white/78">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
