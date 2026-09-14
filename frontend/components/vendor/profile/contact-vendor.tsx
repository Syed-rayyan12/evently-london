import { Globe, Mail, Phone } from "lucide-react";

type ContactVendorCardProps = {
  responseTime: string;
  phone: string;
  website: string;
  onRequestQuote?: () => void;
  onSendMessage?: () => void;
};

export default function ContactVendorCard({
  responseTime,
  phone,
  website,
  onRequestQuote,
  onSendMessage,
}: ContactVendorCardProps) {
  return (
    <aside className="rounded-[10px] border border-brand-line bg-white p-5">
      <h3 className="font-pt-serif text-[24px] font-normal text-ink">
        Contact Vendor
      </h3>
      <p className="mt-2 font-inter text-[14px] leading-6 text-muted">
        {responseTime}
      </p>

      <div className="mt-5 space-y-3 font-inter text-[14px] text-ink">
        <a href={`tel:${phone}`} className="flex items-center gap-3">
          <Phone size={17} className="text-[#D79D42]" />
          {phone}
        </a>
        <a
          href={`https://${website}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3"
        >
          <Globe size={17} className="text-[#D79D42]" />
          {website}
        </a>
      </div>

      <div className="mt-6 space-y-3">
        {/* <button
          type="button"
          onClick={onRequestQuote}
          className="btn-slide group w-full rounded-[8px] bg-[#003224] px-5 py-3 font-inter text-[15px] font-medium text-white"
        >
          <span className="btn-slide-overlay btn-slide-overlay-gold" />
          <span className="btn-slide-label">Request Quote</span>
        </button> */}
        <button
          type="button"
          onClick={onSendMessage}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-brand-line px-5 py-3 font-inter text-[15px] font-medium text-ink transition-colors hover:border-[#003224] hover:text-[#003224]"
        >
          <Mail size={17} />
          Send Message
        </button>
      </div>
    </aside>
  );
}
