"use client";

import { Store, UserRound, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SignupRole } from "@/lib/auth";
import { loginAccount, loginVendor } from "@/lib/auth";
import { saveCustomerProfileSession } from "@/lib/customer-session";
import { saveVendorProfileSession } from "@/lib/vendor-session";

type AccountLoginModalProps = {
  buttonClassName: string;
  open: boolean;
  initialRole: SignupRole;
  onOpenChange: (open: boolean) => void;
};

const tabs: Array<{
  role: SignupRole;
  label: string;
  icon: typeof UserRound;
}> = [
  { role: "CUSTOMER", label: "Customer", icon: UserRound },
  { role: "VENDOR", label: "Vendor", icon: Store }
];

export function AccountLoginModal({
  buttonClassName,
  open,
  initialRole,
  onOpenChange
}: AccountLoginModalProps) {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>(initialRole);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setRole(initialRole);
    }
  }, [initialRole, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const credentials = {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      };
      const result =
        role === "VENDOR"
          ? await loginVendor(credentials)
          : await loginAccount({ ...credentials, role });

      if (result.user.role !== role) {
        throw new Error("This account role does not match the selected login tab.");
      }

      if (!result.token) {
        throw new Error("Login succeeded but the API did not return a session token.");
      }

      if (result.user.role === "CUSTOMER") {
        saveCustomerProfileSession(result.user, result.token);
      }

      if (result.user.role === "VENDOR") {
        saveVendorProfileSession(result.user, result.token, result.profile ?? null);
      }

      setStatus("success");
      setMessage(`${role === "VENDOR" ? "Vendor" : "Customer"} login successful.`);
      onOpenChange(false);

      if (role === "VENDOR") {
        router.replace(
          !result.profile
            ? "/vendor-dashboard/setup"
            : result.user.approvalStatus === "APPROVED"
              ? "/vendor-dashboard"
              : "/vendor-dashboard/pending-approval"
        );
        return;
      }

      router.replace("/customer-dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <>
      <button type="button" className={buttonClassName} onClick={() => onOpenChange(true)}>
        <span className="btn-slide-overlay btn-slide-overlay-gold" />
        <span className="btn-slide-label transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink">
          Login
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-login-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onOpenChange(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-lg border border-[#C07C22]/45 bg-[#001B12] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 px-6 py-5">
              <div>
                <h2 id="account-login-modal-title" className="font-pt-serif text-2xl font-bold">
                  Account login
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Login after admin approval.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close login"
                className="grid h-10 w-10 place-items-center rounded-md border border-white/25 text-white transition hover:border-brand-gold hover:text-gold"
                onClick={() => onOpenChange(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 px-6 pt-5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = role === tab.role;

                return (
                  <button
                    key={tab.role}
                    type="button"
                    className={`flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition ${
                      active
                        ? "border-brand-gold bg-[#fff8ed] text-ink"
                        : "border-white/25 text-white/80 hover:border-brand-gold hover:text-white"
                    }`}
                    onClick={() => {
                      setRole(tab.role);
                      setStatus("idle");
                      setMessage("");
                    }}
                  >
                    <Icon size={17} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-semibold text-white">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-gold"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-white">Password</span>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-gold"
                />
              </label>

              {message ? (
                <p
                  className={`rounded-md px-3 py-2 text-sm ${
                    status === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                  aria-live="polite"
                >
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 w-full rounded-md bg-gold px-4 text-sm font-semibold text-white transition hover:bg-[#003224] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading"
                  ? "Signing in..."
                  : `Login as ${role === "VENDOR" ? "vendor" : "customer"}`}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
