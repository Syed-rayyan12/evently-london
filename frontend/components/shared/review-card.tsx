import { Star } from "lucide-react";
import type { VendorReview } from "@/data/vendor-data";

type ReviewCardProps = {
  review: VendorReview;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const nameParts = review.name.trim().split(/\s+/);
  const initial = `${nameParts[0]?.charAt(0) ?? ""}${nameParts[1]?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <article className="flex flex-col gap-4 rounded-[8px] border border-brand-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0FFFB] font-inter text-[14px] font-semibold text-black">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="font-inter text-[14px] font-semibold text-black">
              {review.name}
            </h4>
      <div className="flex shrink-0 items-center gap-1 text-[#D79D42]">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={15}
            className={
              index < Math.round(review.rating)
                ? "text-[#D79D42]"
                : "text-brand-line"
            }
          />
        ))}
      </div>
            <span className="font-inter text-[13px] text-muted">
              {review.date}
            </span>
          </div>
          <p className="mt-2 font-inter text-[15px] leading-7 text-muted">
            {review.comment}
          </p>
        </div>
      </div>
    </article>
  );
}
