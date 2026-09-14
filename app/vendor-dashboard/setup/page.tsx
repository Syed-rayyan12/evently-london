"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, MapPin, Phone, Store, UserRound } from "lucide-react";
import {
  getVendorProfile,
  updateVendorProfile,
  type VendorProfileDetails,
} from "@/lib/auth";
import {
  clearVendorProfileSession,
  getVendorProfileSession,
  saveVendorProfileSession,
} from "@/lib/vendor-session";

type VendorSetupForm = {
  ownerName: string;
  vendorName: string;
  category: string;
  location: string;
  email: string;
  phone: string;
  about: string;
};

const emptyForm: VendorSetupForm = {
  ownerName: "",
  vendorName: "",
  category: "",
  location: "",
  email: "",
  phone: "",
  about: "",
};

function createFormFromSession(profile: VendorProfileDetails | null): VendorSetupForm {
  const session = getVendorProfileSession();

  return {
    ownerName: profile?.ownerName ?? session?.ownerName ?? session?.fullName ?? "",
    vendorName: profile?.vendorName ?? session?.vendorName ?? "",
    category: profile?.category ?? session?.category ?? "",
    location: profile?.location ?? session?.location ?? "",
    email: session?.email ?? "",
    phone: session?.phone ?? "",
    about: profile?.about ?? session?.about ?? "",
  };
}

export default function VendorSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState<VendorSetupForm>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const session = getVendorProfileSession();

    if (!session?.token) {
      clearVendorProfileSession();
      router.replace("/");
      return;
    }

    setForm(createFormFromSession(null));
    setStatus("loading");
    setMessage("Loading vendor setup...");

    getVendorProfile(session)
      .then((result) => {
        if (!active) {
          return;
        }

        saveVendorProfileSession(result.user, session.token, result.profile);
        setForm(createFormFromSession(result.profile));
        setStatus("idle");
        setMessage("");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load vendor setup");
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor signup token is missing. Please create the vendor account again.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const phone = form.phone.trim();
      const about = form.about.trim();
      const result = await updateVendorProfile(
        {
          ownerName: form.ownerName.trim(),
          vendorName: form.vendorName.trim(),
          category: form.category.trim(),
          location: form.location.trim(),
          email: form.email.trim(),
          ...(phone ? { phone } : {}),
          ...(about ? { about } : {})
        },
        session
      );

      saveVendorProfileSession(result.user, session.token, result.profile);
      setStatus("success");
      setMessage("Vendor profile completed.");
      router.replace(
        result.user.approvalStatus === "APPROVED"
          ? "/vendor-dashboard"
          : "/vendor-dashboard/pending-approval"
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to complete vendor profile");
    }
  }

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Complete Vendor Profile
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Add the business details customers and admin reviewers will see.
        </p>
      </section>

      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <SetupInput
            icon={UserRound}
            label="Owner name"
            value={form.ownerName}
            onChange={(value) => setForm((current) => ({ ...current, ownerName: value }))}
          />
          <SetupInput
            icon={Store}
            label="Vendor name"
            value={form.vendorName}
            onChange={(value) => setForm((current) => ({ ...current, vendorName: value }))}
          />
          <SetupInput
            icon={Building2}
            label="Category"
            value={form.category}
            onChange={(value) => setForm((current) => ({ ...current, category: value }))}
          />
          <SetupInput
            icon={MapPin}
            label="Location"
            value={form.location}
            onChange={(value) => setForm((current) => ({ ...current, location: value }))}
          />
          <SetupInput
            icon={Mail}
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
          />
          <SetupInput
            icon={Phone}
            label="Phone"
            type="tel"
            required={false}
            value={form.phone}
            onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
          />

          <label className="block md:col-span-2">
            <span className="font-inter text-sm font-semibold text-[#16231f]">
              About
            </span>
            <textarea
              value={form.about}
              onChange={(event) =>
                setForm((current) => ({ ...current, about: event.target.value }))
              }
              rows={6}
              maxLength={2000}
              className="mt-2 w-full resize-none rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
            />
          </label>

          {message ? (
            <p
              className={`rounded-md px-3 py-2 font-inter text-sm md:col-span-2 ${
                status === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : status === "loading"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
              }`}
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-[#0D5B46] px-5 py-3 font-inter text-sm font-medium text-white transition-colors hover:bg-[#001B12] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Saving..." : "Complete Profile"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SetupInput({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "email" | "tel" | "text";
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">
        {label}
      </span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 focus-within:border-[#0D5B46]">
        <Icon className="h-5 w-5 flex-none text-[#0D5B46]" aria-hidden="true" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          minLength={required ? 2 : undefined}
          maxLength={type === "tel" ? 30 : 160}
          className="h-full min-w-0 flex-1 bg-transparent font-inter text-sm text-[#16231f] outline-none"
        />
      </span>
    </label>
  );
}
