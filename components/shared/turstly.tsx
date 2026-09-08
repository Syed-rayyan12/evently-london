import Image from "next/image";

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

export default function Why() {
    return (
        <section className="relative w-full  bg-[#faf9f6] px-6 pb-16">
            <div
                className="absolute left-0 -top-30 z-10 animate-shape-float"
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

            <div className="relative mx-auto max-w-[87%]">
                <div className="text-center">
                    <p className="text-[16px] font-medium capitalize tracking-widest text-gold">
                        Why Evently
                    </p>
                    <h2 className="mt-0 text-[44px] font-pt-serif font-normal text-neutral-900 ">
                        Why Choose Evently?
                    </h2>
                </div>

                <div className="mt-10 border-t border-neutral-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {REASONS.map((reason, i) => (
                            <div
                                key={reason.title}
                                className={`px-0 py-6 lg:px-8 lg:py-8 ${i !== 0 ? "lg:border-l border-neutral-200" : ""
                                    }`}
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
