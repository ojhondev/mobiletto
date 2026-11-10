import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail, MessageCircle, Phone } from "lucide-react";
import { exigirUsuario } from "@/lib/auth";
import { dataHora, listarMensagens, mensagemPorId } from "@/lib/painel";
import { AnotacoesMensagem, ExcluirMensagem, StatusMensagem } from "@/components/painel/MensagemDetalhe";
import { Cabecalho, Cartao, Selo, Vazio, cls } from "@/components/painel/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mensagens" };

const TIPOS = [
  { v: "", r: "Todas" },
  { v: "contato", r: "Contatos" },
  { v: "candidatura", r: "Candidaturas" },
  { v: "linha-especial", r: "Linha especial" },
];
const ROTULO_TIPO: Record<string, string> = { contato: "Contato", candidatura: "Candidatura", "linha-especial": "Linha especial" };
const ROTULO_STATUS: Record<string, { r: string; cor: "azul" | "amarelo" | "verde" }> = {
  nova: { r: "Nova", cor: "azul" },
  "em-andamento": { r: "Em andamento", cor: "amarelo" },
  concluida: { r: "Concluída", cor: "verde" },
};
const ASSUNTOS: Record<string, string> = {
  orcamento: "Orçamento",
  projeto: "Projeto de ambiente",
  catalogo: "Material técnico / catálogo",
  arquiteto: "Arquiteto(a) ou designer",
  "pos-venda": "Pós-venda",
  outro: "Outro assunto",
};

export default async function Mensagens({ searchParams }: PageProps<"/painel/mensagens">) {
  await exigirUsuario();
  const sp = await searchParams;
  const tipo = typeof sp.tipo === "string" ? sp.tipo : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const id = Number(sp.id) || null;
  const [lista, aberta] = await Promise.all([listarMensagens({ tipo, status }), id ? mensagemPorId(id) : Promise.resolve(null)]);

  const link = (p: Record<string, string>) => {
    const q = new URLSearchParams({ ...(tipo && { tipo }), ...(status && { status }), ...p });
    for (const [k, v] of [...q.entries()]) if (!v) q.delete(k);
    const s = q.toString();
    return `/painel/mensagens${s ? `?${s}` : ""}`;
  };
  const tel = aberta?.telefone.replace(/\D/g, "") ?? "";
  const whats = tel ? `https://wa.me/${tel.length <= 11 ? `55${tel}` : tel}` : null;

  return (
    <>
      <Cabecalho titulo="Mensagens" descricao="Contatos, pedidos de orçamento e currículos enviados pelo site." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-lg border border-[#dcdad4] bg-white p-1">
          {TIPOS.map((t) => (
            <Link key={t.v} href={link({ tipo: t.v, id: "" })} className={cn("rounded-md px-3 py-1.5 text-[13px]", tipo === t.v ? "bg-azul text-white" : "hover:bg-[#f3f2ee]")}>
              {t.r}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-[#dcdad4] bg-white p-1">
          {[{ v: "", r: "Qualquer status" }, ...Object.entries(ROTULO_STATUS).map(([v, s]) => ({ v, r: s.r }))].map((s) => (
            <Link key={s.v} href={link({ status: s.v, id: "" })} className={cn("rounded-md px-3 py-1.5 text-[13px]", status === s.v ? "bg-tinta text-white" : "hover:bg-[#f3f2ee]")}>
              {s.r}
            </Link>
          ))}
        </div>
      </div>

      {lista.length === 0 && !aberta ? (
        <Vazio titulo="Nenhuma mensagem por aqui" texto="Quando alguém preencher um formulário do site, a mensagem aparece nesta lista." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <Cartao className={cn(aberta && "hidden lg:block")}>
            <ul className="max-h-[75svh] divide-y divide-[#efede8] overflow-y-auto">
              {lista.map((m) => (
                <li key={m.id}>
                  <Link href={link({ id: String(m.id) })} className={cn("block px-4 py-3.5 hover:bg-[#fafaf8]", m.id === id && "bg-[#f4f7fb]")}>
                    <span className="flex items-center gap-2">
                      {m.status === "nova" && <span className="size-2 shrink-0 rounded-full bg-azul" />}
                      <span className={cn("truncate text-[14.5px]", m.status === "nova" && "font-semibold")}>{m.nome}</span>
                      <span className="ml-auto shrink-0 text-[12px] text-pedra">{dataHora(m.criadoEm)}</span>
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <Selo cor={m.tipo === "candidatura" ? "amarelo" : "azul"}>{ROTULO_TIPO[m.tipo] ?? m.tipo}</Selo>
                      <span className="truncate text-[13px] text-pedra">{m.tipo === "candidatura" ? m.assunto : m.mensagem}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Cartao>

          {aberta ? (
            <Cartao className="p-5 md:p-6">
              <Link href={link({ id: "" })} className="mb-4 inline-block text-[13px] text-pedra hover:text-tinta lg:hidden">
                ← Voltar à lista
              </Link>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Selo cor={aberta.tipo === "candidatura" ? "amarelo" : "azul"}>{ROTULO_TIPO[aberta.tipo] ?? aberta.tipo}</Selo>
                    <Selo cor={ROTULO_STATUS[aberta.status]?.cor}>{ROTULO_STATUS[aberta.status]?.r}</Selo>
                  </div>
                  <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">{aberta.nome}</h2>
                  <p className="text-[13px] text-pedra">Recebida em {dataHora(aberta.criadoEm)}</p>
                </div>
                <ExcluirMensagem id={aberta.id} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`mailto:${aberta.email}`} className={cls("secundario", "h-9")}>
                  <Mail className="size-4" /> {aberta.email}
                </a>
                {aberta.telefone && (
                  <a href={`tel:${tel}`} className={cls("secundario", "h-9")}>
                    <Phone className="size-4" /> {aberta.telefone}
                  </a>
                )}
                {whats && (
                  <a href={whats} target="_blank" rel="noopener noreferrer" className={cls("secundario", "h-9")}>
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                )}
                {aberta.arquivo && (
                  <a href={aberta.arquivo} target="_blank" rel="noopener noreferrer" className={cls("primario", "h-9")}>
                    <Download className="size-4" /> Baixar currículo
                  </a>
                )}
              </div>

              <dl className="mt-6 grid gap-x-6 sm:grid-cols-2">
                {[
                  ["Empresa", aberta.empresa],
                  [aberta.tipo === "candidatura" ? "Vaga" : "Assunto", ASSUNTOS[aberta.assunto] ?? aberta.assunto],
                  ["Segmento", aberta.segmento],
                  ["Cidade", aberta.extra.cidade],
                  ["LinkedIn / portfólio", aberta.extra.link],
                  ["Enviado de", aberta.extra.origem],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="border-b border-[#efede8] py-2.5">
                      <dt className="text-[12.5px] text-pedra">{k}</dt>
                      <dd className="text-[14.5px] break-words">
                        {k === "LinkedIn / portfólio" ? (
                          <a href={String(v)} target="_blank" rel="noopener noreferrer" className="text-azul underline">
                            {v}
                          </a>
                        ) : (
                          v
                        )}
                      </dd>
                    </div>
                  ))}
              </dl>

              {aberta.mensagem && (
                <div className="mt-6">
                  <p className="text-[12.5px] text-pedra">Mensagem</p>
                  <p className="mt-1.5 rounded-lg bg-[#f6f5f1] p-4 text-[15px] leading-relaxed whitespace-pre-line">{aberta.mensagem}</p>
                </div>
              )}

              <div className="mt-6 grid gap-2">
                <p className="text-[14px] font-medium">Status</p>
                <StatusMensagem id={aberta.id} status={aberta.status} />
              </div>
              <div className="mt-6">
                <AnotacoesMensagem key={aberta.id} id={aberta.id} inicial={aberta.anotacoes} />
              </div>
            </Cartao>
          ) : (
            <div className="hidden place-items-center rounded-xl border border-dashed border-[#d9d7d0] text-[14px] text-pedra lg:grid">Selecione uma mensagem para ver os detalhes.</div>
          )}
        </div>
      )}
    </>
  );
}
