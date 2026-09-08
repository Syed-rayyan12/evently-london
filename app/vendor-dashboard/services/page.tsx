"use client";

import { type FormEvent, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";

type ServicePackage = {
  id: number;
  name: string;
  price: string;
  description: string;
};

type Service = {
  id: number;
  name: string;
  category: string;
  startingPrice: string;
  description: string;
  image: string;
  packages: ServicePackage[];
};

const initialServices: Service[] = [
  {
    id: 1,
    name: "Wedding Photography",
    category: "Photography",
    startingPrice: "GBP 1,500",
    description: "Full-day wedding coverage with edited digital gallery.",
    image: "/images/Photography.png",
    packages: [
      {
        id: 1,
        name: "Essential",
        price: "GBP 1,500",
        description: "Ceremony coverage, edited gallery, and online delivery.",
      },
      {
        id: 2,
        name: "Premium",
        price: "GBP 2,500",
        description: "Full-day coverage with second shooter and album.",
      },
    ],
  },
  {
    id: 2,
    name: "Engagement Shoot",
    category: "Photography",
    startingPrice: "GBP 650",
    description: "Outdoor or studio engagement session with edited portraits.",
    image: "/images/card-3.png",
    packages: [
      {
        id: 1,
        name: "Classic",
        price: "GBP 650",
        description: "Two-hour engagement shoot with edited portraits.",
      },
    ],
  },
  {
    id: 3,
    name: "Cinematic Videography",
    category: "Videography",
    startingPrice: "GBP 1,200",
    description: "Highlight film and event video coverage for celebrations.",
    image: "/images/card-5.png",
    packages: [],
  },
];

const emptyForm = {
  name: "",
  category: "",
  startingPrice: "",
  description: "",
  image: "/images/Photography.png",
};

const emptyPackageForm = {
  name: "",
  price: "",
  description: "",
};

type PackageModalState = {
  mode: "add" | "edit";
  serviceId: number;
  packageId?: number;
};

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [packageModal, setPackageModal] = useState<PackageModalState | null>(
    null,
  );
  const [packageForm, setPackageForm] = useState(emptyPackageForm);

  const openModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const updateForm = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openPackageModal = (
    mode: PackageModalState["mode"],
    serviceId: number,
    packageItem?: ServicePackage,
  ) => {
    setPackageForm(
      packageItem
        ? {
            name: packageItem.name,
            price: packageItem.price,
            description: packageItem.description,
          }
        : emptyPackageForm,
    );
    setPackageModal({
      mode,
      serviceId,
      packageId: packageItem?.id,
    });
  };

  const savePackage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!packageModal) {
      return;
    }

    setServices((current) =>
      current.map((service) => {
        if (service.id !== packageModal.serviceId) {
          return service;
        }

        if (packageModal.mode === "edit" && packageModal.packageId) {
          return {
            ...service,
            packages: service.packages.map((item) =>
              item.id === packageModal.packageId
                ? { ...item, ...packageForm }
                : item,
            ),
          };
        }

        return {
          ...service,
          packages: [...service.packages, { id: Date.now(), ...packageForm }],
        };
      }),
    );

    setPackageModal(null);
  };

  const uploadServiceImage = (file: File | undefined) => {
    if (!file) {
      return;
    }

    updateForm("image", URL.createObjectURL(file));
  };

  const removeSavedPackage = (serviceId: number, packageId: number) => {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              packages: service.packages.filter((item) => item.id !== packageId),
            }
          : service,
      ),
    );
  };

  const saveService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setServices((current) => [
      {
        id: Date.now(),
        ...form,
        packages: [],
      },
      ...current,
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-inter text-[38px] font-normal leading-tight text-[#16231f]">
              Manage Service
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Add, review, and organize the services and packages attached to
              your vendor profile.
            </p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0D5B46] px-5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#001B12]"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add Service
          </button>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="border-b border-[#edf1ee] px-4 py-4">
          <h3 className="font-inter text-[16px] font-semibold leading-tight text-[#16231f]">
            Services
          </h3>
        </div>
        <div>
          {services.map((service) => (
            <div
              key={service.id}
              className="border-b border-[#edf1ee] px-4 py-5 last:border-b-0"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative h-28 w-full flex-none overflow-hidden rounded-[12px] bg-[#f5f7f4] sm:w-36">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                      unoptimized={service.image.startsWith("blob:")}
                    />
                  </div>
                  <div>
                    <p className="font-inter text-[16px] font-semibold text-[#16231f]">
                      {service.name}
                    </p>
                    <p className="mt-1 font-inter text-sm text-[#68746e]">
                      {service.category} | Starting from {service.startingPrice}
                    </p>
                    <p className="mt-3 max-w-3xl font-inter text-[15px] leading-7 text-[#68746e]">
                      {service.description}
                    </p>
                  </div>
                </div>
                <span className="self-start rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-xs font-semibold text-[#0D5B46]">
                  {service.packages.length} Packages
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-inter text-[15px] font-semibold text-[#16231f]">
                    Packages
                  </h4>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {service.packages.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-[#edf1ee] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-[#68746e]">
                          Package {index + 1}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openPackageModal("edit", service.id, item)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe7e2] bg-white text-[#16231f] transition-colors hover:border-[#0D5B46] hover:bg-[#0D5B46] hover:text-white"
                            aria-label={`Edit ${item.name || `package ${index + 1}`}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSavedPackage(service.id, item.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                            aria-label={`Remove ${item.name || `package ${index + 1}`}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 font-inter text-sm font-semibold text-[#16231f]">
                        {item.name || "Untitled Package"}
                      </p>
                      <p className="mt-1 font-inter text-sm text-[#0D5B46]">
                        {item.price || "Price not set"}
                      </p>
                      <p className="mt-2 font-inter text-sm leading-6 text-[#68746e]">
                        {item.description || "No package description added."}
                      </p>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => openPackageModal("add", service.id)}
                    className="flex min-h-[150px] items-center justify-center rounded-md border border-dashed border-[#dfe7e2] p-3 font-inter text-sm font-semibold text-black transition-colors hover:border-[#0D5B46] hover:bg-[#f5f7f4]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Add More Packages
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
          <form
            onSubmit={saveService}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[16px] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
              <div>
                <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">
                  Add Service
                </h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">
                  Add service details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                aria-label="Close add service"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="mb-2 font-inter text-sm font-semibold text-[#16231f]">
                  Service Image
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-36 overflow-hidden rounded-[12px] bg-[#f5f7f4]">
                    <Image
                      src={form.image}
                      alt="Service preview"
                      fill
                      sizes="144px"
                      className="object-cover"
                      unoptimized={form.image.startsWith("blob:")}
                    />
                  </div>
                  <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => uploadServiceImage(event.target.files?.[0])}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <FormInput
                label="Service Name"
                value={form.name}
                onChange={(value) => updateForm("name", value)}
                required
              />
              <FormInput
                label="Category"
                value={form.category}
                onChange={(value) => updateForm("category", value)}
                required
              />
              <FormInput
                label="Starting Price"
                value={form.startingPrice}
                onChange={(value) => updateForm("startingPrice", value)}
                required
              />
              <FormTextarea
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#001B12]"
              >
                Save Service
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {packageModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 py-8">
          <form
            onSubmit={savePackage}
            className="w-full max-w-lg rounded-[16px] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
              <div>
                <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">
                  {packageModal.mode === "edit" ? "Edit Package" : "Add Package"}
                </h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">
                  Add package name, price, and description.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPackageModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                aria-label="Close package modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6">
              <FormInput
                label="Package Name"
                value={packageForm.name}
                onChange={(value) =>
                  setPackageForm((current) => ({ ...current, name: value }))
                }
                required
              />
              <FormInput
                label="Price"
                value={packageForm.price}
                onChange={(value) =>
                  setPackageForm((current) => ({ ...current, price: value }))
                }
                required
              />
              <FormTextarea
                label="Package Description"
                value={packageForm.description}
                onChange={(value) =>
                  setPackageForm((current) => ({
                    ...current,
                    description: value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
              <button
                type="button"
                onClick={() => setPackageModal(null)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#001B12]"
              >
                {packageModal.mode === "edit" ? "Update Package" : "Add Package"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] px-4 font-inter text-sm text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      />
    </label>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="font-inter text-sm font-semibold text-[#16231f]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none rounded-md border border-[#dfe7e2] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      />
    </label>
  );
}
