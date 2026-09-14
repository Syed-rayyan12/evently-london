"use client";

import { type FormEvent, useMemo, useState } from "react";
import Breadcrumbs from "@/components/shared/bread-crumbs";
import type {
  VendorProfile as VendorProfileData,
  VendorPackage,
  VendorService,
} from "@/data/vendor-data";
import { createCustomerEnquiry, saveVendorToShortlist } from "@/lib/customer";
import { getCustomerProfileSession } from "@/lib/customer-session";
import type { PublicVendorDetail } from "@/lib/public-vendors";
import ReviewFormSection from "./review-form-section";
import AboutTab from "./tabs/about-tab";
import AvailabilityTab from "./tabs/availability-tab";
import PortfolioTab from "./tabs/portfolio-tab";
import ReviewsTab from "./tabs/review-tab";
import ServicesTab from "./tabs/service-tab";
import TabNav from "./service-tab-nav";
import type { VendorProfileTab } from "./service-tab-nav";
import VendorHeader from "./vendor-header";

type VendorProfileProps = {
  vendor: VendorProfileData | PublicVendorDetail;
};

export default function VendorProfile({ vendor }: VendorProfileProps) {
  const [activeTab, setActiveTab] = useState<VendorProfileTab>("About");
  const [reviews, setReviews] = useState(vendor.reviews);
  const [quoteService, setQuoteService] = useState<VendorService | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [quoteEventType, setQuoteEventType] = useState("");
  const [quoteEventDate, setQuoteEventDate] = useState("");
  const [quoteGuestCount, setQuoteGuestCount] = useState("");
  const [quoteLocation, setQuoteLocation] = useState("");
  const [quoteNeeds, setQuoteNeeds] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const resetQuoteFields = () => {
    setQuoteEventType("");
    setQuoteEventDate("");
    setQuoteGuestCount("");
    setQuoteLocation("");
    setQuoteNeeds("");
  };

  const handleRequestQuote = (service?: VendorService) => {
    const packages = getQuotePackages(vendor, service);

    setQuoteService(service ?? null);
    setSelectedPackageId(packages[0]?.id ?? packages[0]?.name ?? "");
    resetQuoteFields();
    setStatusMessage("");
    setIsQuoteModalOpen(true);
  };

  const quotePackages = useMemo(
    () => getQuotePackages(vendor, quoteService ?? undefined),
    [quoteService, vendor]
  );

  const selectedPackage = quotePackages.find(
    (packageItem) => getPackageValue(packageItem) === selectedPackageId
  );

  async function handleSaveVendor() {
    const session = getCustomerProfileSession();

    if (!session?.token) {
      setStatusMessage("Please login as a customer before shortlisting this vendor.");
      return;
    }

    try {
      await saveVendorToShortlist(String(vendor.id), session);
      setIsSaved(true);
      setStatusMessage("Vendor saved to your shortlist.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save vendor.");
    }
  }

  async function handleSubmitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const session = getCustomerProfileSession();

    if (!session?.token) {
      setStatusMessage("Please login as a customer before requesting a quote.");
      return;
    }

    setIsSubmittingQuote(true);
    setStatusMessage("");

    try {
      const serviceLine = quoteService ? `Service: ${quoteService.title}` : `Vendor: ${vendor.name}`;
      const packageLine = selectedPackage ? `Package: ${selectedPackage.name}` : "Package: Custom quote";
      const enquiryMessage = [
        serviceLine,
        packageLine,
        `Event Type: ${formatQuoteValue(quoteEventType)}`,
        `Event Date: ${formatQuoteValue(quoteEventDate)}`,
        `Guest Count: ${formatQuoteValue(quoteGuestCount)}`,
        `Location: ${formatQuoteValue(quoteLocation)}`,
        `Requirements: ${formatQuoteValue(quoteNeeds)}`
      ].join("\n");

      await createCustomerEnquiry(
        {
          vendorId: String(vendor.id),
          packageId: selectedPackage?.id,
          packageName: selectedPackage?.name,
          message: enquiryMessage
        },
        session
      );
      setStatusMessage("Your enquiry was sent to the vendor.");
      setIsQuoteModalOpen(false);
      resetQuoteFields();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to send enquiry.");
    } finally {
      setIsSubmittingQuote(false);
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "About":
        return <AboutTab about={vendor.about} />;
      case "Services":
        return (
          <ServicesTab
            services={vendor.services}
            onRequestQuote={handleRequestQuote}
          />
        );
      case "Portfolio":
        return <PortfolioTab images={vendor.portfolio} />;
      case "Reviews":
        return (
          <ReviewsTab reviews={reviews} />
        );
      case "Availability":
        return (
          <AvailabilityTab
            statusByDate={vendor.availability}
            labelByDate={vendor.availabilityLabels}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="bg-[#F9F8F4] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-[90%] flex-col gap-5">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Vendors", href: "/vendor" },
            { label: `${vendor.name} Vendor Profile` },
          ]}
        />

        <VendorHeader
          vendor={vendor}
          onRequestQuote={() => handleRequestQuote()}
          onSaveVendor={handleSaveVendor}
          isSaved={isSaved}
        />

        {statusMessage ? (
          <div
            className="rounded-[10px] border border-brand-line bg-white px-4 py-3 font-inter text-sm font-semibold text-[#003224]"
            aria-live="polite"
          >
            {statusMessage}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-[10px] border border-brand-line bg-white">
          <TabNav activeTab={activeTab} onChange={setActiveTab} />
          {renderTabContent()}
        </section>

        <ReviewFormSection
          vendorId={String(vendor.id)}
          onReviewCreated={(review) =>
            setReviews((current) => [
              review,
              ...current.filter((item) => item.name !== review.name)
            ])
          }
        />
      </div>

      {isQuoteModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/45 px-4 py-6 sm:px-5 sm:py-8">
          <form
            onSubmit={handleSubmitQuote}
            className="my-auto flex max-h-[calc(100vh-3rem)] w-full max-w-xl flex-col overflow-hidden rounded-[12px] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-brand-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-pt-serif text-[28px] font-normal text-ink">
                  Request Quote
                </h2>
                <p className="mt-1 font-inter text-sm text-muted">
                  {quoteService ? quoteService.title : vendor.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-brand-line font-inter text-xl text-ink"
                aria-label="Close quote form"
              >
                x
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-4">
                <label className="block">
                  <span className="font-inter text-sm font-semibold text-ink">Package</span>
                  <select
                    value={selectedPackageId}
                    onChange={(event) => setSelectedPackageId(event.target.value)}
                    className="mt-2 h-12 w-full rounded-[8px] border border-brand-line bg-white px-3 font-inter text-sm text-ink outline-none focus:border-[#003224]"
                  >
                    {quotePackages.length ? (
                      quotePackages.map((packageItem) => (
                        <option key={getPackageValue(packageItem)} value={getPackageValue(packageItem)}>
                          {packageItem.name} - {packageItem.price}
                        </option>
                      ))
                    ) : (
                      <option value="">Custom quote</option>
                    )}
                  </select>
                </label>

                {selectedPackage ? (
                  <div className="rounded-[8px] bg-[#F9F8F4] p-3">
                    <p className="font-inter text-sm font-semibold text-[#003224]">
                      {selectedPackage.price}
                    </p>
                    <p className="mt-1 font-inter text-sm leading-6 text-muted">
                      {selectedPackage.description || "Package details available on request."}
                    </p>
                  </div>
                ) : null}

                <label className="block">
                  <span className="font-inter text-sm font-semibold text-ink">
                    Event Type
                  </span>
                  <input
                    type="text"
                    value={quoteEventType}
                    onChange={(event) => setQuoteEventType(event.target.value)}
                    placeholder="Wedding, birthday, corporate event"
                    className="mt-2 h-12 w-full rounded-[8px] border border-brand-line px-3 font-inter text-sm text-ink outline-none focus:border-[#003224]"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-inter text-sm font-semibold text-ink">
                      Event Date
                    </span>
                    <input
                      type="date"
                      value={quoteEventDate}
                      onChange={(event) => setQuoteEventDate(event.target.value)}
                      className="mt-2 h-12 w-full rounded-[8px] border border-brand-line px-3 font-inter text-sm text-ink outline-none focus:border-[#003224]"
                    />
                  </label>

                  <label className="block">
                    <span className="font-inter text-sm font-semibold text-ink">
                      Guest Count
                    </span>
                    <input
                      type="text"
                      value={quoteGuestCount}
                      onChange={(event) => setQuoteGuestCount(event.target.value)}
                      placeholder="Example: 150 guests"
                      className="mt-2 h-12 w-full rounded-[8px] border border-brand-line px-3 font-inter text-sm text-ink outline-none focus:border-[#003224]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-inter text-sm font-semibold text-ink">
                    Location
                  </span>
                  <input
                    type="text"
                    value={quoteLocation}
                    onChange={(event) => setQuoteLocation(event.target.value)}
                    placeholder="Event city or venue"
                    className="mt-2 h-12 w-full rounded-[8px] border border-brand-line px-3 font-inter text-sm text-ink outline-none focus:border-[#003224]"
                  />
                </label>

                <label className="block">
                  <span className="font-inter text-sm font-semibold text-ink">
                    What do you need?
                  </span>
                  <textarea
                    value={quoteNeeds}
                    onChange={(event) => setQuoteNeeds(event.target.value)}
                    minLength={3}
                    required
                    rows={4}
                    placeholder="Tell the vendor what you want included."
                    className="mt-2 w-full resize-none rounded-[8px] border border-brand-line px-3 py-3 font-inter text-sm text-ink outline-none focus:border-[#003224]"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-brand-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="rounded-[8px] border border-brand-line px-5 py-2.5 font-inter text-sm font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingQuote}
                className="rounded-[8px] bg-[#003224] px-5 py-2.5 font-inter text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingQuote ? "Sending..." : "Send Enquiry"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}

function formatQuoteValue(value: string) {
  return value.trim().replace(/\s+/g, " ") || "Not provided";
}

function getQuotePackages(
  vendor: VendorProfileData | PublicVendorDetail,
  service?: VendorService
): VendorPackage[] {
  if (service?.packages?.length) {
    return service.packages;
  }

  if (service?.id) {
    const packagesForService = vendor.packages.filter(
      (packageItem) => packageItem.serviceId === service.id
    );

    if (packagesForService.length) {
      return packagesForService;
    }
  }

  return vendor.packages;
}

function getPackageValue(packageItem: VendorPackage) {
  return packageItem.id ?? packageItem.name;
}
