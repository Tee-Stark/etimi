import { getAbout } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = "About Timmy Omolana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({ section: "/about", title: "About", subtitle: getAbout().philosophy.statement });
}
