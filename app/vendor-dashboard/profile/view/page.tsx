"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getVendorProfile, type VendorProfileDetails } from "@/lib/auth";
import { getVendorProfileSession, saveVendorProfileSession } from "@/lib/vendor-session";

export default function ViewProfilePage() {
  const [profile, setProfile] = useState<VendorProfileDetails | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      setMessage("Vendor login is required to view profile.");
      return;
    }

    getVendorProfile(session)
      .then((result) => {
        saveVendorProfileSession(result.user, session.token, result.profile);
        setProfile(result.profile);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load profile."));
  }, []);

  const session = getVendorProfileSession();
  const vendorName = profile?.vendorName ?? session?.vendorName ?? "Vendor Profile";
  const category = profile?.category ?? session?.category ?? "";
  const location = profile?.location ?? session?.location ?? "";
  const about = profile?.about ?? session?.about ?? "No vendor description added yet.";
  const imageUrl = profile?.imageUrl ?? session?.image ?? "/images/Photography.png";

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">View Profile</h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">Preview how your vendor profile appears to customers.</p>
        {message ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 font-inter text-sm text-red-700">{message}</p> : null}
      </section>

      <section className="overflow-hidden rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="relative min-h-[340px]">
          <Image src={imageUrl} alt={vendorName} fill sizes="100vw" className="object-cover" unoptimized={imageUrl.startsWith("data:")} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="relative z-10 max-w-3xl p-8 text-white">
            <span className="rounded-full bg-white px-4 py-1 font-inter text-sm font-semibold text-[#0D5B46]">{session?.approvalStatus ?? "PENDING"}</span>
            <h3 className="mt-5 [font-family:var(--font-playfair)] text-[40px] font-semibold leading-tight">{vendorName}</h3>
            <p className="mt-3 font-inter text-[16px] text-white/80">{[category, location].filter(Boolean).join(" | ")}</p>
            <p className="mt-4 font-inter text-[18px] leading-8 text-white/82">{about}</p>
            <Link href="/vendor-dashboard/profile" className="mt-7 inline-flex rounded-md border border-white px-5 py-3 font-inter text-sm font-medium text-white hover:bg-white hover:text-[#0D5B46]">Back to Profile</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
