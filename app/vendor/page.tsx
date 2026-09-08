import Trust from "@/components/shared/trust";
import {
  BrowseByCelebration,
  VendorBanner,
  VendorDirectory,
  VendorGetInspired,
} from "@/components/vendor";
import CtaAndFooter from "@/components/website/footer";
import { HowItWorks } from "@/components/website/how-it-works";

export default function VendorPage() {
  return (
    <>
      <main className="bg-[#F9F8F4]">
        <VendorBanner />
        <VendorDirectory />
        <BrowseByCelebration />
        <VendorGetInspired />
        <HowItWorks/>
        <Trust/>
      </main>
      <CtaAndFooter />
    </>
  );
}
