import { Suspense } from "react";
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
      <main className="responsive-page overflow-x-clip bg-[#F9F8F4]">
        <VendorBanner />
        <Suspense fallback={null}>
          <VendorDirectory />
        </Suspense>
        <BrowseByCelebration />
        <VendorGetInspired />
        <HowItWorks/>
        <Trust/>
      </main>
      <CtaAndFooter />
    </>
  );
}
