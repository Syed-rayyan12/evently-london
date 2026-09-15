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
                <div>
                 <h2 className="font-serif text-[44px] text-black font-normal">
                          Our Promise
                        </h2>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                   We understand that every celebration carries its own meaning and needs careful attention. Whether you need a Sikh wedding planner who respects your traditions or a Gurdwara wedding venue in London that feels right for your family, we help you find it.
                </p>
                  <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Our platform also connects you with trusted Pooja ceremony organisers who handle sacred rituals with genuine care. Every step is built to save your time and protect your peace of mind. You deserve a planning journey that feels calm, clear and completely supported from beginning to end.
                </p>
                </div>
            </div>
        </section>
    );
}
