import type { Metadata } from "next";
import Image from "next/image";
import { Botao } from "@/components/site/Botao";
import { Rotulo, TituloSecao } from "@/components/site/Blocos";
import { FormContato } from "@/components/site/Formularios";

/**
 * Landing interna da linha de móveis especial.
 * OCULTA por enquanto: fora do menu, do rodapé e do sitemap, e com noindex.
 * Para lançar: trocar nome/textos/fotos, tirar o `robots` abaixo e linkar no menu.
 */
export const metadata: Metadata = {
  title: "Linha Especial",
  description: "A linha especial de mobiliário corporativo Mobiletto.",
  robots: { index: false, follow: false },
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

const destaques = [
  {
    titulo: "Materiais nobres",
    texto: "Madeiras naturais, pedras e metais com acabamento artesanal em cada peça.",
    imagem: "/produtos/sala-diretoria-madeira.jpg",
  },
  {
    titulo: "Desenho exclusivo",
    texto: "Peças assinadas, produzidas em séries limitadas para projetos de alto padrão.",
    imagem: "/produtos/mesa-diretor-armario.jpg",
  },
  {
    titulo: "Sob medida",
    texto: "Dimensões, acabamentos e composições ajustados ao ambiente de cada cliente.",
    imagem: "/produtos/balcao-recepcao.jpg",
  },
];

export default function LinhaEspecial() {
  return (
    <>
      <section className="relative isolate flex h-[calc(100svh-40px)] max-h-[980px] min-h-[640px] items-end overflow-hidden bg-tinta text-white">
        <Image src="/produtos/sala-de-reuniao-10-lugares.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/35 to-black/20" />
        <div className="shell pb-20 md:pb-28">
          <p className="reveal is-in text-[15px] font-medium text-marfim">Lançamento Mobiletto</p>
          <h1 className="reveal is-in mt-5 max-w-[14ch] text-display" style={d(0.06)}>
            Linha Especial
          </h1>
          <p className="reveal is-in mt-6 max-w-[38rem] text-lead text-white/85" style={d(0.12)}>
            Uma linha de mobiliário corporativo pensada para diretorias, recepções e salas de conselho que pedem
            presença.
          </p>
          <div className="reveal is-in mt-10 flex flex-wrap gap-3" style={d(0.18)}>
            <Botao href="#interesse">Quero conhecer a linha</Botao>
            <Botao href="#destaques" variante="contorno-claro">
              Ver detalhes
            </Botao>
          </div>
        </div>
      </section>

      <section id="destaques" className="shell scroll-mt-24 py-20 md:py-28">
        <TituloSecao titulo="Presença em cada detalhe" sub="Uma linha para os ambientes que representam a empresa." />
        <div className="mt-14 grid gap-x-4 gap-y-12 md:grid-cols-3">
          {destaques.map((x, i) => (
            <article key={x.titulo} className="reveal" style={d(i * 0.06)}>
              <div className="foto aspect-[4/5]">
                <Image src={x.imagem} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h2 className="mt-6 text-[22px]">
                <span className="font-bold">{String(i + 1).padStart(2, "0")}.</span> {x.titulo}
              </h2>
              <p className="mt-3 text-[15px] leading-snug text-pedra">{x.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="interesse" className="scroll-mt-24 bg-azul text-marfim">
        <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
          <div className="reveal">
            <Rotulo className="text-marfim/70">Pré-lançamento</Rotulo>
            <h2 className="mt-5 max-w-[14ch] text-h2">Seja o primeiro a conhecer.</h2>
            <p className="mt-6 max-w-[34ch] text-[16px] leading-relaxed text-marfim/75">
              Deixe seus dados e enviamos o material completo da linha assim que ela for lançada.
            </p>
          </div>
          <div className="reveal bg-white p-6 text-tinta md:p-10" style={d(0.08)}>
            <FormContato origem="linha-especial" assuntoPadrao="catalogo" />
          </div>
        </div>
      </section>
    </>
  );
}
