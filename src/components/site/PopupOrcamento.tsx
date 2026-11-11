"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, MessageCircle, X } from "lucide-react";
import { capturarLead } from "@/app/actions";
import { botaoClasses } from "./Botao";

export type ConfigPopup = {
  ativo: boolean;
  atraso: string;
  diasParaReexibir: string;
  rotulo: string;
  titulo: string;
  texto: string;
  imagem: string;
  legenda: string;
  botao: string;
  whatsapp: string;
  mensagem: string;
  aviso: string;
};

const CHAVE = "mobiletto:popup-orcamento";
/** Páginas onde a pessoa já está preenchendo um formulário. */
const SEM_POPUP = ["/fale-conosco", "/trabalhe-conosco"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function mascaraTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function lerMemoria(): { fechadoEm?: number; enviado?: boolean } {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || "{}");
  } catch {
    return {};
  }
}
function gravarMemoria(v: { fechadoEm?: number; enviado?: boolean }) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(v));
  } catch {}
}

export function PopupOrcamento({ config }: { config: ConfigPopup }) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [enviado, setEnviado] = useState<string | null>(null);
  const [erros, setErros] = useState<Partial<Record<"nome" | "email" | "whatsapp", string>>>({});
  const [form, setForm] = useState({ nome: "", email: "", whatsapp: "", website: "" });
  const disparou = useRef(false);
  const primeiroCampo = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------ quando abrir */
  useEffect(() => {
    if (!config.ativo || SEM_POPUP.includes(pathname) || disparou.current) return;
    const mem = lerMemoria();
    if (mem.enviado) return;
    const dias = Math.max(0, Number(config.diasParaReexibir) || 0);
    if (mem.fechadoEm && Date.now() - mem.fechadoEm < dias * 86_400_000) return;

    const abrir = () => {
      if (disparou.current) return;
      disparou.current = true;
      setAberto(true);
      limpar();
    };
    const onScroll = () => window.scrollY > window.innerHeight * 0.9 && abrir();
    const t = window.setTimeout(abrir, Math.max(0, Number(config.atraso) || 4) * 1000);
    window.addEventListener("scroll", onScroll, { passive: true });
    function limpar() {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    }
    return limpar;
  }, [config.ativo, config.atraso, config.diasParaReexibir, pathname]);

  const fechar = useCallback(() => {
    setAberto(false);
    if (!enviado) gravarMemoria({ ...lerMemoria(), fechadoEm: Date.now() });
  }, [enviado]);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => primeiroCampo.current?.focus({ preventScroll: true }), 350);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [aberto, fechar]);

  if (!aberto) return null;

  /* ------------------------------------------------ envio */
  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const nome = form.nome.trim();
    const email = form.email.trim();
    const digitos = form.whatsapp.replace(/\D/g, "");
    const novos: typeof erros = {};
    if (nome.length < 2) novos.nome = "Informe seu nome.";
    if (!EMAIL.test(email)) novos.email = "Informe um e-mail válido.";
    if (digitos.length < 10) novos.whatsapp = "Informe o WhatsApp com DDD.";
    setErros(novos);
    if (Object.keys(novos).length) return;

    const pagina = `${window.location.origin}${pathname}`;
    const texto = [config.mensagem, "", `Nome: ${nome}`, `E-mail: ${email}`, `WhatsApp: ${form.whatsapp}`, `Página: ${pagina}`].join("\n");
    const url = `https://wa.me/${config.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`;

    // abre o WhatsApp no mesmo clique (fora dele o navegador bloqueia a nova aba)
    const aba = window.open(url, "_blank");
    if (aba) aba.opener = null;
    else window.location.href = url; // navegador bloqueou a nova aba (ex.: navegador interno de apps)

    // grava o lead para o painel em paralelo
    capturarLead({ nome, email, whatsapp: form.whatsapp, origem: pathname, website: form.website }).catch(() => {});
    gravarMemoria({ enviado: true });
    setEnviado(url);
  }

  return (
    <div className="popup-fundo fixed inset-0 z-[90] flex items-end justify-center bg-black/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-6" onClick={fechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-titulo"
        className="popup-caixa relative grid max-h-[94svh] w-full max-w-[920px] overflow-y-auto rounded-t-[10px] bg-white sm:rounded-[8px] md:grid-cols-[1fr_1.1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={fechar}
          className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-tinta transition-colors hover:bg-cinza-claro"
          aria-label="Fechar"
        >
          <X className="size-5" strokeWidth={1.6} />
        </button>

        <div className="relative hidden min-h-[520px] bg-tinta md:block">
          {config.imagem && <Image src={config.imagem} alt="" fill sizes="440px" className="object-cover" />}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          {config.legenda && <p className="absolute bottom-6 left-6 max-w-[22ch] text-[15px] leading-snug text-white">{config.legenda}</p>}
        </div>

        <div className="p-6 pt-14 sm:p-10 sm:pt-12">
          {enviado ? (
            <div className="grid min-h-[380px] content-center justify-items-start gap-5">
              <CheckCircle2 className="size-10 text-azul" strokeWidth={1.4} />
              <p className="text-h3">Pronto, {form.nome.trim().split(" ")[0]}!</p>
              <p className="text-[16px] leading-relaxed text-pedra">
                Abrimos o WhatsApp com os seus dados. É só enviar a mensagem para falar com um especialista da Mobiletto.
              </p>
              <a href={enviado} target="_blank" rel="noopener noreferrer" className={botaoClasses("primario")}>
                <MessageCircle className="size-4" strokeWidth={1.8} /> Abrir o WhatsApp de novo
              </a>
              <button type="button" onClick={() => setAberto(false)} className="text-[14px] text-pedra underline-offset-2 hover:underline">
                Continuar navegando
              </button>
            </div>
          ) : (
            <>
              {config.rotulo && <p className="text-[14px] font-medium text-azul">{config.rotulo}</p>}
              <h2 id="popup-titulo" className="mt-3 text-h3 leading-tight">
                {config.titulo}
              </h2>
              {config.texto && <p className="mt-3 text-[15.5px] leading-relaxed text-pedra">{config.texto}</p>}

              <form onSubmit={enviar} noValidate className="mt-7 grid gap-4">
                <div className="hidden" aria-hidden>
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                {(
                  [
                    { k: "nome", rotulo: "Nome", tipo: "text", auto: "name", modo: "text" },
                    { k: "email", rotulo: "E-mail", tipo: "email", auto: "email", modo: "email" },
                    { k: "whatsapp", rotulo: "WhatsApp", tipo: "tel", auto: "tel", modo: "tel" },
                  ] as const
                ).map((c, i) => (
                  <label key={c.k} className="grid gap-1.5">
                    <span className="text-[14px] font-medium">{c.rotulo}</span>
                    <input
                      ref={i === 0 ? primeiroCampo : undefined}
                      type={c.tipo}
                      inputMode={c.modo}
                      autoComplete={c.auto}
                      placeholder={c.k === "whatsapp" ? "(00) 00000-0000" : undefined}
                      value={form[c.k]}
                      onChange={(e) => setForm({ ...form, [c.k]: c.k === "whatsapp" ? mascaraTelefone(e.target.value) : e.target.value })}
                      className="campo"
                      aria-invalid={!!erros[c.k]}
                    />
                    {erros[c.k] && <span className="text-[13px] text-[#a12a1b]">{erros[c.k]}</span>}
                  </label>
                ))}
                <button type="submit" className={botaoClasses("primario", "mt-2 h-12 w-full text-[15px] tracking-[0.02em]")}>
                  <MessageCircle className="size-[18px]" strokeWidth={1.8} />
                  {config.botao}
                </button>
                {config.aviso && <p className="text-[12.5px] leading-snug text-pedra">{config.aviso}</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
