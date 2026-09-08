import { notFound } from "next/navigation";
import VendorProfile from "@/components/vendor/profile/vendor-profile";
import { getVendorBySlug, getVendorSlugs } from "@/data/vendor-data";
import CtaAndFooter from "@/components/website/footer";
import { BrowseByCelebration } from "@/components/celebration";
import InspirationTabsSection from "@/components/inspiration/inspiration-tabs-section";
import Trust from "@/components/shared/trust";
import TabsSection from "@/components/how-it-works/tabs-section";
import { HowItWorks } from "@/components/website/how-it-works";

export function generateStaticParams() {
  return getVendorSlugs();
}

export default async function VendorProfilePage({
  params,
}: PageProps<"/vendor/[slug]">) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  return (
    <>
      <VendorProfile vendor={vendor} />
      <BrowseByCelebration/>

      <TabsSection/>
      <HowItWorks/>
      <Trust/>
      <CtaAndFooter />
    </>
  );
}
