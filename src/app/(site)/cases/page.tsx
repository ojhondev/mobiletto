import type { Metadata } from "next";
import { Suspense } from "react";
import { AberturaPagina, ChamadaDupla } from "@/components/site/Blocos";
import { CasesGrid, CasesGridEstatico } from "@/components/site/CasesGrid";
import { casesPublicados, getSecao, segmentosPublicados } from "@/lib/cms/dados";

export const metadata: Metadata = {
  title: "Cases",
  description: "Escritórios, recepções, hotéis, restaurantes e áreas comuns mobiliados pela Mobiletto.",
};

export default async function Cases() {
  const [ab, lista, segs] = await Promise.all([getSecao("cases.abertura"), casesPublicados(), segmentosPublicados()]);
  const cards = lista.map(({ slug, titulo, segmento, cidade, resumo, capa }) => ({ slug, titulo, segmento, cidade, resumo, capa }));
  const chips = segs.map(({ slug, nome }) => ({ slug, nome }));
  return (
    <>
      <AberturaPagina rotulo={ab.rotulo} titulo={ab.titulo} texto={ab.texto} />
      <section className="shell pb-10">
        <Suspense fallback={<CasesGridEstatico cases={cards} segmentos={chips} />}>
          <CasesGrid cases={cards} segmentos={chips} />
        </Suspense>
      </section>
      <ChamadaDupla
        titulo="O próximo case pode ser o seu."
        fantasma={{ href: "/sobre-nos#processo", label: "Como trabalhamos" }}
        primario={{ href: "/fale-conosco?assunto=projeto", label: "Solicitar projeto" }}
      />
    </>
  );
}
