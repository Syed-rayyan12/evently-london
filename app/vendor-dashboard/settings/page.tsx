"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Eye,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldAlert,
  Store,
  UserRound,
  X,
} from "lucide-react";

const initialAccount = {
  businessName: "Royal Moments Photography",
  ownerName: "Vendor Account",
  category: "Photography",
  email: "vendor@evently.com",
  phone: "+44 7700 900123",
  location: "London, United Kingdom",
};

const accountFields = [
  { key: "businessName", label: "Business Name", icon: Store },
  { key: "ownerName", label: "Owner Name", icon: UserRound },
  { key: "category", label: "Category", icon: Building2 },
  { key: "email", label: "Email Address", icon: Mail },
  { key: "phone", label: "Phone Number", icon: Phone },
  { key: "location", label: "Location", icon: MapPin },
] as const;

export default function SettingsPage() {
  const [account, setAccount] = useState(initialAccount);
  const [editAccount, setEditAccount] = useState(initialAccount);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const openEditModal = () => {
    setEditAccount(account);
    setIsEditOpen(true);
  };

  const saveAccount = () => {
    setAccount(editAccount);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
              Account Settings
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Manage account information, password security, logout access, and
              account deletion.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLogoutOpen(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex flex-col gap-4 border-b border-[#edf1ee] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
              Account Information
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0D5B46] px-4 font-inter text-[14px] font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                View Details
              </button>
              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-4 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit Account
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {accountFields.map((field) => {
              const Icon = field.icon;

              return (
                <div
                  key={field.key}
                  className="rounded-[12px] border border-[#dfe7e2] p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-[#01241D] text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-inter text-[13px] font-medium text-[#68746e]">
                        {field.label}
                      </p>
                      <p className="mt-1 font-inter text-[15px] font-semibold text-[#16231f]">
                        {account[field.key]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#01241D] text-white">
            <KeyRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-5 font-inter text-[18px] font-semibold text-[#16231f]">
            Change Password
          </h3>
          <form className="mt-6 space-y-4">
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
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
            >
              Change Password
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-[10px] bg-[#fbeaea] text-[#b42318]">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
                Delete Account
              </h3>
              <p className="mt-2 max-w-3xl font-inter text-[14px] leading-6 text-[#68746e]">
                Permanently delete this vendor account, profile details,
                services, portfolio items, enquiries, and dashboard history.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#b42318] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#8f1d14]"
          >
            Delete Account
          </button>
        </div>
      </section>

      {isDetailsOpen ? (
        <SettingsModal title="Account Details" onClose={() => setIsDetailsOpen(false)}>
          <div className="grid gap-3 sm:grid-cols-2">
            {accountFields.map((field) => (
              <div
                key={field.key}
                className="rounded-[10px] border border-[#dfe7e2] p-4"
              >
                <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
                  {field.label}
                </p>
                <p className="mt-1 font-inter text-[15px] font-medium text-[#16231f]">
                  {account[field.key]}
                </p>
              </div>
            ))}
          </div>
        </SettingsModal>
      ) : null}

      {isEditOpen ? (
        <SettingsModal title="Edit Account Details" onClose={() => setIsEditOpen(false)}>
          <div className="grid gap-4 sm:grid-cols-2">
            {accountFields.map((field) => (
              <label key={field.key} className="block">
                <span className="font-inter text-[13px] font-semibold text-[#16231f]">
                  {field.label}
                </span>
                <input
                  value={editAccount[field.key]}
                  onChange={(event) =>
                    setEditAccount((current) => ({
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
              onClick={saveAccount}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              Save Details
            </button>
          </div>
        </SettingsModal>
      ) : null}

      {isDeleteOpen ? (
        <SettingsModal title="Delete Account" onClose={() => setIsDeleteOpen(false)}>
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
        </SettingsModal>
      ) : null}

      {isLogoutOpen ? (
        <SettingsModal title="Logout" onClose={() => setIsLogoutOpen(false)}>
          <p className="font-inter text-[15px] leading-7 text-[#68746e]">
            Are you sure you want to logout from the vendor dashboard?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLogoutOpen(false)}
              className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] transition-colors hover:bg-[#f5f7f4]"
            >
              Cancel
            </button>
            <Link
              href="/"
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              Logout
            </Link>
          </div>
        </SettingsModal>
      ) : null}
    </div>
  );
}

function SettingsModal({
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
