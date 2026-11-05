import Link from "next/link";
import type { ReactNode } from "react";
import { cn, isExternalHref } from "@/lib/utils";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Open external links in a new tab (adds safe rel and an announcement). */
  newTab?: boolean;
};

/**
 * Inline text link. Internal hrefs use next/link; external ones get
 * rel="noopener noreferrer" when opened in a new tab.
 */
export function TextLink({ href, children, className, newTab = false }: TextLinkProps) {
  const classes = cn("link", className);

  if (isExternalHref(href) || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
