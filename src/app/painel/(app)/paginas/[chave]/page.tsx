import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { exigirUsuario } from "@/lib/auth";
import { getSecao } from "@/lib/cms/dados";
import { SECOES, type ChaveSecao } from "@/lib/cms/secoes";
import { CAMINHO_PAGINA } from "@/lib/cms/caminhos";
import { dataHora, secoesSalvas } from "@/lib/painel";
import { salvarSecao } from "@/app/painel/acoes";
import { EditorCampos } from "@/components/painel/EditorCampos";
import { RestaurarSecao } from "@/components/painel/Acoes";
import { Cabecalho, Cartao, cls } from "@/components/painel/ui";

export async function generateMetadata({ params }: PageProps<"/painel/paginas/[chave]">): Promise<Metadata> {
  const { chave } = await params;
  const s = SECOES[chave as ChaveSecao];
  return { title: s ? `${s.pagina} · ${s.titulo}` : "Página" };
}

export default async function EditarSecao({ params }: PageProps<"/painel/paginas/[chave]">) {
  await exigirUsuario();
  const { chave } = await params;
  if (!(chave in SECOES)) notFound();
  const def = SECOES[chave as ChaveSecao];
  const [valor, salvas] = await Promise.all([getSecao(chave as ChaveSecao), secoesSalvas()]);
  const salva = salvas.get(chave);
  const caminho = CAMINHO_PAGINA[def.pagina];

  return (
    <>
      <Cabecalho
        voltar={{ href: "/painel/paginas", label: "Páginas e textos" }}
        titulo={
          <>
            <span className="text-pedra">{def.pagina} ·</span> {def.titulo}
          </>
        }
        descricao={def.descricao ?? (salva ? `Última edição ${dataHora(salva.em)}${salva.por ? ` por ${salva.por}` : ""}.` : "Ainda com o texto original do site.")}
      >
        {caminho && (
          <a href={caminho} target="_blank" rel="noopener noreferrer" className={cls("secundario")}>
            Ver no site <ExternalLink className="size-4" />
          </a>
        )}
      </Cabecalho>
      <Cartao className="p-4 md:p-6">
        <EditorCampos
          campos={def.campos}
          inicial={valor as Record<string, unknown>}
          salvar={salvarSecao.bind(null, chave)}
          extras={salva ? <RestaurarSecao chave={chave} /> : undefined}
        />
      </Cartao>
    </>
  );
}
