"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { Check, Copy, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { atualizarAlt, excluirMidia, type MidiaLeve } from "@/app/painel/acoes";
import { ACEITOS, enviarParaBiblioteca } from "./upload";
import { cls } from "./ui";
import { cn } from "@/lib/utils";

export function Biblioteca({ inicial }: { inicial: MidiaLeve[] }) {
  const [midias, setMidias] = useState(inicial);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"" | "imagem" | "video" | "blob">("");
  const [aberta, setAberta] = useState<MidiaLeve | null>(null);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return midias.filter((m) => {
      if (filtro === "imagem" && m.tipo.startsWith("video/")) return false;
      if (filtro === "video" && !m.tipo.startsWith("video/")) return false;
      if (filtro === "blob" && m.origem !== "blob") return false;
      return !q || m.nome.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q);
    });
  }, [midias, busca, filtro]);

  async function enviar(files: FileList | File[] | null) {
    const arr = files ? Array.from(files) : [];
    if (!arr.length) return;
    try {
      setEnviando(`Enviando 0 de ${arr.length}…`);
      const novos = await enviarParaBiblioteca(arr, (f, t) => setEnviando(`Enviando ${f} de ${t}…`));
      setMidias((m) => [...novos, ...m]);
      toast.success(novos.length > 1 ? `${novos.length} arquivos enviados.` : "Arquivo enviado.");
    } catch (e) {
      toast.error((e as Error).message || "Falha no envio.");
    } finally {
      setEnviando(null);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastando(false);
        enviar(e.dataTransfer.files);
      }}
    >
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-pedra" />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar pelo nome ou descrição" className="h-10 w-full rounded-lg border border-[#dcdad4] bg-white pr-3 pl-9 text-[14px] outline-none focus:border-azul" />
        </div>
        <div className="flex gap-1 rounded-lg border border-[#dcdad4] bg-white p-1">
          {([
            ["", "Tudo"],
            ["imagem", "Imagens"],
            ["video", "Vídeos"],
            ["blob", "Enviados"],
          ] as const).map(([v, r]) => (
            <button key={v} type="button" onClick={() => setFiltro(v)} className={cn("rounded-md px-3 py-1.5 text-[13px]", filtro === v ? "bg-azul text-white" : "hover:bg-[#f3f2ee]")}>
              {r}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => input.current?.click()} disabled={!!enviando} className={cls("primario", "ml-auto")}>
          {enviando ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {enviando ?? "Enviar arquivos"}
        </button>
        <input ref={input} type="file" accept={ACEITOS} multiple hidden onChange={(e) => enviar(e.target.files)} />
      </div>

      <div className={cn("rounded-xl border-2 border-dashed p-1 transition-colors", arrastando ? "border-azul bg-[#f4f7fb]" : "border-transparent")}>
        {lista.length === 0 ? (
          <p className="py-20 text-center text-[14px] text-pedra">Nenhum arquivo. Arraste fotos ou vídeos para cá.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {lista.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => setAberta(m)} className="block aspect-square w-full overflow-hidden rounded-lg bg-[#f0efeb] ring-azul ring-offset-2 hover:ring-2">
                  {m.tipo.startsWith("video/") ? (
                    <video src={m.url} muted className="size-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.alt} loading="lazy" className="size-full object-cover" />
                  )}
                </button>
                <p className="mt-1 truncate text-[12px] text-pedra">{m.nome}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-[12.5px] text-pedra">Fotos grandes são reduzidas automaticamente (até 2400px) antes do envio. Vídeos: MP4 ou WebM, sem áudio, de preferência curtos.</p>

      {aberta && (
        <DetalheMidia
          midia={aberta}
          fechar={() => setAberta(null)}
          aoMudar={(m) => {
            setMidias((l) => l.map((x) => (x.id === m.id ? m : x)));
            setAberta(m);
          }}
          aoExcluir={(id) => {
            setMidias((l) => l.filter((x) => x.id !== id));
            setAberta(null);
          }}
        />
      )}
    </div>
  );
}

function DetalheMidia({
  midia,
  fechar,
  aoMudar,
  aoExcluir,
}: {
  midia: MidiaLeve;
  fechar: () => void;
  aoMudar: (m: MidiaLeve) => void;
  aoExcluir: (id: number) => void;
}) {
  const [alt, setAlt] = useState(midia.alt);
  const [copiado, setCopiado] = useState(false);
  const [pendente, iniciar] = useTransition();
  const urlCompleta = midia.url.startsWith("http") ? midia.url : `${typeof window !== "undefined" ? window.location.origin : ""}${midia.url}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal onClick={fechar}>
      <div className="grid max-h-[92svh] w-full max-w-[920px] overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[1.4fr_1fr]" onClick={(e) => e.stopPropagation()}>
        <div className="grid min-h-[260px] place-items-center bg-[#1c1c1c]">
          {midia.tipo.startsWith("video/") ? (
            <video src={midia.url} controls muted className="max-h-[80svh] w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={midia.url} alt={midia.alt} className="max-h-[80svh] w-full object-contain" />
          )}
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[15px] font-semibold break-all">{midia.nome}</p>
            <button type="button" onClick={fechar} className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-[#efeeea]" aria-label="Fechar">
              <X className="size-5" />
            </button>
          </div>
          <p className="text-[13px] text-pedra">
            {midia.largura && midia.altura ? `${midia.largura} × ${midia.altura}px · ` : ""}
            {midia.origem === "blob" ? "Enviado pelo painel" : "Arquivo original do site"}
          </p>
          <label className="grid gap-1.5">
            <span className="text-[14px] font-medium">Descrição da imagem</span>
            <span className="text-[12.5px] text-pedra">Ajuda no Google e na acessibilidade. Ex.: “Recepção com balcão em madeira”.</span>
            <textarea value={alt} onChange={(e) => setAlt(e.target.value)} rows={3} className="rounded-lg border border-[#dcdad4] px-3 py-2 text-[14px] outline-none focus:border-azul" />
          </label>
          <button
            type="button"
            disabled={pendente || alt === midia.alt}
            onClick={() =>
              iniciar(async () => {
                await atualizarAlt(midia.id, alt);
                aoMudar({ ...midia, alt });
                toast.success("Descrição salva.");
              })
            }
            className={cls("secundario", "justify-self-start")}
          >
            Salvar descrição
          </button>
          <div className="grid gap-1.5">
            <span className="text-[14px] font-medium">Link do arquivo</span>
            <div className="flex gap-2">
              <input readOnly value={urlCompleta} className="h-10 min-w-0 flex-1 rounded-lg border border-[#dcdad4] bg-[#f6f5f1] px-3 text-[12.5px]" onFocus={(e) => e.target.select()} />
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(urlCompleta);
                  setCopiado(true);
                  setTimeout(() => setCopiado(false), 1500);
                }}
                className={cls("secundario", "w-10 px-0")}
                aria-label="Copiar link"
              >
                {copiado ? <Check className="size-4 text-[#1e6b34]" /> : <Copy className="size-4" />}
              </button>
            </div>
          </div>
          <div className="mt-auto border-t border-[#efede8] pt-4">
            <button
              type="button"
              disabled={pendente}
              onClick={() =>
                confirm("Excluir este arquivo da biblioteca? Se ele estiver sendo usado em alguma página, a imagem vai sumir de lá.") &&
                iniciar(async () => {
                  await excluirMidia(midia.id);
                  aoExcluir(midia.id);
                  toast.success("Arquivo excluído.");
                })
              }
              className={cls("perigo")}
            >
              <Trash2 className="size-4" /> Excluir arquivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
