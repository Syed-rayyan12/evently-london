import Image from "next/image";

import styles from "./why-choose-us.module.css";

const REASONS = [
    {
        title: "100% Verified Vendors",
        description: "Every vendor is carefully verified for your peace of mind.",
    },
    {
        title: "Quality You Can Trust",
        description:
            "Discover professionals with services and experiences you can rely on.",
    },
    {
        title: "Transparent Pricing",
        description:
            "Explore available pricing and packages before making your decision.",
    },
    {
        title: "Personalised Support",
        description: "We're here to make your planning journey easier.",
    },
];

const MOBILE_BEAM_PATH =
    "M0 0 L0 100 L100 100 L100 0 L0 0 L0 25 L100 25 L100 50 L0 50 L0 75 L100 75 L0 75 L0 0";
const TABLET_BEAM_PATH =
    "M0 0 L0 100 L100 100 L100 0 L0 0 L50 0 L50 100 L50 50 L0 50 L100 50 L0 50 L0 0";
const DESKTOP_BEAM_PATH =
    "M0 0 L0 100 L100 100 L100 0 L0 0 L25 0 L25 100 L25 0 L50 0 L50 100 L50 0 L75 0 L75 100 L75 0 L0 0";

function getReasonBorderClass(index: number) {
    return [
        index !== REASONS.length - 1 ? "border-b" : "",
        index % 2 === 0 ? "sm:border-r" : "sm:border-r-0",
        index < REASONS.length - 2 ? "sm:border-b" : "sm:border-b-0",
        index !== REASONS.length - 1 ? "lg:border-r" : "lg:border-r-0",
        "lg:border-b-0",
    ]
        .filter(Boolean)
        .join(" ");
}

export default function WhyChooseSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#faf9f6] px-6 py-16 md:px-12 lg:px-20">
            <div
                className="absolute left-0 top-10 z-10 animate-shape-float"
                aria-hidden="true"
            >
                <Image
                    src="/images/shape.png"
                    alt=""
                    width={103}
                    height={424}
                    className="h-[350px] w-auto object-cover"
                />
            </div>
            {/* decorative floral corners */}
            <div className="pointer-events-none absolute -top-8 -left-10 h-40 w-40 bg-[url('/images/floral.png')] bg-contain bg-no-repeat opacity-90" />
            <div className="pointer-events-none absolute -top-8 -right-10 h-40 w-40 -scale-x-100 bg-[url('/images/floral.png')] bg-contain bg-no-repeat opacity-90" />

            <div className="relative mx-auto max-w-6xl">
                <div className="text-center">
                    <p className="text-[16px] font-medium capitalize tracking-widest text-gold">
                        Why Evently
                    </p>
                    <h2 className="mt-0 text-[44px] font-pt-serif font-normal text-neutral-900 ">
                        Why Choose Evently?
                    </h2>
                </div>

                <div className="relative mt-10 overflow-hidden border border-brand-line">
                    <svg
                        className={`${styles.beamSvg} ${styles.beamMobile}`}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            className={styles.beamLight}
                            pathLength="100"
                            d={MOBILE_BEAM_PATH}
                        />
                    </svg>
                    <svg
                        className={`${styles.beamSvg} ${styles.beamTablet}`}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            className={styles.beamLight}
                            pathLength="100"
                            d={TABLET_BEAM_PATH}
                        />
                    </svg>
                    <svg
                        className={`${styles.beamSvg} ${styles.beamDesktop}`}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            className={styles.beamLight}
                            pathLength="100"
                            d={DESKTOP_BEAM_PATH}
                        />
                    </svg>

                    <div className="relative z-10 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {REASONS.map((reason, i) => (
                            <div
                                key={reason.title}
                                className={`border-brand-line px-6 py-6 sm:px-8 sm:py-8 lg:px-8 lg:py-8 ${getReasonBorderClass(i)}`}
                            >
                                <h3 className="text-[22px] font-pt-serif font-normal text-black">
                                    {reason.title}
                                </h3>
                                <p className="mt-2 text-[14px] leading-relaxed text-neutral-500 font-inter font-normal">
                                    {reason.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
