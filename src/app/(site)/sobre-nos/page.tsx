import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Botao } from "@/components/site/Botao";
import { AberturaPagina, ChamadaDupla, FaixaFoto, Rotulo, TituloSecao } from "@/components/site/Blocos";
import { getSecoes, segmentosPublicados } from "@/lib/cms/dados";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "A Mobiletto projeta, fabrica e instala mobiliário corporativo para escritórios, recepções, hotéis e restaurantes. Conheça nossa forma de trabalhar.",
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/** Padrão "módulo, linha e espaço" do manual da marca: quadrados com diagonais. */
function Modulos() {
  return (
    <div className="grid grid-cols-7 gap-3" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => {
        const forte = (i * 7 + Math.floor(i / 7)) % 3 === 0;
        const diag = i % 2 === 0;
        return (
          <svg key={i} viewBox="0 0 40 40" className="modulo aspect-square w-full" style={{ animationDelay: `${(i % 7) * 60 + Math.floor(i / 7) * 90}ms` }}>
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

export default async function SobreNos() {
  const [s, segs] = await Promise.all([
    getSecoes("sobre.abertura", "sobre.manifesto", "sobre.valores", "sobre.processo", "sobre.fabrica", "sobre.segmentos", "sobre.faixaFinal"),
    segmentosPublicados(),
  ]);
  const ab = s["sobre.abertura"];
  const man = s["sobre.manifesto"];
  const val = s["sobre.valores"];
  const proc = s["sobre.processo"];
  const fab = s["sobre.fabrica"];
  const fim = s["sobre.faixaFinal"];

  return (
    <>
      <AberturaPagina rotulo={ab.rotulo} titulo={ab.titulo} texto={ab.texto} imagem={ab.imagem || undefined}>
        <Botao href="/fale-conosco?assunto=projeto">Fale com a nossa equipe</Botao>
        <Botao href="/cases" variante="fantasma">
          Ver cases
        </Botao>
      </AberturaPagina>

      <section className="bg-azul text-marfim">
        <div className="shell grid gap-14 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <div className="reveal">
            <p className="text-[14px] font-medium text-marfim/70">{man.rotulo}</p>
            <h2 className="mt-5 max-w-[20ch] text-h2">{man.titulo}</h2>
            <p className="mt-7 max-w-[36rem] text-lead text-marfim/80">{man.texto}</p>
          </div>
          <div className="reveal text-marfim" style={d(0.1)}>
            <Modulos />
          </div>
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <TituloSecao titulo={val.titulo} sub={val.texto} />
        <ol className="mt-14 grid border-t border-linha sm:grid-cols-2 lg:grid-cols-4">
          {val.itens.map((v, i) => (
            <li key={v + i} className="reveal flex items-baseline gap-4 border-b border-linha py-6 sm:pr-6" style={d((i % 4) * 0.06)}>
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

      <section id="processo" className="scroll-mt-24 bg-marfim-suave">
        <div className="shell py-20 md:py-28">
          <TituloSecao alinhamento="esquerda" titulo={proc.titulo} sub={proc.texto} />
          <div className="mt-14 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {proc.itens.map((p, i) => (
              <article key={p.titulo + i} className="reveal" style={d(i * 0.08)}>
                <div className="foto aspect-[4/3]">
                  {p.imagem && <Image src={p.imagem} alt="" fill sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw" className="object-cover" />}
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

      <section className="shell grid gap-10 py-20 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="reveal">
          <div className="foto aspect-[4/3] lg:aspect-[5/4]">
            {fab.imagem && <Image src={fab.imagem} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />}
          </div>
        </div>
        <div className="reveal" style={d(0.1)}>
          <Rotulo>{fab.rotulo}</Rotulo>
          <h2 className="mt-5 max-w-[18ch] text-h2">{fab.titulo}</h2>
          <p className="mt-6 max-w-[34rem] text-lead text-pedra">{fab.texto}</p>
          {fab.itens.length > 0 && (
            <ul className="mt-8 grid max-w-[34rem] grid-cols-2 gap-x-6 border-t border-linha">
              {fab.itens.map((t) => (
                <li key={t} className="border-b border-linha py-4 text-[16px]">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {segs.length > 0 && (
        <section className="shell pb-6">
          <TituloSecao alinhamento="esquerda" titulo={s["sobre.segmentos"].titulo} sub={s["sobre.segmentos"].texto} />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {segs.map((sg, i) => (
              <Link key={sg.slug} href={`/cases?segmento=${sg.slug}`} className="group reveal block" style={d(i * 0.06)}>
                <div className="foto aspect-[3/4]">
                  {sg.imagem && <Image src={sg.imagem} alt="" fill sizes="(min-width:1024px) 20vw, (min-width:640px) 50vw, 100vw" className="object-cover" />}
                </div>
                <p className="mt-4 text-[20px] transition-colors group-hover:text-azul">{sg.nome}</p>
                <p className="mt-1 text-[14px] leading-snug text-pedra">{sg.resumo}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ChamadaDupla
        titulo="Vamos desenhar o seu espaço?"
        fantasma={{ href: "/catalogo", label: "Ver o catálogo" }}
        primario={{ href: "/fale-conosco?assunto=projeto", label: "Solicitar projeto" }}
      />

      <FaixaFoto imagem={fim.imagem} titulo={fim.titulo} botao={fim.botao ? { href: fim.link || "/cases", label: fim.botao } : undefined} />
    </>
  );
}
