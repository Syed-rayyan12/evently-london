import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Vendors", href: "/vendor" },
  { label: "Celebrations", href: "/celebration" },
  { label: "Inspiration", href: "/inspiration" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Blogs", href: "/blog" },
  // { label: "Contact", href: "/contact" },
];

type WebsiteHeaderProps = {
  overlay?: boolean;
};

export function WebsiteHeader({ overlay = false }: WebsiteHeaderProps) {
  const headerClassName = overlay
    ? "absolute left-0 top-0 z-30 w-full   text-white "
    : "sticky top-0 z-30 border-b border-brand-line bg-site/95 text-ink backdrop-blur";
  const navClassName = overlay
    ? "order-3 col-span-2 flex items-center justify-center gap-1 overflow-x-auto whitespace-nowrap pt-1 font-inter text-[18px] font-normal text-white/82 lg:order-none lg:col-span-1 lg:pt-0"
    : "order-3 col-span-2 flex items-center justify-center gap-1 overflow-x-auto whitespace-nowrap pt-1 font-inter text-[18px] font-normal text-muted lg:order-none lg:col-span-1 lg:pt-0";
  const navLinkClassName = overlay
    ? "relative px-3 py-2 transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-gold after:transition-transform after:duration-300 after:ease-out hover:text-white hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold focus-visible:after:scale-x-100"
    : "relative px-3 py-2 transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-gold after:transition-transform after:duration-300 after:ease-out hover:text-ink hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold focus-visible:after:scale-x-100";
  const loginClassName = overlay
    ? "btn-slide group h-11 rounded-[10px] border border-brand-gold px-10 font-inter text-[16px] font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
    : "btn-slide group h-11 rounded-md border border-gold px-5 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold";

  return (
    <header className={headerClassName}>
      <div className="mx-auto grid min-h-24 w-full max-w-7xl grid-cols-[auto_1fr] items-center gap-5 px-5 py-4 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Evently home">
          <Image
            src="/images/site-logo.png"
            alt="Evently"
            width={152}
            height={104}
            priority
            className="h-24 w-auto object-contain"
          />
        </Link>

        <nav
          className={navClassName}
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={navLinkClassName}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="justify-self-end flex items-center gap-2">
          <Link
            href="/login"
            className={loginClassName}
          >
            <span className="btn-slide-overlay btn-slide-overlay-gold" />
            <span className="btn-slide-label transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink">
              Login
            </span>
          </Link>
          <Link
            href="/signup"
            className="btn-slide group h-11 rounded-[10px] bg-gold px-10 font-inter text-[16px] font-normal text-white"
          >
            <span className="btn-slide-overlay btn-slide-overlay-green" />
            <span className="btn-slide-label">Sign up</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
