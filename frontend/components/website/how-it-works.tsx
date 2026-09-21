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
  return (
    <section className="home-how-section relative overflow-hidden bg-ink px-5 pt-6 text-white lg:px-8">
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
          <h2 className="home-section-title font-pt-serif text-[44px] font-normal leading-tight text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="home-section-copy mt-4 font-inter text-[18px] font-normal leading-7 text-white/82">
           Finding luxury wedding vendors in London becomes truly simple when you use our trusted platform every single time.
          </p>
        </div>

        <div className="home-steps-grid mt-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="home-step-card flex w-full items-center gap-5 rounded-[8px] py-10"
            >
              <span className="flex h-20 w-20 shrink-0 items-center justify-center">
                <Image
                  src={step.icon}
                  alt=""
                  width={500}
                  height={500}
                  className="h-20 w-20 object-cover shrink-0"
                />
              </span>
              <div className="flex min-w-0 flex-col">
                <h3 className=" font-pt-serif text-[16px] font-normal text-white">
                  {step.title}
                </h3>
                <p className=" font-inter text-[12px] font-normal leading-6 text-white/78">
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
