import ReviewCard from "@/components/shared/review-card";
import type { VendorReview } from "@/data/vendor-data";

type ReviewsTabProps = {
  reviews: VendorReview[];
};

export default function ReviewsTab({
  reviews,
}: ReviewsTabProps) {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewCard key={`${review.name}-${review.date}-${review.comment}`} review={review} />
          ))
        ) : (
          <p className="rounded-[8px] border border-dashed border-brand-line px-4 py-8 text-center font-inter text-sm font-semibold text-muted">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
