"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "./theme-script";

type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

/** The theme actually in effect: explicit choice, else system preference. */
function resolveTheme(): Theme {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

/** Unknown on the server; resolved on the client after hydration. */
const getServerSnapshot = (): Theme | null => null;

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, resolveTheme, getServerSnapshot);

  // React's dev-only Strict Mode remount resets <html> attributes; re-apply the
  // stored choice. A no-op in production, where the inline script already ran.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored) document.documentElement.setAttribute("data-theme", stored);
  }, []);

  function toggle() {
    const next: Theme = resolveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode, disabled): the choice lasts for this page view.
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
        "inline-flex size-11 items-center justify-center text-foreground transition-colors duration-150 hover:text-accent",
        className,
      )}
    >
      {/* Half-filled disc: one symbol for both states, rotated in dark mode. */}
      <svg
        viewBox="0 0 20 20"
        width="18"
        height="18"
        aria-hidden="true"
        className={cn("transition-transform duration-300 ease-out-quiet", theme === "dark" && "rotate-180")}
      >
        <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 1.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
