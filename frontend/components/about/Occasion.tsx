import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const occasions = [
  "Thoughtful vendors for every moment",
  "Luxury touches without the stress",
  "Cultural details handled with respect",
  "Simple tools to save favourites",
  "Support from start to finish",
 

  
];

export default function CelebratingEveryOccasion() {
  return (
    <section className="bg-[#F5F0EA] px-6 pt-10 pb-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-2 ">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
          <Image
            src="/images/occasion.png"
            alt="Table set with a tiered display and drinks in front of an ornate tapestry"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-serif text-[44px] text-[#1C1C1C] font-normal ">
           Design Your Perfect Celebration
          </h2>
          <p className=" text-[15px] leading-relaxed text-[#4A4A4A]">
        We help you build a beautiful event with genuine care and beauty, adding meaning to each occasion.
          </p>

          <ul className="mt-6 space-y-3">
            {occasions.map((occasion) => (
              <li
                key={occasion}
                className="flex items-center gap-3 text-[15px] text-[#1C1C1C]"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#D9A25C]" />
                <span>{occasion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}