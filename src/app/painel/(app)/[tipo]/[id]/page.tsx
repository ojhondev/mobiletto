import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { exigirUsuario } from "@/lib/auth";
import { vazio } from "@/lib/cms/campos";
import { ENTIDADES, ehTipo } from "@/lib/cms/entidades";
import { entidadePorId, opcoesDinamicas } from "@/lib/painel";
import { EditorEntidade, ExcluirItem } from "@/components/painel/Acoes";
import { Cabecalho, Cartao, cls } from "@/components/painel/ui";

export async function generateMetadata({ params }: PageProps<"/painel/[tipo]/[id]">): Promise<Metadata> {
  const { tipo, id } = await params;
  if (!ehTipo(tipo)) return {};
  return { title: id === "novo" ? `Novo ${ENTIDADES[tipo].singular}` : ENTIDADES[tipo].plural };
}

export default async function EditarEntidade({ params }: PageProps<"/painel/[tipo]/[id]">) {
  await exigirUsuario();
  const { tipo, id: idTexto } = await params;
  if (!ehTipo(tipo)) notFound();
  const def = ENTIDADES[tipo];
  const novo = idTexto === "novo";
  const id = novo ? null : Number(idTexto);
  if (!novo && !Number.isInteger(id)) notFound();

  const item = id ? await entidadePorId(tipo, id) : null;
  if (!novo && !item) notFound();
  const inicial = Object.fromEntries(
    def.campos.map((c) => {
      const v = item?.[c.nome];
      if (c.nome === "publicado" && novo) return [c.nome, true];
      if (c.nome === "categoriaId") return [c.nome, v ? String(v) : ""];
      return [c.nome, v ?? vazio(c)];
    }),
  );
  const opcoes = await opcoesDinamicas(def.campos);
  const nome = item ? String(item[def.titulo] ?? "") : "";

  return (
    <>
      <Cabecalho
        voltar={{ href: `/painel/${tipo}`, label: def.plural }}
        titulo={novo ? `Novo ${def.singular}` : nome}
        descricao={novo ? "Preencha os campos e clique em Criar. Você pode voltar e editar quando quiser." : undefined}
      >
        {item && (
          <>
            <a href={def.link(String(item.slug))} target="_blank" rel="noopener noreferrer" className={cls("secundario")}>
              Ver no site <ExternalLink className="size-4" />
            </a>
            <ExcluirItem tipo={tipo} id={Number(item.id)} nome={nome} />
          </>
        )}
      </Cabecalho>
      <Cartao className="p-4 md:p-6">
        <EditorEntidade key={idTexto} tipo={tipo} id={id} campos={def.campos} inicial={inicial} opcoes={opcoes} />
      </Cartao>
    </>
  );
}
