import type { Metadata } from "next";
import { buscarMidias } from "@/app/painel/acoes";
import { Biblioteca } from "@/components/painel/Biblioteca";
import { Cabecalho } from "@/components/painel/ui";

export const metadata: Metadata = { title: "Biblioteca de mídia" };

export default async function Midia() {
  const midias = await buscarMidias();
  return (
    <>
      <Cabecalho
        titulo="Biblioteca de mídia"
        descricao="Todas as fotos e vídeos do site. Envie aqui ou direto de qualquer campo de imagem — tudo fica guardado nesta biblioteca."
      />
      <Biblioteca inicial={midias} />
    </>
  );
}
