import Image from "next/image";
import { WebsiteHeader } from "@/components/website/header";

export function CelebrationBanner() {
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

      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[552px] max-w-[87%] flex-col justify-center pt-24">
        <h1 className="font-pt-serif text-[44px] font-normal leading-tight text-white sm:text-[56px]">
          Celebrations
        </h1>
        <p className="mt-5 max-w-xl font-inter text-[18px] font-normal leading-8 text-white/82">
          Explore beautiful celebration styles, trusted vendors, and thoughtful
          planning ideas for every special occasion.
        </p>
      </div>
    </section>
  );
}
