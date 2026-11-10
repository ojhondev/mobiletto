import type { Metadata } from "next";
import Image from "next/image";
import { Botao } from "@/components/site/Botao";
import { AberturaPagina, ChamadaDupla, FaixaFoto, Rotulo, TituloSecao } from "@/components/site/Blocos";
import { processo, segmentos, valores } from "@/content/site";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "A Mobiletto projeta, fabrica e instala mobiliário corporativo para escritórios, recepções, hotéis e restaurantes. Conheça nossa forma de trabalhar.",
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/** Padrão "módulo, linha e espaço" do manual da marca: quadrados com diagonais. */
function Modulos() {
  const celulas = Array.from({ length: 28 });
  return (
    <div className="grid grid-cols-7 gap-3" aria-hidden>
      {celulas.map((_, i) => {
        const forte = (i * 7 + Math.floor(i / 7)) % 3 === 0;
        const diag = i % 2 === 0;
        return (
          <svg key={i} viewBox="0 0 40 40" className="aspect-square w-full">
            <rect x="0.75" y="0.75" width="38.5" height="38.5" fill="none" stroke="currentColor" strokeOpacity={forte ? 0.9 : 0.35} strokeWidth="1.2" />
            <line
              x1={diag ? 0.75 : 39.25}
              y1="39.25"
              x2={diag ? 39.25 : 0.75}
              y2="0.75"
              stroke="currentColor"
              strokeOpacity={forte ? 0.9 : 0.35}
              strokeWidth="1.2"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default function SobreNos() {
  return (
    <>
      <AberturaPagina
        rotulo="Sobre nós"
        titulo="Planejar é desenhar o espaço."
        texto="A Mobiletto transforma precisão, materialidade e organização em ambientes corporativos feitos para funcionar. Projetamos, fabricamos e instalamos mobiliário para empresas de todos os portes — do simples ao sofisticado."
        imagem="/images/conferencia-oval.jpg"
      >
        <Botao href="/fale-conosco?assunto=projeto">Fale com a nossa equipe</Botao>
        <Botao href="/cases" variante="fantasma">
          Ver cases
        </Botao>
      </AberturaPagina>

      {/* manifesto em faixa azul, com o padrão de módulos da marca */}
      <section className="bg-azul text-marfim">
        <div className="shell grid gap-14 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <div className="reveal">
            <p className="text-[14px] font-medium text-marfim/70">Arquitetura como sistema</p>
            <h2 className="mt-5 max-w-[20ch] text-h2">Mobiliário corporativo com a lógica de quem projeta.</h2>
            <p className="mt-7 max-w-[36rem] text-lead text-marfim/80">
              Módulos, proporção, respiro e acabamento. Cada peça nasce do espaço em que vai viver e da forma como as
              pessoas vão usá-lo: recepcionar, reunir, concentrar, receber.
            </p>
          </div>
          <div className="reveal text-marfim" style={d(0.1)}>
            <Modulos />
          </div>
        </div>
      </section>

      {/* valores */}
      <section className="shell py-20 md:py-28">
        <TituloSecao titulo="O que guia cada projeto" sub="Os princípios da marca Mobiletto, do primeiro traço à última peça instalada." />
        <ol className="mt-14 grid border-t border-linha sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((v, i) => (
            <li
              key={v}
              className="reveal flex items-baseline gap-4 border-b border-linha py-6 sm:pr-6"
              style={d((i % 4) * 0.05)}
            >
              <span className="text-[15px] font-bold text-azul">{String(i + 1).padStart(2, "0")}.</span>
              <span className="text-[24px] leading-tight md:text-[28px]">{v}</span>
            </li>
          ))}
          <li className="reveal flex items-center border-b border-linha py-6">
            <Botao href="/fale-conosco" variante="fantasma">
              Converse com a gente
            </Botao>
          </li>
        </ol>
      </section>

      {/* processo */}
      <section id="processo" className="scroll-mt-24 bg-marfim-suave">
        <div className="shell py-20 md:py-28">
          <TituloSecao
            alinhamento="esquerda"
            titulo="Como trabalhamos"
            sub="Um único parceiro do briefing à instalação — e depois dela."
          />
          <div className="mt-14 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {processo.map((p, i) => (
              <article key={p.titulo} className="reveal" style={d(i * 0.06)}>
                <div className="foto aspect-[4/3]">
                  <Image src={p.imagem} alt="" fill sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw" className="object-cover" />
                </div>
                <h3 className="mt-6 text-[20px]">
                  <span className="font-bold">{String(i + 1).padStart(2, "0")}.</span> {p.titulo}
                </h3>
                <p className="mt-3 text-[15px] leading-snug text-pedra">{p.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* fábrica */}
      <section className="shell grid gap-10 py-20 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="foto reveal aspect-[4/3] lg:aspect-[5/4]">
          <Image src="/images/marcenaria-bancada.jpg" alt="Bancada de marcenaria" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="reveal" style={d(0.08)}>
          <Rotulo>Fabricação própria</Rotulo>
          <h2 className="mt-5 max-w-[18ch] text-h2">A fábrica é o que garante o padrão.</h2>
          <p className="mt-6 max-w-[34rem] text-lead text-pedra">
            Produzir na nossa estrutura significa controlar prazo, acabamento e qualidade. Madeira, metal, pedra e
            estofados passam pelas mesmas mãos que vão instalar o seu ambiente.
          </p>
          <ul className="mt-8 grid max-w-[34rem] grid-cols-2 gap-x-6 border-t border-linha">
            {["Marcenaria sob medida", "Estruturas metálicas", "Estofados", "Montagem e instalação"].map((t) => (
              <li key={t} className="border-b border-linha py-4 text-[16px]">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* segmentos */}
      <section className="shell pb-6">
        <TituloSecao alinhamento="esquerda" titulo="Onde atuamos" sub="Todos os segmentos da arquitetura de interiores corporativa." />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {segmentos.map((s, i) => (
            <a key={s.id} href={`/cases?segmento=${s.id}`} className="group reveal block" style={d(i * 0.05)}>
              <div className="foto aspect-[3/4]">
                <Image src={s.imagem} alt="" fill sizes="(min-width:1024px) 20vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 text-[20px]">{s.nome}</p>
              <p className="mt-1 text-[14px] leading-snug text-pedra">{s.resumo}</p>
            </a>
          ))}
        </div>
      </section>

      <ChamadaDupla
        titulo="Vamos desenhar o seu espaço?"
        fantasma={{ href: "/catalogo", label: "Ver o catálogo" }}
        primario={{ href: "/fale-conosco?assunto=projeto", label: "Solicitar projeto" }}
      />

      <FaixaFoto
        imagem="/images/hotel-madeira.jpg"
        titulo="Do balcão da recepção à sala do conselho, um mesmo padrão de precisão."
        botao={{ href: "/cases", label: "Conheça nossos cases" }}
      />
    </>
  );
}
