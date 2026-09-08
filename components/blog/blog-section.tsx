import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { AnimatedShapeImage } from "@/components/website/animated-shape-image";

const BLOG_ARTICLES = [
  {
    readTime: "5 min read",
    title: "How to Choose the Perfect Wedding Venue",
    excerpt:
      "Learn what to look for in a venue, from guest flow and lighting to the practical details that shape the whole celebration.",
    image: "/images/blog-1.png",
  },
  {
    readTime: "4 min read",
    title: "Elegant Wedding Ideas for Timeless Celebration",
    excerpt:
      "Refined styling cues, soft details and thoughtful planning ideas for a celebration that feels graceful from start to finish.",
    image: "/images/blog-2.png",
  },
  {
    readTime: "6 min read",
    title: "Planning Engagement Celebration to Remember",
    excerpt:
      "A focused guide to building the right mood, choosing vendors and making every engagement detail feel intentional.",
    image: "/images/blog-3.png",
  },
  {
    readTime: "5 min read",
    title: "How to Choose the Perfect Wedding Venue",
    excerpt:
      "Learn what to look for in a venue, from guest flow and lighting to the practical details that shape the whole celebration.",
    image: "/images/blog-1.png",
  },
  {
    readTime: "4 min read",
    title: "Elegant Wedding Ideas for Timeless Celebration",
    excerpt:
      "Refined styling cues, soft details and thoughtful planning ideas for a celebration that feels graceful from start to finish.",
    image: "/images/blog-2.png",
  },
];

type BlogArticle = (typeof BLOG_ARTICLES)[number];

function BlogCard({ readTime, title, excerpt, image }: BlogArticle) {
  return (
    <article className="flex h-full flex-col">
      <div className="relative h-52 w-full overflow-hidden">
        <Image src={image} alt={title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>

      <div className="mt-4 flex items-center gap-1.5 font-inter text-xs font-normal tracking-[3px] text-neutral-500">
        <Clock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
        {readTime}
      </div>

      <h3 className="mt-2 font-pt-serif text-[18px] font-normal leading-snug text-neutral-900">
        {title}
      </h3>

      <p className="mt-2 flex-1 font-inter text-[14px] font-normal leading-relaxed text-neutral-500">
        {excerpt}
      </p>

      <Link
        href="/blog"
        className="group mt-4 flex items-center gap-1.5 font-inter text-[14px] font-normal tracking-[3.28px] text-[#D79D42]"
      >
        <span className="text-hover-underline">Read More</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

type BlogSectionProps = {
  className?: string;
};

export default function BlogSection({ className = "" }: BlogSectionProps) {
  return (
    <section id="Blogs" className={`relative w-full bg-[#faf9f6] px-6 py-16 ${className}`}>
      <AnimatedShapeImage
        src="/images/flower-1.png"
        width={103}
        height={424}
        className="absolute top-30 right-0 z-10 hidden lg:block"
        imageClassName="h-auto w-auto object-cover"
      />

      <div

        className="absolute left-0 bottom-20 z-10 animate-shape-float"
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

      <div className="relative z-20 mx-auto max-w-[90%]">
        {/* <div className="text-center">
          <h2 className="font-pt-serif text-[38px] font-normal text-neutral-900 sm:text-[44px]">
            Inspiration Section
          </h2>
          <p className="mx-auto mt-3 max-w-6xl font-inter text-[18px] leading-relaxed text-neutral-500">
            Ideas, advice and practical planning notes for every celebration.
          </p>
        </div> */}

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {BLOG_ARTICLES.map((article, index) => (
            <div key={`${article.title}-${index}`} className="lg:col-span-2">
              <BlogCard {...article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
