import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl }];
}
