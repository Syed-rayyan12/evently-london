import Image from "next/image";
import { WebsiteHeader } from "@/components/website/header";

export function InspirationBanner() {
  return (
    <section className="relative min-h-[552px] overflow-hidden text-white">
      <WebsiteHeader overlay />

      <Image
        src="/images/work-banner.png"
        alt="Elegant celebration setup"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-10 mx-auto flex min-h-[552px] max-w-[87%] flex-col justify-center pt-24">
        <h1 className="font-pt-serif text-[44px] font-normal leading-tight text-white sm:text-[56px]">
          Ideas That Inspire Every Celebration
        </h1>
        <p className="mt-5 max-w-xl font-inter text-[18px] font-normal leading-8 text-white/82">
         From a church wedding venue in London to Sikh and Muslim event planner management and celebration themes, find ideas that spark your imagination and guide your planning journey.
        </p>
      </div>
    </section>
  );
}
