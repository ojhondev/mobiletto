import type { MetadataRoute } from "next";
import { cases } from "@/content/site";

const BASE = "https://www.mobiletto.com.br";

// a Linha Especial fica de fora enquanto estiver oculta
export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ["", "/sobre-nos", "/catalogo", "/cases", "/trabalhe-conosco", "/fale-conosco", "/politica-de-privacidade"];
  return [
    ...paginas.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...cases.map((c) => ({ url: `${BASE}/cases/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
