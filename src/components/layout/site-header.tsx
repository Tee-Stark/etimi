import Link from "next/link";
import { Suspense } from "react";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { PrimaryNav, PrimaryNavFallback } from "@/components/navigation/primary-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Container } from "./container";

type SiteHeaderProps = { name: string };

/** Not sticky: the header scrolls away and never eats mobile viewport height. */
export function SiteHeader({ name }: SiteHeaderProps) {
  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center gap-x-4 py-3 sm:py-4">
        <Link
          href="/"
          className="mr-auto inline-flex min-h-11 items-center font-serif text-[1.1875rem] leading-none tracking-tight"
        >
          {name}
        </Link>
        <Suspense fallback={<PrimaryNavFallback />}>
          <PrimaryNav />
        </Suspense>
        <ThemeToggle className="-mr-2 lg:mr-0" />
        <Suspense fallback={null}>
          <MobileMenu />
        </Suspense>
      </Container>
    </header>
  );
}
