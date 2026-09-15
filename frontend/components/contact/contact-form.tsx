"use client";

import Image from "next/image";
import { useState } from "react";

export default function SendMessageForm() {
  const [eventType, setEventType] = useState("");

  return (
    <section className="bg-[#F9F8F4] py-10">
      <div className="mx-auto grid max-w-[87%] grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form card */}
        <div className="rounded-md border border-[#1F3D34] bg-white p-8">
          <h2 className="mb-1 text-[40px] font-normal font-pt-serif text-[#1f1c17]">
           Get In Touch With Us
          </h2>
          <p className="mb-6 text-sm text-[#6b6459]">
         Reach out and our team will respond with warmth and genuine attention.
          </p>

          <form className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[16px] font-normal font-inter  text-[#1f1c17]">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full rounded-md border border-[#E4DCC9]  px-3 py-2 text-sm placeholder:text-[#a39d8f] focus:outline-none focus:ring-1 focus:ring-[#1F3D34]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[16px] font-normal font-inter  text-[#1f1c17]">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full rounded-md border border-[#E4DCC9]  px-3 py-2 text-sm placeholder:text-[#a39d8f] focus:outline-none focus:ring-1 focus:ring-[#1F3D34]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[16px] font-normal font-inter  text-[#1f1c17]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full rounded-md border border-[#E4DCC9]  px-3 py-2 text-sm placeholder:text-[#a39d8f] focus:outline-none focus:ring-1 focus:ring-[#1F3D34]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[16px] font-normal font-inter  text-[#1f1c17]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter Your Phone Number"
                  className="w-full rounded-md border border-[#E4DCC9]  px-3 py-2 text-sm placeholder:text-[#a39d8f] focus:outline-none focus:ring-1 focus:ring-[#1F3D34]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[16px] font-normal font-inter  text-[#1f1c17]">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full rounded-md border border-[#E4DCC9]  px-3 py-2 text-sm text-[#a39d8f] focus:outline-none focus:ring-1 focus:ring-[#1F3D34]"
              >
                <option value="">Select Event</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="birthday">Birthday</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[16px] font-normal font-inter  text-[#1f1c17]">
                Event Date
              </label>
              <input
                type="text"
                placeholder="Dates"
                className="w-full rounded-md border border-[#E4DCC9]  px-3 py-2 text-sm placeholder:text-[#a39d8f] focus:outline-none focus:ring-1 focus:ring-[#1F3D34]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[16px] font-normal font-inter  text-[#1f1c17]">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell Us About Your Requirements..."
                className="w-full resize-none rounded-md border border-[#E4DCC9] bg-[#FBF9F4] px-3 py-2 text-sm placeholder:text-[#a39d8f] focus:outline-none focus:ring-1 focus:ring-[#1F3D34]"
              />
            </div>

            <button
              type="submit"
              className="btn-slide group w-full rounded-md bg-[#003224] py-3 text-[16px] font-normal text-white"
            >
              <span className="btn-slide-overlay btn-slide-overlay-gold" />
              <span className="btn-slide-label">Send Message</span>
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="relative min-h-[420px] overflow-hidden rounded-md">
          <Image
            src="/images/contact-image.png"
            alt="Couple enjoying a toast at an outdoor cafe"
            fill
            sizes="(min-width: 1024px) 44vw, 87vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
