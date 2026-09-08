import Link from "next/link";

const fields = [
  ["Business Name", "Royal Moments Photography"],
  ["Category", "Photography"],
  ["Location", "London, UK"],
  ["Phone", "+44 7700 100103"],
  ["Email", "hello@royalmoments.example.com"],
  ["Website", "royalmoments.example.com"],
];

export default function EditProfilePage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
          Edit Profile
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          Update the business information customers see on your vendor profile.
        </p>
      </section>

      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <form className="grid gap-5 md:grid-cols-2">
          {fields.map(([label, value]) => (
            <label key={label} className="block">
              <span className="font-inter text-sm font-medium text-[#16231f]">
                {label}
              </span>
              <input
                defaultValue={value}
                className="mt-2 h-12 w-full rounded-[10px] border border-[#0D5B46] px-4 font-inter text-sm text-[#16231f] outline-none"
              />
            </label>
          ))}
          <label className="block md:col-span-2">
            <span className="font-inter text-sm font-medium text-[#16231f]">
              About Vendor
            </span>
            <textarea
              defaultValue="Royal Moments Photography creates timeless wedding, engagement, and family celebration coverage with a calm documentary approach."
              className="mt-2 min-h-36 w-full resize-none rounded-[10px] border border-[#0D5B46] px-4 py-3 font-inter text-sm leading-6 text-[#16231f] outline-none"
            />
          </label>
          <div className="flex justify-end gap-3 md:col-span-2">
            <Link
              href="/vendor-dashboard/profile"
              className="rounded-md border border-[#dfe7e2] px-5 py-3 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-[#0D5B46] px-5 py-3 font-inter text-sm font-medium text-white hover:bg-[#001B12]"
            >
              Save Profile
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
