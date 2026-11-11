"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react";
import { CloudUpload, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { publicarSite } from "@/app/painel/acoes";
import { cls } from "./ui";

/**
 * Botão "Salvar e publicar" presente em todas as telas do painel.
 * O formulário aberto (EditorCampos) se registra aqui: se houver alterações não
 * salvas, o botão salva primeiro e depois republica o site inteiro.
 */

type EditorAberto = { sujo: () => boolean; salvar: () => Promise<boolean> };
const Ctx = createContext<{ registrar: (e: EditorAberto | null) => void } | null>(null);

export function useRegistrarEditor(editor: EditorAberto) {
  const ctx = useContext(Ctx);
  const ref = useRef(editor);
  useEffect(() => {
    ref.current = editor;
  });
  useEffect(() => {
    if (!ctx) return;
    ctx.registrar({ sujo: () => ref.current.sujo(), salvar: () => ref.current.salvar() });
    return () => ctx.registrar(null);
  }, [ctx]);
}

const formatar = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function PublicacaoProvider({
  ultima,
  children,
}: {
  /** texto já formatado no servidor (evita diferença de hidratação) */
  ultima: string | null;
  children: React.ReactNode;
}) {
  const editor = useRef<EditorAberto | null>(null);
  const registrar = useCallback((e: EditorAberto | null) => {
    editor.current = e;
  }, []);
  return (
    <Ctx.Provider value={{ registrar }}>
      <BarraPublicar ultima={ultima} editor={editor} />
      {children}
    </Ctx.Provider>
  );
}

function BarraPublicar({ ultima, editor }: { ultima: string | null; editor: React.RefObject<EditorAberto | null> }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [quando, setQuando] = useState(ultima);

  const publicar = () =>
    iniciar(async () => {
      try {
        const e = editor.current;
        if (e?.sujo()) {
          const ok = await e.salvar();
          if (!ok) return; // o próprio formulário já mostrou o erro
        }
        const r = await publicarSite();
        if (!r.ok) return void toast.error(r.erro ?? "Não foi possível publicar.");
        setQuando(r.em ? formatar(r.em) : null);
        toast.success("Site publicado! Todas as páginas já estão atualizadas.");
        router.refresh();
      } catch {
        toast.error("Falha de conexão ao publicar. Tente de novo.");
      }
    });

  return (
    <div className="sticky top-0 z-30 border-b border-[#e7e5e0] bg-white/95 backdrop-blur max-lg:top-14">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center gap-3 px-4 md:px-8">
        <span className="flex min-w-0 items-center gap-2 text-[13px] text-pedra">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#2f9e57] opacity-40" />
            <span className="relative size-2 rounded-full bg-[#2f9e57]" />
          </span>
          <span className="truncate">
            Site no ar{quando && <span className="hidden sm:inline"> · última publicação {quando}</span>}
          </span>
        </span>
        <a href="/" target="_blank" rel="noopener noreferrer" className={cls("secundario", "ml-auto hidden h-9 sm:inline-flex")}>
          Ver site <ExternalLink className="size-4" />
        </a>
        <button type="button" onClick={publicar} disabled={pendente} className={cls("primario", "h-9 max-sm:ml-auto")}>
          {pendente ? <Loader2 className="size-4 animate-spin" /> : <CloudUpload className="size-4" />}
          Salvar e publicar
        </button>
      </div>
    </div>
  );
}
