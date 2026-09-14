import TestimonialsSection from "@/components/testimonial";
import { BlogSection } from "@/components/blog";
import FeaturedVendorsSection from "@/components/website/featured-vendor-section";
import CtaAndFooter from "@/components/website/footer";
import { LandingPage } from "@/components/website/landing-page";

export default function Home() {
  return (
    <>
      <LandingPage />
      <FeaturedVendorsSection/>
      <TestimonialsSection />
      <BlogSection/>
      <CtaAndFooter/>
    </>
  );
}
