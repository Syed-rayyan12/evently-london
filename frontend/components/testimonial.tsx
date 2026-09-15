import Image from "next/image";
import { Star, Quote } from "lucide-react";

const ROW_1 = [
  {
    name: "Priya Raghunathan",
    role: "Harrow",
    image: "/images/profile-1.png",
    quote:
      "Evently London truly helped me find a photographer who understood our Tamil traditions completely and captured every single moment beautifully for us.",
    rating: 5,
  },
  {
    name: "Arjun Meenakshi",
    role: "Wembley",
    image: "/images/profile-2.png",
    quote:
      "Finding a South Indian wedding planner through Evently London felt truly effortless and completely stress free for our entire family.",
    rating: 5,
  },
  {
    name: "Deepa Krishnan",
    role: "Ilford",
    image: "/images/profile-3.png",
    quote:
      "I really loved how easy it was to save my favourite vendors and come back to them whenever I needed extra help, especially managing the requirement of mandap and priest.",
    rating: 4,
  },
  {
    name: "Rajesh Subramanian",
    role: "Croydon",
    image: "/images/profile-1.png",
    quote:
      "The luxury event décor we found through this platform transformed our reception beautifully and left every single guest truly speechless.",
    rating: 5,
  },
  {
    name: "Kavitha Balachandran",
    role: "Leicester",
    image: "/images/profile-1.png",
    quote:
      "As a Tamil bride I wanted vendors who respected our customs deeply and Evently London truly delivered that for me every time.",
    rating: 5,
  },
  {
    name: "Suresh Anandakumar",
    role: "Birmingham",
    image: "/images/profile-1.png",
    quote:
      "Booking our mehndi artist and caterer through Evently London saved us so much precious time and endless worry during our whole planning.",
    rating: 5,
  },

];

const ROW_2 = [
   {
    name: "Rajesh Subramanian",
    role: "Croydon",
    image: "/images/profile-1.png",
    quote:
      "The luxury event décor we found through this platform transformed our reception beautifully and left every single guest truly speechless.",
    rating: 5,
  },
  {
    name: "Kavitha Balachandran",
    role: "Leicester",
    image: "/images/profile-1.png",
    quote:
      "As a Tamil bride I wanted vendors who respected our customs deeply and Evently London truly delivered that for me every time.",
    rating: 5,
  },
  {
    name: "Suresh Anandakumar",
    role: "Birmingham",
    image: "/images/profile-1.png",
    quote:
      "Booking our mehndi artist and caterer through Evently London saved us so much precious time and endless worry during our whole planning.",
    rating: 5,
  },
];

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
};

type MarqueeRowProps = {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: number;
};

function TestimonialCard({ name, role, image, quote, rating }: Testimonial) {
  return (
    <div className="relative mx-3 flex w-[340px] flex-none flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:w-[440px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating
                  ? "fill-[#D79D42] text-amber-400"
                  : "fill-[#D79D42] text-neutral-200"
                }`}
            />
          ))}
        </div>
        <Quote className="h-6 w-6 text-neutral-200" />
      </div>

      <p className="text-sm leading-relaxed text-neutral-600">{quote}</p>

      <div className="mt-auto flex items-center gap-3 pt-2">
        <div className="relative h-11 w-11 flex-none overflow-hidden rounded-full bg-neutral-200">
          <Image
            src={image}
            alt={name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  speed = 30,
}: MarqueeRowProps) {
  const doubled = [...items, ...items];

  return (
    <div className="group relative w-full overflow-hidden">
      <div
        className={`flex w-max ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
          } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <TestimonialCard key={i} {...item} />
        ))}
      </div>

      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#faf9f6] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#faf9f6] to-transparent" />
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-[#faf9f6] py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-[44px] font-pt-serif font-normal text-neutral-900">
          Loved By Couples Across London
        </h2>
        <p className="mt-3 text-[16px] font-inter font-normal leading-relaxed text-neutral-500">
          When you search for luxury event décor in London, our clients share what truly made their day special.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-6">
        <MarqueeRow items={ROW_1} direction="left" speed={45} />
        <MarqueeRow items={ROW_2} direction="right" speed={45} />
      </div>
    </section>
  );
}
