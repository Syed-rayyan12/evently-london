import type { Metadata } from "next";
import Image from "next/image";
import CtaAndFooter from "@/components/website/footer";
import { WebsiteHeader } from "@/components/website/header";

export const metadata: Metadata = {
  title: "Terms and Conditions | Evently London",
  description: "Terms and conditions for Evently London.",
};

const sections = [
  {
    title: "About Our Platform",
    body: "Evently London is a vendor directory that helps people across the United Kingdom find professionals for special occasions. We connect clients with vendors but we do not provide event services ourselves. Any contract you enter into with a vendor is strictly between you and that vendor. We are not responsible for the quality, safety, or delivery of any service booked through our platform.",
  },
  {
    title: "Eligibility",
    body: "You must be at least eighteen years old to create an account and use our services. By using our platform, you confirm that you have the legal capacity to enter into binding agreements. If you are using our website on behalf of a business, you confirm that you have authority to bind that business to these terms.",
  },
  {
    title: "Account Responsibilities",
    body: "You agree to provide accurate and complete information when creating your account. You are responsible for keeping your login details secure and confidential at all times. Any activity that happens under your account is your responsibility, so please tell us immediately if you suspect unauthorised access. We reserve the right to suspend or close any account that breaks these terms.",
  },
  {
    title: "Vendor Listings",
    body: "Vendors are responsible for the accuracy of the information they publish on our platform. We review listings carefully but we cannot guarantee that every detail is always correct or current. Prices, availability, and services may change without notice, so please confirm all details directly with the vendor. We reserve the right to remove any listing that breaks our guidelines or harms our community.",
  },
  {
    title: "User Conduct",
    body: "You agree to use our platform in a respectful and lawful manner at all times. You must not post false information, harass other users, or attempt to damage our website in any way. You must not use our platform to send spam, advertise unrelated services, or collect data about other users. We may take legal action against anyone who misuses our platform or harms others.",
  },
  {
    title: "Payments and Fees",
    body: "Evently London may charge fees for certain features, listings, or premium services in the future. Any fees will be clearly explained before you agree to pay them. Payments made through our platform are subject to the terms of our payment providers. We do not store your full payment details on our servers at any time.",
  },
  {
    title: "Intellectual Property",
    body: "All content on our website, including text, images, logos, and design, belongs to Evently London or our licensors. You may not copy, reproduce, or distribute any part of our platform without written permission from us. Vendors keep ownership of their own photos and descriptions but grant us a licence to display them. Any unauthorised use of our content may result in legal action.",
  },
  {
    title: "Limitation Of Liability",
    body: "We provide our platform on an \"as is\" basis and we do not guarantee uninterrupted or error free service. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential losses you suffer. This includes losses related to vendor services, cancellations, or events beyond our reasonable control. Nothing in these terms limits any rights you have under UK consumer law.",
  },
  {
    title: "Indemnity",
    body: "You agree to indemnify Evently London against any claims, losses, or expenses that arise from your use of our platform. This includes claims resulting from your breach of these terms or your dealings with any vendor. We reserve the right to take over the defence of any claim that falls under this section.",
  },
  {
    title: "Termination",
    body: "We may suspend or end your access to our platform at any time if you break these terms. You may also close your account whenever you wish by contacting our support team. Once your account is closed, certain provisions of these terms will still apply, including those about liability and intellectual property.",
  },
  {
    title: "Changes To These Terms",
    body: "We may update these terms from time to time to reflect changes in our services or the law. Any updates will be posted on this page with a revised date at the top. Your continued use of our platform after any change means you accept the updated terms.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of England and Wales. Any disputes arising from these terms will be handled by the courts of England and Wales. If any part of these terms is found to be invalid, the remaining sections will still apply.",
  },
  {
    title: "Contact Us",
    body: "If you have questions about these terms and conditions, please contact our team through the details on our contact page. We are happy to explain any part of this document and address your concerns.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <main className="responsive-page overflow-x-clip bg-[#F9F8F4]">
        <section className="relative min-h-[520px] overflow-hidden text-white">
          <WebsiteHeader overlay />
          <Image
            src="/images/work-banner.png"
            alt="Elegant celebration setup"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[87%] flex-col justify-center pt-24">
            <p className="font-inter text-[13px] font-semibold uppercase tracking-[3px] text-[#D79D42]">
              Effective from: 1st October 2026
            </p>
            <h1 className="mt-4 max-w-4xl font-pt-serif text-[42px] font-normal leading-tight text-white sm:text-[58px]">
              Terms and Conditions
            </h1>
            <p className="mt-6 max-w-3xl font-inter text-[18px] leading-8 text-white/82">
              These terms and conditions govern your use of the Evently London website and any
              services we offer through it. By accessing our platform, you agree to follow these
              terms completely and without reservation.
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="rounded-[12px] bg-white p-6 font-inter text-[18px] leading-9 text-[#4d5a54] shadow-lg shadow-[#0D5B46]/10">
              If you do not agree with any part of these terms, please stop using our website
              immediately. We recommend reading this page carefully before creating an account or
              contacting any vendor.
            </p>

            <div className="mt-8 space-y-8">
              {sections.map((section) => (
                <section key={section.title} className="rounded-[12px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
                  <h2 className="font-pt-serif text-[30px] font-normal text-[#16231f]">
                    {section.title}
                  </h2>
                  <p className="mt-4 font-inter text-[17px] leading-8 text-[#4d5a54]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CtaAndFooter />
    </>
  );
}
