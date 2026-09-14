import Image from "next/image";

export default function IntroSection() {
    return (
        <section className="relative w-full py-16 ">
              <div

                    className="absolute -left-2 top-65 z-10 animate-shape-float"
                    aria-hidden="true"
                >
                    <Image
                        src="/images/how-shape.png"
                        alt=""
                        width={103}
                        height={424}
                        className="h-auto w-auto object-cover"
                    />
                </div>
            <div className="mx-auto grid  grid-cols-1 max-w-[87%] mx-auto items-center gap-10 lg:grid-cols-2">
                <div className="relative h-64 w-full overflow-hidden sm:h-80">
                    <Image
                        src="/images/how-image.png"
                        alt="Friends celebrating together"
                        fill
                        className="object-cover"
                    />
                </div>

                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                    Planning your perfect celebration doesn’t have to be complicated. Evently London brings everything together in one simple place, helping you discover trusted vendors, explore their services and packages, compare your options, send enquiries, and manage your bookings with confidence. From your first idea to the moment you celebrate, we make every step easier.
                </p>
            </div>
        </section>
    );
}
