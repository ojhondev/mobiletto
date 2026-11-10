import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AberturaPagina, Faq } from "@/components/site/Blocos";
import { Botao } from "@/components/site/Botao";
import { CartaoProduto } from "@/components/site/CartaoProduto";
import { catalogo, getSecoes } from "@/lib/cms/dados";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Estações de trabalho, mesas, diretoria, salas de reunião, recepções e armazenamento. Mobiliário corporativo fabricado pela Mobiletto e adaptável ao seu projeto.",
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

const colunas = (n: number) =>
  n === 1 ? "" : n === 2 ? "sm:grid-cols-2" : n % 3 === 0 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";

export default async function Catalogo() {
  const [s, cats] = await Promise.all([getSecoes("catalogo.abertura", "catalogo.chamada", "catalogo.faq"), catalogo()]);
  const ab = s["catalogo.abertura"];
  const ch = s["catalogo.chamada"];
  const visiveis = cats.filter((c) => c.produtos.length > 0);

  return (
    <>
      <AberturaPagina rotulo={ab.rotulo} titulo={ab.titulo} texto={ab.texto}>
        <Botao href="/fale-conosco?assunto=orcamento">Solicitar orçamento</Botao>
        <Botao href="/fale-conosco?assunto=projeto" variante="fantasma">
          Projeto sob medida
        </Botao>
      </AberturaPagina>

      {visiveis.length > 0 && (
        <nav className="sticky top-[72px] z-30 border-y border-linha bg-white/95 backdrop-blur" aria-label="Categorias">
          <div className="shell rail flex gap-2 overflow-x-auto py-3">
            {visiveis.map((c) => (
              <a key={c.id} href={`#${c.slug}`} className="shrink-0 rounded-full border border-linha px-4 py-2 text-[14px] transition-colors hover:border-tinta">
                {c.nome}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="pt-8 pb-10 md:pb-16">
        {visiveis.map((c, i) => (
          <section key={c.id} id={c.slug} className="shell scroll-mt-40 border-b border-linha py-14 last:border-b-0 md:py-20">
            <div className="reveal grid gap-6 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end lg:gap-12">
              <h2 className="text-h3">
                <span className="font-bold text-azul">{String(i + 1).padStart(2, "0")}.</span> {c.nome}
              </h2>
              <div>
                <p className="max-w-[46ch] text-[16px] leading-snug text-pedra">{c.descricao}</p>
                {c.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <li key={t} className="rounded-full bg-marfim-suave px-3 py-1 text-[13px]">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link
                href={`/fale-conosco?assunto=orcamento&categoria=${encodeURIComponent(c.nome)}`}
                className="inline-flex items-center gap-2 text-[15px] font-medium whitespace-nowrap text-azul hover:underline"
              >
                Solicitar orçamento <ArrowRight className="size-4" strokeWidth={1.6} />
              </Link>
            </div>
            <div className={`mt-10 grid gap-x-4 gap-y-10 ${colunas(c.produtos.length)}`}>
              {c.produtos.map((p, k) => (
                <CartaoProduto
                  key={p.id}
                  slug={p.slug}
                  nome={p.nome}
                  resumo={p.resumo}
                  imagem={p.imagens[0]}
                  grande={c.produtos.length === 1}
                  delay={(k % 4) * 0.08}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="bg-marfim-suave">
        <div className="shell grid gap-10 py-20 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="reveal">
            <p className="text-[14px] font-medium text-azul">{ch.rotulo}</p>
            <h2 className="mt-5 max-w-[20ch] text-h2">{ch.titulo}</h2>
            <p className="mt-6 max-w-[36rem] text-lead text-pedra">{ch.texto}</p>
          </div>
          <div className="reveal flex flex-wrap gap-3 lg:justify-end" style={d(0.08)}>
            <Botao href="/fale-conosco?assunto=catalogo" variante="fantasma">
              Receber material técnico
            </Botao>
            <Botao href="/fale-conosco?assunto=orcamento">Solicitar orçamento</Botao>
          </div>
        </div>
      </section>

      <Faq titulo={s["catalogo.faq"].titulo} itens={s["catalogo.faq"].itens} />
    </>
  );
}
