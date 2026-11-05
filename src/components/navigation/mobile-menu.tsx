"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { NavList } from "./nav-list";

/**
 * Compact menu for small and medium screens. The panel wraps onto its own row
 * inside the header, in normal document flow (no overlay, so nothing is
 * obscured and no focus trap is needed). Escape
 * closes it and returns focus to the button. Without JavaScript the footer
 * navigation provides the same links.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="contents lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="meta inline-flex min-h-11 items-center gap-2 px-2 text-foreground hover:text-accent"
      >
        <span>{open ? "Close" : "Menu"}</span>
        <span aria-hidden="true" className="relative block size-3.5">
          <span
            className={cn(
              "absolute left-0 h-[1.5px] w-3.5 bg-current transition-[rotate,top] duration-200 ease-out-quiet",
              open ? "top-[6.25px] rotate-45" : "top-[3px]",
            )}
          />
          <span
            className={cn(
              "absolute left-0 h-[1.5px] w-3.5 bg-current transition-[rotate,top] duration-200 ease-out-quiet",
              open ? "top-[6.25px] -rotate-45" : "top-[9.5px]",
            )}
          />
        </span>
      </button>

      <nav
        id={panelId}
        aria-label="Primary"
        hidden={!open}
        className="order-last basis-full border-t border-border pt-1 pb-6"
      >
        <div>
          <NavList
            items={primaryNav}
            pathname={pathname}
            orientation="vertical"
            onNavigate={() => setOpen(false)}
          />
        </div>
      </nav>
    </div>
  );
}
