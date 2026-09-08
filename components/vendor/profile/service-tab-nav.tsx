import React from "react";

const TABS = [
  "About",
  "Services",
  "Packages",
  "Portfolio",
  "Reviews",
  "Availability",
] as const;

export type VendorProfileTab = (typeof TABS)[number];

type TabNavProps = {
  activeTab: VendorProfileTab;
  onChange: (tab: VendorProfileTab) => void;
};

/**
 * TabNav
 * The horizontal tab strip. Purely UI — the parent owns which tab is
 * active and what content renders for it.
 *
 * Props:
 * - activeTab: string   one of TABS
 * - onChange: (tab: string) => void
 */
export default function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <div className="flex justify-between gap-6 border-b border-black/10 px-5 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`relative py-3 font-inter text-[20px] font-medium whitespace-nowrap transition-colors ${
              isActive ? "text-[#003224]" : "text-gray-500 hover:text-[#003224]"
            }`}
          >
            {tab}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-1 bg-[#003224] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { TABS };
