import { Star, Shield, Heart, Users } from "lucide-react";
import Image from "next/image";
const values = [
  { icon: Star, title: "Care", description: "We treat every celebration as if it were our own special day." },
  { icon: Shield, title: "Respect", description: "We honour every culture, faith and tradition with genuine understanding." },
  { icon: Heart, title: "Trust", description: "We only work with vendors who earn your confidence completely." },
  { icon: Users, title: "Excellence", description: "We hold every vendor to a standard of true quality and beauty" },
];

export default function OurValues() {
  return (
    <section className="relative bg-[#F9F8F4] px-6 pt-12 pb-12">
         <div
                className="absolute right-0 -bottom-18 z-10 animate-shape-float"
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
              
      <div className="pointer-events-none absolute -right-10 -bottom-16 h-64 w-64 opacity-90" aria-hidden="true">
        <svg viewBox="0 0 300 300" className="h-full w-full">
          {/* <defs>
            <linearGradient id="floral-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C77A" />
              <stop offset="100%" stopColor="#C9A24B" />
            </linearGradient>
          </defs> */}
          {Array.from({ length: 26 }).map((_, i) => {
            const angle = (i / 26) * Math.PI * 2;
            const radius = 60 + ((i * 37) % 90);
            const cx = 240 + Math.cos(angle) * radius * 0.6;
            const cy = 240 + Math.sin(angle) * radius * 0.6;
            const r = 6 + ((i * 13) % 10);
            return <circle key={i} cx={cx} cy={cy} r={r} fill="url(#floral-gold)" opacity={0.5 + (i % 5) * 0.1} />;
          })}
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-4xl text-[#3a352c] md:text-5xl">Our Values</h2>
          <div className="mx-auto mt-4 h-[2px] w-16 bg-[#C9852E]" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-md border border-[#E4DCC9] bg-white px-6 py-10 text-center transition-shadow hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#E4DCC9] bg-[#F7F2E9]">
                <Icon className="h-5 w-5 text-[#C9852E]" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-[24px] font-normal font-pt-serif text-[#3a352c]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#8a8377] font-inter font-light">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}