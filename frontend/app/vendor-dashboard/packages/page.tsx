"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createVendorPackage,
  deleteVendorPackage,
  listVendorPackages,
  listVendorServices,
  updateVendorPackage,
  type VendorPackage,
  type VendorService,
} from "@/lib/auth";
import { getVendorProfileSession } from "@/lib/vendor-session";

const emptyPackageForm = {
  serviceId: "",
  name: "",
  price: "",
  description: "",
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [services, setServices] = useState<VendorService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPackageForm);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");

  const serviceNameById = useMemo(
    () => Object.fromEntries(services.map((service) => [service.id, service.name])),
    [services],
  );

  const loadPackages = async () => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to load packages.");
      return;
    }

    setStatus("loading");
    try {
      const [packagesResult, servicesResult] = await Promise.all([
        listVendorPackages(session),
        listVendorServices(session),
      ]);
      setPackages(packagesResult.packages);
      setServices(servicesResult.services);
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to load packages.");
    }
  };

  useEffect(() => {
    void loadPackages();
  }, []);

  const openAddModal = () => {
    setEditingPackageId(null);
    setForm(emptyPackageForm);
    setIsModalOpen(true);
  };

  const openEditModal = (packageItem: VendorPackage) => {
    setEditingPackageId(packageItem.id);
    setForm({
      serviceId: packageItem.serviceId ?? "",
      name: packageItem.name,
      price: packageItem.price,
      description: packageItem.description ?? "",
    });
    setIsModalOpen(true);
  };

  const savePackage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to save packages.");
      return;
    }

    const payload = {
      ...(form.serviceId ? { serviceId: form.serviceId } : {}),
      name: form.name.trim(),
      price: form.price.trim(),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
    };

    setStatus("saving");
    try {
      const packageItem = editingPackageId
        ? await updateVendorPackage(editingPackageId, payload, session)
        : await createVendorPackage(payload, session);

      setPackages((current) =>
        editingPackageId
          ? current.map((item) => (item.id === packageItem.id ? packageItem : item))
          : [packageItem, ...current],
      );
      setIsModalOpen(false);
      setEditingPackageId(null);
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save package.");
    }
  };

  const removePackage = async (packageId: string) => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      return;
    }

    await deleteVendorPackage(packageId, session);
    setPackages((current) => current.filter((item) => item.id !== packageId));
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">Manage Package</h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Keep your vendor packages and package pricing accurate for customers.
            </p>
          </div>
          <button type="button" onClick={openAddModal} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0D5B46] px-5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#001B12]">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add Package
          </button>
        </div>
        {message ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 font-inter text-sm text-red-700">{message}</p> : null}
      </section>

      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        {packages.map((packageItem) => (
          <div key={packageItem.id} className="flex flex-col gap-3 border-b border-[#edf1ee] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-inter text-[15px] font-semibold text-[#16231f]">{packageItem.name}</p>
              <p className="mt-1 font-inter text-sm text-[#68746e]">
                {packageItem.serviceId ? serviceNameById[packageItem.serviceId] ?? "Linked service" : "Standalone package"}
              </p>
              {packageItem.description ? <p className="mt-2 font-inter text-sm leading-6 text-[#68746e]">{packageItem.description}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              <p className="mr-2 font-inter text-[15px] font-semibold text-[#0D5B46]">{packageItem.price}</p>
              <button type="button" onClick={() => openEditModal(packageItem)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe7e2] text-[#16231f] hover:border-[#0D5B46] hover:bg-[#0D5B46] hover:text-white" aria-label={`Edit ${packageItem.name}`}>
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => removePackage(packageItem.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" aria-label={`Delete ${packageItem.name}`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
        {!packages.length && status !== "loading" ? <p className="font-inter text-sm text-[#68746e]">No packages added yet.</p> : null}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
          <form onSubmit={savePackage} className="w-full max-w-xl rounded-[16px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
              <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">{editingPackageId ? "Edit Package" : "Add Package"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]" aria-label="Close package modal">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid gap-5 px-6 py-6">
              <label className="block">
                <span className="font-inter text-sm font-semibold text-[#16231f]">Service</span>
                <select value={form.serviceId} onChange={(event) => setForm((current) => ({ ...current, serviceId: event.target.value }))} className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] bg-white px-4 font-inter text-sm text-[#16231f] outline-none focus:border-[#0D5B46]">
                  <option value="">Standalone package</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </label>
              <FormInput label="Package Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
              <FormInput label="Price" value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: value }))} required />
              <FormTextarea label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
            </div>
            <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
              <button type="submit" disabled={status === "saving"} className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#001B12] disabled:opacity-70">{status === "saving" ? "Saving..." : "Save Package"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function FormInput({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <input type="text" value={value} required={required} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] px-4 font-inter text-sm text-[#16231f] outline-none focus:border-[#0D5B46]" />
    </label>
  );
}

function FormTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-md border border-[#dfe7e2] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none focus:border-[#0D5B46]" />
    </label>
  );
}
