import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { exigirUsuario } from "@/lib/auth";
import { PAGINAS, SECOES } from "@/lib/cms/secoes";
import { dataHora, secoesSalvas } from "@/lib/painel";
import { Cabecalho, Cartao, Selo } from "@/components/painel/ui";
import { CAMINHO_PAGINA } from "@/lib/cms/caminhos";

export const metadata: Metadata = { title: "Páginas e textos" };

export default async function Paginas() {
  await exigirUsuario();
  const salvas = await secoesSalvas();
  const porPagina = PAGINAS.map((p) => ({
    pagina: p,
    secoes: Object.entries(SECOES).filter(([, s]) => s.pagina === p),
  }));

  return (
    <>
      <Cabecalho
        titulo="Páginas e textos"
        descricao="Títulos, textos, fotos e botões de cada página do site. Produtos, cases, segmentos e vagas têm telas próprias no menu."
      />
      <div className="grid gap-6">
        {porPagina.map(({ pagina, secoes }) => (
          <Cartao key={pagina}>
            <div className="flex items-center justify-between border-b border-[#efede8] px-5 py-3.5">
              <h2 className="text-[16px] font-semibold">{pagina}</h2>
              {CAMINHO_PAGINA[pagina] && (
                <a href={CAMINHO_PAGINA[pagina]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-pedra hover:text-azul">
                  Ver página <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
            <ul className="divide-y divide-[#efede8]">
              {secoes.map(([chave, s]) => {
                const salva = salvas.get(chave);
                return (
                  <li key={chave}>
                    <Link href={`/painel/paginas/${chave}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#fafaf8]">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14.5px] font-medium">{s.titulo}</span>
                        {s.descricao && <span className="block truncate text-[13px] text-pedra">{s.descricao}</span>}
                      </span>
                      {salva ? (
                        <span className="hidden text-right text-[12.5px] text-pedra sm:block">
                          Editado {dataHora(salva.em)}
                          {salva.por && <> · {salva.por}</>}
                        </span>
                      ) : (
                        <Selo>Texto original</Selo>
                      )}
                      <ChevronRight className="size-4 shrink-0 text-[#9a978f]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Cartao>
        ))}
      </div>
    </>
  );
}
