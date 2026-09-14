"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import {
  createVendorPackage,
  createVendorService,
  deleteVendorPackage,
  deleteVendorService,
  listVendorServices,
  updateVendorPackage,
  type VendorPackage,
  type VendorService,
} from "@/lib/auth";
import { getVendorProfileSession } from "@/lib/vendor-session";

const emptyServiceForm = {
  name: "",
  category: "",
  startingPrice: "",
  description: "",
  imageUrl: "/images/Photography.png",
};

const emptyPackageForm = {
  name: "",
  price: "",
  description: "",
};

type PackageModalState = {
  mode: "add" | "edit";
  serviceId: string;
  packageId?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<VendorService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyServiceForm);
  const [packageModal, setPackageModal] = useState<PackageModalState | null>(null);
  const [packageForm, setPackageForm] = useState(emptyPackageForm);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");

  const loadServices = async () => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to load services.");
      return;
    }

    setStatus("loading");
    try {
      const result = await listVendorServices(session);
      setServices(result.services);
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to load services.");
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const openModal = () => {
    setForm(emptyServiceForm);
    setIsModalOpen(true);
  };

  const updateForm = (field: keyof typeof emptyServiceForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadServiceImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    readFileAsDataUrl(file).then((imageUrl) => updateForm("imageUrl", imageUrl));
  };

  const saveService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to save services.");
      return;
    }

    setStatus("saving");
    try {
      const service = await createVendorService(
        {
          name: form.name.trim(),
          category: form.category.trim(),
          startingPrice: form.startingPrice.trim(),
          ...(form.description.trim() ? { description: form.description.trim() } : {}),
          ...(form.imageUrl ? { imageUrl: form.imageUrl } : {}),
        },
        session,
      );
      setServices((current) => [service, ...current]);
      setIsModalOpen(false);
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save service.");
    }
  };

  const openPackageModal = (
    mode: PackageModalState["mode"],
    serviceId: string,
    packageItem?: VendorPackage,
  ) => {
    setPackageForm(
      packageItem
        ? {
            name: packageItem.name,
            price: packageItem.price,
            description: packageItem.description ?? "",
          }
        : emptyPackageForm,
    );
    setPackageModal({ mode, serviceId, packageId: packageItem?.id });
  };

  const savePackage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!packageModal || !session?.token) {
      return;
    }

    setStatus("saving");
    try {
      const payload = {
        serviceId: packageModal.serviceId,
        name: packageForm.name.trim(),
        price: packageForm.price.trim(),
        ...(packageForm.description.trim() ? { description: packageForm.description.trim() } : {}),
      };
      const packageItem =
        packageModal.mode === "edit" && packageModal.packageId
          ? await updateVendorPackage(packageModal.packageId, payload, session)
          : await createVendorPackage(payload, session);

      setServices((current) =>
        current.map((service) =>
          service.id === packageModal.serviceId
            ? {
                ...service,
                packages:
                  packageModal.mode === "edit"
                    ? service.packages.map((item) => (item.id === packageItem.id ? packageItem : item))
                    : [packageItem, ...service.packages],
              }
            : service,
        ),
      );
      setPackageModal(null);
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save package.");
    }
  };

  const removeSavedPackage = async (serviceId: string, packageId: string) => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      return;
    }

    await deleteVendorPackage(packageId, session);
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? { ...service, packages: service.packages.filter((item) => item.id !== packageId) }
          : service,
      ),
    );
  };

  const removeService = async (serviceId: string) => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      return;
    }

    await deleteVendorService(serviceId, session);
    setServices((current) => current.filter((service) => service.id !== serviceId));
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-inter text-[34px] font-normal leading-tight text-[#16231f]">Manage Service</h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Add, review, and organize the services and packages attached to your vendor profile.
            </p>
          </div>
          <button type="button" onClick={openModal} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0D5B46] px-5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#001B12]">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add Service
          </button>
        </div>
        {message ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 font-inter text-sm text-red-700">{message}</p> : null}
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-4 py-4">
          <h3 className="font-inter text-[16px] font-semibold leading-tight text-[#16231f]">Services</h3>
        </div>
        <div>
          {services.map((service) => (
            <div key={service.id} className="border-b border-[#edf1ee] px-4 py-5 last:border-b-0">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative h-28 w-full flex-none overflow-hidden rounded-[12px] bg-[#f5f7f4] sm:w-36">
                    <Image src={service.imageUrl ?? "/images/Photography.png"} alt={service.name} fill sizes="144px" className="object-cover" unoptimized={isUnoptimizedImage(service.imageUrl)} />
                  </div>
                  <div>
                    <p className="font-inter text-[16px] font-semibold text-[#16231f]">{service.name}</p>
                    <p className="mt-1 font-inter text-sm text-[#68746e]">{service.category} | Starting from {service.startingPrice}</p>
                    <p className="mt-3 max-w-3xl font-inter text-[15px] leading-7 text-[#68746e]">{service.description || "No service description added."}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <span className="rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-xs font-semibold text-[#0D5B46]">{service.packages.length} Packages</span>
                  <button type="button" onClick={() => removeService(service.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white" aria-label={`Delete ${service.name}`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="font-inter text-[15px] font-semibold text-[#16231f]">Packages</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {service.packages.map((item, index) => (
                    <div key={item.id} className="rounded-md border border-[#edf1ee] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-[#68746e]">Package {index + 1}</p>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openPackageModal("edit", service.id, item)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe7e2] bg-white text-[#16231f] transition-colors hover:border-[#0D5B46] hover:bg-[#0D5B46] hover:text-white" aria-label={`Edit ${item.name}`}>
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => removeSavedPackage(service.id, item.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white" aria-label={`Remove ${item.name}`}>
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 font-inter text-sm font-semibold text-[#16231f]">{item.name}</p>
                      <p className="mt-1 font-inter text-sm text-[#0D5B46]">{item.price}</p>
                      <p className="mt-2 font-inter text-sm leading-6 text-[#68746e]">{item.description || "No package description added."}</p>
                    </div>
                  ))}
                  <button type="button" onClick={() => openPackageModal("add", service.id)} className="flex min-h-[150px] items-center justify-center rounded-md border border-dashed border-[#dfe7e2] p-3 font-inter text-sm font-semibold text-black transition-colors hover:border-[#0D5B46] hover:bg-[#f5f7f4]">
                    <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" aria-hidden="true" />Add More Packages</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!services.length && status !== "loading" ? <p className="px-4 py-6 font-inter text-sm text-[#68746e]">No services added yet.</p> : null}
        </div>
      </section>

      {isModalOpen ? (
        <ServiceModal form={form} status={status} onChange={updateForm} onUpload={uploadServiceImage} onClose={() => setIsModalOpen(false)} onSubmit={saveService} />
      ) : null}

      {packageModal ? (
        <PackageModal form={packageForm} mode={packageModal.mode} onChange={setPackageForm} onClose={() => setPackageModal(null)} onSubmit={savePackage} />
      ) : null}
    </div>
  );
}

function ServiceModal({ form, status, onChange, onUpload, onClose, onSubmit }: { form: typeof emptyServiceForm; status: string; onChange: (field: keyof typeof emptyServiceForm, value: string) => void; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
      <form onSubmit={onSubmit} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[16px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
          <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">Add Service</h3>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]" aria-label="Close add service"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="mb-2 font-inter text-sm font-semibold text-[#16231f]">Service Image</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-36 overflow-hidden rounded-[12px] bg-[#f5f7f4]">
                <Image src={form.imageUrl} alt="Service preview" fill sizes="144px" className="object-cover" unoptimized={isUnoptimizedImage(form.imageUrl)} />
              </div>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                <Upload className="h-4 w-4" aria-hidden="true" />Upload Image
                <input type="file" accept="image/*" onChange={onUpload} className="sr-only" />
              </label>
            </div>
          </div>
          <FormInput label="Service Name" value={form.name} onChange={(value) => onChange("name", value)} required />
          <FormInput label="Category" value={form.category} onChange={(value) => onChange("category", value)} required />
          <FormInput label="Starting Price" value={form.startingPrice} onChange={(value) => onChange("startingPrice", value)} required />
          <FormTextarea label="Description" value={form.description} onChange={(value) => onChange("description", value)} />
        </div>
        <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
          <button type="button" onClick={onClose} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
          <button type="submit" disabled={status === "saving"} className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#001B12] disabled:opacity-70">{status === "saving" ? "Saving..." : "Save Service"}</button>
        </div>
      </form>
    </div>
  );
}

function PackageModal({ form, mode, onChange, onClose, onSubmit }: { form: typeof emptyPackageForm; mode: PackageModalState["mode"]; onChange: React.Dispatch<React.SetStateAction<typeof emptyPackageForm>>; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 py-8">
      <form onSubmit={onSubmit} className="w-full max-w-lg rounded-[16px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
          <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">{mode === "edit" ? "Edit Package" : "Add Package"}</h3>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]" aria-label="Close package modal"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="grid gap-5 px-6 py-6">
          <FormInput label="Package Name" value={form.name} onChange={(value) => onChange((current) => ({ ...current, name: value }))} required />
          <FormInput label="Price" value={form.price} onChange={(value) => onChange((current) => ({ ...current, price: value }))} required />
          <FormTextarea label="Package Description" value={form.description} onChange={(value) => onChange((current) => ({ ...current, description: value }))} />
        </div>
        <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
          <button type="button" onClick={onClose} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
          <button type="submit" className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#001B12]">{mode === "edit" ? "Update Package" : "Add Package"}</button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <input type="text" value={value} required={required} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] px-4 font-inter text-sm text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]" />
    </label>
  );
}

function FormTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block sm:col-span-2">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-md border border-[#dfe7e2] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]" />
    </label>
  );
}

function isUnoptimizedImage(src: string | null) {
  return Boolean(src?.startsWith("blob:") || src?.startsWith("data:"));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
