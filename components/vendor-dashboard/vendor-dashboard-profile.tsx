"use client";

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Globe,
  Mail,
  MapPin,
  Package as PackageIcon,
  Phone,
  PoundSterling,
  Star,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import AvailabilityCalendar from "@/components/shared/availability";
import type { AvailabilityStatus } from "@/data/vendor-data";
import {
  getVendorProfile,
  listVendorAvailability,
  listVendorPackages,
  listVendorPortfolio,
  listVendorServices,
  updateVendorProfile,
  upsertVendorAvailability,
  type VendorAvailabilityEvent,
  type VendorPackage,
  type VendorPortfolioItem,
  type VendorProfileDetails,
  type VendorService,
} from "@/lib/auth";
import {
  getVendorProfileSession,
  saveVendorProfileSession,
} from "@/lib/vendor-session";

type ProfileViewModel = {
  ownerName: string;
  vendorName: string;
  status: string;
  category: string;
  imageUrl: string;
  rating: string;
  location: string;
  startingPrice: string;
  phone: string;
  email: string;
  website: string;
  about: string;
};

type CalendarDateDetail = {
  calendarStatus: AvailabilityStatus;
  eventName: string;
};

const fallbackImage = "/images/Photography.png";
const boxHeadingClass = "font-inter text-[16px] font-semibold leading-tight text-[#16231f]";
const calendarStatusOptions: AvailabilityStatus[] = ["available", "booked", "pending", "unavailable"];

function createProfileViewModel(profile: VendorProfileDetails | null): ProfileViewModel {
  const session = getVendorProfileSession();

  return {
    ownerName: profile?.ownerName ?? session?.ownerName ?? session?.fullName ?? "",
    vendorName: profile?.vendorName ?? session?.vendorName ?? session?.fullName ?? "Vendor",
    status: session?.approvalStatus === "APPROVED" ? "Active" : session?.approvalStatus ?? "Pending",
    category: profile?.category ?? session?.category ?? "Not added",
    imageUrl: profile?.imageUrl ?? session?.image ?? fallbackImage,
    rating: "New",
    location: profile?.location ?? session?.location ?? "Not added",
    startingPrice: "Not set",
    phone: session?.phone ?? "",
    email: session?.email ?? "",
    website: "",
    about: profile?.about ?? session?.about ?? "No vendor description added yet.",
  };
}

function createDateDetail(status: AvailabilityStatus): CalendarDateDetail {
  return {
    calendarStatus: status,
    eventName: "",
  };
}

function eventToDetail(event: VendorAvailabilityEvent): CalendarDateDetail {
  return {
    calendarStatus: event.status,
    eventName: event.eventName,
  };
}

export function VendorDashboardProfile() {
  const [profile, setProfile] = useState<ProfileViewModel>(() => createProfileViewModel(null));
  const [services, setServices] = useState<VendorService[]>([]);
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [portfolio, setPortfolio] = useState<VendorPortfolioItem[]>([]);
  const [calendarDetails, setCalendarDetails] = useState<Record<string, CalendarDateDetail>>({});
  const [editForm, setEditForm] = useState<ProfileViewModel>(() => createProfileViewModel(null));
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [visibleDate, setVisibleDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(formatDateKey(new Date()));
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");

  const calendarStatuses = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(calendarDetails).map(([date, detail]) => [date, detail.calendarStatus]),
      ) as Record<string, AvailabilityStatus>,
    [calendarDetails],
  );

  const calendarLabels = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(calendarDetails).map(([date, detail]) => [date, detail.eventName]),
      ),
    [calendarDetails],
  );

  const selectedDateDetail =
    calendarDetails[selectedDateKey] ??
    createDateDetail(calendarStatuses[selectedDateKey] ?? "available");
  const selectedDateLabel = parseDateKey(selectedDateKey).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const infoRows = [
    { label: "Owner Name", value: profile.ownerName, icon: BriefcaseBusiness },
    { label: "Business Name", value: profile.vendorName, icon: BriefcaseBusiness },
    { label: "Category", value: profile.category, icon: PackageIcon },
    { label: "Location", value: profile.location, icon: MapPin },
    { label: "Phone", value: profile.phone || "Not added", icon: Phone },
    { label: "Email", value: profile.email || "Not added", icon: Mail },
    { label: "Website", value: profile.website || "Not added", icon: Globe },
  ];

  useEffect(() => {
    let active = true;
    const session = getVendorProfileSession();

    if (!session?.token) {
      void Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Vendor login is required to load profile.");
      });
      return;
    }

    Promise.all([
      getVendorProfile(session),
      listVendorServices(session),
      listVendorPackages(session),
      listVendorPortfolio(session),
      listVendorAvailability(session),
    ])
      .then(([profileResult, servicesResult, packagesResult, portfolioResult, availabilityResult]) => {
        if (!active) {
          return;
        }

        saveVendorProfileSession(profileResult.user, session.token, profileResult.profile);
        const nextProfile = createProfileViewModel(profileResult.profile);
        const nextDetails = Object.fromEntries(
          availabilityResult.events.map((event) => [event.date, eventToDetail(event)]),
        );

        setProfile(nextProfile);
        setEditForm(nextProfile);
        setServices(servicesResult.services);
        setPackages(packagesResult.packages);
        setPortfolio(portfolioResult.portfolio);
        setCalendarDetails(nextDetails);
        setStatus("idle");
        setMessage("");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load vendor profile.");
      });

    return () => {
      active = false;
    };
  }, []);

  const openEditModal = () => {
    setEditForm(profile);
    setIsEditOpen(true);
  };

  const updateEditForm = (field: keyof ProfileViewModel, value: string) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    readFileAsDataUrl(file).then((imageUrl) => updateEditForm("imageUrl", imageUrl));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Vendor login is required to update profile.");
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const result = await updateVendorProfile(
        {
          ownerName: editForm.ownerName.trim(),
          vendorName: editForm.vendorName.trim(),
          category: editForm.category.trim(),
          location: editForm.location.trim(),
          email: editForm.email.trim(),
          ...(editForm.phone.trim() ? { phone: editForm.phone.trim() } : {}),
          ...(editForm.about.trim() ? { about: editForm.about.trim() } : {}),
          ...(editForm.imageUrl ? { imageUrl: editForm.imageUrl } : {}),
        },
        session,
      );
      saveVendorProfileSession(result.user, session.token, result.profile);
      const nextProfile = createProfileViewModel(result.profile);
      setProfile(nextProfile);
      setEditForm(nextProfile);
      setIsEditOpen(false);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    }
  };

  const handleSelectDate = (dateKey: string) => {
    const selectedDate = parseDateKey(dateKey);

    setSelectedDateKey(dateKey);
    setVisibleDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  };

  const updateSelectedDateDetail = (field: keyof CalendarDateDetail, value: string) => {
    setCalendarDetails((current) => ({
      ...current,
      [selectedDateKey]: {
        ...(current[selectedDateKey] ?? createDateDetail("available")),
        [field]: value,
      },
    }));
  };

  const saveSelectedDateDetail = async () => {
    const session = getVendorProfileSession();
    const detail = selectedDateDetail;

    if (!session?.token) {
      setMessage("Vendor login is required to update availability.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const result = await upsertVendorAvailability(
        {
          date: selectedDateKey,
          status: detail.calendarStatus,
          eventName: detail.eventName.trim(),
        },
        session,
      );

      setCalendarDetails((current) => ({
        ...current,
        [result.date]: eventToDetail(result),
      }));
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update availability.");
    }
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">
              My Profile
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Manage your vendor profile, services, packages, portfolio, and availability details from one page.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={openEditModal} className="rounded-md border border-[#0D5B46] px-5 py-3 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
              Edit Profile
            </button>
            <button type="button" onClick={() => setIsViewOpen(true)} className="rounded-md border border-[#0D5B46] px-5 py-3 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
              View Profile
            </button>
          </div>
        </div>
        {message ? (
          <p className={`mt-4 rounded-md px-3 py-2 font-inter text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`} aria-live="polite">
            {message}
          </p>
        ) : null}
      </section>

      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative h-[220px] w-full flex-none overflow-hidden rounded-[16px] bg-[#f5f7f4] lg:w-[220px]">
            <Image src={profile.imageUrl} alt={profile.vendorName} fill sizes="220px" className="object-cover" unoptimized={isUnoptimizedImage(profile.imageUrl)} />
          </div>
          <div>
            <div className="flex flex-wrap items-start gap-3">
              <h3 className="[font-family:var(--font-playfair)] text-[24px] font-semibold leading-tight text-[#16231f]">
                {profile.vendorName}
              </h3>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-inter text-sm font-semibold text-emerald-700">
                {profile.status}
              </span>
            </div>
            <div className="mt-2">
              <ProfileMeta icon={PackageIcon} label={profile.category} />
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
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3 border-b border-[#edf1ee] px-4 pb-3">
                <row.icon className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
                <div>
                  <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">{row.label}</p>
                  <p className="font-inter text-[15px] font-medium text-[#16231f]">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
          <div className="border-b border-[#edf1ee] px-4 py-4">
            <h3 className={boxHeadingClass}>About Vendor</h3>
          </div>
          <p className="mt-5 px-4 font-inter text-[16px] leading-8 text-[#68746e]">{profile.about}</p>
        </section>
      </div>

      <div className="grid gap-7 xl:grid-cols-2">
        <ResourceBox title="Services" href="/vendor-dashboard/services" action="Manage Service">
          {services.slice(0, 4).map((service) => (
            <div key={service.id} className="flex items-center justify-between gap-4 border-b border-[#edf1ee] px-4 py-4">
              <div>
                <p className="font-inter text-[15px] font-semibold text-[#16231f]">{service.name}</p>
                <p className="mt-1 font-inter text-sm text-[#68746e]">Starting from {service.startingPrice}</p>
              </div>
              <span className="rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-xs font-semibold text-[#0D5B46]">
                {service.category}
              </span>
            </div>
          ))}
          {!services.length ? <EmptyRow label="No services added yet." /> : null}
        </ResourceBox>

        <ResourceBox title="Packages" href="/vendor-dashboard/packages" action="Manage Package">
          {packages.slice(0, 4).map((packageItem) => (
            <div key={packageItem.id} className="flex items-center justify-between gap-4 border-b border-[#edf1ee] px-4 py-4">
              <p className="font-inter text-[15px] font-semibold text-[#16231f]">{packageItem.name}</p>
              <p className="font-inter text-[15px] font-semibold text-[#0D5B46]">{packageItem.price}</p>
            </div>
          ))}
          {!packages.length ? <EmptyRow label="No packages added yet." /> : null}
        </ResourceBox>
      </div>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-3 border-b border-[#edf1ee] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className={boxHeadingClass}>Portfolio</h3>
          <Link href="/vendor-dashboard/portfolio" className="inline-flex self-start rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white sm:self-auto">
            Manage Portfolio
          </Link>
        </div>
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-6">
          {portfolio.slice(0, 6).map((item) => (
            <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#f5f7f4]">
              <Image src={item.imageUrl} alt={item.name} fill sizes="(min-width: 1024px) 14vw, 90vw" className="object-cover" unoptimized={isUnoptimizedImage(item.imageUrl)} />
            </div>
          ))}
          {!portfolio.length ? <div className="rounded-md border border-dashed border-[#dfe7e2] p-4 font-inter text-sm text-[#68746e] sm:col-span-2 lg:col-span-6">No portfolio photos added yet.</div> : null}
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="mb-5 flex items-center gap-3 border-b border-[#edf1ee] px-4 py-4">
          <CalendarDays className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
          <h3 className={boxHeadingClass}>Availability Calendar</h3>
        </div>
        <div className="grid gap-6 px-4 pb-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[12px] border border-[#dfe7e2]">
            <AvailabilityCalendar
              year={visibleDate.getFullYear()}
              month={visibleDate.getMonth()}
              statusByDate={calendarStatuses}
              labelByDate={calendarLabels}
              selectedDateKey={selectedDateKey}
              onSelectDate={handleSelectDate}
              onPrevMonth={() => setVisibleDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              onNextMonth={() => setVisibleDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            />
          </div>
          <aside className="rounded-[12px] border border-[#dfe7e2] p-5">
            <h4 className={boxHeadingClass}>Selected Date Details</h4>
            <div className="mt-4 space-y-4 rounded-[10px] border border-[#edf1ee] p-4">
              <DetailRow label="Date" value={selectedDateLabel} />
              <EditSelect label="Status" value={selectedDateDetail.calendarStatus} options={calendarStatusOptions} onChange={(value) => updateSelectedDateDetail("calendarStatus", value)} />
              <EditInput label="Event Name" value={selectedDateDetail.eventName} onChange={(value) => updateSelectedDateDetail("eventName", value)} />
              <button type="button" onClick={saveSelectedDateDetail} disabled={status === "saving"} className="w-full rounded-md bg-[#0D5B46] px-4 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#001B12] disabled:cursor-not-allowed disabled:opacity-70">
                {status === "saving" ? "Saving..." : "Save Calendar Event"}
              </button>
            </div>
          </aside>
        </div>
      </section>

      {isViewOpen ? (
        <ProfilePreview profile={profile} infoRows={infoRows} onClose={() => setIsViewOpen(false)} />
      ) : null}

      {isEditOpen ? (
        <ProfileEditModal
          editForm={editForm}
          status={status}
          onClose={() => setIsEditOpen(false)}
          onSubmit={saveProfile}
          onPhotoUpload={handlePhotoUpload}
          onChange={updateEditForm}
        />
      ) : null}
    </div>
  );
}

function ResourceBox({ title, href, action, children }: { title: string; href: string; action: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
      <div className="flex flex-col gap-3 border-b border-[#edf1ee] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className={boxHeadingClass}>{title}</h3>
        <Link href={href} className="inline-flex self-start rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white sm:self-auto">
          {action}
        </Link>
      </div>
      <div className="mt-1">{children}</div>
    </section>
  );
}

function EmptyRow({ label }: { label: string }) {
  return <p className="px-4 py-5 font-inter text-sm text-[#68746e]">{label}</p>;
}

function ProfilePreview({ profile, infoRows, onClose }: { profile: ProfileViewModel; infoRows: Array<{ label: string; value: string; icon: LucideIcon }>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[16px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
          <div>
            <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">Profile Preview</h3>
            <p className="mt-1 font-inter text-sm text-[#68746e]">Live data from your vendor profile API.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white" aria-label="Close profile preview">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="relative min-h-[330px]">
          <Image src={profile.imageUrl} alt={profile.vendorName} fill sizes="900px" className="object-cover" unoptimized={isUnoptimizedImage(profile.imageUrl)} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="relative z-10 max-w-3xl p-8 text-white">
            <span className="rounded-full bg-white px-4 py-1 font-inter text-sm font-semibold text-[#0D5B46]">{profile.status}</span>
            <h4 className="mt-5 [font-family:var(--font-playfair)] text-[40px] font-semibold leading-tight">{profile.vendorName}</h4>
            <p className="mt-4 font-inter text-[17px] leading-8 text-white/84">{profile.about}</p>
          </div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {infoRows.map((row) => (
            <div key={row.label} className="rounded-[12px] border border-[#dfe7e2] p-4">
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">{row.label}</p>
              <p className="mt-1 font-inter text-[15px] font-semibold text-[#16231f]">{row.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileEditModal({
  editForm,
  status,
  onClose,
  onSubmit,
  onPhotoUpload,
  onChange,
}: {
  editForm: ProfileViewModel;
  status: "idle" | "loading" | "saving" | "error";
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPhotoUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: keyof ProfileViewModel, value: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-5 py-8">
      <form onSubmit={onSubmit} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[16px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf1ee] px-6 py-5">
          <div>
            <h3 className="font-inter text-[24px] font-semibold text-[#16231f]">Edit Profile</h3>
            <p className="mt-1 font-inter text-sm text-[#68746e]">Owner, email, and phone come from the vendor profile API.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white" aria-label="Close edit profile">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="mb-2 font-inter text-sm font-semibold text-[#16231f]">Upload Photo</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-[14px] bg-[#f5f7f4]">
                <Image src={editForm.imageUrl} alt="Vendor preview" fill sizes="112px" className="object-cover" unoptimized={isUnoptimizedImage(editForm.imageUrl)} />
              </div>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0D5B46] px-5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload Photo
                <input type="file" accept="image/*" onChange={onPhotoUpload} className="sr-only" />
              </label>
            </div>
          </div>
          <EditInput label="Owner Name" value={editForm.ownerName} onChange={(value) => onChange("ownerName", value)} />
          <EditInput label="Vendor Name" value={editForm.vendorName} onChange={(value) => onChange("vendorName", value)} />
          <EditInput label="Category Name" value={editForm.category} onChange={(value) => onChange("category", value)} />
          <EditInput label="Location" value={editForm.location} onChange={(value) => onChange("location", value)} />
          <EditInput label="Email" type="email" value={editForm.email} onChange={(value) => onChange("email", value)} />
          <EditInput label="Phone" type="tel" value={editForm.phone} onChange={(value) => onChange("phone", value)} />
          <EditTextarea label="About" value={editForm.about} onChange={(value) => onChange("about", value)} />
        </div>
        <div className="flex justify-end gap-3 border-t border-[#edf1ee] px-6 py-5">
          <button type="button" onClick={onClose} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]">
            Cancel
          </button>
          <button type="submit" disabled={status === "saving"} className="rounded-md bg-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#001B12] disabled:cursor-not-allowed disabled:opacity-70">
            {status === "saving" ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-[#68746e]">{label}</p>
      <p className="mt-1 font-inter text-sm font-medium text-[#16231f]">{value}</p>
    </div>
  );
}

function EditInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "email" | "tel" | "text" }) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] px-4 font-inter text-sm text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]" />
    </label>
  );
}

function EditTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block sm:col-span-2">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-md border border-[#dfe7e2] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]" />
    </label>
  );
}

function EditSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-inter text-sm font-semibold text-[#16231f]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#dfe7e2] bg-white px-4 font-inter text-sm capitalize text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ProfileMeta({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 font-inter text-[15px] font-medium text-[#68746e]">
      <Icon className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
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
