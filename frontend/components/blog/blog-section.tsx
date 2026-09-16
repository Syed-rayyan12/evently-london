"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { AnimatedShapeImage } from "@/components/website/animated-shape-image";
import { listPublicBlogs, type BlogPost } from "@/lib/blogs";

function BlogCard({ bannerImage, createdAt, sections, slug, title }: BlogPost) {
  const firstSection = sections[0];

  return (
    <article className="flex h-full flex-col rounded-[12px] bg-white shadow-lg shadow-[#0D5B46]/10">
      <div className="relative h-52 w-full overflow-hidden rounded-t-[12px]">
        <Image
          src={bannerImage}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
      <div className="mt-4 flex items-center gap-1.5 font-inter text-xs font-normal tracking-[3px] text-neutral-500">
        <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
        {formatDateTime(createdAt)}
      </div>

      <h3 className="mt-2 font-pt-serif text-[18px] font-normal leading-snug text-neutral-900">
        {title}
      </h3>

      <p className="mt-2 flex-1 font-inter text-[14px] font-normal leading-relaxed text-neutral-500">
        {firstSection?.paragraph ?? ""}
      </p>

      <Link
        href={`/blog/${slug}`}
        className="group mt-4 flex items-center gap-1.5 font-inter text-[14px] font-normal tracking-[3.28px] text-[#D79D42]"
      >
        <span className="text-hover-underline">Read More</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
      </Link>
      </div>
    </article>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

type BlogSectionProps = {
  className?: string;
};

export default function BlogSection({ className = "" }: BlogSectionProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");

  useEffect(() => {
    let active = true;

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        return listPublicBlogs();
      })
      .then((result) => {
        if (!active) {
          return;
        }

        setBlogs(result.blogs);
        setStatus("idle");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setBlogs([]);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="Blogs" className={`relative w-full bg-[#faf9f6] px-6 py-16 ${className}`}>
      <AnimatedShapeImage
        src="/images/flower-1.png"
        width={103}
        height={424}
        className="absolute top-30 right-0 z-10 hidden lg:block"
        imageClassName="h-auto w-auto object-cover"
      />

      <div className="absolute left-0 bottom-20 z-10 animate-shape-float" aria-hidden="true">
        <Image
          src="/images/how-shape.png"
          alt=""
          width={103}
          height={424}
          className="h-auto w-auto object-cover"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-[90%]">
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {blogs.length ? blogs.map((article) => (
            <div key={article.id} className="lg:col-span-2">
              <BlogCard {...article} />
            </div>
          )) : (
            <p className="col-span-full rounded-[12px] border border-dashed border-[#dfe7e2] bg-white px-4 py-12 text-center font-inter text-sm font-semibold text-[#68746e]">
              {status === "loading" ? "Loading blogs..." : "No published blogs yet."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
