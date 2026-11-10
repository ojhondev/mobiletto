import type { MetadataRoute } from "next";
import { getSecao } from "@/lib/cms/dados";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const linha = await getSecao("linha.hero");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/painel", ...(linha.publicada ? [] : ["/linha-especial"])] },
    sitemap: "https://www.mobiletto.com.br/sitemap.xml",
  };
}
