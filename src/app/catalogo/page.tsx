import type { Metadata } from "next";
import { CatalogViewer } from "@/catalog/CatalogViewer";

export const metadata: Metadata = {
  title: "Catálogo 2027 · Mobiletto",
  description: "Folheie o catálogo Mobiletto: produtos, acabamentos, fichas técnicas e cotação para empresas.",
};

export default function CatalogoPage() {
  return <CatalogViewer />;
}
