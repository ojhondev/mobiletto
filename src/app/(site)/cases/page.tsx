import type { Metadata } from "next";
import { Suspense } from "react";
import { AberturaPagina, ChamadaDupla } from "@/components/site/Blocos";
import { CasesGrid, CasesGridEstatico } from "@/components/site/CasesGrid";

export const metadata: Metadata = {
  title: "Cases",
  description: "Escritórios, recepções, hotéis, restaurantes e áreas comuns mobiliados pela Mobiletto.",
};

export default function Cases() {
  return (
    <>
      <AberturaPagina
        rotulo="Cases"
        titulo="Ambientes que já funcionam."
        texto="Uma seleção de projetos entregues pela Mobiletto em escritórios, recepções, hotéis, restaurantes e áreas comuns — do simples ao sofisticado."
      />
      <section className="shell pb-10">
        <Suspense fallback={<CasesGridEstatico />}>
          <CasesGrid />
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
