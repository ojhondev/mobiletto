import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AberturaPagina, Faq } from "@/components/site/Blocos";
import { Botao } from "@/components/site/Botao";
import { categorias } from "@/content/site";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Estações de trabalho, mesas de reunião, cadeiras corporativas, recepção, lounge, armazenamento, hotelaria e restaurantes. Mobiliário corporativo sob medida.",
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

const perguntas = [
  {
    p: "Os produtos do catálogo podem ser personalizados?",
    r: "Sim. Dimensões, acabamentos, tecidos e cores podem ser adaptados ao projeto. Também desenvolvemos peças exclusivas a partir do zero.",
  },
  {
    p: "Existe pedido mínimo?",
    r: "Depende da linha e do nível de personalização. Na proposta indicamos volumes e prazos para cada item.",
  },
  {
    p: "Vocês enviam amostras de acabamento?",
    r: "Sim. Para projetos em andamento, enviamos amostras de madeiras, tecidos e laminados para aprovação.",
  },
];

export default function Catalogo() {
  return (
    <>
      <AberturaPagina
        rotulo="Catálogo"
        titulo="Mobiliário para cada ambiente corporativo."
        texto="Estações de trabalho, mesas, diretoria, salas de reunião, recepções e armazenamento — tudo fabricado pela Mobiletto e adaptável ao seu projeto, do simples ao sofisticado."
      >
        <Botao href="/fale-conosco?assunto=orcamento">Solicitar orçamento</Botao>
        <Botao href="/fale-conosco?assunto=projeto" variante="fantasma">
          Projeto sob medida
        </Botao>
      </AberturaPagina>

      {/* navegação por categoria */}
      <nav className="sticky top-[72px] z-30 border-y border-linha bg-white/95 backdrop-blur" aria-label="Categorias">
        <div className="shell rail flex gap-2 overflow-x-auto py-3">
          {categorias.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="shrink-0 rounded-full border border-linha px-4 py-2 text-[14px] transition-colors hover:border-tinta"
            >
              {c.nome}
            </a>
          ))}
        </div>
      </nav>

      <div className="pt-8 pb-10 md:pb-16">
        {categorias.map((c, i) => (
          <section key={c.id} id={c.id} className="shell scroll-mt-40 border-b border-linha py-14 last:border-b-0 md:py-20">
            <div className="reveal grid gap-6 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end lg:gap-12">
              <h2 className="text-h3">
                <span className="font-bold text-azul">{String(i + 1).padStart(2, "0")}.</span> {c.nome}
              </h2>
              <div>
                <p className="max-w-[46ch] text-[16px] leading-snug text-pedra">{c.texto}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.itens.map((item) => (
                    <li key={item} className="rounded-full bg-marfim-suave px-3 py-1 text-[13px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/fale-conosco?assunto=orcamento&categoria=${c.id}`}
                className="inline-flex items-center gap-2 text-[15px] font-medium whitespace-nowrap text-azul hover:underline"
              >
                Solicitar orçamento <ArrowRight className="size-4" strokeWidth={1.6} />
              </Link>
            </div>
            <div
              className={`mt-10 grid gap-x-4 gap-y-8 ${c.produtos.length === 1 ? "" : c.produtos.length === 2 ? "sm:grid-cols-2" : c.produtos.length % 3 === 0 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}
            >
              {c.produtos.map((p, k) => (
                <figure key={p.imagem} className="reveal" style={d((k % 4) * 0.05)}>
                  <div className={`foto bg-marfim-suave ${c.produtos.length === 1 ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]"}`}>
                    <Image
                      src={p.imagem}
                      alt={p.nome}
                      fill
                      sizes={c.produtos.length === 1 ? "100vw" : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"}
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-[16px]">{p.nome}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* chamada do catálogo completo (o catálogo interativo entra em uma fase futura) */}
      <section className="bg-marfim-suave">
        <div className="shell grid gap-10 py-20 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="reveal">
            <p className="text-[14px] font-medium text-azul">Em breve</p>
            <h2 className="mt-5 max-w-[20ch] text-h2">Catálogo completo, com fichas técnicas e acabamentos.</h2>
            <p className="mt-6 max-w-[36rem] text-lead text-pedra">
              Enquanto isso, nossa equipe envia o material técnico de cada linha junto com a sua proposta.
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-3 lg:justify-end" style={d(0.08)}>
            <Botao href="/fale-conosco?assunto=catalogo" variante="fantasma">
              Receber material técnico
            </Botao>
            <Botao href="/fale-conosco?assunto=orcamento">Solicitar orçamento</Botao>
          </div>
        </div>
      </section>

      <Faq titulo="Dúvidas sobre o catálogo" itens={perguntas} />
    </>
  );
}
