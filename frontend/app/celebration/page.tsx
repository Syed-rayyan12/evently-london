import {
  BrowseByCelebration,
  CelebrationCategorySections,
  CelebrationBanner,
} from "@/components/celebration";
import Trust from "@/components/shared/trust";
import CtaAndFooter from "@/components/website/footer";
import { HowItWorks } from "@/components/website/how-it-works";
import GetInspiredSection from "@/components/how-it-works/tabs-section";

export default function CelebrationPage() {
  return (
    <>
      <main className="bg-[#F9F8F4]">
        <CelebrationBanner />
        <BrowseByCelebration />
        <CelebrationCategorySections />
        <GetInspiredSection />
        <HowItWorks />
        <Trust />
      </main>
      <CtaAndFooter />
    </>
  );
}
