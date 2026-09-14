import { AboutBanner } from "@/components/about";
import CelebratingEveryOccasion from "@/components/about/Occasion";
import OurStoryMission from "@/components/about/our-story-mission";
import OurValues from "@/components/about/our-values";
import Trust from "@/components/shared/trust";
import Why from "@/components/shared/turstly";
import CtaAndFooter from "@/components/website/footer";

export default function AboutPage() {
  return (
    <>
      <main className="bg-[#F5F0EA]">
        <AboutBanner />
        <OurStoryMission/>
        <Why/>
        <CelebratingEveryOccasion/>
        <OurValues/>
        <Trust/>
      </main>
      <CtaAndFooter />
    </>
  );
}
