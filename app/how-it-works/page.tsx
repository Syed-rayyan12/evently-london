import { HowItWorksBanner } from "@/components/how-it-works";
import FeaturesSection from "@/components/how-it-works/feature-section";
import IntroSection from "@/components/how-it-works/intro-section";
import JourneySection from "@/components/how-it-works/journey-section";
import TabsSection from "@/components/how-it-works/tabs-section";
import WhyChooseSection from "@/components/how-it-works/why-choose-us";
import CtaAndFooter from "@/components/website/footer";

export default function HowItWorksPage() {
  return (
    <>
      <main className="bg-[#F9F8F4]">
        <HowItWorksBanner />
        <IntroSection/>
        <JourneySection/>
        <FeaturesSection/>
        <WhyChooseSection/>
        <TabsSection/>
      </main>
      <CtaAndFooter />
    </>
  );
}
