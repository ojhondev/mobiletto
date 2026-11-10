"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { Check, Copy, KeyRound, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { alternarAtivo, criarUsuario, mudarPapel, redefinirSenha, type EstadoUsuario } from "@/app/painel/acoes";
import { cls } from "./ui";

const entrada = "h-10 w-full rounded-lg border border-[#dcdad4] bg-white px-3 text-[14px] outline-none focus:border-azul";

function SenhaGerada({ email, senha, fechar }: { email: string; senha: string; fechar: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const texto = `Acesso ao painel da Mobiletto\nEndereço: ${window.location.origin}/painel\nE-mail: ${email}\nSenha provisória: ${senha}\n(No primeiro acesso o painel pede uma senha nova.)`;
  return (
    <div className="rounded-lg border border-[#cfe3d5] bg-[#f1f8f3] p-4">
      <p className="text-[14px] font-medium text-[#1e6b34]">Senha provisória gerada para {email}</p>
      <p className="mt-2 font-mono text-[18px] tracking-wider select-all">{senha}</p>
      <p className="mt-1 text-[12.5px] text-pedra">Ela só aparece agora. Envie para a pessoa por um canal seguro — no primeiro acesso, o painel pede uma senha nova.</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(texto);
            setCopiado(true);
          }}
          className={cls("secundario", "h-9")}
        >
          {copiado ? <Check className="size-4" /> : <Copy className="size-4" />} Copiar instruções de acesso
        </button>
        <button type="button" onClick={fechar} className={cls("fantasma", "h-9")}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export function NovoUsuario() {
  const [estado, acao, enviando] = useActionState<EstadoUsuario, FormData>(criarUsuario, null);
  const [visto, setVisto] = useState<string | null>(null);
  const mostrar = estado?.senha && visto !== estado.senha;
  return (
    <div className="grid gap-4">
      {mostrar && estado?.senha && estado.email && <SenhaGerada email={estado.email} senha={estado.senha} fechar={() => setVisto(estado.senha!)} />}
      <form action={acao} className="grid gap-3 sm:grid-cols-[1fr_1fr_160px_auto] sm:items-end" key={estado?.senha ?? "novo"}>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium">Nome</span>
          <input name="nome" required className={entrada} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium">E-mail</span>
          <input name="email" type="email" required className={entrada} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-medium">Acesso</span>
          <select name="papel" defaultValue="editor" className={entrada}>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <button type="submit" disabled={enviando} className={cls("primario")}>
          {enviando ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />} Criar acesso
        </button>
      </form>
      {estado?.erro && <p className="text-[13.5px] text-[#a12a1b]">{estado.erro}</p>}
    </div>
  );
}

export function AcoesUsuario({ id, email, ativo, papel, souEu }: { id: string; email: string; ativo: boolean; papel: "admin" | "editor"; souEu: boolean }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [senha, setSenha] = useState<string | null>(null);
  return (
    <div className="grid justify-items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <select
          value={papel}
          disabled={pendente || souEu}
          onChange={(e) =>
            iniciar(async () => {
              const r = await mudarPapel(id, e.target.value as "admin" | "editor");
              if (!r.ok) toast.error(r.erro);
              router.refresh();
            })
          }
          className="h-9 rounded-lg border border-[#dcdad4] bg-white px-2 text-[13px]"
          aria-label="Tipo de acesso"
        >
          <option value="editor">Editor</option>
          <option value="admin">Administrador</option>
        </select>
        <button
          type="button"
          disabled={pendente}
          onClick={() =>
            confirm(`Gerar uma nova senha provisória para ${email}? A senha atual deixa de funcionar.`) &&
            iniciar(async () => {
              const r = await redefinirSenha(id);
              if (r.senha) setSenha(r.senha);
              else toast.error(r.erro);
            })
          }
          className={cls("secundario", "h-9")}
        >
          <KeyRound className="size-4" /> Nova senha
        </button>
        {!souEu && (
          <button
            type="button"
            disabled={pendente}
            onClick={() =>
              iniciar(async () => {
                const r = await alternarAtivo(id);
                if (!r.ok) toast.error(r.erro);
                else toast.success(ativo ? "Acesso desativado." : "Acesso reativado.");
                router.refresh();
              })
            }
            className={cls(ativo ? "perigo" : "secundario", "h-9")}
          >
            {ativo ? "Desativar" : "Reativar"}
          </button>
        )}
      </div>
      {senha && <SenhaGerada email={email} senha={senha} fechar={() => setSenha(null)} />}
    </div>
  );
}
