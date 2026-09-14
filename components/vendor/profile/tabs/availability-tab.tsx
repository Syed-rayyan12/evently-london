"use client";

import { useState } from "react";
import AvailabilityCalendar from "@/components/shared/availability";
import type { AvailabilityStatus } from "@/data/vendor-data";

type AvailabilityTabProps = {
  statusByDate: Record<string, AvailabilityStatus>;
  labelByDate?: Record<string, string>;
};

export default function AvailabilityTab({ statusByDate, labelByDate = {} }: AvailabilityTabProps) {
  const [visibleDate, setVisibleDate] = useState(new Date(2026, 8, 1));

  const goToPreviousMonth = () => {
    setVisibleDate(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setVisibleDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  };

  return (
    <div className="p-6">
     
      <div className="rounded-[8px] border border-brand-line bg-white">
        <AvailabilityCalendar
          year={visibleDate.getFullYear()}
          month={visibleDate.getMonth()}
          statusByDate={statusByDate}
          labelByDate={labelByDate}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
      </div>
    </div>
  );
}
