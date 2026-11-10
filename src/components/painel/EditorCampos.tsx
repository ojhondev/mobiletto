"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ImagePlus, Loader2, Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import type { Campo, Opcao } from "@/lib/cms/campos";
import { vazio } from "@/lib/cms/campos";
import type { Resultado } from "@/app/painel/acoes";
import { SeletorMidia } from "./SeletorMidia";
import { btn, cls } from "./ui";
import { cn } from "@/lib/utils";

type Valor = Record<string, unknown>;

const entrada =
  "w-full rounded-lg border border-[#dcdad4] bg-white px-3 text-[15px] outline-none transition-colors placeholder:text-[#a5a39c] focus:border-azul focus:ring-1 focus:ring-azul";

function mover<T>(arr: T[], i: number, d: number) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
}

/* ------------------------------------------------------- campos de mídia */

function CampoImagem({ valor, mudar, video }: { valor: string; mudar: (v: string) => void; video?: boolean }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="flex flex-wrap items-start gap-4">
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="group relative grid aspect-[16/10] w-56 place-items-center overflow-hidden rounded-lg border border-dashed border-[#cfccc4] bg-[#f6f5f1] text-pedra hover:border-azul"
      >
        {valor ? (
          video ? (
            <video src={valor} muted className="size-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={valor} alt="" className="size-full object-cover" />
          )
        ) : (
          <span className="grid justify-items-center gap-1 text-[13px]">
            {video ? <Video className="size-6" strokeWidth={1.5} /> : <ImagePlus className="size-6" strokeWidth={1.5} />}
            Escolher {video ? "vídeo" : "imagem"}
          </span>
        )}
      </button>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => setAberto(true)} className={cls("secundario", "h-9")}>
          {valor ? "Trocar" : "Escolher"}
        </button>
        {valor && (
          <button type="button" onClick={() => mudar("")} className={cls("fantasma", "h-9 text-[#a12a1b]")}>
            Remover
          </button>
        )}
      </div>
      <SeletorMidia aberto={aberto} fechar={() => setAberto(false)} escolher={([u]) => u && mudar(u)} tipo={video ? "video" : "imagem"} />
    </div>
  );
}

function CampoImagens({ valor, mudar }: { valor: string[]; mudar: (v: string[]) => void }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {valor.map((u, i) => (
          <li key={u + i} className="group relative overflow-hidden rounded-lg border border-[#e7e5e0] bg-[#f6f5f1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="aspect-[4/3] w-full object-cover" />
            {i === 0 && <span className="absolute top-2 left-2 rounded bg-azul px-1.5 py-0.5 text-[11px] font-medium text-white">Capa</span>}
            <div className="flex items-center justify-between bg-white px-1 py-1">
              <span className="flex">
                <button type="button" onClick={() => mudar(mover(valor, i, -1))} disabled={i === 0} className={btn.icone} aria-label="Mover para a esquerda">
                  <ArrowLeft className="size-4" />
                </button>
                <button type="button" onClick={() => mudar(mover(valor, i, 1))} disabled={i === valor.length - 1} className={btn.icone} aria-label="Mover para a direita">
                  <ArrowRight className="size-4" />
                </button>
              </span>
              <button type="button" onClick={() => mudar(valor.filter((_, k) => k !== i))} className={cn(btn.icone, "hover:text-[#a12a1b]")} aria-label="Remover">
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="grid aspect-[4/3] w-full place-items-center rounded-lg border border-dashed border-[#cfccc4] bg-[#f6f5f1] text-[13px] text-pedra hover:border-azul hover:text-azul"
          >
            <span className="grid justify-items-center gap-1">
              <ImagePlus className="size-6" strokeWidth={1.5} />
              Adicionar
            </span>
          </button>
        </li>
      </ul>
      <SeletorMidia aberto={aberto} fechar={() => setAberto(false)} multiplo escolher={(us) => mudar([...valor, ...us.filter((u) => !valor.includes(u))])} />
    </div>
  );
}

/* -------------------------------------------------------- listas e itens */

function CampoLista({ valor, mudar, item = "item" }: { valor: string[]; mudar: (v: string[]) => void; item?: string }) {
  return (
    <div className="grid gap-2">
      {valor.map((v, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            value={v}
            onChange={(e) => mudar(valor.map((x, k) => (k === i ? e.target.value : x)))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const c = [...valor];
                c.splice(i + 1, 0, "");
                mudar(c);
                setTimeout(() => (document.querySelectorAll<HTMLInputElement>(`[data-lista-item]`)[i + 1] as HTMLInputElement | undefined)?.focus());
              }
            }}
            data-lista-item
            className={cn(entrada, "h-10")}
          />
          <button type="button" onClick={() => mudar(mover(valor, i, -1))} disabled={i === 0} className={btn.icone} aria-label="Subir">
            <ArrowUp className="size-4" />
          </button>
          <button type="button" onClick={() => mudar(mover(valor, i, 1))} disabled={i === valor.length - 1} className={btn.icone} aria-label="Descer">
            <ArrowDown className="size-4" />
          </button>
          <button type="button" onClick={() => mudar(valor.filter((_, k) => k !== i))} className={cn(btn.icone, "hover:text-[#a12a1b]")} aria-label="Remover">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => mudar([...valor, ""])} className={cls("fantasma", "h-9 justify-self-start px-2 text-azul")}>
        <Plus className="size-4" /> Adicionar {item}
      </button>
    </div>
  );
}

function CampoItens({
  campo,
  valor,
  mudar,
  opcoes,
}: {
  campo: Extract<Campo, { tipo: "itens" }>;
  valor: Valor[];
  mudar: (v: Valor[]) => void;
  opcoes: Record<string, Opcao[]>;
}) {
  const [fechados, setFechados] = useState<Set<number>>(new Set());
  const novo = () => Object.fromEntries(campo.campos.map((c) => [c.nome, vazio(c)]));
  // segue a ordem dos campos (o jsonb do Postgres reordena as chaves)
  const resumo = (v: Valor) =>
    String(
      campo.campos.map((c) => v[c.nome]).find((x) => typeof x === "string" && x && !x.startsWith("/") && !x.startsWith("http")) ?? "",
    );
  return (
    <div className="grid gap-3">
      {valor.map((v, i) => {
        const fechado = fechados.has(i);
        return (
          <div key={i} className="rounded-lg border border-[#e7e5e0] bg-[#fbfbf9]">
            <div className="flex items-center gap-1 border-b border-[#efede8] px-3 py-1.5">
              <button
                type="button"
                onClick={() => setFechados((s) => {
                  const n = new Set(s);
                  if (n.has(i)) n.delete(i);
                  else n.add(i);
                  return n;
                })}
                className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left text-[13.5px] font-medium"
              >
                <ChevronDown className={cn("size-4 shrink-0 transition-transform", fechado && "-rotate-90")} />
                <span className="capitalize">{campo.item} {i + 1}</span>
                <span className="truncate font-normal text-pedra">{resumo(v) && `— ${resumo(v)}`}</span>
              </button>
              <button type="button" onClick={() => mudar(mover(valor, i, -1))} disabled={i === 0} className={btn.icone} aria-label="Subir">
                <ArrowUp className="size-4" />
              </button>
              <button type="button" onClick={() => mudar(mover(valor, i, 1))} disabled={i === valor.length - 1} className={btn.icone} aria-label="Descer">
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => confirm(`Remover este ${campo.item}?`) && mudar(valor.filter((_, k) => k !== i))}
                className={cn(btn.icone, "hover:text-[#a12a1b]")}
                aria-label="Remover"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            {!fechado && (
              <div className="p-4">
                <Campos campos={campo.campos} valor={v} mudar={(k, x) => mudar(valor.map((it, j) => (j === i ? { ...it, [k]: x } : it)))} opcoes={opcoes} compacto />
              </div>
            )}
          </div>
        );
      })}
      <button type="button" onClick={() => mudar([...valor, novo()])} className={cls("secundario", "h-9 justify-self-start")}>
        <Plus className="size-4" /> Adicionar {campo.item}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ renderizador */

function Campos({
  campos,
  valor,
  mudar,
  opcoes,
  compacto,
}: {
  campos: Campo[];
  valor: Valor;
  mudar: (nome: string, v: unknown) => void;
  opcoes: Record<string, Opcao[]>;
  compacto?: boolean;
}) {
  // itens só com textos curtos (ex.: nome + valor) ficam lado a lado
  const ladoALado = compacto && campos.length <= 3 && campos.every((c) => c.tipo === "texto");
  return (
    <div className={cn("grid", compacto ? "gap-4" : "gap-6", ladoALado && (campos.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"))}>
      {campos.map((c) => {
        const v = valor[c.nome] ?? vazio(c);
        const id = `campo-${c.nome}`;
        const rotulo = (
          <label htmlFor={id} className="text-[14px] font-medium">
            {c.rotulo}
          </label>
        );
        const ajuda = c.ajuda && <p className="text-[12.5px] text-pedra">{c.ajuda}</p>;
        let controle: React.ReactNode;
        switch (c.tipo) {
          case "texto":
            controle = <input id={id} value={String(v)} placeholder={c.placeholder} onChange={(e) => mudar(c.nome, e.target.value)} className={cn(entrada, "h-11")} />;
            break;
          case "textarea":
            controle = (
              <textarea id={id} value={String(v)} rows={c.linhas ?? 3} onChange={(e) => mudar(c.nome, e.target.value)} className={cn(entrada, "py-2.5 leading-relaxed")} />
            );
            break;
          case "booleano":
            return (
              <label key={c.nome} className="flex cursor-pointer items-center gap-3">
                <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", v ? "bg-azul" : "bg-[#d6d4cd]")}>
                  <input type="checkbox" checked={!!v} onChange={(e) => mudar(c.nome, e.target.checked)} className="peer sr-only" />
                  <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", v ? "left-[22px]" : "left-0.5")} />
                </span>
                <span className="text-[14px] font-medium">{c.rotulo}</span>
              </label>
            );
          case "select": {
            const ops = Array.isArray(c.opcoes) ? c.opcoes : (opcoes[c.nome] ?? []);
            controle = (
              <select id={id} value={String(v ?? "")} onChange={(e) => mudar(c.nome, e.target.value)} className={cn(entrada, "h-11")}>
                <option value="">— Nenhum —</option>
                {ops.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            );
            break;
          }
          case "imagem":
            controle = <CampoImagem valor={String(v)} mudar={(x) => mudar(c.nome, x)} />;
            break;
          case "video":
            controle = <CampoImagem valor={String(v)} mudar={(x) => mudar(c.nome, x)} video />;
            break;
          case "imagens":
            controle = <CampoImagens valor={v as string[]} mudar={(x) => mudar(c.nome, x)} />;
            break;
          case "lista":
            controle = <CampoLista valor={v as string[]} mudar={(x) => mudar(c.nome, x)} item={c.item} />;
            break;
          case "itens":
            controle = <CampoItens campo={c} valor={v as Valor[]} mudar={(x) => mudar(c.nome, x)} opcoes={opcoes} />;
            break;
        }
        return (
          <div key={c.nome} className="grid gap-2">
            {rotulo}
            {ajuda}
            {controle}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ formulário */

export function EditorCampos({
  campos,
  inicial,
  opcoes = {},
  salvar,
  depoisDeSalvar,
  rotuloSalvar = "Salvar alterações",
  extras,
}: {
  campos: Campo[];
  inicial: Valor;
  opcoes?: Record<string, Opcao[]>;
  salvar: (dados: Valor) => Promise<Resultado>;
  depoisDeSalvar?: (r: Resultado) => void;
  rotuloSalvar?: string;
  /** botões extras na barra de salvar (ex.: restaurar padrão) */
  extras?: React.ReactNode;
}) {
  const [valor, setValor] = useState<Valor>(inicial);
  const [sujo, setSujo] = useState(false);
  const [salvando, iniciar] = useTransition();

  const mudar = useCallback((nome: string, v: unknown) => {
    setValor((s) => ({ ...s, [nome]: v }));
    setSujo(true);
  }, []);

  const enviar = useCallback(() => {
    iniciar(async () => {
      try {
        const r = await salvar(valor);
        if (r.ok) {
          setSujo(false);
          toast.success("Salvo! O site já foi atualizado.");
          depoisDeSalvar?.(r);
        } else toast.error(r.erro ?? "Não foi possível salvar.");
      } catch {
        toast.error("Não foi possível salvar. Verifique a conexão e tente de novo.");
      }
    });
  }, [salvar, valor, depoisDeSalvar]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        enviar();
      }
    };
    const antesDeSair = (e: BeforeUnloadEvent) => {
      if (sujo) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", antesDeSair);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", antesDeSair);
    };
  }, [enviar, sujo]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
    >
      <Campos campos={campos} valor={valor} mudar={mudar} opcoes={opcoes} />
      <div className="sticky bottom-0 z-20 -mx-4 mt-8 flex flex-wrap items-center gap-3 border-t border-[#e7e5e0] bg-white/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <button type="submit" disabled={salvando} className={cls("primario", "min-w-[170px]")}>
          {salvando && <Loader2 className="size-4 animate-spin" />}
          {salvando ? "Salvando…" : rotuloSalvar}
        </button>
        {extras}
        <span className={cn("ml-auto text-[13px]", sujo ? "text-[#8a5a00]" : "text-pedra")}>
          {sujo ? "● Alterações não salvas" : "Tudo salvo"} <span className="hidden text-pedra sm:inline">· Ctrl+S salva</span>
        </span>
      </div>
    </form>
  );
}
