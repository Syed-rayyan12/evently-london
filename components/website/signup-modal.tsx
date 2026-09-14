"use client";

import { Store, UserRound, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SignupRole } from "@/lib/auth";
import { signupCustomer, signupVendor } from "@/lib/auth";
import { saveVendorProfileSession } from "@/lib/vendor-session";

type SignupModalProps = {
  buttonClassName: string;
  onLoginRequest?: (role: SignupRole) => void;
};

const tabs: Array<{
  role: SignupRole;
  label: string;
  icon: typeof UserRound;
}> = [
  { role: "CUSTOMER", label: "Customer", icon: UserRound },
  { role: "VENDOR", label: "Vendor", icon: Store }
];

export function SignupModal({ buttonClassName, onLoginRequest }: SignupModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<SignupRole>("CUSTOMER");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const phone = String(formData.get("phone") ?? "").trim();

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role,
      ...(phone ? { phone } : {})
    };

    try {
      if (role === "VENDOR") {
        const result = await signupVendor({
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password,
          ...(payload.phone ? { phone: payload.phone } : {})
        });
        saveVendorProfileSession(result.user, result.token);
        setStatus("success");
        setMessage("Vendor account created. Complete your vendor profile.");
        form.reset();
        setOpen(false);
        router.replace("/vendor-dashboard/setup");
        return;
      } else {
        await signupCustomer(payload);
      }
      setStatus("success");
      setMessage("Account created. You can login after admin approval.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Signup failed");
    }
  }

  return (
    <>
      <button type="button" className={buttonClassName} onClick={() => setOpen(true)}>
        <span className="btn-slide-overlay btn-slide-overlay-green" />
        <span className="btn-slide-label">Sign up</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-lg border border-[#C07C22]/45 bg-[#001B12] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 px-6 py-5">
              <div>
                <h2 id="signup-modal-title" className="font-pt-serif text-2xl font-bold">
                  Create account
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Choose customer or vendor.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close signup"
                className="grid h-10 w-10 place-items-center rounded-md border border-white/25 text-white transition hover:border-brand-gold hover:text-gold"
                onClick={() => setOpen(false)}
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
                <span className="text-sm font-semibold text-white">
                  {role === "VENDOR" ? "Owner name" : "Full name"}
                </span>
                <input
                  name="fullName"
                  type="text"
                  minLength={2}
                  maxLength={120}
                  required
                  className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-gold"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-white">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-gold"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-white">Password</span>
                <input
                  name="password"
                  type="password"
                  minLength={8}
                  required
                  className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-gold"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-white">Phone</span>
                <input
                  name="phone"
                  type="tel"
                  minLength={7}
                  maxLength={30}
                  className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-gold"
                />
              </label>

              {message ? (
                <div
                  className={`rounded-md px-3 py-2 text-sm ${
                    status === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                  aria-live="polite"
                >
                  <p>{message}</p>
                  {status === "success" && onLoginRequest ? (
                    <button
                      type="button"
                      className="mt-2 font-semibold underline"
                      onClick={() => {
                        setOpen(false);
                        onLoginRequest(role);
                      }}
                    >
                      Open login
                    </button>
                  ) : null}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 w-full rounded-md bg-gold px-4 text-sm font-semibold text-white transition hover:bg-[#003224] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading"
                  ? "Creating account..."
                  : `Sign up as ${role === "VENDOR" ? "vendor" : "customer"}`}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
