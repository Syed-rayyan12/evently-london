"use client";

import type { ReactNode } from "react";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  getVendorProfile,
  updateVendorPassword,
  updateVendorProfile,
  type AuthUser,
  type VendorProfileDetails,
} from "@/lib/auth";
import {
  clearVendorProfileSession,
  getVendorProfileSession,
  saveVendorProfileSession,
} from "@/lib/vendor-session";

const initialAccount = {
  businessName: "Royal Moments Photography",
  ownerName: "Vendor Account",
  category: "Photography",
  email: "vendor@evently.com",
  phone: "+44 7700 900123",
  location: "London, United Kingdom",
  about: "Royal Moments Photography creates timeless wedding, engagement, and family celebration coverage with a calm documentary approach.",
};

type VendorAccount = typeof initialAccount;

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function createVendorAccountFromUser(
  user: AuthUser,
  profile: VendorProfileDetails | null,
  current = initialAccount
): VendorAccount {
  return {
    ...current,
    businessName: profile?.vendorName ?? user.name,
    ownerName: profile?.ownerName ?? user.name,
    category: profile?.category ?? current.category,
    email: user.email,
    phone: user.phone ?? "",
    location: profile?.location ?? current.location,
    about: profile?.about ?? current.about,
  };
}

const accountFields = [
  { key: "businessName", label: "Business Name", icon: Store },
  { key: "ownerName", label: "Owner Name", icon: UserRound },
  { key: "category", label: "Category", icon: Building2 },
  { key: "email", label: "Email Address", icon: Mail },
  { key: "phone", label: "Phone Number", icon: Phone },
  { key: "location", label: "Location", icon: MapPin },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const [account, setAccount] = useState<VendorAccount>(initialAccount);
  const [editAccount, setEditAccount] = useState<VendorAccount>(initialAccount);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [accountStatus, setAccountStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [accountMessage, setAccountMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const session = getVendorProfileSession();

    if (!session?.token) {
      setAccountStatus("error");
      setAccountMessage("Please login before viewing vendor settings.");
      router.replace("/");
      return;
    }

    setAccountStatus("loading");
    setAccountMessage("Loading vendor profile...");

    getVendorProfile(session)
      .then((result) => {
        if (!active) {
          return;
        }

        const nextAccount = createVendorAccountFromUser(result.user, result.profile);

        saveVendorProfileSession(result.user, session.token, result.profile);
        setAccount(nextAccount);
        setEditAccount(nextAccount);
        setAccountStatus("idle");
        setAccountMessage("");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        clearVendorProfileSession();
        setAccountStatus("error");
        setAccountMessage(error instanceof Error ? error.message : "Unable to load vendor profile");
        router.replace("/");
      });

    return () => {
      active = false;
    };
  }, [router]);

  const openEditModal = () => {
    setEditAccount(account);
    setAccountStatus("idle");
    setAccountMessage("");
    setIsEditOpen(true);
  };

  const saveAccount = async () => {
    const session = getVendorProfileSession();

    if (!session?.token) {
      setAccountStatus("error");
      setAccountMessage("Please login before updating your vendor profile.");
      return;
    }

    setAccountStatus("loading");
    setAccountMessage("");

    try {
      const phone = editAccount.phone.trim();
      const result = await updateVendorProfile(
        {
          ownerName: editAccount.ownerName.trim(),
          vendorName: editAccount.businessName.trim(),
          category: editAccount.category.trim(),
          location: editAccount.location.trim(),
          email: editAccount.email.trim(),
          ...(phone ? { phone } : {}),
          ...(editAccount.about.trim() ? { about: editAccount.about.trim() } : {})
        },
        session
      );
      const nextAccount = createVendorAccountFromUser(result.user, result.profile, editAccount);

      saveVendorProfileSession(result.user, session.token, result.profile);
      setAccount(nextAccount);
      setEditAccount(nextAccount);
      setAccountStatus("success");
      setAccountMessage("Vendor profile updated successfully.");
      setIsEditOpen(false);
    } catch (error) {
      setAccountStatus("error");
      setAccountMessage(error instanceof Error ? error.message : "Unable to update vendor profile");
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getVendorProfileSession();

    if (!session?.token) {
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
      await updateVendorPassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        session
      );

      setPasswordStatus("success");
      setPasswordMessage("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordStatus("error");
      setPasswordMessage(error instanceof Error ? error.message : "Unable to change password");
    }
  };

  const logout = () => {
    clearVendorProfileSession();
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
          {accountMessage && !isEditOpen ? (
            <StatusMessage status={accountStatus} message={accountMessage} />
          ) : null}
        </div>

        <div className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#01241D] text-white">
            <KeyRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-5 font-inter text-[18px] font-semibold text-[#16231f]">
            Change Password
          </h3>
          <form className="mt-6 space-y-4" onSubmit={changePassword}>
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
            {passwordMessage ? (
              <StatusMessage status={passwordStatus} message={passwordMessage} />
            ) : null}
            <button
              type="submit"
              disabled={passwordStatus === "loading"}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
            >
              {passwordStatus === "loading" ? "Changing..." : "Change Password"}
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
          <div className="mt-3 rounded-[10px] border border-[#dfe7e2] p-4">
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#68746e]">
              About
            </p>
            <p className="mt-1 font-inter text-[15px] font-medium leading-7 text-[#16231f]">
              {account.about}
            </p>
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
          <label className="mt-4 block">
            <span className="font-inter text-[13px] font-semibold text-[#16231f]">
              About
            </span>
            <textarea
              value={editAccount.about}
              onChange={(event) =>
                setEditAccount((current) => ({
                  ...current,
                  about: event.target.value,
                }))
              }
              rows={5}
              maxLength={2000}
              className="mt-2 w-full resize-none rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 py-3 font-inter text-[14px] leading-6 text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
            />
          </label>
          {accountMessage ? (
            <StatusMessage status={accountStatus} message={accountMessage} />
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
              onClick={saveAccount}
              disabled={accountStatus === "loading"}
              className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
            >
              {accountStatus === "loading" ? "Saving..." : "Save Details"}
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
              onClick={logout}
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
        required
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
