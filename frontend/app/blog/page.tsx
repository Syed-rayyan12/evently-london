import { BlogBanner, BlogSection } from "@/components/blog";
import Trust from "@/components/shared/trust";
import CtaAndFooter from "@/components/website/footer";

export default function BlogPage() {
  return (
    <>
      <main className="bg-[#F9F8F4]">
        <BlogBanner />
        <BlogSection />
        <Trust />
      </main>
      <CtaAndFooter />
    </>
  );
}
