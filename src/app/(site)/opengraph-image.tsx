import { getSite } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = "Timmy Omolana: engineering at the intersection of mathematics, computation, and real-world systems";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const site = getSite();
  return ogImage({ title: site.name, subtitle: site.positioning });
}
