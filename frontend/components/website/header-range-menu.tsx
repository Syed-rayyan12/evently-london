"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WebsiteAuthActions } from "./website-auth-actions";

type HeaderRangeMenuProps = {
  links: Array<{
    label: string;
    href: string;
  }>;
  overlay?: boolean;
};

export function HeaderRangeMenu({ links, overlay = false }: HeaderRangeMenuProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false)

   const closeMenu = () => {
      setClosing(true);

      setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 220);
    };

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

   

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const buttonClassName = overlay
    ? "desktop-range-menu-button text-white hover:border-brand-gold hover:text-gold"
    : "desktop-range-menu-button text-ink hover:border-brand-gold hover:text-gold";

  return (
    <div className="desktop-range-menu justify-self-end">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        className={buttonClassName}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm"
          style={{ animation: "menuFadeIn 180ms ease-out forwards" }}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <aside
            className="mr-auto flex h-full w-full max-w-sm flex-col bg-[#001B12] px-7 py-6 text-white shadow-2xl"
            style={{
      animation: closing
        ? "menuSlideToLeft 220ms ease-in forwards"
        : "menuSlideFromLeft 240ms ease-out forwards",
    }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <span className="font-pt-serif text-2xl font-bold">Menu</span>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="grid h-10 w-10 place-items-center rounded-md border border-white/25 text-white transition hover:border-
    brand-gold hover:text-gold"
                onClick={closeMenu}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 py-6" aria-label="Drawer navigation">
              {links.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-md px-1 py-3 font-inter text-lg text-white/82 transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold ${index < 4 ? "desktop-range-sheet-hidden-link" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/15 pt-6 ">
              <WebsiteAuthActions
                loginClassName="btn-slide group h-11 w-full rounded-[10px] border border-brand-gold px-8 font-inter text-[16px] font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
                signupClassName="btn-slide group  h-11 w-full rounded-[10px] bg-gold px-8 font-inter text-[16px] font-normal text-white"
              />
            </div>
          </aside>
           <style jsx global>{`
    @keyframes menuSlideFromLeft {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(0);
      }
    }

    @keyframes menuSlideToLeft {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(-100%);
      }
    }
  `}</style>

        </div>
      ) : null}
    </div>
  );
}
