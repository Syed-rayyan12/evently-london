import { Search, LayoutGrid, ClipboardList, PartyPopper } from "lucide-react";

import Image from "next/image";

const FEATURES = [
    {
        icon: Search,
        title: "Vendor Discovery",
        description:
            "Find trusted professionals across every category you need.",
    },
    {
        icon: LayoutGrid,
        title: "Smart Saving",
        description:
            "Shortlist your favourite vendors and compare them side by side.",
    },
    {
        icon: ClipboardList,
        title: "Direct Contact",
        description:
            "Reach out to vendors quickly without any middle steps.",
    },
    {
        icon: PartyPopper,
        title: "Planning Support",
        description:
            "Get guidance whenever you need help along the way.",
    },
];

export default function FeaturesSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#F5F0EA] px-6 py-16 md:px-12 lg:px-20">
            <div
                className="absolute right-0 bottom-0 z-10 animate-shape-float"
                aria-hidden="true"
            >
                <Image
                    src="/images/how-shape-1.png"
                    alt=""
                    width={103}
                    height={424}
                    className="h-auto w-auto object-cover"
                />
            </div>

            <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 bg-[url('/images/floral.png')] bg-contain bg-no-repeat opacity-90" />

            <div className="relative mx-auto max-w-6xl">
                <div className="text-center">
                    <p className="text-[16px]  font-medium capitalize tracking-widest text-gold">
                       One Platform For Every Celebration
                    </p>
                    <h2 className="mt-0 text-[44px] font-pt-serif font-normal text-neutral-900 ">
                        All Your Event Needs Together
                    </h2>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="rounded-xl border border-neutral-200 bg-white p-6"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                                <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
                            </div>
                            <h3 className="mt-4 text-[24px] font-pt-serif font-normal leading-snug text-neutral-900">
                                {title}
                            </h3>
                            <p className="mt-2 text-[14px] font-inter font-normal leading-relaxed text-neutral-500">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
