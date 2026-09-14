import { notFound } from "next/navigation";
import VendorProfile from "@/components/vendor/profile/vendor-profile";
import { getVendorBySlug } from "@/data/vendor-data";
import { getPublicVendorBySlug } from "@/lib/public-vendors";
import CtaAndFooter from "@/components/website/footer";
import { BrowseByCelebration } from "@/components/celebration";
import Trust from "@/components/shared/trust";
import { HowItWorks } from "@/components/website/how-it-works";

export const dynamic = "force-dynamic";

type VendorProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VendorProfilePage({
  params,
}: VendorProfilePageProps) {
  const { slug } = await params;
  const vendor =
    (await getPublicVendorBySlug(slug)
      .then((result) => result.vendor)
      .catch(() => null)) ?? getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  return (
    <>
      <VendorProfile vendor={vendor} />
      <BrowseByCelebration/>

      <HowItWorks/>
      <Trust/>
      <CtaAndFooter />
    </>
  );
}
