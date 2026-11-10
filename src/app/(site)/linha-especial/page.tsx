import type { Metadata } from "next";
import Image from "next/image";
import { Botao } from "@/components/site/Botao";
import { Rotulo, TituloSecao } from "@/components/site/Blocos";
import { FormContato } from "@/components/site/Formularios";
import { getSecao, getSecoes, segmentosPublicados } from "@/lib/cms/dados";

/**
 * Landing interna da linha de móveis especial.
 * Fica OCULTA (fora do menu, do sitemap e do Google) até ser liberada no painel
 * em Páginas → Linha especial → "Liberar a página".
 */
export async function generateMetadata(): Promise<Metadata> {
  const hero = await getSecao("linha.hero");
  return {
    title: hero.titulo,
    description: hero.texto,
    robots: hero.publicada ? undefined : { index: false, follow: false },
  };
}

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default async function LinhaEspecial() {
  const [s, segs] = await Promise.all([getSecoes("linha.hero", "linha.destaques", "linha.interesse"), segmentosPublicados()]);
  const hero = s["linha.hero"];
  const dest = s["linha.destaques"];
  const int = s["linha.interesse"];

  return (
    <>
      <section className="relative isolate flex h-[calc(100svh-40px)] max-h-[980px] min-h-[640px] items-end overflow-hidden bg-tinta text-white">
        {hero.imagem && <Image src={hero.imagem} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/35 to-black/20" />
        <div className="shell pb-20 md:pb-28">
          <p className="entra text-[15px] font-medium text-marfim">{hero.rotulo}</p>
          <h1 className="entra mt-5 max-w-[14ch] text-display" style={d(0.08)}>
            {hero.titulo}
          </h1>
          <p className="entra mt-6 max-w-[38rem] text-lead text-white/85" style={d(0.16)}>
            {hero.texto}
          </p>
          <div className="entra mt-10 flex flex-wrap gap-3" style={d(0.24)}>
            <Botao href="#interesse">Quero conhecer a linha</Botao>
            <Botao href="#destaques" variante="contorno-claro">
              Ver detalhes
            </Botao>
          </div>
        </div>
      </section>

      {dest.itens.length > 0 && (
        <section id="destaques" className="shell scroll-mt-24 py-20 md:py-28">
          <TituloSecao titulo={dest.titulo} sub={dest.texto} />
          <div className="mt-14 grid gap-x-4 gap-y-12 md:grid-cols-3">
            {dest.itens.map((x, i) => (
              <article key={x.titulo + i} className="reveal" style={d(i * 0.08)}>
                <div className="foto aspect-[4/5]">
                  {x.imagem && <Image src={x.imagem} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />}
                </div>
                <h2 className="mt-6 text-[22px]">
                  <span className="font-bold">{String(i + 1).padStart(2, "0")}.</span> {x.titulo}
                </h2>
                <p className="mt-3 text-[15px] leading-snug text-pedra">{x.texto}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="interesse" className="scroll-mt-24 bg-azul text-marfim">
        <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
          <div className="reveal">
            <Rotulo className="text-marfim/70">{int.rotulo}</Rotulo>
            <h2 className="mt-5 max-w-[14ch] text-h2">{int.titulo}</h2>
            <p className="mt-6 max-w-[34ch] text-[16px] leading-relaxed text-marfim/75">{int.texto}</p>
          </div>
          <div className="reveal bg-white p-6 text-tinta md:p-10" style={d(0.08)}>
            <FormContato origem="linha-especial" assuntoPadrao="catalogo" segmentos={segs.map((x) => ({ slug: x.slug, nome: x.nome }))} />
          </div>
        </div>
      </section>
    </>
  );
}
