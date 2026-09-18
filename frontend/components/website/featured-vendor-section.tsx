import Image from "next/image";
import { Star, BadgeCheck, ArrowRight } from "lucide-react";
import { AnimatedShapeImage } from "./animated-shape-image";

const VENDORS = [
    {
        name: "Royal Moments Photography",
        category: "Photography",
        rating: 4.9,
        reviews: 128,
        price: "From £1,500",
        image: "/images/card-5.png",
    },
    {
        name: "Signature Flavours Catering",
        category: "Catering",
        rating: 4.9,
        reviews: 128,
        price: "From £1,500",
        image: "/images/card-4.png",
    },
    {
        name: "Bhosh Bridal Studio",
        category: "Makeup Artist",
        rating: 4.9,
        reviews: 128,
        price: "From £1,500",
        image: "/images/card-3.png",
    },
    {
        name: "Golden Petals Events",
        category: "Decor & Styling",
        rating: 4.9,
        reviews: 128,
        price: "From £1,500",
        image: "/images/card-2.png",
    },
    {
        name: "DJ Infinity",
        category: "Entertainment",
        rating: 4.9,
        reviews: 128,
        price: "From £1,500",
        image: "/images/card-1.png",
    },
];

function VendorCard({
    name,
    category,
    rating,
    reviews,
    price,
    image,
}: (typeof VENDORS)[number]) {
    return (
        <div className="flex-1 overflow-hidden rounded-xl border border-neutral-200 p-1 bg-white shadow-sm">
            <div className="relative h-40 w-full">
                <Image src={image} alt={name} fill className="object-cover rounded-lg" />
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-[#173d33] px-2.5 py-1 text-[11px] font-medium text-white">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                </span>
            </div>

            <div className="p-4">
                <h3 className="text-[15px] font-normal font-pt-serif text-black">{name}</h3>
                <p className="mt-0.5 text-[13px] text-neutral-500 font-inter font-normal">{category}</p>

                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-medium text-neutral-800">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                
                        {rating.toFixed(1)}
                        <span className="text-neutral-400">({reviews})</span>
                    </div>
                    <span className="text-xs font-normal font-inter text-neutral-700">
                        {price}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedVendorsSection() {
    return (
        <section className="relative w-full overflow-hidden px-6 py-16">
            <AnimatedShapeImage
                src="/images/how-shape.png"
                width={103}
                height={424}
                className="absolute left-0 top-0 z-10"
                imageClassName="h-auto w-auto object-cover"
            />
            <div className="mx-auto max-w-[90%]">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-pt-serif font-normal text-neutral-900 sm:text-4xl">
                     Handpicked Vendors You Can Trust
                    </h2>
                    <a
                        href="#"
                        className="group flex items-center gap-1.5 text-sm font-medium text-neutral-800 transition-colors hover:text-gold"
                    >
                        <span className="text-hover-underline capitalize">
                            View All Categories
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </a>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    {VENDORS.map((vendor) => (
                        <VendorCard key={vendor.name} {...vendor} />
                    ))}
                </div>
            </div>
        </section>
    );
}
