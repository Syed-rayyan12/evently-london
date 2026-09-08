import Image from "next/image";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    customer: "Ayesha Khan",
    image: "/images/profile-1.png",
    event: "Wedding",
    rating: 5,
    date: "12 Sep 2026",
    status: "Published",
    review:
      "The team handled our wedding photography beautifully and delivered every important moment with care.",
  },
  {
    id: 2,
    customer: "Hamza Malik",
    image: "/images/profile-2.png",
    event: "Engagement",
    rating: 4,
    date: "18 Sep 2026",
    status: "Pending",
    review:
      "Professional service and great portraits. We are waiting for the final gallery edits.",
  },
  {
    id: 3,
    customer: "Sara Ahmed",
    image: "/images/profile-3.png",
    event: "Baby Shower",
    rating: 5,
    date: "24 Sep 2026",
    status: "Published",
    review:
      "Very smooth experience from booking to delivery. The photos matched the mood of the event perfectly.",
  },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
          Reviews
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Review customer feedback, ratings, event details, and publication
          status from one place.
        </p>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-4 py-4">
          <h3 className="font-inter text-[16px] font-semibold leading-tight text-[#16231f]">
            Customer Reviews
          </h3>
        </div>
        <div className="space-y-4 p-4">
          {reviews.map((review) => (
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
                      <div className=" flex items-center gap-1 text-[#C07C22]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${index < review.rating ? "fill-current" : ""
                              }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center mt-2 gap-2">

                      <span className="self-start rounded-full bg-gray-100 px-3 py-1 font-inter text-xs font-semibold text-gray-600">
                        {review.status}
                      </span>
                      <p className="font-inter text-sm text-[#68746e]">
                        {review.event} | {review.date}
                      </p>
                    </div>
                  </div>
                </div>


                <p className="mt-3 font-inter text-[15px] leading-7 text-[#68746e]">
                  {review.review}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
