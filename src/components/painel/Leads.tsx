"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, Mail, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { excluirLead, mudarStatusLead, salvarAnotacoesLead } from "@/app/painel/acoes";
import { STATUS_LEAD, type StatusLead as Status } from "@/lib/leads";
import { btn, cls } from "./ui";
import { cn } from "@/lib/utils";


export function LinhaLead({
  lead,
}: {
  lead: { id: number; nome: string; email: string; whatsapp: string; origem: string; status: Status; anotacoes: string; quando: string };
}) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [aberto, setAberto] = useState(false);
  const [notas, setNotas] = useState(lead.anotacoes);
  const [salvas, setSalvas] = useState(lead.anotacoes);
  const digitos = lead.whatsapp.replace(/\D/g, "");
  const whats = `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}?text=${encodeURIComponent(
    `Olá, ${lead.nome.split(" ")[0]}! Aqui é da Mobiletto. Recebemos seu pedido de orçamento pelo site.`,
  )}`;

  return (
    <li className={cn("px-4 py-3.5", pendente && "opacity-60")}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={() => setAberto((v) => !v)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <ChevronDown className={cn("size-4 shrink-0 text-pedra transition-transform", !aberto && "-rotate-90")} />
          <span className="min-w-0">
            <span className={cn("block truncate text-[15px]", lead.status === "novo" && "font-semibold")}>{lead.nome}</span>
            <span className="block truncate text-[13px] text-pedra">
              {lead.whatsapp} · {lead.email}
            </span>
          </span>
        </button>
        <span className="hidden text-[12.5px] text-pedra md:block">{lead.quando}</span>
        <select
          value={lead.status}
          disabled={pendente}
          onChange={(e) =>
            iniciar(async () => {
              await mudarStatusLead(lead.id, e.target.value as Status);
              router.refresh();
            })
          }
          className={cn("h-8 rounded-full border-0 px-3 text-[12.5px] font-medium outline-none", STATUS_LEAD[lead.status].cor)}
          aria-label="Status do lead"
        >
          {Object.entries(STATUS_LEAD).map(([v, s]) => (
            <option key={v} value={v}>
              {s.r}
            </option>
          ))}
        </select>
        <a href={whats} target="_blank" rel="noopener noreferrer" className={cls("primario", "h-8 px-3 text-[13px]")}>
          <MessageCircle className="size-4" /> WhatsApp
        </a>
        <a href={`mailto:${lead.email}`} className={btn.icone} title="Enviar e-mail" aria-label="Enviar e-mail">
          <Mail className="size-4" />
        </a>
        <button
          type="button"
          onClick={() =>
            confirm(`Excluir o lead "${lead.nome}"?`) &&
            iniciar(async () => {
              await excluirLead(lead.id);
              toast.success("Lead excluído.");
              router.refresh();
            })
          }
          className={cn(btn.icone, "hover:text-[#a12a1b]")}
          title="Excluir"
          aria-label="Excluir"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {aberto && (
        <div className="mt-3 grid gap-3 rounded-lg bg-[#f6f5f1] p-4 md:grid-cols-[1fr_1.4fr]">
          <dl className="grid content-start gap-2 text-[13.5px]">
            <div>
              <dt className="text-pedra">Recebido</dt>
              <dd>{lead.quando}</dd>
            </div>
            <div>
              <dt className="text-pedra">Página do site</dt>
              <dd className="break-all">{lead.origem || "—"}</dd>
            </div>
          </dl>
          <div className="grid gap-2">
            <label htmlFor={`notas-${lead.id}`} className="text-[13.5px] font-medium">
              Anotações internas
            </label>
            <textarea
              id={`notas-${lead.id}`}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Ex.: pediu orçamento para 20 estações; retornar segunda."
              className="rounded-lg border border-[#dcdad4] bg-white px-3 py-2 text-[14px] outline-none focus:border-azul"
            />
            <button
              type="button"
              disabled={pendente || notas === salvas}
              onClick={() =>
                iniciar(async () => {
                  await salvarAnotacoesLead(lead.id, notas);
                  setSalvas(notas);
                  toast.success("Anotação salva.");
                })
              }
              className={cls("secundario", "h-9 justify-self-start")}
            >
              Salvar anotação
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
