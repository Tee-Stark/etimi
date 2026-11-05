type ExternalEmbedProps = {
  url: string;
  title: string;
  /** iframe sandbox tokens from content (never allow-scripts + allow-same-origin together). */
  sandbox: string;
};

/*
 * An external interactive companion, embedded only when its content entry
 * marks it public. Lazy-loaded, sandboxed, no referrer, fixed aspect ratio
 * (no layout shift), with an always-visible fallback link so the page is
 * complete if the frame is blocked.
 */
export function ExternalEmbed({ url, title, sandbox }: ExternalEmbedProps) {
  return (
    <figure>
      <div className="relative aspect-[4/3] w-full border border-border bg-surface sm:aspect-video">
        <iframe
          src={url}
          title={title}
          loading="lazy"
          sandbox={sandbox}
          referrerPolicy="no-referrer"
          allow=""
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <figcaption className="annot mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-muted-foreground">
        <span>{title}: an external interactive companion to this page.</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="link">
          Open in a new tab<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
