"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cases, segmentoNome, segmentos, type SegmentoId } from "@/content/site";
import { cn } from "@/lib/utils";

export function CasesGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ativo = (params.get("segmento") ?? "") as SegmentoId | "";
  const lista = ativo ? cases.filter((c) => c.segmento === ativo) : cases;

  const filtrar = (id: string) => router.replace(id ? `${pathname}?segmento=${id}` : pathname, { scroll: false });

  return <Grid ativo={ativo} lista={lista} filtrar={filtrar} />;
}

/** Versão estática (sem filtro ativo), usada como fallback do Suspense. */
export function CasesGridEstatico() {
  return <Grid ativo="" lista={cases} />;
}

function Grid({
  ativo,
  lista,
  filtrar,
}: {
  ativo: SegmentoId | "";
  lista: typeof cases;
  filtrar?: (id: string) => void;
}) {
  const chips = [{ id: "", nome: "Todos" }, ...segmentos.map((s) => ({ id: s.id, nome: s.nome }))];
  return (
    <>
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filtrar por segmento">
        {chips.map((c) => (
          <button
            key={c.id || "todos"}
            type="button"
            onClick={() => filtrar?.(c.id)}
            aria-pressed={ativo === c.id}
            className={cn(
              "h-10 rounded-full border px-5 text-[15px] transition-colors",
              ativo === c.id ? "border-azul bg-azul text-white" : "border-linha hover:border-tinta",
            )}
          >
            {c.nome}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c) => (
          <Link key={c.slug} href={`/cases/${c.slug}`} className="group block">
            <div className="foto aspect-[4/3]">
              <Image src={c.capa} alt={c.titulo} fill sizes="(min-width:1024px) 32vw, (min-width:640px) 48vw, 100vw" className="object-cover" />
            </div>
            <div className="pt-5">
              <p className="text-[14px] text-pedra">
                {segmentoNome(c.segmento)} · {c.cidade}
              </p>
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
