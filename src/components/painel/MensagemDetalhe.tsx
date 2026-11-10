"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { excluirMensagem, mudarStatus, salvarAnotacoes } from "@/app/painel/acoes";
import { cls } from "./ui";
import { cn } from "@/lib/utils";

const STATUS = [
  { v: "nova", r: "Nova" },
  { v: "em-andamento", r: "Em andamento" },
  { v: "concluida", r: "Concluída" },
] as const;

export function StatusMensagem({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-[#dcdad4] bg-white p-1">
      {STATUS.map((s) => (
        <button
          key={s.v}
          type="button"
          disabled={pendente}
          onClick={() =>
            iniciar(async () => {
              await mudarStatus(id, s.v);
              router.refresh();
            })
          }
          className={cn("rounded-md px-3 py-1.5 text-[13px] transition-colors", status === s.v ? "bg-azul text-white" : "hover:bg-[#f3f2ee]")}
        >
          {s.r}
        </button>
      ))}
    </div>
  );
}

export function AnotacoesMensagem({ id, inicial }: { id: number; inicial: string }) {
  const [texto, setTexto] = useState(inicial);
  const [salvo, setSalvo] = useState(inicial);
  const [pendente, iniciar] = useTransition();
  return (
    <div className="grid gap-2">
      <label htmlFor="anotacoes" className="text-[14px] font-medium">
        Anotações internas
      </label>
      <textarea
        id="anotacoes"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={4}
        placeholder="Ex.: retornei por telefone, enviar proposta até sexta…"
        className="rounded-lg border border-[#dcdad4] px-3 py-2 text-[14px] outline-none focus:border-azul"
      />
      <button
        type="button"
        disabled={pendente || texto === salvo}
        onClick={() =>
          iniciar(async () => {
            await salvarAnotacoes(id, texto);
            setSalvo(texto);
            toast.success("Anotação salva.");
          })
        }
        className={cls("secundario", "h-9 justify-self-start")}
      >
        {pendente && <Loader2 className="size-4 animate-spin" />} Salvar anotação
      </button>
    </div>
  );
}

export function ExcluirMensagem({ id }: { id: number }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  return (
    <button
      type="button"
      disabled={pendente}
      onClick={() =>
        confirm("Excluir esta mensagem? O currículo anexado (se houver) também será apagado.") &&
        iniciar(async () => {
          await excluirMensagem(id);
          toast.success("Mensagem excluída.");
          router.push("/painel/mensagens");
        })
      }
      className={cls("perigo", "h-9")}
    >
      <Trash2 className="size-4" /> Excluir
    </button>
  );
}
