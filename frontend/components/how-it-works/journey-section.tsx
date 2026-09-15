import Image from "next/image";

const STEPS = [
  {
    icon: "/images/grp-1.png",
    title: "Create Account",
    description:
      "Sign up free and save your favourite vendors.",
  },
  {
    icon: "/images/grp-2.png",
    title: "Browse Vendors",
    description:
      "Explore handpicked vendors matched to your event needs.",
  },
  {
    icon: "/images/grp-3.png",
    title: "Save Favourites",
    description:
      "Shortlist vendors you love and compare them easily.",
  },
  {
    icon: "/images/grp-4.png",
    title: "Contact Directly",
    description:
      "Reach out and book your vendor with confidence",
  },
];

export default function JourneySection() {
  return (
    <section className="w-full pb-20 pt-4 ">

      <div className="mx-auto max-w-[87%]">
        <div className="text-center">
          <h2 className="text-[44px] font-pt-serif font-normal text-neutral-900 ">
           How It Works
          </h2>
          <p className=" text-[18px] text-neutral-500 font-inter font-normal leading-[30px]">
         Finding luxury wedding vendors in London becomes truly simple when you use our trusted platform every single time.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon, title, description }) => (
            <div key={title} className="flex gap-4 items-center">
              <div className="flex h-24 w-24 items-center justify-center">
                <Image
                  src={icon}
                  alt=""
                  width={600}
                  height={600}
                  className="h-32 w-22 object-contain"
                />
              </div>
              <div className="flex-col items-start">

              <h3 className=" text-[20px] font-normal font-pt-serif text-start text-neutral-900">
                {title}
              </h3>
              <p className="mt-2 max-w-[200px] text-[12px]  font-inter text-start leading-relaxed text-neutral-500">
                {description}
              </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
