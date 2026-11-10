"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { enviarCandidatura, enviarContato, type EstadoForm } from "@/app/actions";
import { categorias, segmentos, vagas } from "@/content/site";
import { botaoClasses } from "./Botao";
import { cn } from "@/lib/utils";

function Campo({
  rotulo,
  nome,
  erro,
  opcional,
  className,
  children,
}: {
  rotulo: string;
  nome: string;
  erro?: string;
  opcional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={nome} className="text-[14px] font-medium">
        {rotulo} {opcional && <span className="font-normal text-pedra">(opcional)</span>}
      </label>
      {children}
      {erro && (
        <p id={`${nome}-erro`} className="text-[13px] text-[#a12a1b]">
          {erro}
        </p>
      )}
    </div>
  );
}

/** Campo invisível para robôs (honeypot). */
function Armadilha() {
  return (
    <div className="hidden" aria-hidden>
      <label>
        Site <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Consentimento({ erro, texto }: { erro?: string; texto: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="flex items-start gap-3 text-[14px] leading-snug text-pedra">
        <input type="checkbox" name="consentimento" className="mt-0.5 size-4 shrink-0 accent-azul" aria-invalid={!!erro} />
        <span>{texto}</span>
      </label>
      {erro && <p className="text-[13px] text-[#a12a1b]">{erro}</p>}
    </div>
  );
}

function Sucesso({ estado, novo }: { estado: NonNullable<EstadoForm>; novo: () => void }) {
  return (
    <div className="grid justify-items-start gap-5 border-t-2 border-azul bg-marfim-suave p-8" role="status">
      <CheckCircle2 className="size-8 text-azul" strokeWidth={1.4} />
      <p className="max-w-[40ch] text-[22px] leading-snug">{estado.mensagem}</p>
      <button type="button" onClick={novo} className={botaoClasses("fantasma")}>
        Enviar outra mensagem
      </button>
    </div>
  );
}

const ASSUNTOS = [
  { id: "orcamento", label: "Orçamento" },
  { id: "projeto", label: "Projeto de ambiente" },
  { id: "catalogo", label: "Material técnico / catálogo" },
  { id: "arquiteto", label: "Sou arquiteto(a) ou designer" },
  { id: "pos-venda", label: "Pós-venda" },
  { id: "outro", label: "Outro assunto" },
];

export function FormContato({ origem = "fale-conosco", assuntoPadrao = "orcamento" }: { origem?: string; assuntoPadrao?: string }) {
  const [chave, setChave] = useState(0);
  return <FormContatoInterno key={chave} origem={origem} assuntoPadrao={assuntoPadrao} novo={() => setChave((k) => k + 1)} />;
}

function FormContatoInterno({ origem, assuntoPadrao, novo }: { origem: string; assuntoPadrao: string; novo: () => void }) {
  const [estado, acao, enviando] = useActionState(enviarContato, null);
  const [assunto, setAssunto] = useState(assuntoPadrao);
  const [mensagem, setMensagem] = useState("");

  // ?assunto=… e ?categoria=… vindos dos botões do site já preenchem o formulário
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = q.get("assunto");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- parâmetros da URL só existem no cliente
    if (a && ASSUNTOS.some((x) => x.id === a)) setAssunto(a);
    const cat = categorias.find((c) => c.id === q.get("categoria"));
    if (cat) setMensagem(`Gostaria de um orçamento para: ${cat.nome}.\n\n`);
  }, []);

  if (estado?.ok) return <Sucesso estado={estado} novo={novo} />;
  const e = estado?.erros ?? {};
  const v = estado?.valores ?? {};

  return (
    <form action={acao} className="grid gap-5" noValidate>
      <Armadilha />
      <input type="hidden" name="origem" value={origem} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo rotulo="Nome" nome="nome" erro={e.nome}>
          <input id="nome" name="nome" defaultValue={v.nome} className="campo" autoComplete="name" required aria-invalid={!!e.nome} />
        </Campo>
        <Campo rotulo="Empresa" nome="empresa" opcional>
          <input id="empresa" name="empresa" defaultValue={v.empresa} className="campo" autoComplete="organization" />
        </Campo>
        <Campo rotulo="E-mail" nome="email" erro={e.email}>
          <input id="email" name="email" defaultValue={v.email} type="email" className="campo" autoComplete="email" required aria-invalid={!!e.email} />
        </Campo>
        <Campo rotulo="Telefone / WhatsApp" nome="telefone" opcional>
          <input id="telefone" name="telefone" defaultValue={v.telefone} type="tel" className="campo" autoComplete="tel" inputMode="tel" />
        </Campo>
        <Campo rotulo="Assunto" nome="assunto">
          <select id="assunto" name="assunto" className="campo" value={assunto} onChange={(ev) => setAssunto(ev.target.value)}>
            {ASSUNTOS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Segmento" nome="segmento" opcional>
          <select id="segmento" name="segmento" className="campo" defaultValue={v.segmento ?? ""}>
            <option value="">Selecione</option>
            {segmentos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
            <option value="outro">Outro</option>
          </select>
        </Campo>
      </div>
      <Campo rotulo="Mensagem" nome="mensagem" erro={e.mensagem}>
        <textarea
          id="mensagem"
          name="mensagem"
          className="campo"
          rows={5}
          value={mensagem}
          onChange={(ev) => setMensagem(ev.target.value)}
          placeholder="Conte sobre o espaço: tipo de ambiente, metragem, número de pessoas e prazo da obra."
          aria-invalid={!!e.mensagem}
        />
      </Campo>
      <Consentimento
        erro={e.consentimento}
        texto={
          <>
            Autorizo a Mobiletto a usar estes dados para responder ao meu contato, conforme a{" "}
            <Link href="/politica-de-privacidade" className="underline">
              política de privacidade
            </Link>
            .
          </>
        }
      />
      {estado && !estado.ok && <p className="text-[14px] text-[#a12a1b]">{estado.mensagem}</p>}
      <div>
        <button type="submit" disabled={enviando} className={botaoClasses("primario", "min-w-[200px]")}>
          {enviando ? "Enviando…" : "Enviar mensagem"}
        </button>
      </div>
    </form>
  );
}

export function FormCandidatura() {
  const [chave, setChave] = useState(0);
  return <FormCandidaturaInterno key={chave} novo={() => setChave((k) => k + 1)} />;
}

function FormCandidaturaInterno({ novo }: { novo: () => void }) {
  const [estado, acao, enviando] = useActionState(enviarCandidatura, null);
  const [vaga, setVaga] = useState("");

  // botões "Candidatar-se" das vagas preenchem a vaga (#candidatura?vaga=…)
  useEffect(() => {
    const ler = () => {
      const v = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("vaga");
      if (v) setVaga(v);
    };
    ler();
    window.addEventListener("hashchange", ler);
    return () => window.removeEventListener("hashchange", ler);
  }, []);

  if (estado?.ok) return <Sucesso estado={estado} novo={novo} />;
  const e = estado?.erros ?? {};
  const v = estado?.valores ?? {};

  return (
    <form action={acao} className="grid gap-5" noValidate>
      <Armadilha />
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo rotulo="Nome completo" nome="nome" erro={e.nome}>
          <input id="nome" name="nome" defaultValue={v.nome} className="campo" autoComplete="name" aria-invalid={!!e.nome} />
        </Campo>
        <Campo rotulo="E-mail" nome="email" erro={e.email}>
          <input id="email" name="email" defaultValue={v.email} type="email" className="campo" autoComplete="email" aria-invalid={!!e.email} />
        </Campo>
        <Campo rotulo="Telefone / WhatsApp" nome="telefone" opcional>
          <input id="telefone" name="telefone" defaultValue={v.telefone} type="tel" className="campo" autoComplete="tel" />
        </Campo>
        <Campo rotulo="Cidade" nome="cidade" opcional>
          <input id="cidade" name="cidade" defaultValue={v.cidade} className="campo" autoComplete="address-level2" />
        </Campo>
        <Campo rotulo="Vaga" nome="vaga" erro={e.vaga}>
          <select id="vaga" name="vaga" className="campo" value={vaga} onChange={(ev) => setVaga(ev.target.value)} aria-invalid={!!e.vaga}>
            <option value="">Selecione</option>
            {vagas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.titulo}
              </option>
            ))}
            <option value="banco-de-talentos">Banco de talentos</option>
          </select>
        </Campo>
        <Campo rotulo="LinkedIn ou portfólio" nome="link" opcional>
          <input id="link" name="link" defaultValue={v.link} type="url" className="campo" placeholder="https://" />
        </Campo>
      </div>
      <Campo rotulo="Currículo (PDF ou Word, até 4 MB)" nome="curriculo" erro={e.curriculo}>
        <input
          id="curriculo"
          name="curriculo"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="campo h-auto py-3 text-[15px] file:mr-4 file:rounded-[6px] file:border-0 file:bg-cinza-claro file:px-4 file:py-2 file:text-[14px] file:font-medium"
          aria-invalid={!!e.curriculo}
        />
      </Campo>
      <Campo rotulo="Conte um pouco sobre você" nome="mensagem" opcional>
        <textarea id="mensagem" name="mensagem" className="campo" rows={4} defaultValue={v.mensagem} />
      </Campo>
      <Consentimento
        erro={e.consentimento}
        texto="Autorizo a Mobiletto a usar meus dados e meu currículo exclusivamente para processos seletivos."
      />
      {estado && !estado.ok && <p className="text-[14px] text-[#a12a1b]">{estado.mensagem}</p>}
      <div>
        <button type="submit" disabled={enviando} className={botaoClasses("primario", "min-w-[200px]")}>
          {enviando ? "Enviando…" : "Enviar candidatura"}
        </button>
      </div>
    </form>
  );
}
