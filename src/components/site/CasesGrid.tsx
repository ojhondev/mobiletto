"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type CaseCard = { slug: string; titulo: string; segmento: string; cidade: string; resumo: string; capa: string };
export type SegmentoChip = { slug: string; nome: string };

export function CasesGrid({ cases, segmentos }: { cases: CaseCard[]; segmentos: SegmentoChip[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ativo = params.get("segmento") ?? "";
  const lista = ativo ? cases.filter((c) => c.segmento === ativo) : cases;
  const filtrar = (id: string) => router.replace(id ? `${pathname}?segmento=${id}` : pathname, { scroll: false });
  return <Grid ativo={ativo} lista={lista} segmentos={segmentos} filtrar={filtrar} />;
}

/** Versão sem filtro ativo, usada como fallback do Suspense. */
export function CasesGridEstatico({ cases, segmentos }: { cases: CaseCard[]; segmentos: SegmentoChip[] }) {
  return <Grid ativo="" lista={cases} segmentos={segmentos} />;
}

function Grid({
  ativo,
  lista,
  segmentos,
  filtrar,
}: {
  ativo: string;
  lista: CaseCard[];
  segmentos: SegmentoChip[];
  filtrar?: (id: string) => void;
}) {
  const nome = (slug: string) => segmentos.find((s) => s.slug === slug)?.nome ?? "";
  const chips = [{ slug: "", nome: "Todos" }, ...segmentos];
  return (
    <>
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filtrar por segmento">
        {chips.map((c) => (
          <button
            key={c.slug || "todos"}
            type="button"
            onClick={() => filtrar?.(c.slug)}
            aria-pressed={ativo === c.slug}
            className={cn(
              "h-10 rounded-full border px-5 text-[15px] transition-colors",
              ativo === c.slug ? "border-azul bg-azul text-white" : "border-linha hover:border-tinta",
            )}
          >
            {c.nome}
          </button>
        ))}
      </div>

      <div key={ativo} className="mt-10 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c, i) => (
          <Link key={c.slug} href={`/cases/${c.slug}`} className="group entra block" style={{ "--d": `${Math.min(i, 6) * 0.06}s` } as React.CSSProperties}>
            <div className="foto foto-hover aspect-[4/3]">
              {c.capa && <Image src={c.capa} alt={c.titulo} fill sizes="(min-width:1024px) 32vw, (min-width:640px) 48vw, 100vw" className="object-cover" />}
              <span className="legenda bottom-4 left-4 translate-y-2 rounded-[6px] bg-white px-4 py-2 text-[14px] font-medium text-tinta opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Ver case →
              </span>
            </div>
            <div className="pt-5">
              <p className="text-[14px] text-pedra">{[nome(c.segmento), c.cidade].filter(Boolean).join(" · ")}</p>
              <h2 className="mt-1.5 text-[22px] leading-tight transition-colors group-hover:text-azul">{c.titulo}</h2>
              <p className="mt-2 max-w-[44ch] text-[15px] leading-snug text-pedra">{c.resumo}</p>
            </div>
          </Link>
        ))}
        {!lista.length && <p className="text-pedra">Nenhum case neste segmento ainda.</p>}
      </div>
    </>
  );
}
