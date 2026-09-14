"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { listVendorReviews, type VendorReview } from "@/lib/auth";
import { getVendorProfileSession } from "@/lib/vendor-session";

type ReviewRow = {
  id: string;
  customer: string;
  image: string;
  rating: number;
  date: string;
  review: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Vendor login is required to load reviews.");
      });
      return;
    }

    void Promise.resolve()
      .then(() => {
        setStatus("loading");
        return listVendorReviews(session);
      })
      .then((result) => {
        setReviews(result.reviews.map(mapVendorReview));
        setStatus("idle");
        setMessage("");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load reviews.");
      });
  }, []);

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
          Reviews
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Review customer feedback, ratings, review dates, and messages from one place.
        </p>
        {message ? (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 font-inter text-sm font-semibold text-rose-700">
            {message}
          </p>
        ) : null}
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-4 py-4">
          <h3 className="font-inter text-[16px] font-semibold leading-tight text-[#16231f]">
            Customer Reviews
          </h3>
        </div>
        <div className="space-y-4 p-4">
          {reviews.length ? (
            reviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col gap-4 rounded-md border border-[#edf1ee] bg-white p-4 sm:flex-row sm:items-start"
              >
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full bg-[#f5f7f4]">
                  <Image
                    src={review.image}
                    alt={review.customer}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-inter text-[16px] font-semibold text-[#16231f]">
                          {review.customer}
                        </p>
                        <div className="flex items-center gap-1 text-[#C07C22]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${index < review.rating ? "text-[#C07C22]" : "text-[#dfe7e2]"}`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 font-inter text-sm text-[#68746e]">
                        Review date: {review.date}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 font-inter text-[15px] leading-7 text-[#68746e]">
                    {review.review}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-[12px] border border-dashed border-[#dfe7e2] px-4 py-10 text-center font-inter text-sm font-semibold text-[#68746e]">
              {status === "loading" ? "Loading reviews..." : "No reviews yet."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function mapVendorReview(review: VendorReview): ReviewRow {
  return {
    id: review.id,
    customer: review.customer.name,
    image: "/images/profile-2.png",
    rating: review.rating,
    date: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(review.updatedAt)),
    review: review.message
  };
}
