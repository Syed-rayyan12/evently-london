"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Pencil,
  Phone,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import {
  getCustomerProfile,
  updateCustomerPassword,
  updateCustomerProfile,
  type AuthUser,
} from "@/lib/auth";
import {
  clearCustomerProfileSession,
  getCustomerProfileSession,
  saveCustomerProfileSession,
  type CustomerProfileSession,
} from "@/lib/customer-session";

const initialProfile = {
  image: "/images/profile-2.png",
  fullName: "Customer User",
  email: "admin@evently.com",
  phone: "+44 7700 900321",
};

type CustomerProfile = Pick<CustomerProfileSession, "image" | "fullName" | "email" | "phone">;

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function getInitialProfile(): CustomerProfile {
  const session = getCustomerProfileSession();

  if (!session) {
    return initialProfile;
  }

  return {
    image: session.image,
    fullName: session.fullName,
    email: session.email,
    phone: session.phone,
  };
}

function createProfileFromUser(user: AuthUser, image = "/images/profile-2.png"): CustomerProfile {
  return {
    image,
    fullName: user.name,
    email: user.email,
    phone: user.phone ?? "",
  };
}

const profileFields = [
  { key: "fullName", label: "Full Name", icon: UserRound },
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
] as const;

export default function AdminSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile>(getInitialProfile);
  const [editProfile, setEditProfile] = useState<CustomerProfile>(getInitialProfile);
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const session = getCustomerProfileSession();

    if (!session?.token) {
      setProfileStatus("error");
      setProfileMessage("Please login before viewing your profile.");
      router.replace("/");
      return;
    }

    setProfileStatus("loading");
    setProfileMessage("Loading profile...");

    getCustomerProfile(session)
      .then((result) => {
        if (!active) {
          return;
        }

        const nextProfile = createProfileFromUser(result.user, session.image);

        saveCustomerProfileSession(result.user, session.token);
        setProfile(nextProfile);
        setEditProfile(nextProfile);
        setProfileStatus("idle");
        setProfileMessage("");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        clearCustomerProfileSession();
        setProfileStatus("error");
        setProfileMessage(error instanceof Error ? error.message : "Unable to load profile");
        router.replace("/");
      });

    return () => {
      active = false;
    };
  }, [router]);

  const openEditModal = () => {
    setEditProfile(profile);
    setProfileStatus("idle");
    setProfileMessage("");
    setIsEditOpen(true);
  };

  const saveProfile = async () => {
    const session = getCustomerProfileSession();

    if (!session?.id || !session.token) {
      setProfileStatus("error");
      setProfileMessage("Please login before updating your profile.");
      return;
    }

    setProfileStatus("loading");
    setProfileMessage("");

    try {
      const phone = editProfile.phone.trim();
      const result = await updateCustomerProfile(
        {
          fullName: editProfile.fullName.trim(),
          email: editProfile.email.trim(),
          ...(phone ? { phone } : {})
        },
        session
      );
      const nextProfile = createProfileFromUser(result.user, editProfile.image);

      saveCustomerProfileSession(result.user, session.token);
      setProfile(nextProfile);
      setEditProfile(nextProfile);
      setProfileStatus("success");
      setProfileMessage("Profile updated successfully.");
      setIsEditOpen(false);
    } catch (error) {
      setProfileStatus("error");
      setProfileMessage(error instanceof Error ? error.message : "Unable to update profile");
    }
  };

  const openPasswordModal = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStatus("idle");
    setPasswordMessage("");
    setIsPasswordOpen(true);
  };

  const changePassword = async () => {
    const session = getCustomerProfileSession();

    if (!session?.id || !session.token) {
      setPasswordStatus("error");
      setPasswordMessage("Please login before changing your password.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("error");
      setPasswordMessage("New password and confirm password must match.");
      return;
    }

    setPasswordStatus("loading");
    setPasswordMessage("");

    try {
      const result = await updateCustomerPassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        session
      );

      saveCustomerProfileSession(result.user, session.token);
      setPasswordStatus("success");
      setPasswordMessage("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordOpen(false);
    } catch (error) {
      setPasswordStatus("error");
      setPasswordMessage(error instanceof Error ? error.message : "Unable to change password");
    }
  };

  const updateProfileImage = (file: File | undefined) => {
    if (!file) {
      return;
    }

    setEditProfile((current) => ({
      ...current,
      image: URL.createObjectURL(file),
    }));
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Settings
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Manage your profile information, password security, and account access.
        </p>
      </section>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 border-b border-[#edf1ee] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative h-20 w-20 flex-none overflow-hidden rounded-full bg-[#f5f7f4]">
              <Image
                src={profile.image}
                alt={profile.fullName}
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <div>
              <h3 className="[font-family:var(--font-playfair)] text-[20px] font-semibold text-[#16231f]">
                {profile.fullName}
              </h3>
              <p className="mt-1 font-inter text-[18px] font-medium text-[#68746e]">
                Profile Information
              </p>
            </div>
          </div>
          <div className="flex-end items-center space-x-4">

            <button
              type="button"
              onClick={openEditModal}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-4 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={openPasswordModal}
              className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-gray-300 bg-gray-100 px-5 font-inter text-[14px] font-semibold text-gray-500 transition-colors hover:border-[#0D5B46] hover:bg-white hover:text-[#0D5B46]"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {profileFields.map((field) => {
            return (
              <div
                key={field.key}
                className="rounded-[12px]  p-4"
              >
                <div className="flex items-start gap-3">

                  <div className="min-w-0">
                    <p className="font-inter text-[13px] font-medium text-[#68746e]">
                      {field.label}
                    </p>
                    <p className="mt-1 break-words font-inter text-[15px] font-semibold text-[#16231f]">
                      {profile[field.key]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {profileMessage && !isEditOpen ? (
          <StatusMessage status={profileStatus} message={profileMessage} />
        ) : null}

        {/* <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1ee] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
        
          
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordOpen(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-gray-300 bg-gray-100 px-5 font-inter text-[14px] font-semibold text-gray-500 transition-colors hover:border-[#0D5B46] hover:bg-white hover:text-[#0D5B46]"
          >
            Change Password
          </button>
        </div> */}
      </section>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">

            <div className="flex flex-col gap-3">
              <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
                Delete Account
              </h3>
              <p className=" max-w-3xl font-inter text-[14px] leading-6 text-[#68746e]">
                Permanently delete this customer account, saved vendors, events,
                enquiries, bookings, and dashboard history.
              </p>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="inline-flex min-h-11 w-40 items-center justify-center rounded-[10px] bg-[#b42318] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#8f1d14]"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {isEditOpen ? (
        <ProfileModal title="Edit Profile" onClose={() => setIsEditOpen(false)}>
          <div className="mb-5 rounded-[12px] border border-dashed border-[#0D5B46] bg-[#f5f7f4] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="relative h-16 w-16 flex-none overflow-hidden rounded-full bg-white">
                <Image
                  src={editProfile.image}
                  alt={editProfile.fullName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white px-4 font-inter text-[14px] font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => updateProfileImage(event.target.files?.[0])}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {profileFields.map((field) => (
              <label key={field.key} className="block">
                <span className="font-inter text-[13px] font-semibold text-[#16231f]">
                  {field.label}
                </span>
                <input
                  value={editProfile[field.key]}
                  onChange={(event) =>
                    setEditProfile((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
                />
              </label>
            ))}
          </div>
          {profileMessage ? (
            <StatusMessage status={profileStatus} message={profileMessage} />
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProfile}
              disabled={profileStatus === "loading"}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              {profileStatus === "loading" ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </ProfileModal>
      ) : null}

      {isPasswordOpen ? (
        <ProfileModal
          title="Change Password"
          onClose={() => setIsPasswordOpen(false)}
        >
          <div className="space-y-4">
            <PasswordInput
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(value) =>
                setPasswordForm((current) => ({ ...current, currentPassword: value }))
              }
            />
            <PasswordInput
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(value) =>
                setPasswordForm((current) => ({ ...current, newPassword: value }))
              }
            />
            <PasswordInput
              label="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={(value) =>
                setPasswordForm((current) => ({ ...current, confirmPassword: value }))
              }
            />
          </div>
          {passwordMessage ? (
            <StatusMessage status={passwordStatus} message={passwordMessage} />
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPasswordOpen(false)}
              className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={changePassword}
              disabled={passwordStatus === "loading"}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              {passwordStatus === "loading" ? "Changing..." : "Change Password"}
            </button>
          </div>
        </ProfileModal>
      ) : null}

      {isDeleteOpen ? (
        <ProfileModal title="Delete Account" onClose={() => setIsDeleteOpen(false)}>
          <p className="font-inter text-[15px] leading-7 text-[#68746e]">
            Are you sure you want to delete this account? This action is
            permanent and cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-md bg-[#b42318] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#8f1d14]"
            >
              Delete Account
            </button>
          </div>
        </ProfileModal>
      ) : null}
    </div>
  );
}

function ProfileModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 py-8">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h3 className="font-inter text-[22px] font-semibold text-[#16231f]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]"
            aria-label={`Close ${title}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-inter text-[13px] font-semibold text-[#16231f]">
        {label}
      </span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      />
    </label>
  );
}

function StatusMessage({
  status,
  message,
}: {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}) {
  const className =
    status === "success"
      ? "bg-emerald-50 text-emerald-700"
      : status === "loading"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <p className={`mt-4 rounded-md px-3 py-2 font-inter text-sm ${className}`} aria-live="polite">
      {message}
    </p>
  );
}
