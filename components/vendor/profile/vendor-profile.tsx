"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/shared/bread-crumbs";
import type {
  VendorProfile as VendorProfileData,
  VendorService,
} from "@/data/vendor-data";
import AboutTab from "./tabs/about-tab";
import AvailabilityTab from "./tabs/availability-tab";
import PackagesTab from "./tabs/packages-tab";
import PortfolioTab from "./tabs/portfolio-tab";
import ReviewsTab from "./tabs/review-tab";
import ServicesTab from "./tabs/service-tab";
import ContactVendorCard from "./contact-vendor";
import ServicesOfferedGrid from "./service-offered-grid";
import TabNav from "./service-tab-nav";
import type { VendorProfileTab } from "./service-tab-nav";
import VendorHeader from "./vendor-header";

type VendorProfileProps = {
  vendor: VendorProfileData;
};

export default function VendorProfile({ vendor }: VendorProfileProps) {
  const [activeTab, setActiveTab] = useState<VendorProfileTab>("About");

  const handleRequestQuote = (service?: VendorService) => {
    void service;
  };

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
      case "Packages":
        return <PackagesTab packages={vendor.packages} />;
      case "Portfolio":
        return <PortfolioTab images={vendor.portfolio} />;
      case "Reviews":
        return <ReviewsTab reviews={vendor.reviews} />;
      case "Availability":
        return <AvailabilityTab statusByDate={vendor.availability} />;
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
          onSaveVendor={() => {}}
          onShare={() => {}}
        />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
          <section className="overflow-hidden rounded-[10px] border border-brand-line bg-white">
            <TabNav activeTab={activeTab} onChange={setActiveTab} />
            {renderTabContent()}
          </section>

          <ContactVendorCard
            responseTime={vendor.responseTime}
            phone={vendor.phone}
            website={vendor.website}
            onRequestQuote={() => handleRequestQuote()}
            onSendMessage={() => {}}
          />
        </div>

        <ServicesOfferedGrid services={vendor.servicesOffered} />
      </div>
    </main>
  );
}
