import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AvailabilityStatus } from "@/data/vendor-data";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_STYLES: Record<AvailabilityStatus, string> = {
  available: "bg-emerald-50 text-emerald-700",
  booked: "bg-rose-50 text-rose-700",
  pending: "bg-amber-50 text-amber-700",
  unavailable: "bg-gray-100 text-gray-500",
};

type AvailabilityCalendarProps = {
  year: number;
  month: number;
  statusByDate?: Record<string, AvailabilityStatus>;
  labelByDate?: Record<string, string>;
  selectedDateKey?: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onSelectDate?: (dateKey: string) => void;
};

type CalendarDay = {
  date: number;
  inCurrentMonth: boolean;
  key: string;
};

/**
 * AvailabilityCalendar
 * Renders a month grid where each date can carry a status
 * ("available" | "booked" | "pending"). Pure date math — no external
 * calendar library required.
 *
 * Props:
 * - year: number
 * - month: number            0-indexed (0 = January)
 * - statusByDate?: Record<string, "available" | "booked" | "pending">
 *     key format: "YYYY-MM-DD"
 * - onPrevMonth?: () => void
 * - onNextMonth?: () => void
 */
export default function AvailabilityCalendar({
  year,
  month,
  statusByDate = {},
  labelByDate = {},
  selectedDateKey,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const monthLabel = useMemo(
    () =>
      new Date(year, month, 1).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }),
    [year, month]
  );

  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  return (
    <div className="p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-inter text-[22px] font-semibold text-[#003224]">
          {monthLabel}
        </h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[#003224] hover:bg-[#003224] hover:text-white transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[#003224] hover:bg-[#003224] hover:text-white transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center font-sans text-xs font-medium text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map(({ date, inCurrentMonth, key }) => {
          const status = statusByDate[key];
          const label = labelByDate[key];
          const isSelected = selectedDateKey === key;

          return (
            <button
              type="button"
              key={key}
              onClick={() => onSelectDate?.(key)}
              className={`aspect-square flex flex-col items-center justify-center overflow-hidden rounded-lg px-1 font-sans text-sm transition-colors hover:bg-[#003224] hover:text-white ${
                inCurrentMonth ? "text-[#003224]" : "text-gray-300"
              } ${status ? STATUS_STYLES[status] : ""} ${
                isSelected ? "ring-2 ring-[#003224] ring-offset-2" : ""
              }`}
              aria-pressed={isSelected}
            >
              <span>{date}</span>
              {label ? (
                <span className="mt-0.5 w-full truncate text-center text-[10px] font-semibold leading-tight">
                  {label}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        <LegendDot color="bg-emerald-50" label="Available" />
        <LegendDot color="bg-amber-50" label="Pending" />
        <LegendDot color="bg-rose-50" label="Booked" />
        <LegendDot color="bg-gray-100" label="Unavailable" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-full ${color} border border-[var(--color-border)]`} />
      <span className="font-sans text-xs text-gray-500">{label}</span>
    </div>
  );
}

// Builds a 6-week grid (Mon-start) including the trailing/leading days
// from adjacent months, the way most calendar UIs render.
function buildMonthGrid(year: number, month: number): CalendarDay[][] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // convert Sun=0 -> Mon=0
  const gridStart = new Date(year, month, 1 - startOffset);

  const weeks: CalendarDay[][] = [];
  const cursor = new Date(gridStart);

  for (let w = 0; w < 6; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: cursor.getDate(),
        inCurrentMonth: cursor.getMonth() === month,
        key: formatDateKey(cursor),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
