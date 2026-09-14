export default function VendorProfileLoading() {
  return (
    <main className="bg-[#F9F8F4] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-[90%] animate-pulse flex-col gap-5">
        <div className="h-5 w-64 rounded bg-neutral-200" />

        <section className="flex flex-col overflow-hidden rounded-[10px] border border-brand-line bg-white">
          <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
            <div className="min-h-[280px] rounded-[8px] bg-neutral-200 lg:min-h-[360px] lg:w-[46%]" />
            <div className="flex flex-1 flex-col justify-center space-y-4 py-2">
              <div className="h-5 w-36 rounded bg-neutral-200" />
              <div className="h-12 w-3/4 rounded bg-neutral-200" />
              <div className="h-5 w-full rounded bg-neutral-200" />
              <div className="h-5 w-5/6 rounded bg-neutral-200" />
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-[8px] bg-neutral-200" />
                <div className="h-11 w-11 rounded-[8px] bg-neutral-200" />
                <div className="h-11 w-36 rounded-[8px] bg-neutral-200" />
              </div>
            </div>
          </div>

          <div className="border-t border-brand-line p-4 lg:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] rounded-[8px] bg-neutral-200"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
