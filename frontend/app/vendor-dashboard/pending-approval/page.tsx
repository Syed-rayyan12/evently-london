import { Clock3, ShieldCheck } from "lucide-react";

export default function VendorPendingApprovalPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid h-14 w-14 flex-none place-items-center rounded-[12px] bg-[#0D5B46]/10 text-[#0D5B46]">
            <Clock3 className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.16em] text-[#0D5B46]">
              Vendor Account
            </p>
            <h2 className="mt-2 [font-family:var(--font-playfair)] text-[34px] font-normal leading-tight text-[#16231f]">
              Pending Approval
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Your vendor profile is complete and waiting for admin approval.
              Once approved, your next login will open the vendor dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[10px] bg-[#001B12] text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-inter text-[17px] font-semibold text-[#16231f]">
              Admin review required
            </h3>
            <p className="mt-2 max-w-2xl font-inter text-sm leading-6 text-[#68746e]">
              You can stay signed in while approval is pending. Dashboard tools
              remain locked until the admin changes your vendor account status
              to approved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
