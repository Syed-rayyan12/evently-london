import { InspirationBanner } from "@/components/inspiration";
import InspirationTabsSection from "@/components/inspiration/inspiration-tabs-section";
import Trust from "@/components/shared/trust";
import CtaAndFooter from "@/components/website/footer";

export default function InspirationPage() {
  return (
    <>
      <main className="responsive-page overflow-x-clip bg-[#F9F8F4]">
        <InspirationBanner />
        <InspirationTabsSection />
        <Trust/>
      </main>
      <CtaAndFooter />
    </>
  );
}
