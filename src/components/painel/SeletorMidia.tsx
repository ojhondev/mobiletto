"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { buscarMidias, type MidiaLeve } from "@/app/painel/acoes";
import { ACEITOS, enviarParaBiblioteca } from "./upload";
import { cls } from "./ui";
import { cn } from "@/lib/utils";

/**
 * Janela de escolha de mídia (usada pelos campos de imagem/vídeo).
 * Mostra a biblioteca, permite buscar e enviar arquivos novos na hora.
 */
export function SeletorMidia({
  aberto,
  fechar,
  escolher,
  multiplo,
  tipo = "imagem",
}: {
  aberto: boolean;
  fechar: () => void;
  escolher: (urls: string[]) => void;
  multiplo?: boolean;
  tipo?: "imagem" | "video";
}) {
  const [midias, setMidias] = useState<MidiaLeve[] | null>(null);
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [enviando, setEnviando] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const fecharRef = useRef(fechar);
  useEffect(() => {
    fecharRef.current = fechar;
  }, [fechar]);

  // só reage à abertura: o componente pai pode re-renderizar (e recriar "fechar") a qualquer momento
  useEffect(() => {
    if (!aberto) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia a seleção ao abrir
    setSel([]);
    buscarMidias().then(setMidias).catch(() => toast.error("Não foi possível carregar a biblioteca."));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && fecharRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return (midias ?? []).filter((m) => (tipo === "video" ? m.tipo.startsWith("video/") : !m.tipo.startsWith("video/")) && (!q || m.nome.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q)));
  }, [midias, busca, tipo]);

  async function enviar(files: FileList | null) {
    if (!files?.length) return;
    try {
      setEnviando(`Enviando 0 de ${files.length}…`);
      const novos = await enviarParaBiblioteca(Array.from(files), (f, t) => setEnviando(`Enviando ${f} de ${t}…`));
      setMidias((m) => [...novos, ...(m ?? [])]);
      setSel((s) => (multiplo ? [...s, ...novos.map((n) => n.url)] : [novos[0].url]));
      toast.success(novos.length > 1 ? `${novos.length} arquivos enviados.` : "Arquivo enviado.");
    } catch (e) {
      toast.error((e as Error).message || "Falha no envio.");
    } finally {
      setEnviando(null);
      if (input.current) input.current.value = "";
    }
  }

  if (!aberto) return null;

  const alternar = (url: string) => setSel((s) => (multiplo ? (s.includes(url) ? s.filter((x) => x !== url) : [...s, url]) : [url]));

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal aria-label="Biblioteca de mídia" onClick={fechar}>
      <div className="flex max-h-[92svh] w-full max-w-[1040px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[#e7e5e0] p-4">
          <p className="text-[17px] font-semibold">{tipo === "video" ? "Escolher vídeo" : multiplo ? "Escolher imagens" : "Escolher imagem"}</p>
          <div className="relative ml-auto hidden sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-pedra" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar pelo nome" className="h-10 w-64 rounded-lg border border-[#dcdad4] pr-3 pl-9 text-[14px] outline-none focus:border-azul" />
          </div>
          <button type="button" onClick={() => input.current?.click()} disabled={!!enviando} className={cls("secundario", "ml-auto sm:ml-0")}>
            {enviando ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {enviando ?? "Enviar do computador"}
          </button>
          <input ref={input} type="file" accept={tipo === "video" ? "video/mp4,video/webm" : ACEITOS.replace(/,video\/[a-z0-9]+/g, "")} multiple={multiplo} hidden onChange={(e) => enviar(e.target.files)} />
          <button type="button" onClick={fechar} className="grid size-10 place-items-center rounded-lg hover:bg-[#efeeea]" aria-label="Fechar">
            <X className="size-5" />
          </button>
        </div>

        <div
          className="min-h-[300px] flex-1 overflow-y-auto p-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            enviar(e.dataTransfer.files);
          }}
        >
          {!midias ? (
            <div className="grid h-full place-items-center py-20 text-pedra">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : lista.length === 0 ? (
            <div className="grid place-items-center py-20 text-center text-pedra">
              <p>Nenhum arquivo {busca ? "encontrado" : "ainda"}.</p>
              <p className="mt-1 text-[13px]">Arraste arquivos para cá ou use “Enviar do computador”.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {lista.map((m) => {
                const marcado = sel.includes(m.url);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => alternar(m.url)}
                      onDoubleClick={() => {
                        if (!multiplo) {
                          escolher([m.url]);
                          fechar();
                        }
                      }}
                      className={cn("group relative block aspect-square w-full overflow-hidden rounded-lg bg-[#f0efeb] ring-offset-2 transition", marcado ? "ring-2 ring-azul" : "hover:ring-2 hover:ring-[#cfd6df]")}
                      title={m.nome}
                    >
                      {m.tipo.startsWith("video/") ? (
                        <video src={m.url} muted className="size-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element -- miniaturas de qualquer origem, sem otimização
                        <img src={m.url} alt={m.alt} loading="lazy" className="size-full object-cover" />
                      )}
                      {marcado && (
                        <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-azul text-white">
                          <Check className="size-4" />
                        </span>
                      )}
                    </button>
                    <p className="mt-1 truncate text-[12px] text-pedra">{m.nome}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#e7e5e0] p-4">
          <p className="text-[13px] text-pedra">{sel.length ? `${sel.length} selecionad${sel.length > 1 ? "as" : "a"}` : "Clique para selecionar"}</p>
          <div className="flex gap-2">
            <button type="button" onClick={fechar} className={cls("secundario")}>
              Cancelar
            </button>
            <button
              type="button"
              disabled={!sel.length}
              onClick={() => {
                escolher(sel);
                fechar();
              }}
              className={cls("primario")}
            >
              Usar {multiplo && sel.length > 1 ? `${sel.length} imagens` : tipo === "video" ? "vídeo" : "imagem"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
