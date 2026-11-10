import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, MessageCircle, Ruler, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Botao } from "@/components/site/Botao";
import { CartaoProduto } from "@/components/site/CartaoProduto";
import { GaleriaProduto } from "@/components/site/GaleriaProduto";
import { getSecoes, linkWhatsapp, paragrafos, produtoPorSlug, produtosPublicados } from "@/lib/cms/dados";

export async function generateStaticParams() {
  return (await produtosPublicados()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await produtoPorSlug(slug);
  if (!r) return {};
  return {
    title: r.produto.nome,
    description: r.produto.resumo || r.produto.descricao.slice(0, 160),
    openGraph: { images: r.produto.imagens.slice(0, 1) },
  };
}

function Tabela({ linhas }: { linhas: { rotulo: string; valor: string }[] }) {
  return (
    <dl className="border-t border-linha">
      {linhas.map((l, i) => (
        <div key={l.rotulo + i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-linha py-3.5">
          <dt className="text-[15px] text-pedra">{l.rotulo}</dt>
          <dd className="text-[15px]">{l.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="reveal grid gap-6 border-t border-tinta pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
      <h2 className="text-h3">{titulo}</h2>
      <div>{children}</div>
    </div>
  );
}

export default async function ProdutoPage({ params }: PageProps<"/catalogo/[slug]">) {
  const { slug } = await params;
  const r = await produtoPorSlug(slug);
  if (!r) notFound();
  const { produto: p, categoria, relacionados } = r;
  const { contato, "catalogo.produto": txt } = await getSecoes("contato", "catalogo.produto");
  const orcamento = `/fale-conosco?assunto=orcamento&produto=${encodeURIComponent(p.nome)}`;
  const whats = linkWhatsapp(contato.whatsapp, `Olá! Gostaria de um orçamento do produto "${p.nome}" que vi no site.`);
  const textos = paragrafos(p.descricao);

  return (
    <>
      <nav className="shell flex flex-wrap items-center gap-1.5 pt-8 text-[14px] text-pedra" aria-label="Você está em">
        <Link href="/catalogo" className="hover:text-tinta">
          Catálogo
        </Link>
        {categoria && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/catalogo#${categoria.slug}`} className="hover:text-tinta">
              {categoria.nome}
            </Link>
          </>
        )}
        <ChevronRight className="size-3.5" />
        <span className="text-tinta">{p.nome}</span>
      </nav>

      <section className="shell grid gap-10 pt-6 pb-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14 md:pb-28">
        <div className="entra">
          <GaleriaProduto imagens={p.imagens} nome={p.nome} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="entra" style={{ "--d": ".1s" } as React.CSSProperties}>
            {categoria && <p className="text-[14px] font-medium text-azul">{categoria.nome}</p>}
            <h1 className="mt-3 text-h1">{p.nome}</h1>
            {p.codigo && <p className="mt-3 text-[14px] text-pedra">Ref. {p.codigo}</p>}
            {p.resumo && <p className="mt-5 text-lead text-pedra">{p.resumo}</p>}

            {p.medidas.length > 0 && (
              <ul className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-linha bg-linha">
                {p.medidas.slice(0, 4).map((m, k, arr) => (
                  <li key={m.rotulo} className={`bg-white p-4 ${arr.length % 2 === 1 && k === arr.length - 1 ? "col-span-2" : ""}`}>
                    <p className="text-[13px] text-pedra">{m.rotulo}</p>
                    <p className="mt-1 text-[16px] leading-snug">{m.valor}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Botao href={orcamento} className="flex-1">
                Solicitar orçamento
              </Botao>
              <Botao href={whats} externo variante="fantasma" className="flex-1">
                <MessageCircle className="size-4" strokeWidth={1.6} /> Falar no WhatsApp
              </Botao>
            </div>

            <ul className="mt-8 grid gap-3 border-t border-linha pt-6 text-[15px]">
              {[
                { icone: SlidersHorizontal, texto: txt.personalizacao },
                { icone: ShieldCheck, texto: txt.garantia },
                { icone: Ruler, texto: txt.projeto },
              ]
                .filter((x) => x.texto)
                .map(({ icone: Icone, texto }) => (
                  <li key={texto} className="flex items-start gap-3">
                    <Icone className="mt-0.5 size-5 shrink-0 text-azul" strokeWidth={1.5} />
                    <span>{texto}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell grid gap-16 pb-24 md:pb-32">
        {textos.length > 0 && (
          <Bloco titulo="Sobre o produto">
            <div className="grid max-w-[62ch] gap-4 text-[17px] leading-relaxed text-pedra">
              {textos.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </Bloco>
        )}
        {p.medidas.length > 0 && (
          <Bloco titulo="Medidas">
            <Tabela linhas={p.medidas} />
          </Bloco>
        )}
        {p.especificacoes.length > 0 && (
          <Bloco titulo="Especificações técnicas">
            <Tabela linhas={p.especificacoes} />
          </Bloco>
        )}
        {p.aplicacoes.length > 0 && (
          <Bloco titulo="Aplicações">
            <ul className="flex flex-wrap gap-2">
              {p.aplicacoes.map((a) => (
                <li key={a} className="rounded-full border border-linha px-4 py-2 text-[15px]">
                  {a}
                </li>
              ))}
            </ul>
          </Bloco>
        )}
        {p.acabamentos.length > 0 && (
          <Bloco titulo="Acabamentos">
            <ul className="flex flex-wrap gap-2">
              {p.acabamentos.map((a) => (
                <li key={a} className="rounded-full bg-marfim-suave px-4 py-2 text-[15px]">
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] text-pedra">Amostras físicas disponíveis para projetos em andamento.</p>
          </Bloco>
        )}
        {p.diferenciais.length > 0 && (
          <Bloco titulo="Diferenciais">
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.diferenciais.map((x) => (
                <li key={x} className="flex items-start gap-3 text-[16px]">
                  <Check className="mt-0.5 size-5 shrink-0 text-azul" strokeWidth={1.8} />
                  {x}
                </li>
              ))}
            </ul>
          </Bloco>
        )}
        {txt.aviso && <p className="text-[13px] text-pedra">{txt.aviso}</p>}
      </section>

      <section className="bg-azul text-marfim">
        <div className="shell flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <h2 className="reveal max-w-[24ch] text-h2">Quer este produto no seu projeto?</h2>
          <div className="reveal flex flex-wrap gap-3">
            <Botao href={orcamento} variante="claro">
              Solicitar orçamento
            </Botao>
            <Botao href={whats} externo variante="contorno-claro">
              Falar no WhatsApp
            </Botao>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="shell py-20 md:py-28">
          <h2 className="reveal text-h2">{categoria ? `Mais em ${categoria.nome}` : "Outros produtos"}</h2>
          <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((o, k) => (
              <CartaoProduto key={o.id} slug={o.slug} nome={o.nome} resumo={o.resumo} imagem={o.imagens[0]} delay={k * 0.08} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
