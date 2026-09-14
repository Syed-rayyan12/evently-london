import { type FormEvent, useState } from "react";
import { Star } from "lucide-react";
import type { VendorReview } from "@/data/vendor-data";
import { createCustomerReview, type CustomerReview } from "@/lib/customer";
import { getCustomerProfileSession } from "@/lib/customer-session";

type ReviewFormSectionProps = {
  vendorId: string;
  onReviewCreated?: (review: VendorReview) => void;
};

export default function ReviewFormSection({
  vendorId,
  onReviewCreated,
}: ReviewFormSectionProps) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const session = getCustomerProfileSession();

    if (!session?.token) {
      setStatus("error");
      setStatusMessage("Please login as a customer before placing a review.");
      return;
    }

    setStatus("saving");
    setStatusMessage("");

    try {
      const result = await createCustomerReview(
        {
          vendorId,
          rating,
          message: message.trim()
        },
        session
      );

      onReviewCreated?.(mapCustomerReview(result.review));
      setMessage("");
      setStatus("success");
      setStatusMessage("Your review was submitted.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to submit review.");
    }
  }

  return (
    <section className="rounded-[10px] border border-brand-line bg-white p-5 sm:p-6">
      <form onSubmit={submitReview}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-pt-serif text-[28px] font-normal text-ink">
              Leave a Review
            </h2>
            <p className="mt-1 font-inter text-sm leading-6 text-muted">
              Rate your experience and share a short message for this vendor.
            </p>
          </div>
        
        </div>

        <label className="mt-5 block">
          <span className="font-inter text-sm font-semibold text-ink">Review message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={3}
            required
            rows={5}
            placeholder="Write your experience with this vendor."
            className="mt-2 w-full resize-none rounded-[8px] border border-brand-line bg-white px-3 py-3 font-inter text-sm text-ink outline-none focus:border-[#003224]"
          />
        </label>

          <div className="flex items-center gap-2" aria-label={`${rating} star rating`}>
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="text-[#D79D42]"
                  aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      value <= rating
                        ? "fill-[#D79D42] text-[#D79D42]"
                        : "text-brand-line"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

        {statusMessage ? (
          <p
            className={`mt-3 font-inter text-sm font-semibold ${
              status === "error" ? "text-rose-700" : "text-emerald-700"
            }`}
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "saving"}
          className="mt-4 rounded-[8px] bg-[#003224] px-5 py-2.5 font-inter text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
}

function mapCustomerReview(review: CustomerReview): VendorReview {
  return {
    name: review.customer.name,
    rating: review.rating,
    date: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(review.createdAt)),
    comment: review.message
  };
}
