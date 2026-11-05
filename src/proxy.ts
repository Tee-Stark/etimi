import { NextResponse, type NextRequest } from "next/server";
import manifest from "@/generated/route-manifest.json";
import { isUnknownDetailPath } from "@/lib/route-manifest";

/*
 * Real 404 status for unknown or hidden detail slugs in production.
 * The check is a lookup in a build-time manifest of published slugs: no
 * content is read here. Development renders its own 404s, and preview
 * entries must stay reachable there, so the check is production-only.
 */
export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();
  if (isUnknownDetailPath(request.nextUrl.pathname, manifest)) {
    // Rewriting to a path no route matches renders the site's 404 page with a 404 status.
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/work/:path+", "/research/:path+", "/writing/:path+"],
};
