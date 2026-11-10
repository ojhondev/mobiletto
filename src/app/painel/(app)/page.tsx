import Link from "next/link";
import { ArrowRight, FileText, Images, Inbox, Package, PanelsTopLeft, Plus } from "lucide-react";
import { exigirUsuario } from "@/lib/auth";
import { contagens, dataHora, ultimasMensagens } from "@/lib/painel";
import { Cartao, Selo, cls } from "@/components/painel/ui";

const TIPO_MSG: Record<string, string> = { contato: "Contato", candidatura: "Candidatura", "linha-especial": "Linha especial" };

export default async function Painel({ searchParams }: PageProps<"/painel">) {
  const u = await exigirUsuario();
  const [n, ultimas] = await Promise.all([contagens(), ultimasMensagens()]);
  const negado = (await searchParams).negado;

  const cards = [
    { href: "/painel/mensagens?status=nova", label: "Mensagens novas", valor: n.novas, icone: Inbox, destaque: n.novas > 0 },
    { href: "/painel/produtos", label: "Produtos no catálogo", valor: n.produtos, icone: Package },
    { href: "/painel/cases", label: "Cases publicados", valor: n.cases, icone: FileText },
    { href: "/painel/midia", label: "Arquivos na biblioteca", valor: n.midias, icone: Images },
  ];

  const atalhos = [
    { href: "/painel/produtos/novo", label: "Novo produto" },
    { href: "/painel/cases/novo", label: "Novo case" },
    { href: "/painel/paginas/home.hero", label: "Editar a home" },
    { href: "/painel/midia", label: "Enviar imagens" },
    { href: "/painel/vagas/novo", label: "Nova vaga" },
    { href: "/painel/paginas/contato", label: "Contatos e WhatsApp" },
  ];

  return (
    <>
      {negado && <p className="mb-6 rounded-lg bg-[#fdf3dc] px-4 py-3 text-[14px] text-[#8a5a00]">Essa área é só para administradores.</p>}
      <div className="mb-8">
        <h1 className="text-[30px] font-semibold tracking-[-0.02em]">Olá, {u.nome.split(" ")[0]}.</h1>
        <p className="mt-1 text-[15px] text-pedra">Tudo o que você altera aqui aparece no site na mesma hora.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ href, label, valor, icone: Icone, destaque }) => (
          <Link key={href} href={href} className="group">
            <Cartao className={`p-5 transition-colors group-hover:border-azul/40 ${destaque ? "border-azul/40 bg-[#f4f7fb]" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] text-pedra">{label}</span>
                <Icone className={`size-5 ${destaque ? "text-azul" : "text-[#9a978f]"}`} strokeWidth={1.6} />
              </div>
              <p className="mt-3 text-[34px] leading-none font-semibold tracking-[-0.03em]">{valor}</p>
            </Cartao>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Cartao>
          <div className="flex items-center justify-between border-b border-[#efede8] px-5 py-4">
            <h2 className="text-[16px] font-semibold">Últimas mensagens</h2>
            <Link href="/painel/mensagens" className="inline-flex items-center gap-1 text-[13.5px] text-azul hover:underline">
              Ver todas <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {ultimas.length === 0 ? (
            <p className="px-5 py-10 text-center text-[14px] text-pedra">Nenhuma mensagem ainda. Os contatos e currículos enviados pelo site aparecem aqui.</p>
          ) : (
            <ul className="divide-y divide-[#efede8]">
              {ultimas.map((m) => (
                <li key={m.id}>
                  <Link href={`/painel/mensagens?id=${m.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#fafaf8]">
                    <span className={`size-2 shrink-0 rounded-full ${m.status === "nova" ? "bg-azul" : "bg-transparent"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={`truncate text-[14.5px] ${m.status === "nova" ? "font-semibold" : ""}`}>{m.nome}</span>
                        <Selo cor={m.tipo === "candidatura" ? "amarelo" : "azul"}>{TIPO_MSG[m.tipo] ?? m.tipo}</Selo>
                      </span>
                      <span className="block truncate text-[13px] text-pedra">{m.mensagem || m.assunto || m.email}</span>
                    </span>
                    <span className="hidden shrink-0 text-[12.5px] text-pedra sm:block">{dataHora(m.criadoEm)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Cartao>

        <div className="grid content-start gap-6">
          <Cartao className="p-5">
            <h2 className="text-[16px] font-semibold">Atalhos</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {atalhos.map((a) => (
                <Link key={a.href} href={a.href} className="flex items-center gap-2 rounded-lg border border-[#e7e5e0] px-3 py-2.5 text-[13.5px] hover:border-azul/40 hover:bg-[#f4f7fb]">
                  <Plus className="size-4 shrink-0 text-azul" />
                  {a.label}
                </Link>
              ))}
            </div>
          </Cartao>
          <Cartao className="p-5">
            <div className="flex items-start gap-3">
              <PanelsTopLeft className="mt-0.5 size-5 shrink-0 text-azul" strokeWidth={1.6} />
              <div>
                <h2 className="text-[16px] font-semibold">Como editar o site</h2>
                <ul className="mt-2 grid gap-1.5 text-[13.5px] text-pedra">
                  <li>• <b className="font-medium text-tinta">Páginas e textos</b>: títulos, textos e fotos de cada página.</li>
                  <li>• <b className="font-medium text-tinta">Produtos</b> e <b className="font-medium text-tinta">Categorias</b>: o catálogo.</li>
                  <li>• <b className="font-medium text-tinta">Biblioteca de mídia</b>: todas as imagens e vídeos.</li>
                  <li>• Itens despublicados somem do site, mas continuam salvos aqui.</li>
                </ul>
                <Link href="/painel/paginas" className={cls("secundario", "mt-4 h-9")}>
                  Ir para Páginas e textos
                </Link>
              </div>
            </div>
          </Cartao>
        </div>
      </div>
    </>
  );
}
