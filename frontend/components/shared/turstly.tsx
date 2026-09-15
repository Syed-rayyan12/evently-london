import Image from "next/image";

const REASONS = [
    {
        title: "Trusted Vendors",
        description: "Every professional on our platform is checked carefully before joining",
    },
    {
        title: "Cultural Understanding",
        description:
            "We respect your traditions and match you with vendors who understand them.",
    },
    {
        title: "Effortless Planning",
        description:
            "Our tools help you save, compare and contact vendors without any stress.",
    },
    {
        title: "Luxury Experience",
        description: "Every vendor is chosen for quality, elegance and genuine attention to detail.",
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
                Why Choose Us?
                    </p>
                    <h2 className="mt-0 text-[44px] font-pt-serif font-normal text-neutral-900 ">
                     Reasons To Celebrate With Evently
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
