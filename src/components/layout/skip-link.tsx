/** First focusable element on every page; visible only when focused. */
export function SkipLink() {
  return (
    <a
      href="#content"
      className="meta sr-only z-50 bg-foreground px-4 py-3 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  );
}
