import type { Metadata } from "next";
import Image from "next/image";
import CtaAndFooter from "@/components/website/footer";
import { WebsiteHeader } from "@/components/website/header";

export const metadata: Metadata = {
  title: "Privacy Policy | Evently London",
  description: "Privacy policy for Evently London.",
};

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information you give us directly when you create an account, fill out a form, or contact a vendor through our platform. This may include your name, email address, phone number, event details, and any messages you send to us. We also collect certain technical information automatically when you browse our website, such as your IP address, browser type, and pages you visit.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to create and manage your account, connect you with vendors, and respond to your enquiries. Your details help us personalise your experience and recommend vendors that match your celebration needs. We may also use your information to send you updates, offers, or service messages that relate to your account.",
  },
  {
    title: "Sharing Your Information",
    body: "We share your information with vendors only when you choose to contact them through our platform. We do not sell your personal data to third parties for marketing purposes. We may share information with trusted service providers who help us run our website, process payments, or send emails, and these partners are bound by strict confidentiality obligations.",
  },
  {
    title: "Cookies and Tracking",
    body: "Our website uses cookies to improve your browsing experience and remember your preferences. Cookies help us understand how visitors use our site so we can make it better for everyone. You can disable cookies in your browser settings, though some features of our platform may not work properly without them.",
  },
  {
    title: "Data Security",
    body: "We take reasonable steps to protect your personal information from unauthorised access, loss, or misuse. Our systems use secure technology and our team follows strict internal policies to keep your data safe. No online platform can guarantee complete security, so we encourage you to protect your account details carefully.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, correct, or delete the personal information we hold about you. You can also ask us to stop sending marketing messages at any time. To exercise any of these rights, please contact us using the details provided on our website.",
  },
  {
    title: "Children's Privacy",
    body: "Our platform is not intended for children under the age of sixteen. We do not knowingly collect personal information from children, and if we learn that we have, we will delete it promptly.",
  },
  {
    title: "Changes To This Policy",
    body: "We may update this privacy policy from time to time to reflect changes in our services or legal requirements. Any updates will be posted on this page with a revised date. We encourage you to review this policy periodically to stay informed about how we protect your information.",
  },
  {
    title: "Contact Us",
    body: "If you have questions about this privacy policy or how we handle your information, please contact our team through the details on our contact page. We are happy to answer your questions and address any concerns you may have.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="bg-[#F9F8F4]">
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
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-3xl font-inter text-[18px] leading-8 text-white/82">
              Evently London respects your privacy and is committed to protecting the personal
              information you share with us.
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="rounded-[12px] bg-white p-6 font-inter text-[18px] leading-9 text-[#4d5a54] shadow-lg shadow-[#0D5B46]/10">
              Evently London respects your privacy and is committed to protecting the personal
              information you share with us. This policy explains what we collect, why we collect it,
              and how we keep it safe when you use our platform. By using our website, you agree to
              the practices described in this privacy policy.
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
