import { getUsuario } from "@/lib/auth";
import { dataHora, listarLeads } from "@/lib/painel";

/** Planilha (CSV, abre no Excel/Google Planilhas) com todos os leads do popup. */
export async function GET() {
  if (!(await getUsuario())) return new Response("Não autorizado", { status: 401 });
  const leads = await listarLeads();
  const STATUS: Record<string, string> = { novo: "Novo", "em-contato": "Em contato", convertido: "Convertido", descartado: "Descartado" };
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const linhas = [
    ["Data", "Nome", "E-mail", "WhatsApp", "Status", "Página", "Anotações"],
    ...leads.map((l) => [dataHora(l.criadoEm), l.nome, l.email, l.whatsapp, STATUS[l.status] ?? l.status, l.origem, l.anotacoes]),
  ];
  // ";" + BOM: o Excel em português abre com acentos e colunas certas
  const csv = "﻿" + linhas.map((l) => l.map(esc).join(";")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-mobiletto.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
