"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, X } from "lucide-react";
import {
  createVendorPortfolioItem,
  deleteVendorPortfolioItem,
  listVendorPortfolio,
  type VendorPortfolioItem,
} from "@/lib/auth";
import { getVendorProfileSession } from "@/lib/vendor-session";

const emptyForm = {
  imageUrl: "/images/card-1.png",
  name: "",
  category: "",
};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<VendorPortfolioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");

  const loadPortfolio = async () => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to load portfolio.");
      return;
    }

    setStatus("loading");
    try {
      const result = await listVendorPortfolio(session);
      setPortfolio(result.portfolio);
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to load portfolio.");
    }
  };

  useEffect(() => {
    void loadPortfolio();
  }, []);

  const openModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

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

  const savePhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to save portfolio.");
      return;
    }

    setStatus("saving");
    try {
      const item = await createVendorPortfolioItem(
        {
          imageUrl: form.imageUrl,
          name: form.name.trim(),
          category: form.category.trim(),
        },
        session,
      );
      setPortfolio((current) => [item, ...current]);
      setIsModalOpen(false);
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save portfolio photo.");
    }
  };

  const deletePhoto = async (id: string) => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      return;
    }

    await deleteVendorPortfolioItem(id, session);
    setPortfolio((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-inter text-[34px] font-normal leading-tight text-[#16231f]">Portfolio</h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Manage the photos customers see before they contact you.
            </p>
          </div>
          <button type="button" onClick={openModal} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0D5B46] px-5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#001B12]">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add Photos
          </button>
        </div>
        {message ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 font-inter text-sm text-red-700">{message}</p> : null}
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-4 py-4">
          <h3 className="font-inter text-[16px] font-semibold leading-tight text-[#16231f]">Photos</h3>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-md border border-[#edf1ee] bg-white">
              <div className="relative aspect-[4/3] bg-[#f5f7f4]">
                <Image src={item.imageUrl} alt={item.name} fill sizes="(min-width: 1024px) 28vw, 90vw" className="object-cover" unoptimized={isUnoptimizedImage(item.imageUrl)} />
                <button type="button" onClick={() => deletePhoto(item.id)} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 shadow-sm transition-colors hover:bg-red-600 hover:text-white" aria-label={`Delete ${item.name}`}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="p-4">
                <p className="font-inter text-[16px] font-semibold text-[#16231f]">{item.name}</p>
                <p className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 font-inter text-xs font-semibold text-gray-600">{item.category}</p>
              </div>
            </article>
          ))}
          {!portfolio.length && status !== "loading" ? <p className="font-inter text-sm text-[#68746e]">No portfolio photos added yet.</p> : null}
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
          <form onSubmit={savePhoto} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[16px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
              <div>
                <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">Add Photos</h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">Add image, name, and category.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]" aria-label="Close add photos">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6">
              <div>
                <p className="mb-2 font-inter text-sm font-semibold text-[#16231f]">Image</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-32 w-full overflow-hidden rounded-[12px] bg-[#f5f7f4] sm:w-44">
                    <Image src={form.imageUrl} alt="Portfolio preview" fill sizes="176px" className="object-cover" unoptimized={isUnoptimizedImage(form.imageUrl)} />
                  </div>
                  <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={uploadImage} className="sr-only" />
                  </label>
                </div>
              </div>
              <PhotoInput label="Image Name" value={form.name} onChange={(value) => updateForm("name", value)} required />
              <PhotoInput label="Category" value={form.category} onChange={(value) => updateForm("category", value)} required />
            </div>

            <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
              <button type="submit" disabled={status === "saving"} className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#001B12] disabled:opacity-70">{status === "saving" ? "Saving..." : "Save Photo"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function PhotoInput({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <input type="text" value={value} required={required} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] px-4 font-inter text-sm text-[#16231f] outline-none focus:border-[#0D5B46]" />
    </label>
  );
}

function isUnoptimizedImage(src: string) {
  return src.startsWith("blob:") || src.startsWith("data:");
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
