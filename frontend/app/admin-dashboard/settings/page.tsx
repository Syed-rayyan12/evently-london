import {
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

const accountFields = [
  { label: "Full Name", value: "Admin User", icon: UserRound },
  { label: "Email Address", value: "admin@evently.com", icon: Mail },
  { label: "Phone Number", value: "+44 7700 900321", icon: Phone },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
          Account Setting
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Manage your admin account information, password security, and account
          access.
        </p>
      </section>

      <section className="grid gap-7 xl:grid-cols-2">
        <div className="rounded-[14px] bg-white  shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center gap-3 border-b border-[#edf1ee] pb-4 pt-4 px-4">
           
            <h3 className="font-inter text-[18px] font-semibold text-black">
              Account Setting
            </h3>
          </div>

          <form className="mt-6 grid gap-4 px-4">
            {accountFields.map((field) => (
              <label key={field.label} className="block">
                <span className="font-inter text-[13px] font-semibold text-black">
                  {field.label}
                </span>
                <input
                  defaultValue={field.value}
                  className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] font-medium text-black outline-none transition-colors focus:border-[#0D5B46]"
                />
              </label>
            ))}
            <button
              type="button"
              className="mt-2 inline-flex min-h-11 w-fit items-center justify-center rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
            >
              Save Changes
            </button>
          </form>
        </div>

        <div className="rounded-[14px] bg-white  shadow-xl shadow-[#0D5B46]/10">
          <div className="flex items-center gap-3 border-b border-[#edf1ee] pb-4 pt-4  px-4">
           
            <h3 className="font-inter text-[18px] font-semibold text-black">
              Change Password
            </h3>
          </div>

          <form className="mt-6 grid gap-4 px-4 pb-4">
            {["Current Password", "New Password", "Confirm Password"].map(
              (label) => (
                <label key={label} className="block">
                  <span className="font-inter text-[13px] font-semibold text-black">
                    {label}
                  </span>
                  <input
                    type="password"
                    className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] font-medium text-black outline-none transition-colors focus:border-[#0D5B46]"
                  />
                </label>
              ),
            )}
            <button
              type="button"
              className="mt-2 inline-flex min-h-11 w-fit items-center justify-center rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
            >
              Change Password
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-6 shadow-xl shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
                Delete Account
              </h3>
              <p className="max-w-3xl font-inter text-[14px] leading-6 text-[#68746e]">
                Permanently delete this admin account, saved vendors, events,
                enquiries, bookings, and dashboard history.
              </p>
              <button
                type="button"
                className="inline-flex min-h-11 w-40 items-center justify-center rounded-[10px] bg-[#b42318] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#8f1d14]"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
