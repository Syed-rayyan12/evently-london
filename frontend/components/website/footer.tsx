import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AnimatedShapeImage } from "./animated-shape-image";

const CTA_FEATURES = [
    "Free Signup",
    "Verified Vendors",
    "Easy Contact",
];

const EXPLORE_LINKS = [
    { label: "Vendors", href: "/vendor" },
    { label: "Celebration", href: "/celebration" },
    { label: "Inspiration", href: "/inspiration" },
    { label: "How It Works", href: "/how-it-works" },
];
const COMPANY_LINKS = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Blogs", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
];
const VENDOR_LINKS = [
    { label: "Join Vendor", href: "/contact" },
    { label: "Vendor Login", href: "/vendor-dashboard" },
];
const FOOTER_LINK_CLASS =
    "text-hover-underline inline-flex text-[14px] text-white/70 font-inter font-normal hover:text-gold";
const SOCIAL_LINKS = [
    { label: "Facebook", href: "https://www.facebook.com/", icon: "/images/ico-1.png" },
    { label: "Instagram", href: "https://www.instagram.com/", icon: "/images/ico-2.png" },
    { label: "X", href: "https://x.com/", icon: "/images/ico-3.png" },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "/images/ico-4.png" },
];

export default function CtaAndFooter() {
    return (
        <footer className="relative w-full overflow-hidden bg-[#173d33] text-white">
            <AnimatedShapeImage
                src="/images/foot-3.png"
                width={103}
                height={424}
                className="absolute right-0 bottom-0 z-9999"
                imageClassName="h-auto w-auto object-contain"
            />

            <AnimatedShapeImage
                src="/images/foot-2.png"
                width={103}
                height={424}
                className="absolute left-0 bottom-0 z-9999"
                imageClassName="h-auto w-full object-cover"
            />

            {/* CTA banner */}
            <div
                className="home-footer-cta relative overflow-hidden border-b border-gold bg-cover bg-center px-6 pt-0"
                style={{
                    backgroundImage: "url('/images/mec.png')",
                }}
            >
                <div className="absolute inset-0 bg-[#173d33]/45" aria-hidden="true" />

                <div className="home-footer-cta-grid relative z-10 mx-auto grid min-h-[190px] max-w-[90%] items-center gap-8 lg:grid-cols-[260px_minmax(0,1fr)_auto]">
                    <div className="home-footer-cta-image relative h-40 w-full self-end ">
                        <Image
                            src="/images/foot.png"
                            alt="Event planning clients"
                            fill
                            sizes="320px"
                            className="object-contain object-bottom"
                        />
                    </div>

                    <div className="home-footer-cta-copy max-w-2xl">
                        <h2 className="home-footer-title text-[34px] font-pt-serif  font-normal text-gold">
                        Start Planning Your Perfect Day Today!
                        </h2>
                        <p className="mt-2 max-w-md text-[16px] font-inter leading-relaxed text-white/70">
                           Join Evently London today and find vendors who truly care.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                            {CTA_FEATURES.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-1.5  text-[13px] font-normal font-inter text-white/80"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-gold" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/contact"
                        className="home-footer-cta-button btn-slide group flex-none whitespace-nowrap rounded-md bg-gold px-12 py-3.5 text-sm font-semibold text-white lg:justify-self-end"
                    >
                        <span className="btn-slide-overlay btn-slide-overlay-green" />
                        <span className="btn-slide-label">Create Your Free Account</span>
                    </Link>
                </div>
            </div>

            {/* Footer links */}
            <div className="home-footer-links relative px-6 pt-14 pb-4 md:px-12 lg:px-10 xl:px-20 bg-[#003224]">
                <div className="home-footer-grid mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.75fr_0.85fr_390px] lg:gap-8">
                    {/* Brand */}
                    <div className="">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/images/site-logo.png"
                                alt="Evently"
                                width={152}
                                height={104}
                                className="h-auto w-38"
                            />
                        </div>
                        <p className="mt-3 text-sm leading-relaxed font-normal font-inter text-[18px] text-white">
                          Your Celebration Beautifully Planned
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-[18px] font-normal  text-white/50">Explore</h4>
                        <ul className="mt-4 space-y-2.5">
                            {EXPLORE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={FOOTER_LINK_CLASS}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[18px] font-normal  text-white/50">Company</h4>
                        <ul className="mt-4 space-y-2.5">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={FOOTER_LINK_CLASS}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Vendor */}
                    <div>
                        <h4 className="text-[18px] font-normal  text-white/50">For Vendor</h4>
                        <ul className="mt-4 space-y-2.5">
                            {VENDOR_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={FOOTER_LINK_CLASS}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stay Connected */}
                    <div>
                        <h4 className="text-[18px] font-normal text-white/50">Stay Connected</h4>
                        <form className="home-footer-form mt-4 flex w-full gap-2 lg:w-[390px]">
                            <input
                                type="email"
                                placeholder="Enter your Email"
                                className="min-w-0 flex-1 rounded-[10px] border border-gold bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="btn-slide group flex-none rounded-[10px] bg-gold px-5 py-3 text-sm font-semibold text-white"
                            >
                                <span className="btn-slide-overlay btn-slide-overlay-green" />
                                <span className="btn-slide-label">Subscribe</span>
                            </button>
                        </form>

                        <div className="mt-5 flex items-center gap-3">
                            {SOCIAL_LINKS.map((link) => (
                                <a
                                    key={link.icon}
                                    href={link.href}
                                    aria-label={link.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    <Image
                                        src={link.icon}
                                        alt=""
                                        width={606}
                                        height={606}
                                        className="h-9 w-9 object-contain hover:bg-gold"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-10 max-w-7xl   pt-3 text-center text-xs text-white/50">
                    © 2026 Eventiy London . All Rights Reserved.
                </div>
            </div>


        </footer>
    );
}
