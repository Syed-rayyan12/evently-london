"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { WebsiteHeader } from "@/components/website/header";
import CtaAndFooter from "@/components/website/footer";
import { getPublicBlog, type BlogPost } from "@/lib/blogs";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        setMessage("");
        return getPublicBlog(params.slug);
      })
      .then((result) => {
        if (!active) {
          return;
        }

        setBlog(result.blog);
        setStatus("idle");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setBlog(null);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load blog.");
      });

    return () => {
      active = false;
    };
  }, [params.slug]);

  return (
    <>
      <main className="bg-[#F9F8F4]">
        <section className="relative min-h-[520px] overflow-hidden text-white">
          <WebsiteHeader overlay />
          <div className="absolute inset-0 bg-[#001B12]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.52),rgba(0,0,0,0.18))]" />
          <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[87%] flex-col justify-center pt-24">
            <Link
              href="/blog"
              className="mb-6 inline-flex w-fit items-center gap-2 font-inter text-sm font-semibold text-white/85 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Blogs
            </Link>
            <div className="flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-[3px] text-white/80">
              <CalendarDays className="h-4 w-4 text-[#D79D42]" aria-hidden="true" />
              {blog ? formatDateTime(blog.createdAt) : "Blog"}
            </div>
            <h1 className="mt-4 max-w-4xl font-pt-serif text-[42px] font-normal leading-tight text-white sm:text-[58px]">
              {blog?.title ?? (status === "loading" ? "Loading blog..." : "Blog not found")}
            </h1>
          </div>
        </section>

        <section className="px-6 py-16">
          <article className="mx-auto max-w-4xl">
            {blog ? (
              <div className="space-y-8">
                {blog.sections.map((section, index) => (
                  <section key={`${section.title}-${index}`} className="rounded-[12px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
                    <h2 className="font-pt-serif text-[30px] font-normal text-[#16231f]">
                      {section.title}
                    </h2>
                    <p className="mt-4 font-inter text-[18px] leading-9 text-[#4d5a54]">
                      {section.paragraph}
                    </p>
                  </section>
                ))}
              </div>
            ) : (
              <p className="rounded-[12px] border border-dashed border-[#dfe7e2] bg-white px-4 py-12 text-center font-inter text-sm font-semibold text-[#68746e]">
                {status === "loading" ? "Loading blog..." : message || "Blog not found."}
              </p>
            )}
          </article>
        </section>
      </main>
      <CtaAndFooter />
    </>
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
