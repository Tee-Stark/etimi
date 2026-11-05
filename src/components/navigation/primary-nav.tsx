"use client";

import { usePathname } from "next/navigation";
import { primaryNav } from "@/config/navigation";
import { NavList } from "./nav-list";

/** Desktop navigation (large screens). Mobile uses <MobileMenu />. */
export function PrimaryNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <NavList items={primaryNav} pathname={pathname} orientation="horizontal" />
    </nav>
  );
}

/** Suspense fallback: identical markup without the active marker. */
export function PrimaryNavFallback() {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <NavList items={primaryNav} pathname={null} orientation="horizontal" />
    </nav>
  );
}
