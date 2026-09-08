"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Pencil,
  Phone,
  Upload,
  UserRound,
  X,
} from "lucide-react";

const initialProfile = {
  image: "/images/profile-2.png",
  fullName: "Customer User",
  email: "admin@evently.com",
  phone: "+44 7700 900321",
};

const profileFields = [
  { key: "fullName", label: "Full Name", icon: UserRound },
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
] as const;

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editProfile, setEditProfile] = useState(initialProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openEditModal = () => {
    setEditProfile(profile);
    setIsEditOpen(true);
  };

  const saveProfile = () => {
    setProfile(editProfile);
    setIsEditOpen(false);
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
              onClick={() => setIsPasswordOpen(true)}
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
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              Save Profile
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
            {["Current Password", "New Password", "Confirm Password"].map(
              (label) => (
                <label key={label} className="block">
                  <span className="font-inter text-[13px] font-semibold text-[#16231f]">
                    {label}
                  </span>
                  <input
                    type="password"
                    className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
                  />
                </label>
              ),
            )}
          </div>
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
              onClick={() => setIsPasswordOpen(false)}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              Change Password
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

