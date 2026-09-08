"use client"
import { ContactBanner, ContactCards } from "@/components/contact";
import SendMessageForm from "@/components/contact/contact-form";
import Trust from "@/components/shared/trust";
import CtaAndFooter from "@/components/website/footer";

export default function ContactPage() {
  return (
    <>
      <main className="bg-[#F5F0EA]">
        <ContactBanner />
        <ContactCards />
        <SendMessageForm/>
        <Trust/>
      </main>
      <CtaAndFooter />
    </>
  );
}
