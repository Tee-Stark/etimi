import { pageCopy } from "@/config/page-copy";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = "Writing by Timmy Omolana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({ section: "/writing", title: "Writing", subtitle: pageCopy.writing.lede });
}
