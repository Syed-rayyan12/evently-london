import Image from "next/image";

export default function OurStoryMission() {
    return (
        <section className="relative bg-[#FAF7F2]  py-16 md:py-24">
        
            <div className="relative">
    <div
         className="absolute right-0 top-0 z-10 animate-shape-float"
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
        
            <div className="mx-auto max-w-6xl space-y-20 md:space-y-28">
                {/* Our Story */}
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 ">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                        <Image
                            src="/images/our-story.png"
                            alt="Wedding reception under a draped white tent with floral centerpieces"
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <h2 className="font-serif text-[44px] text-black font-normal  ">
                            Our Story
                        </h2>
                        <div className=" space-y-4 text-[15px] leading-relaxed text-[#4A4A4A]">
                            <p className="font-inter font-normal text-[18px] text-black/60">
                                Evently London was created to transform the way people
                                discover and connect with event professionals.
                            </p>
                            <p className="font-inter font-normal text-[18px] text-black/60">
                                Planning an event often means endless searching, comparing
                                countless suppliers, and spending valuable time trying to
                                find the right fit. We wanted to create something
                                different — a platform that combines luxury, trust, and
                                personalisation.
                            </p>
                            <p className="font-inter font-normal text-[18px] text-black/60">
                                From weddings and engagements to birthdays, concerts, civil
                                ceremonies, and special celebrations, Evently brings together
                                carefully selected vendors who share a passion for creating
                                unforgettable experiences.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Mission */}
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 ">
                    <div className="order-2 md:order-1">
                        <h2 className="font-serif text-[44px] text-black font-normal">
                            Our Mission
                        </h2>
                        <div className=" space-y-4 text-[15px] leading-relaxed text-[#4A4A4A]">
                            <p>
                                Our mission is to connect people with exceptional event
                                professionals through a curated and personalised experience.
                            </p>
                            <p>
                                We believe event planning should feel exciting, not
                                overwhelming.
                            </p>
                            <p>
                                By combining trusted vendors, thoughtful recommendations, and
                                modern planning tools, we help make every celebration feel
                                effortless from beginning to end.
                            </p>
                        </div>
                    </div>

                    <div className="relative order-1 aspect-[4/2] w-full overflow-hidden rounded-md md:order-2">
                        <Image
                            src="/images/our-mission.png"
                            alt="Elegant candlelit table setting with floral arrangements at an event venue"
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
                </div>
        </section>
    );
}