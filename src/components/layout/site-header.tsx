import Link from "next/link";
import { Suspense } from "react";
import { Mark } from "@/components/brand/mark";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { PrimaryNav, PrimaryNavFallback } from "@/components/navigation/primary-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Container } from "./container";

type SiteHeaderProps = { name: string };

/** Not sticky: the header scrolls away and never eats mobile viewport height. */
export function SiteHeader({ name }: SiteHeaderProps) {
  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center gap-x-1 py-2 sm:gap-x-3">
        <Link href="/" className="group mr-auto inline-flex min-h-11 items-center gap-2 text-small font-medium tracking-tight sm:gap-2.5">
          <Mark className="h-3.5 text-foreground transition-colors duration-150 group-hover:text-accent" />
          {name}
        </Link>
        <Suspense fallback={<PrimaryNavFallback />}>
          <PrimaryNav />
        </Suspense>
        <ThemeToggle className="lg:ml-3" />
        <Suspense fallback={null}>
          <MobileMenu />
        </Suspense>
      </Container>
    </header>
  );
}
