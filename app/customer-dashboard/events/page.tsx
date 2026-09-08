"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  MapPin,
  Plus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import AvailabilityCalendar from "@/components/shared/availability";
import type { AvailabilityStatus } from "@/data/vendor-data";

type EventItem = {
  id: number;
  name: string;
  type: string;
  vendor: string;
  date: string;
  location: string;
  guests: string;
  budget: string;
  status: "Active" | "Inactive";
};

const initialEvents: EventItem[] = [
  {
    id: 1,
    name: "Sharma Wedding",
    type: "Wedding",
    vendor: "Royal Moments Photography",
    date: "2026-09-12",
    location: "Mayfair, London",
    guests: "180",
    budget: "24000",
    status: "Active",
  },
  {
    id: 2,
    name: "Engagement Celebration",
    type: "Engagement",
    vendor: "Prime Venue Collection",
    date: "2026-09-18",
    location: "Pearl Suite, Manchester",
    guests: "120",
    budget: "14500",
    status: "Active",
  },
  {
    id: 3,
    name: "Birthday Celebration",
    type: "Birthday",
    vendor: "DJ Infinity",
    date: "2026-10-02",
    location: "Private Residence, Bristol",
    guests: "75",
    budget: "6800",
    status: "Inactive",
  },
];

const vendorOptions = [
  "Royal Moments Photography",
  "Prime Venue Collection",
  "Signature Flavours Catering",
  "Golden Petals Events",
  "DJ Infinity",
];

const emptyEvent = {
  type: "",
  name: "",
  vendor: "",
  date: "",
  location: "",
  guests: "",
  budget: "",
};

export default function MyEventsPage() {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [visibleDate, setVisibleDate] = useState(new Date(2026, 8, 1));
  const [selectedDateKey, setSelectedDateKey] = useState("2026-09-12");
  const [calendarStatuses, setCalendarStatuses] = useState<
    Record<string, AvailabilityStatus>
  >({
    "2026-09-12": "booked",
    "2026-09-18": "pending",
    "2026-10-02": "unavailable",
  });

  const eventLabels = useMemo(
    () =>
      events.reduce<Record<string, string>>((labels, event) => {
        labels[event.date] = event.name;
        return labels;
      }, {}),
    [events],
  );

  const createEvent = () => {
    if (!eventForm.name || !eventForm.type || !eventForm.date) {
      return;
    }

    const nextEvent: EventItem = {
      id: Date.now(),
      name: eventForm.name,
      type: eventForm.type,
      vendor: eventForm.vendor || "Not selected",
      date: eventForm.date,
      location: eventForm.location || "Location pending",
      guests: eventForm.guests || "0",
      budget: eventForm.budget || "0",
      status: "Active",
    };

    setEvents((current) => [nextEvent, ...current]);
    setCalendarStatuses((current) => ({
      ...current,
      [eventForm.date]: "booked",
    }));
    setSelectedDateKey(eventForm.date);
    setVisibleDate(parseDateKey(eventForm.date));
    setEventForm(emptyEvent);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
              My Events
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Plan events, assign vendors, track dates, manage guests, and keep
              your estimated budget organized.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Event
          </button>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
          <div className="border-b border-[#edf1ee] px-5 py-4">
            <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
              Event Calendar
            </h3>
          </div>
          <AvailabilityCalendar
            year={visibleDate.getFullYear()}
            month={visibleDate.getMonth()}
            statusByDate={calendarStatuses}
            labelByDate={eventLabels}
            selectedDateKey={selectedDateKey}
            onSelectDate={setSelectedDateKey}
            onPrevMonth={() =>
              setVisibleDate(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
            onNextMonth={() =>
              setVisibleDate(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
          />
        </div>

        <div className="grid gap-5">
          {events.slice(0, 3).map((event) => (
            <article
              key={event.id}
              className="rounded-[14px] border border-[#dfe7e2] bg-white p-5 shadow-lg shadow-[#0D5B46]/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-inter text-[18px] font-semibold text-[#16231f]">
                    {event.name}
                  </h3>
                  <p className="mt-1 font-inter text-[14px] font-semibold text-[#C07C22]">
                    {event.type}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-inter text-xs font-semibold ${
                    event.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                <EventMeta icon={CalendarCheck2} value={formatDate(event.date)} />
                <EventMeta icon={MapPin} value={event.location} />
                <EventMeta icon={Users} value={`${event.guests} guests`} />
              </div>
              <Link
                href="/customer-dashboard/events/sharma-wedding"
                className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-[10px] border border-black px-4 font-inter text-[14px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
              >
                View Detail
              </Link>
            </article>
          ))}
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h3 className="font-inter text-[22px] font-semibold text-[#16231f]">
                Add Event
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]"
                aria-label="Close add event"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="What are you planning?"
                value={eventForm.type}
                onChange={(value) =>
                  setEventForm((current) => ({ ...current, type: value }))
                }
              />
              <FormInput
                label="Event Name"
                value={eventForm.name}
                onChange={(value) =>
                  setEventForm((current) => ({ ...current, name: value }))
                }
              />
              <label className="block">
                <span className="font-inter text-[13px] font-semibold text-[#16231f]">
                  Choose Vendor
                </span>
                <select
                  value={eventForm.vendor}
                  onChange={(event) =>
                    setEventForm((current) => ({
                      ...current,
                      vendor: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
                >
                  <option value="">Choose Vendor</option>
                  {vendorOptions.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </label>
              <FormInput
                label="Event Date"
                type="date"
                value={eventForm.date}
                onChange={(value) =>
                  setEventForm((current) => ({ ...current, date: value }))
                }
              />
              <FormInput
                label="Location"
                value={eventForm.location}
                onChange={(value) =>
                  setEventForm((current) => ({ ...current, location: value }))
                }
              />
              <FormInput
                label="Number of Guests"
                type="number"
                value={eventForm.guests}
                onChange={(value) =>
                  setEventForm((current) => ({ ...current, guests: value }))
                }
              />
              <FormInput
                label="Estimated Budget"
                type="number"
                value={eventForm.budget}
                onChange={(value) =>
                  setEventForm((current) => ({ ...current, budget: value }))
                }
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-[#0D5B46] px-5 py-2.5 font-inter text-sm font-medium text-[#0D5B46] transition-colors hover:bg-[#f5f7f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createEvent}
                className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EventMeta({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <div className="flex items-center gap-2 font-inter text-[14px] text-[#68746e]">
      <Icon className="h-4 w-4 text-[#0D5B46]" aria-hidden="true" />
      <span>{value}</span>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "date" | "number" | "text";
}) {
  return (
    <label className="block">
      <span className="font-inter text-[13px] font-semibold text-[#16231f]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none transition-colors focus:border-[#0D5B46]"
      />
    </label>
  );
}

function formatDate(dateKey: string) {
  return parseDateKey(dateKey).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

