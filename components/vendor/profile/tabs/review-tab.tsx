import ReviewCard from "@/components/shared/review-card";
import type { VendorReview } from "@/data/vendor-data";

type ReviewsTabProps = {
  reviews: VendorReview[];
};

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <div className="space-y-4 p-6">
   
      {reviews.map((review) => (
        <ReviewCard key={`${review.name}-${review.date}`} review={review} />
      ))}
    </div>
  );
}
