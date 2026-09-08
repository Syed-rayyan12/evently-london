import { Clock, Mail, MapPin, Phone } from "lucide-react";

const CONTACT_ITEMS = [
  {
    title: "Phone",
    value: "+44 20 7946 0821",
    
    icon: Phone,
  },
  {
    title: "Email",
    value: "hello@eventlylondon.com",
  
    icon: Mail,
  },
  {
    title: "Address",
    value: "London, United Kingdom",
  
    icon: MapPin,
  },
  {
    title: "Hours",
    value: "Monday–Saturday: 9am–6pm",
    
    icon: Clock,
  },
];

export function ContactCards() {
  return (
    <section className="relative w-full bg-[#F9F8F4]  py-10">
      <div className="mx-auto max-w-[87%]">
        {/* <div className="text-center">
          <p className="font-inter text-[16px] font-medium capitalize tracking-widest text-gold">
            Get In Touch
          </p>
          <h2 className="mt-0 font-pt-serif text-[44px] font-normal text-neutral-900">
            We&apos;re Here To Help
          </h2>
        </div> */}

        <div className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_ITEMS.map(({ title, value, icon: Icon }) => (
            <article
              key={title}
              className="rounded-[10px] border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#173d33] text-white">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-pt-serif text-[24px] font-normal text-neutral-900">
                {title}
              </h3>
              <p className="mt-2 font-inter text-[16px] font-normal leading-6 text-neutral-800">
                {value}
              </p>
              {/* <p className="mt-2 font-inter text-[14px] font-normal leading-relaxed text-neutral-500">
                {detail}
              </p> */}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
