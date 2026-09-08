"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  PoundSterling,
  Star,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import AvailabilityCalendar from "@/components/shared/availability";
import type { AvailabilityStatus } from "@/data/vendor-data";

const initialVendor = {
  name: "Royal Moments Photography",
  status: "Active",
  category: "Photography",
  image: "/images/Photography.png",
  rating: "4.9",
  location: "London, UK",
  startingPrice: "£1,500",
  phone: "+44 7700 100103",
  email: "hello@royalmoments.example.com",
  website: "royalmoments.example.com",
  about:
    "Royal Moments Photography creates timeless wedding, engagement, and family celebration coverage with a calm documentary approach, refined portraits, and polished delivery for every client.",
};

const services = [
  { name: "Wedding Photography", price: "£1,500", status: "Active" },
  { name: "Engagement Shoot", price: "£650", status: "Active" },
  { name: "Cinematic Videography", price: "£1,200", status: "Inactive" },
  { name: "Albums & Prints", price: "£300", status: "Active" },
];

const packages = [
  { name: "Essential Package", price: "£1,500" },
  { name: "Classic Package", price: "£1,850" },
  { name: "Premium Package", price: "£2,580" },
];

const portfolioImages = [
  "/images/card-1.png",
  "/images/card-2.png",
  "/images/card-3.png",
  "/images/card-4.png",
  "/images/card-5.png",
  "/images/venue.png",
];

const boxHeadingClass =
  "font-inter text-[16px] font-semibold leading-tight text-[#16231f]";

const initialAvailability: Record<string, AvailabilityStatus> = {
  "2026-03-20": "booked",
  "2026-03-21": "available",
  "2026-03-22": "pending",
  "2026-03-23": "unavailable",
  "2026-03-27": "available",
};

type CalendarDateDetail = {
  calendarStatus: AvailabilityStatus;
  eventName: string;
  serviceName: string;
  packageName: string;
  location: string;
  guests: string;
};

const initialCalendarDetails: Record<string, CalendarDateDetail> = {
  "2026-03-20": {
    calendarStatus: "booked",
    eventName: "Wedding Event",
    serviceName: "Wedding Photography",
    packageName: "Premium Package",
    location: "The Grand Hall, London",
    guests: "180",
  },
  "2026-03-21": {
    calendarStatus: "available",
    eventName: "Available Date",
    serviceName: "",
    packageName: "",
    location: "Available across London",
    guests: "",
  },
  "2026-03-22": {
    calendarStatus: "pending",
    eventName: "Engagement Enquiry",
    serviceName: "Engagement Shoot",
    packageName: "Classic Package",
    location: "Chelsea, London",
    guests: "60",
  },
  "2026-03-23": {
    calendarStatus: "unavailable",
    eventName: "Unavailable Date",
    serviceName: "",
    packageName: "",
    location: "Not available",
    guests: "",
  },
  "2026-03-27": {
    calendarStatus: "available",
    eventName: "Available Date",
    serviceName: "",
    packageName: "",
    location: "Available across London",
    guests: "",
  },
};

const calendarStatusOptions: AvailabilityStatus[] = [
  "available",
  "booked",
  "pending",
  "unavailable",
];

export function VendorDashboardProfile() {
  const [profile, setProfile] = useState(initialVendor);
  const [editForm, setEditForm] = useState(initialVendor);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [visibleDate, setVisibleDate] = useState(new Date(2026, 2, 1));
  const [selectedDateKey, setSelectedDateKey] = useState("2026-03-20");
  const [calendarStatuses, setCalendarStatuses] = useState(initialAvailability);
  const [calendarDetails, setCalendarDetails] = useState(
    initialCalendarDetails,
  );
  const selectedDateDetail =
    calendarDetails[selectedDateKey] ??
    createDateDetail(
      calendarStatuses[selectedDateKey] ?? "available",
    );
  const selectedDateLabel = formatSelectedDate(selectedDateKey);

  const infoRows = [
    { label: "Business Name", value: profile.name, icon: BriefcaseBusiness },
    { label: "Category", value: profile.category },
    { label: "Location", value: profile.location, icon: MapPin },
    { label: "Phone", value: profile.phone, icon: Phone },
    { label: "Email", value: profile.email, icon: Mail },
    { label: "Website", value: profile.website, icon: Globe },
  ];

  const handleSelectDate = (dateKey: string) => {
    const selectedDate = parseDateKey(dateKey);

    setSelectedDateKey(dateKey);
    setVisibleDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  };

  const updateSelectedDateDetail = (
    field: keyof CalendarDateDetail,
    value: string,
  ) => {
    const nextDetail = {
      ...selectedDateDetail,
      [field]: value,
    } as CalendarDateDetail;

    setCalendarDetails((current) => ({
      ...current,
      [selectedDateKey]: nextDetail,
    }));

    if (field === "calendarStatus") {
      setCalendarStatuses((current) => ({
        ...current,
        [selectedDateKey]: value as AvailabilityStatus,
      }));
    }
  };

  const openEditModal = () => {
    setEditForm(profile);
    setIsEditOpen(true);
  };

  const updateEditForm = (field: keyof typeof initialVendor, value: string) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    updateEditForm("image", URL.createObjectURL(file));
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfile(editForm);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[38px] font-normal leading-tight text-[#16231f]">
              My Profile
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Manage your vendor profile, services, packages, portfolio, and
              availability details from one page.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openEditModal}
              className="rounded-md border border-[#0D5B46] px-5 py-3 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setIsViewOpen(true)}
              className="rounded-md border border-[#0D5B46] px-5 py-3 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
            >
              View Profile
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative h-[220px] w-full flex-none overflow-hidden rounded-[16px] bg-[#f5f7f4] lg:w-[220px]">
            <Image src={profile.image} alt={profile.name} fill sizes="220px" className="object-cover" unoptimized={profile.image.startsWith("blob:")} />
          </div>
          <div>
            <div className="flex flex-wrap items-start gap-3">
              <h3 className="[font-family:var(--font-playfair)] text-[24px] font-semibold leading-tight text-[#16231f]">
                {profile.name}
              </h3>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-inter text-sm font-semibold text-emerald-700">
                {profile.status}
              </span>
            </div>
            <div className="mt-2">

              <ProfileMeta icon={Package} label={profile.category} />
            </div>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
              <ProfileMeta icon={Star} label={`${profile.rating} rating`} />
              <ProfileMeta icon={MapPin} label={profile.location} />
              <ProfileMeta icon={PoundSterling} label={`Starting from ${profile.startingPrice}`} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-2">
        <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
          <div className="border-b border-[#edf1ee] px-4 py-4">
            <h3 className={boxHeadingClass}>Basic Info</h3>
          </div>
          <div className="mt-5 grid gap-3">
            {infoRows.map((row) => {
              return (
                <div key={row.label} className="flex items-center gap-3 px-4 border-b border-[#edf1ee] pb-3">
                  {/* <Icon className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" /> */}
                  <div>
                    <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                      {row.label}
                    </p>
                    <p className="font-inter text-[15px] font-medium text-[#16231f]">
                      {row.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        
          <div className="border-b border-[#edf1ee] px-4 py-4">
            <h3 className={boxHeadingClass}>About Vendor</h3>
          </div>
          <p className="mt-5 font-inter text-[16px] px-4 leading-8 text-[#68746e]">
            {profile.about}
          </p>
        </section>
      </div>

      <div className="grid gap-7 xl:grid-cols-2">
        <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-3 border-b border-[#edf1ee] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className={boxHeadingClass}>Services</h3>
            <Link
              href="/vendor-dashboard/services"
              className="inline-flex self-start rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white sm:self-auto"
            >
              Manage Service
            </Link>
          </div>
          <div className="mt-5">
            {services.map((service) => (
              <div key={service.name} className="flex items-center px-4 justify-between gap-4 border-b border-[#edf1ee] py-4">
                <div>
                  <p className="font-inter text-[15px] font-semibold text-[#16231f]">{service.name}</p>
                  <p className="mt-1 font-inter text-sm text-[#68746e]">Starting from {service.price}</p>
                </div>
                <span className={`rounded-full px-3 py-1 font-inter text-xs font-semibold ${service.status === "Active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                  }`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[16px] bg-white  shadow-lg shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-3 border-b border-[#edf1ee] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className={boxHeadingClass}>Packages</h3>
            <Link
              href="/vendor-dashboard/packages"
              className="inline-flex self-start rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white sm:self-auto"
            >
              Manage Package
            </Link>
          </div>
          <div className="mt-5">
            {packages.map((pkg) => (
              <div key={pkg.name} className="flex items-center px-4 justify-between gap-4 border-b border-[#edf1ee] py-4">
                <p className="font-inter text-[15px] font-semibold text-[#16231f]">{pkg.name}</p>
                <p className="font-inter text-[15px] font-semibold text-[#0D5B46]">{pkg.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[16px] bg-white  shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-3 border-b border-[#edf1ee] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className={boxHeadingClass}>Portfolio</h3>
          <Link
            href="/vendor-dashboard/portfolio"
            className=" inline-flex self-start rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white sm:self-auto"
          >
            Manage Portfolio
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 px-4 py-4">
          {portfolioImages.map((image, index) => (
            <div key={image} className="relative aspect-[4/3] overflow-hidden px-4 rounded-[14px] bg-[#f5f7f4]">
              <Image src={image} alt={`Portfolio image ${index + 1}`} fill sizes="(min-width: 1024px) 24vw, 90vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="mb-5 border-b border-[#edf1ee] px-4 py-4">
          {/* <CalendarDays className="h-6 w-6 text-[#0D5B46]" aria-hidden="true" /> */}
          <h3 className={boxHeadingClass}>
            Availability Calendar
          </h3>
        </div>
        <div className="grid gap-6 px-4 pb-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[12px] border border-[#dfe7e2]">
            <AvailabilityCalendar
              year={visibleDate.getFullYear()}
              month={visibleDate.getMonth()}
              statusByDate={calendarStatuses}
              selectedDateKey={selectedDateKey}
              onSelectDate={handleSelectDate}
              onPrevMonth={() =>
                setVisibleDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              onNextMonth={() =>
                setVisibleDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
            />
          </div>
          <aside className="rounded-[12px] border border-[#dfe7e2] p-5">
            <div className="border-b border-[#edf1ee] px-4 py-4">
              <h4 className={boxHeadingClass}>Selected Date Details</h4>
            </div>
            <div className="mt-4 space-y-4 rounded-[10px] border border-[#edf1ee] p-4">
              <DetailRow label="Date" value={selectedDateLabel} />
              <EditSelect
                label="Status"
                value={selectedDateDetail.calendarStatus}
                options={calendarStatusOptions}
                onChange={(value) =>
                  updateSelectedDateDetail("calendarStatus", value)
                }
              />
              <EditInput
                label="Event Name"
                value={selectedDateDetail.eventName}
                onChange={(value) => updateSelectedDateDetail("eventName", value)}
              />
              <EditInput
                label="Service Name"
                value={selectedDateDetail.serviceName}
                onChange={(value) =>
                  updateSelectedDateDetail("serviceName", value)
                }
              />
              <EditInput
                label="Package Name"
                value={selectedDateDetail.packageName}
                onChange={(value) =>
                  updateSelectedDateDetail("packageName", value)
                }
              />
              <EditInput
                label="Location"
                value={selectedDateDetail.location}
                onChange={(value) => updateSelectedDateDetail("location", value)}
              />
              <EditInput
                label="Guests"
                value={selectedDateDetail.guests}
                onChange={(value) => updateSelectedDateDetail("guests", value)}
              />
            </div>
          </aside>
        </div>
      </section>

      {isViewOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[16px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
              <div>
                <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">
                  Profile Preview
                </h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">
                  View details without leaving the profile page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                aria-label="Close profile preview"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-[330px]">
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                sizes="900px"
                className="object-cover"
                unoptimized={profile.image.startsWith("blob:")}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              <div className="relative z-10 max-w-3xl p-8 text-white">
                <span className="rounded-full bg-white px-4 py-1 font-inter text-sm font-semibold text-[#0D5B46]">
                  {profile.status}
                </span>
                <h4 className="mt-5 [font-family:var(--font-playfair)] text-[44px] font-semibold leading-tight">
                  {profile.name}
                </h4>
                <p className="mt-4 font-inter text-[17px] leading-8 text-white/84">
                  {profile.about}
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {infoRows.map((row) => (
                <div key={row.label} className="rounded-[12px] border border-[#dfe7e2] p-4">
                  <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                    {row.label}
                  </p>
                  <p className="mt-1 font-inter text-[15px] font-semibold text-[#16231f]">
                    {row.value}
                  </p>
                </div>
              ))}
              <div className="rounded-[12px] border border-[#dfe7e2] p-4">
                <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                  Starting Price
                </p>
                <p className="mt-1 font-inter text-[15px] font-semibold text-[#16231f]">
                  {profile.startingPrice}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#dfe7e2] p-4">
                <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                  Rating
                </p>
                <p className="mt-1 font-inter text-[15px] font-semibold text-[#16231f]">
                  {profile.rating}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isEditOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
          <form
            onSubmit={saveProfile}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[16px] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
              <div>
                <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">
                  Edit Profile
                </h3>
                <p className="mt-1 font-inter text-sm text-[#68746e]">
                  Update your vendor information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
                aria-label="Close edit profile"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="mb-2 font-inter text-sm font-semibold text-[#16231f]">
                  Upload Photo
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-28 overflow-hidden rounded-[14px] bg-[#f5f7f4]">
                    <Image
                      src={editForm.image}
                      alt="Vendor preview"
                      fill
                      sizes="112px"
                      className="object-cover"
                      unoptimized={editForm.image.startsWith("blob:")}
                    />
                  </div>
                  <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <EditInput
                label="Vendor Name"
                value={editForm.name}
                onChange={(value) => updateEditForm("name", value)}
              />
              <EditInput
                label="Category Name"
                value={editForm.category}
                onChange={(value) => updateEditForm("category", value)}
              />
              <EditInput
                label="Location"
                value={editForm.location}
                onChange={(value) => updateEditForm("location", value)}
              />
              <EditInput
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(value) => updateEditForm("email", value)}
              />
              <EditInput
                label="Website"
                value={editForm.website}
                onChange={(value) => updateEditForm("website", value)}
              />
              <EditInput
                label="Phone"
                type="tel"
                value={editForm.phone}
                onChange={(value) => updateEditForm("phone", value)}
              />
              <EditTextarea
                label="About"
                value={editForm.about}
                onChange={(value) => updateEditForm("about", value)}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#001B12]"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-[#68746e]">
        {label}
      </p>
      <p className="mt-1 font-inter text-sm font-medium text-[#16231f]">{value}</p>
    </div>
  );
}

function EditInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "email" | "tel" | "text";
}) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] px-4 font-inter text-sm text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      />
    </label>
  );
}

function EditTextarea({
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
        rows={5}
        className="mt-2 w-full resize-none rounded-md border border-[#dfe7e2] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      />
    </label>
  );
}

function EditSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] bg-white px-4 font-inter text-sm capitalize text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function createDateDetail(status: AvailabilityStatus): CalendarDateDetail {
  return {
    calendarStatus: status,
    eventName: status === "available" ? "Available Date" : "",
    serviceName: "",
    packageName: "",
    location: status === "available" ? "Available across London" : "",
    guests: "",
  };
}

function formatSelectedDate(dateKey: string) {
  return parseDateKey(dateKey).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

function ProfileMeta({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 font-inter text-[15px] font-medium text-[#68746e]">
      <Icon className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
