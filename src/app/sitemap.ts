import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const PATHS = [
  "",
  "/about",
  "/services",
  "/pricing",
  "/contact",
  "/login",
  "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `${site.url}${path}` }));
}
