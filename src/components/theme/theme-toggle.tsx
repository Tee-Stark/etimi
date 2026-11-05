"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "./theme-script";

type Theme = "light" | "dark";

/** Dark is the default identity; light only when explicitly chosen. */
function resolveTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getServerSnapshot = (): Theme | null => null;

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, resolveTheme, getServerSnapshot);

  // React's dev-only Strict Mode remount resets <html> attributes; re-apply the
  // stored choice. A no-op in production, where the inline script already ran.
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") document.documentElement.setAttribute("data-theme", stored);
    } catch {
      // Storage unavailable: keep the default.
    }
  }, []);

  function toggle() {
    const next: Theme = resolveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the choice lasts for this page view.
    }
  }

  const label =
    theme === null ? "Toggle colour theme" : theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "label inline-flex min-h-11 items-center gap-2 px-2 text-muted-foreground transition-colors duration-150 hover:text-foreground",
        className,
      )}
    >
      {/* Two-state indicator: filled square marks the active mode. */}
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <span className={cn("size-2 border border-current", theme !== "light" && "bg-current")} />
        <span className={cn("size-2 border border-current", theme === "light" && "bg-current")} />
      </span>
      <span aria-hidden="true" className="hidden sm:inline">
        {theme === "light" ? "Paper" : "Dark"}
      </span>
    </button>
  );
}
