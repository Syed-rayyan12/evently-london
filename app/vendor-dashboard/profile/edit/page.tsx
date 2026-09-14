"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getVendorProfile, updateVendorProfile } from "@/lib/auth";
import { getVendorProfileSession, saveVendorProfileSession } from "@/lib/vendor-session";

const emptyForm = {
  ownerName: "",
  vendorName: "",
  category: "",
  location: "",
  email: "",
  phone: "",
  about: "",
  imageUrl: "/images/Photography.png",
};

export default function EditProfilePage() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to edit profile.");
      return;
    }

    getVendorProfile(session)
      .then((result) => {
        saveVendorProfileSession(result.user, session.token, result.profile);
        setForm({
          ownerName: result.profile?.ownerName ?? result.user.name,
          vendorName: result.profile?.vendorName ?? result.user.name,
          category: result.profile?.category ?? "",
          location: result.profile?.location ?? "",
          email: result.user.email,
          phone: result.user.phone ?? "",
          about: result.profile?.about ?? "",
          imageUrl: result.profile?.imageUrl ?? "/images/Photography.png",
        });
        setStatus("idle");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load profile.");
      });
  }, []);

  const updateForm = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    readFileAsDataUrl(file).then((imageUrl) => updateForm("imageUrl", imageUrl));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!session?.token) {
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const result = await updateVendorProfile(
        {
          ownerName: form.ownerName.trim(),
          vendorName: form.vendorName.trim(),
          category: form.category.trim(),
          location: form.location.trim(),
          email: form.email.trim(),
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
          ...(form.about.trim() ? { about: form.about.trim() } : {}),
          ...(form.imageUrl ? { imageUrl: form.imageUrl } : {}),
        },
        session,
      );
      saveVendorProfileSession(result.user, session.token, result.profile);
      setStatus("idle");
      setMessage("Vendor profile updated successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    }
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">Edit Profile</h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">Update the business information customers see on your vendor profile.</p>
        {message ? <p className={`mt-4 rounded-md px-3 py-2 font-inter text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{message}</p> : null}
      </section>

      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={saveProfile}>
          <div className="md:col-span-2">
            <p className="mb-2 font-inter text-sm font-semibold text-[#16231f]">Profile Image</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-[14px] bg-[#f5f7f4]">
                <Image src={form.imageUrl} alt="Vendor profile" fill sizes="112px" className="object-cover" unoptimized={form.imageUrl.startsWith("data:")} />
              </div>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] hover:bg-[#0D5B46] hover:text-white">
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload Image
                <input type="file" accept="image/*" onChange={uploadImage} className="sr-only" />
              </label>
            </div>
          </div>
          <ProfileInput label="Owner Name" value={form.ownerName} onChange={(value) => updateForm("ownerName", value)} />
          <ProfileInput label="Vendor Name" value={form.vendorName} onChange={(value) => updateForm("vendorName", value)} />
          <ProfileInput label="Category" value={form.category} onChange={(value) => updateForm("category", value)} />
          <ProfileInput label="Location" value={form.location} onChange={(value) => updateForm("location", value)} />
          <ProfileInput label="Phone" value={form.phone} onChange={(value) => updateForm("phone", value)} />
          <ProfileInput label="Email" type="email" value={form.email} onChange={(value) => updateForm("email", value)} />
          <label className="block md:col-span-2">
            <span className="font-inter text-sm font-medium text-[#16231f]">About Vendor</span>
            <textarea value={form.about} onChange={(event) => updateForm("about", event.target.value)} className="mt-2 min-h-36 w-full resize-none rounded-[10px] border border-[#0D5B46] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none" />
          </label>
          <div className="flex justify-end gap-3 md:col-span-2">
            <Link href="/vendor-dashboard/profile" className="rounded-md border border-[#dfe7e2] px-5 py-3 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</Link>
            <button type="submit" disabled={status === "saving"} className="rounded-md bg-[#0D5B46] px-5 py-3 font-inter text-sm font-medium text-white hover:bg-[#001B12] disabled:opacity-70">{status === "saving" ? "Saving..." : "Save Profile"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ProfileInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "email" | "text" }) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-medium text-[#16231f]">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-[#0D5B46] px-4 font-inter text-sm text-[#16231f] outline-none" />
    </label>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
