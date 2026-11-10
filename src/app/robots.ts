import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/linha-especial"] },
    sitemap: "https://www.mobiletto.com.br/sitemap.xml",
  };
}
