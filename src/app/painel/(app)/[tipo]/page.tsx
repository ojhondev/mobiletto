import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { exigirUsuario } from "@/lib/auth";
import { ENTIDADES, ehTipo } from "@/lib/cms/entidades";
import { listarEntidades, nomesCategorias } from "@/lib/painel";
import { db, schema } from "@/lib/db";
import { AcoesLinha } from "@/components/painel/Acoes";
import { Cabecalho, Cartao, Selo, Vazio, cls } from "@/components/painel/ui";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/painel/[tipo]">): Promise<Metadata> {
  const { tipo } = await params;
  return { title: ehTipo(tipo) ? ENTIDADES[tipo].plural : "Painel" };
}

export default async function ListaEntidades({ params, searchParams }: PageProps<"/painel/[tipo]">) {
  await exigirUsuario();
  const { tipo } = await params;
  if (!ehTipo(tipo)) notFound();
  const def = ENTIDADES[tipo];
  const filtroCat = (await searchParams).categoria;
  const [itens, cats, segs] = await Promise.all([
    listarEntidades(tipo),
    tipo === "produtos" ? nomesCategorias() : Promise.resolve(new Map<number, string>()),
    tipo === "cases" ? db.select({ slug: schema.segmentos.slug, nome: schema.segmentos.nome }).from(schema.segmentos) : Promise.resolve([]),
  ]);
  const lista = tipo === "produtos" && filtroCat ? itens.filter((i) => String(i.categoriaId) === filtroCat) : itens;

  const capa = (i: Record<string, unknown>) =>
    String((def.capa ? i[def.capa] : undefined) || (Array.isArray(i.imagens) ? i.imagens[0] : "") || (Array.isArray(i.galeria) ? i.galeria[0] : "") || "");
  const detalhe = (i: Record<string, unknown>) => {
    if (tipo === "produtos") return cats.get(Number(i.categoriaId)) ?? "Sem categoria";
    if (tipo === "cases") return [segs.find((s) => s.slug === i.segmento)?.nome, i.cidade].filter(Boolean).join(" · ");
    if (tipo === "vagas") return [i.area, i.local, i.regime].filter(Boolean).join(" · ");
    if (tipo === "categorias") return String(i.descricao ?? "");
    return String(i.resumo ?? "");
  };

  return (
    <>
      <Cabecalho titulo={def.plural} descricao={def.descricao}>
        <Link href={`/painel/${tipo}/novo`} className={cls("primario")}>
          <Plus className="size-4" /> Novo {def.singular}
        </Link>
      </Cabecalho>

      {tipo === "produtos" && cats.size > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {[["", "Todas"], ...Array.from(cats.entries()).map(([id, nome]) => [String(id), nome])].map(([id, nome]) => (
            <Link
              key={id || "todas"}
              href={id ? `/painel/produtos?categoria=${id}` : "/painel/produtos"}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
                (filtroCat ?? "") === id ? "border-azul bg-azul text-white" : "border-[#dcdad4] bg-white hover:border-tinta",
              )}
            >
              {nome}
            </Link>
          ))}
        </div>
      )}

      {lista.length === 0 ? (
        <Vazio titulo={`Nenhum ${def.singular} ainda`} texto="Crie o primeiro e ele já aparece no site.">
          <Link href={`/painel/${tipo}/novo`} className={cls("primario")}>
            <Plus className="size-4" /> Novo {def.singular}
          </Link>
        </Vazio>
      ) : (
        <Cartao>
          <ul className="divide-y divide-[#efede8]">
            {lista.map((i, k) => {
              const id = Number(i.id);
              const nome = String(i[def.titulo] ?? "");
              const img = capa(i);
              return (
                <li key={id} className="flex items-center gap-4 px-4 py-3 hover:bg-[#fafaf8]">
                  <Link href={`/painel/${tipo}/${id}`} className="flex min-w-0 flex-1 items-center gap-4">
                    {(def.capa || tipo === "produtos" || tipo === "cases") && (
                      <span className="size-14 shrink-0 overflow-hidden rounded-lg bg-[#f0efeb]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {img && <img src={img} alt="" className="size-full object-cover" />}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-medium">{nome}</span>
                        {!i.publicado && <Selo>Escondido</Selo>}
                        {Boolean(i.destaque) && <Selo cor="azul">Destaque</Selo>}
                      </span>
                      <span className="block truncate text-[13px] text-pedra">{detalhe(i)}</span>
                    </span>
                  </Link>
                  <a
                    href={def.link(String(i.slug))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden size-9 place-items-center rounded-lg text-[#555] hover:bg-[#efeeea] sm:grid"
                    title="Ver no site"
                    aria-label="Ver no site"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                  <AcoesLinha
                    tipo={tipo}
                    id={id}
                    nome={nome}
                    publicado={Boolean(i.publicado)}
                    primeiro={k === 0 || !!filtroCat}
                    ultimo={k === lista.length - 1 || !!filtroCat}
                  />
                </li>
              );
            })}
          </ul>
        </Cartao>
      )}
      <p className="mt-3 text-[12.5px] text-pedra">A ordem desta lista é a ordem em que os itens aparecem no site. Use as setas para reorganizar.</p>
    </>
  );
}
