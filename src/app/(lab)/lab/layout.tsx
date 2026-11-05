import { notFound } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/*
 * TEMPORARY design lab: three homepage compositions for comparison.
 * Development only; removed once a direction is selected.
 */
export default function LabLayout({ children }: LayoutProps<"/lab">) {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <div className="label flex flex-wrap items-center gap-4 border-b border-border px-5 py-2 text-muted-foreground">
        <span className="text-accent">Design lab — development only</span>
        <Link href="/lab/a" className="link">A · Simplex</Link>
        <Link href="/lab/b" className="link">B · Manuscript</Link>
        <Link href="/lab/c" className="link">C · Decomposition</Link>
        <ThemeToggle className="ml-auto" />
      </div>
      <main id="content">{children}</main>
    </>
  );
}
