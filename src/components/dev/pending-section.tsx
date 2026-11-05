import { Container } from "@/components/layout/container";

type PendingSectionProps = {
  title: string;
  note: string;
};

/**
 * Development-only marker for a section that later phases will populate.
 * Renders nothing in production builds, so it can never ship.
 */
export function PendingSection({ title, note }: PendingSectionProps) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <Container>
      <div className="my-6 border border-dashed border-border px-5 py-4">
        <p className="meta text-accent">Development · section pending</p>
        <p className="mt-1 text-small">
          <span className="font-medium">{title}</span>
          <span className="text-muted-foreground"> — {note}</span>
        </p>
      </div>
    </Container>
  );
}
