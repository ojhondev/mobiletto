"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  alternarPublicado,
  duplicarEntidade,
  excluirEntidade,
  moverEntidade,
  restaurarSecao,
  salvarEntidade,
  type Resultado,
} from "@/app/painel/acoes";
import type { Campo, Opcao } from "@/lib/cms/campos";
import { EditorCampos } from "./EditorCampos";
import { btn, cls } from "./ui";
import { cn } from "@/lib/utils";

function useAcao() {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const rodar = (fn: () => Promise<Resultado>, sucesso?: string, depois?: (r: Resultado) => void) =>
    iniciar(async () => {
      try {
        const r = await fn();
        if (!r.ok) return void toast.error(r.erro ?? "Não foi possível concluir.");
        if (sucesso) toast.success(sucesso);
        depois?.(r);
        router.refresh();
      } catch {
        toast.error("Falha de conexão. Tente de novo.");
      }
    });
  return { pendente, rodar, router };
}

export function RestaurarSecao({ chave }: { chave: string }) {
  const { pendente, rodar } = useAcao();
  return (
    <button
      type="button"
      disabled={pendente}
      onClick={() =>
        confirm("Voltar esta seção ao texto original do site? As alterações feitas aqui serão descartadas.") &&
        rodar(() => restaurarSecao(chave), "Texto original restaurado.", () => setTimeout(() => window.location.reload(), 300))
      }
      className={cls("fantasma")}
    >
      <RotateCcw className="size-4" /> Restaurar original
    </button>
  );
}

/** Botões de cada linha das listas (subir, descer, publicar, duplicar, excluir). */
export function AcoesLinha({
  tipo,
  id,
  publicado,
  primeiro,
  ultimo,
  nome,
}: {
  tipo: string;
  id: number;
  publicado: boolean;
  primeiro: boolean;
  ultimo: boolean;
  nome: string;
}) {
  const { pendente, rodar, router } = useAcao();
  return (
    <div className={cn("flex items-center", pendente && "pointer-events-none opacity-60")}>
      {pendente && <Loader2 className="mr-1 size-4 animate-spin text-pedra" />}
      <button type="button" onClick={() => rodar(() => moverEntidade(tipo, id, -1))} disabled={primeiro} className={btn.icone} title="Subir" aria-label="Subir">
        <ArrowUp className="size-4" />
      </button>
      <button type="button" onClick={() => rodar(() => moverEntidade(tipo, id, 1))} disabled={ultimo} className={btn.icone} title="Descer" aria-label="Descer">
        <ArrowDown className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => rodar(() => alternarPublicado(tipo, id), publicado ? "Escondido do site." : "Publicado no site.")}
        className={btn.icone}
        title={publicado ? "Esconder do site" : "Publicar no site"}
        aria-label={publicado ? "Esconder do site" : "Publicar no site"}
      >
        {publicado ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </button>
      <button
        type="button"
        onClick={() => rodar(() => duplicarEntidade(tipo, id), "Cópia criada (escondida do site).", (r) => r.id && router.push(`/painel/${tipo}/${r.id}`))}
        className={btn.icone}
        title="Duplicar"
        aria-label="Duplicar"
      >
        <Copy className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`) && rodar(() => excluirEntidade(tipo, id), "Excluído.")}
        className={cn(btn.icone, "hover:text-[#a12a1b]")}
        title="Excluir"
        aria-label="Excluir"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

/** Formulário de um produto/case/categoria… (criar ou editar). */
export function EditorEntidade({
  tipo,
  id,
  campos,
  inicial,
  opcoes,
}: {
  tipo: string;
  id: number | null;
  campos: Campo[];
  inicial: Record<string, unknown>;
  opcoes: Record<string, Opcao[]>;
}) {
  const router = useRouter();
  return (
    <EditorCampos
      campos={campos}
      inicial={inicial}
      opcoes={opcoes}
      salvar={(dados) => salvarEntidade(tipo, id, dados)}
      rotuloSalvar={id ? "Salvar alterações" : "Criar"}
      depoisDeSalvar={(r) => {
        if (!id && r.id) router.replace(`/painel/${tipo}/${r.id}`);
        else router.refresh();
      }}
    />
  );
}

export function ExcluirItem({ tipo, id, nome }: { tipo: string; id: number; nome: string }) {
  const { pendente, rodar, router } = useAcao();
  return (
    <button
      type="button"
      disabled={pendente}
      onClick={() => confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`) && rodar(() => excluirEntidade(tipo, id), "Excluído.", () => router.push(`/painel/${tipo}`))}
      className={cls("perigo")}
    >
      <Trash2 className="size-4" /> Excluir
    </button>
  );
}
