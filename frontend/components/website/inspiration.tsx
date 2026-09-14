import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { AnimatedShapeImage } from "./animated-shape-image";

const ARTICLES = [
  {
    readTime: "5 min read",
    title: "How to Choose the Perfect Wedding Venue",
    excerpt:
      "What a modern hair system actually is, how it is fitted, and why it looks nothing like the hairpieces of the past.",
    image: "/images/blog-1.png",
  },
  {
    readTime: "4 min read",
    title: "Elegant Wedding Ideas for Timeless Celebration",
    excerpt:
      "A simple weekly routine that keeps your system clean, secure and looking freshly fitted for longer.",
    image: "/images/blog-2.png",
  },
  {
    readTime: "6 min read",
    title: "Planning Engagement Celebration to Remember",
    excerpt:
      "Comparing systems, density and base types so you can decide what genuinely fits your lifestyle.",
    image: "/images/blog-3.png",
  },
];

function ArticleCard({
  readTime,
  title,
  excerpt,
  image,
}: (typeof ARTICLES)[number]) {
  return (
    <div className="flex flex-col">
      <div className="relative h-52 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="mt-4 flex font-inter font-normal tracking-[3px] items-center gap-1.5 text-xs text-neutral-500">
        <Clock className="h-3.5 w-3.5 text-gold" />
        {readTime}
      </div>

      <h3 className="mt-2 text-[18px] font-normal font-pt-serif leading-snug text-neutral-900">
        {title}
      </h3>

      <p className="mt-2 text-[14px] font-inter font-normal leading-relaxed text-neutral-500">
        {excerpt}
      </p>

      <a
        href="#"
        className="group mt-4 flex items-center gap-1.5 font-inter text-[14px] font-normal tracking-[3.28px] text-[#D79D42]"
      >
        <span className="text-hover-underline">Read More</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </a>
    </div>
  );
}

export default function InspirationSection() {
  return (
    <section className="relative w-full bg-[#faf9f6] px-6 pb-26">
         <AnimatedShapeImage
           src="/images/flower-1.png"
           width={103}
           height={424}
           className="absolute right-0 bottom-26 z-9999"
           imageClassName="h-auto w-auto object-cover"
         />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-[44px] font-serif font-normal text-neutral-900">
            Ideas, Advice &amp; Inspiration for Every Celebration.
          </h2>
          <p className="mx-auto mt-3 font-inter max-w-6xl text-[18px] leading-relaxed text-neutral-500">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}
