import Image from "next/image";
import Link from "next/link";

export default function ViewProfilePage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
          View Profile
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Preview how your vendor profile appears to customers.
        </p>
      </section>

      <section className="overflow-hidden rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="relative min-h-[340px]">
          <Image
            src="/images/Photography.png"
            alt="Royal Moments Photography"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="relative z-10 max-w-3xl p-8 text-white">
            <span className="rounded-full bg-white px-4 py-1 font-inter text-sm font-semibold text-[#0D5B46]">
              Active
            </span>
            <h3 className="mt-5 [font-family:var(--font-playfair)] text-[48px] font-semibold leading-tight">
              Royal Moments Photography
            </h3>
            <p className="mt-4 font-inter text-[18px] leading-8 text-white/82">
              Timeless wedding photography and cinematic celebration films in
              London, UK. Starting from £1,500.
            </p>
            <Link
              href="/vendor-dashboard/profile"
              className="mt-7 inline-flex rounded-md border border-white px-5 py-3 font-inter text-sm font-medium text-white hover:bg-white hover:text-[#0D5B46]"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
