import Image from "next/image";

const STEPS = [
  {
    title: "Tell Us Your Plan",
    description: "It is a long established fact that a  will be layout.",
    icon: "/images/grp-1.png",
  },
  {
    title: "Explore Services",
    description: "It is a long established fact that a  will be layout.",
    icon: "/images/grp-2.png",
  },
  {
    title: "Match With Vendors",
    description: "It is a long established fact that a  will be layout.",
    icon: "/images/grp-3.png",
  },
  {
    title: "Celebrate Better",
    description: "It is a long established fact that a  will be layout.",
    icon: "/images/grp-4.png",
  },
];

export function HowItWorks() {
  return (
    <section className="relative bg-ink px-5 pt-6 text-white lg:px-8">
      <Image
        src="/images/how.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[95%]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-pt-serif text-[44px] font-normal leading-tight text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 font-inter text-[18px] font-normal leading-7 text-white/82">
            Plan your event step by step with clear choices, trusted vendors,
            and a smoother path from idea to celebration.
          </p>
        </div>

        <div className="mt-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="flex w-full items-center gap-5 rounded-[8px] py-10"
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
