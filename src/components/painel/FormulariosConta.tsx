"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { entrar, trocarSenha, type EstadoLogin, type EstadoSenha } from "@/app/painel/acoes";
import { cls } from "./ui";
import { cn } from "@/lib/utils";

const entrada =
  "h-11 w-full rounded-lg border border-[#dcdad4] bg-white px-3 text-[15px] outline-none transition-colors focus:border-azul focus:ring-1 focus:ring-azul";

function Senha({ nome, rotulo, autoComplete }: { nome: string; rotulo: string; autoComplete: string }) {
  const [ver, setVer] = useState(false);
  return (
    <label className="grid gap-1.5">
      <span className="text-[14px] font-medium">{rotulo}</span>
      <span className="relative">
        <input name={nome} type={ver ? "text" : "password"} autoComplete={autoComplete} required className={cn(entrada, "pr-11")} />
        <button
          type="button"
          onClick={() => setVer((v) => !v)}
          className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-md text-pedra hover:text-tinta"
          aria-label={ver ? "Esconder senha" : "Mostrar senha"}
        >
          {ver ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>
    </label>
  );
}

export function FormLogin({ voltar }: { voltar?: string }) {
  const [estado, acao, enviando] = useActionState<EstadoLogin, FormData>(entrar, null);
  return (
    <form action={acao} className="grid gap-4">
      <input type="hidden" name="voltar" value={voltar ?? ""} />
      <label className="grid gap-1.5">
        <span className="text-[14px] font-medium">E-mail</span>
        <input name="email" type="email" autoComplete="username" required defaultValue={estado?.email} className={entrada} />
      </label>
      <Senha nome="senha" rotulo="Senha" autoComplete="current-password" />
      {estado?.erro && <p className="rounded-lg bg-[#fbeeec] px-3 py-2 text-[14px] text-[#a12a1b]">{estado.erro}</p>}
      <button type="submit" disabled={enviando} className={cls("primario", "mt-1 h-11")}>
        {enviando && <Loader2 className="size-4 animate-spin" />}
        Entrar
      </button>
    </form>
  );
}

export function FormTrocarSenha({ primeiroAcesso }: { primeiroAcesso?: boolean }) {
  const [estado, acao, enviando] = useActionState<EstadoSenha, FormData>(trocarSenha, null);
  return (
    <form action={acao} className="grid gap-4" key={estado?.ok ? "ok" : "form"}>
      <Senha nome="atual" rotulo={primeiroAcesso ? "Senha provisória" : "Senha atual"} autoComplete="current-password" />
      <Senha nome="nova" rotulo="Nova senha (mínimo 8 caracteres)" autoComplete="new-password" />
      <Senha nome="confirmar" rotulo="Confirme a nova senha" autoComplete="new-password" />
      {estado?.erro && <p className="rounded-lg bg-[#fbeeec] px-3 py-2 text-[14px] text-[#a12a1b]">{estado.erro}</p>}
      {estado?.ok && <p className="rounded-lg bg-[#e6f4ea] px-3 py-2 text-[14px] text-[#1e6b34]">Senha alterada. Outros aparelhos conectados foram desconectados.</p>}
      <button type="submit" disabled={enviando} className={cls("primario", "mt-1 h-11")}>
        {enviando && <Loader2 className="size-4 animate-spin" />}
        {primeiroAcesso ? "Definir senha e entrar" : "Alterar senha"}
      </button>
    </form>
  );
}
