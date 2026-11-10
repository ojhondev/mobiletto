import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Botao } from "@/components/site/Botao";
import { ChamadaDupla, Rotulo } from "@/components/site/Blocos";
import { casePorSlug, casesPublicados, segmentosPublicados } from "@/lib/cms/dados";

export async function generateStaticParams() {
  return (await casesPublicados()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await casePorSlug(slug);
  if (!c) return {};
  return { title: c.titulo, description: c.resumo, openGraph: { images: c.capa ? [c.capa] : [] } };
}

export default async function CasePage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const c = await casePorSlug(slug);
  if (!c) notFound();
  const [todos, segs] = await Promise.all([casesPublicados(), segmentosPublicados()]);
  const nomeSeg = (s: string) => segs.find((x) => x.slug === s)?.nome ?? "";
  const outros = todos
    .filter((x) => x.slug !== c.slug && x.segmento === c.segmento)
    .concat(todos.filter((x) => x.segmento !== c.segmento))
    .slice(0, 3);

  return (
    <>
      <section className="shell pt-10 pb-12 md:pt-14">
        <Link href="/cases" className="inline-flex items-center gap-2 text-[15px] text-pedra hover:text-tinta">
          <ArrowLeft className="size-4" strokeWidth={1.6} /> Todos os cases
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div className="entra">
            {nomeSeg(c.segmento) && <Rotulo>{nomeSeg(c.segmento)}</Rotulo>}
            <h1 className="mt-4 max-w-[18ch] text-h1">{c.titulo}</h1>
          </div>
          <p className="entra text-lead text-pedra lg:pb-1" style={{ "--d": ".1s" } as React.CSSProperties}>
            {c.resumo}
          </p>
        </div>
      </section>

      {c.capa && (
        <div className="foto reveal aspect-[16/9] max-h-[82vh] w-full md:aspect-[21/9]">
          <Image src={c.capa} alt={c.titulo} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <section className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <dl className="reveal grid h-fit grid-cols-2 border-t border-linha lg:grid-cols-1">
          {[
            ["Segmento", nomeSeg(c.segmento)],
            ["Local", c.cidade],
            ["Ano", c.ano],
            ["Escopo", c.escopo.join(", ")],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="border-b border-linha py-4 pr-4">
                <dt className="text-[13px] text-pedra">{k}</dt>
                <dd className="mt-1 text-[17px]">{v}</dd>
              </div>
            ))}
        </dl>
        <div className="reveal grid gap-12">
          {c.desafio && (
            <div>
              <h2 className="text-h3">O desafio</h2>
              <p className="mt-4 max-w-[60ch] text-lead text-pedra">{c.desafio}</p>
            </div>
          )}
          {c.solucao && (
            <div>
              <h2 className="text-h3">A solução</h2>
              <p className="mt-4 max-w-[60ch] text-lead text-pedra">{c.solucao}</p>
            </div>
          )}
          <div>
            <Botao href="/fale-conosco?assunto=projeto">Quero um projeto como este</Botao>
          </div>
        </div>
      </section>

      {c.galeria.length > 0 && (
        <section className="shell grid gap-3 sm:grid-cols-2">
          {c.galeria.map((src, i) => (
            <div key={src + i} className="reveal">
              <div className={`foto ${i === 0 && c.galeria.length % 2 === 1 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"}`}>
                <Image src={src} alt="" fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
          ))}
        </section>
      )}

      {outros.length > 0 && (
        <section className="shell pt-24 md:pt-32">
          <h2 className="reveal text-h2">Outros cases</h2>
          <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-3">
            {outros.map((o, k) => (
              <Link key={o.slug} href={`/cases/${o.slug}`} className="group reveal block" style={{ "--d": `${k * 0.08}s` } as React.CSSProperties}>
                <div className="foto foto-hover aspect-[4/3]">
                  {o.capa && <Image src={o.capa} alt={o.titulo} fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />}
                </div>
                <p className="mt-4 text-[14px] text-pedra">{nomeSeg(o.segmento)}</p>
                <p className="mt-1 text-[20px] leading-tight group-hover:text-azul">{o.titulo}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ChamadaDupla
        titulo="Vamos conversar sobre o seu espaço?"
        fantasma={{ href: "/cases", label: "Ver todos os cases" }}
        primario={{ href: "/fale-conosco?assunto=orcamento", label: "Solicitar orçamento" }}
      />
    </>
  );
}
