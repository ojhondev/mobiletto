import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Botao } from "@/components/site/Botao";
import { ChamadaDupla, Rotulo } from "@/components/site/Blocos";
import { cases, segmentoNome } from "@/content/site";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: c.titulo, description: c.resumo, openGraph: { images: [c.capa] } };
}

export default async function CasePage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) notFound();
  const outros = cases.filter((x) => x.slug !== c.slug && x.segmento === c.segmento).concat(cases.filter((x) => x.segmento !== c.segmento)).slice(0, 3);

  return (
    <>
      <section className="shell pt-10 pb-12 md:pt-14">
        <Link href="/cases" className="inline-flex items-center gap-2 text-[15px] text-pedra hover:text-tinta">
          <ArrowLeft className="size-4" strokeWidth={1.6} /> Todos os cases
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div className="reveal">
            <Rotulo>{segmentoNome(c.segmento)}</Rotulo>
            <h1 className="mt-4 max-w-[18ch] text-h1">{c.titulo}</h1>
          </div>
          <p className="reveal text-lead text-pedra lg:pb-1">{c.resumo}</p>
        </div>
      </section>

      <div className="foto reveal aspect-[16/9] max-h-[82vh] w-full md:aspect-[21/9]">
        <Image src={c.capa} alt={c.titulo} fill priority sizes="100vw" className="object-cover" />
      </div>

      <section className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <dl className="reveal grid h-fit grid-cols-2 border-t border-linha lg:grid-cols-1">
          {[
            ["Segmento", segmentoNome(c.segmento)],
            ["Local", c.cidade],
            ["Ano", c.ano],
            ["Escopo", c.escopo.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-linha py-4 pr-4">
              <dt className="text-[13px] text-pedra">{k}</dt>
              <dd className="mt-1 text-[17px]">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="reveal grid gap-12">
          <div>
            <h2 className="text-h3">O desafio</h2>
            <p className="mt-4 max-w-[60ch] text-lead text-pedra">{c.desafio}</p>
          </div>
          <div>
            <h2 className="text-h3">A solução</h2>
            <p className="mt-4 max-w-[60ch] text-lead text-pedra">{c.solucao}</p>
          </div>
          <div>
            <Botao href="/fale-conosco?assunto=projeto">Quero um projeto como este</Botao>
          </div>
        </div>
      </section>

      <section className="shell grid gap-3 sm:grid-cols-2">
        {c.galeria.map((src, i) => (
          <div key={src + i} className={`foto reveal ${i === 0 && c.galeria.length % 2 === 1 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"}`}>
            <Image src={src} alt="" fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section className="shell pt-24 md:pt-32">
        <h2 className="reveal text-h2">Outros cases</h2>
        <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-3">
          {outros.map((o) => (
            <Link key={o.slug} href={`/cases/${o.slug}`} className="group reveal block">
              <div className="foto aspect-[4/3]">
                <Image src={o.capa} alt={o.titulo} fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 text-[14px] text-pedra">{segmentoNome(o.segmento)}</p>
              <p className="mt-1 text-[20px] leading-tight group-hover:text-azul">{o.titulo}</p>
            </Link>
          ))}
        </div>
      </section>

      <ChamadaDupla
        titulo="Vamos conversar sobre o seu espaço?"
        fantasma={{ href: "/cases", label: "Ver todos os cases" }}
        primario={{ href: "/fale-conosco?assunto=orcamento", label: "Solicitar orçamento" }}
      />
    </>
  );
}
