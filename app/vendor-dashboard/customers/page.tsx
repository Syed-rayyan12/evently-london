const customers = [
  { name: "Ayesha Khan", event: "Wedding", status: "Active" },
  { name: "Hamza Malik", event: "Engagement", status: "Pending" },
  { name: "Sara Ahmed", event: "Baby Shower", status: "Active" },
  { name: "Bilal Raza", event: "Birthday", status: "Review" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <h2 className="[font-family:var(--font-playfair)] text-[42px] font-semibold leading-tight text-[#16231f]">
          Customers
        </h2>
        <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
          View customer records, event interest, and current planning status.
        </p>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {["Customer", "Event", "Status"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.14em] text-[#68746e]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.name}>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] font-medium text-[#16231f]">
                    {customer.name}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4 font-inter text-[15px] text-[#68746e]">
                    {customer.event}
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-4">
                    <span className="rounded-full bg-[#0D5B46]/10 px-3 py-1 font-inter text-[13px] font-medium text-[#0D5B46]">
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
