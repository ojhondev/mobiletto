import type { Metadata } from "next";
import Link from "next/link";
import { Download, Settings2 } from "lucide-react";
import { exigirUsuario } from "@/lib/auth";
import { dataHora, listarLeads } from "@/lib/painel";
import { LinhaLead } from "@/components/painel/Leads";
import { STATUS_LEAD } from "@/lib/leads";
import { Cabecalho, Cartao, Vazio, cls } from "@/components/painel/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads do popup" };

export default async function Leads({ searchParams }: PageProps<"/painel/leads">) {
  await exigirUsuario();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && sp.status in STATUS_LEAD ? sp.status : "";
  const [lista, todos] = await Promise.all([listarLeads(status || undefined), status ? listarLeads() : Promise.resolve(null)]);
  const contagem = (todos ?? lista).reduce<Record<string, number>>((acc, l) => ((acc[l.status] = (acc[l.status] ?? 0) + 1), acc), {});
  const total = (todos ?? lista).length;

  return (
    <>
      <Cabecalho titulo="Leads do popup" descricao="Quem pediu orçamento pelo popup do site. O lead também já foi direto para o WhatsApp da Mobiletto com estes dados.">
        <Link href="/painel/paginas/popup" className={cls("secundario")}>
          <Settings2 className="size-4" /> Editar popup
        </Link>
        {total > 0 && (
          <a href="/painel/exportar-leads" download className={cls("secundario")}>
            <Download className="size-4" /> Exportar planilha
          </a>
        )}
      </Cabecalho>

      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-[#dcdad4] bg-white p-1 sm:inline-flex">
        {[["", `Todos (${total})`], ...Object.entries(STATUS_LEAD).map(([v, s]) => [v, `${s.r} (${contagem[v] ?? 0})`])].map(([v, r]) => (
          <Link key={v || "todos"} href={v ? `/painel/leads?status=${v}` : "/painel/leads"} className={cn("rounded-md px-3 py-1.5 text-[13px]", status === v ? "bg-azul text-white" : "hover:bg-[#f3f2ee]")}>
            {r}
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <Vazio
          titulo={status ? "Nenhum lead com este status" : "Nenhum lead ainda"}
          texto="Quando alguém preencher o popup de orçamento do site, o contato aparece aqui."
        />
      ) : (
        <Cartao>
          <ul className="divide-y divide-[#efede8]">
            {lista.map((l) => (
              <LinhaLead
                key={l.id}
                lead={{ id: l.id, nome: l.nome, email: l.email, whatsapp: l.whatsapp, origem: l.origem, status: l.status, anotacoes: l.anotacoes, quando: dataHora(l.criadoEm) }}
              />
            ))}
          </ul>
        </Cartao>
      )}
    </>
  );
}
