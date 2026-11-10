import type { MetadataRoute } from "next";
import { casesPublicados, getSecao, produtosPublicados } from "@/lib/cms/dados";

const BASE = "https://www.mobiletto.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, produtos, linha] = await Promise.all([casesPublicados(), produtosPublicados(), getSecao("linha.hero")]);
  const paginas = ["", "/sobre-nos", "/catalogo", "/cases", "/trabalhe-conosco", "/fale-conosco", "/politica-de-privacidade"];
  // a Linha Especial só entra quando for liberada no painel
  if (linha.publicada) paginas.push("/linha-especial");
  return [
    ...paginas.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...produtos.map((p) => ({ url: `${BASE}/catalogo/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...cases.map((c) => ({ url: `${BASE}/cases/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
