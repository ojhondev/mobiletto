import type { Metadata } from "next";
import { exigirAdmin } from "@/lib/auth";
import { dataHora, listarUsuarios } from "@/lib/painel";
import { AcoesUsuario, NovoUsuario } from "@/components/painel/Usuarios";
import { Cabecalho, Cartao, Selo } from "@/components/painel/ui";

export const metadata: Metadata = { title: "Usuários e acessos" };

export default async function Usuarios() {
  const eu = await exigirAdmin();
  const usuarios = await listarUsuarios();
  return (
    <>
      <Cabecalho
        titulo="Usuários e acessos"
        descricao="Quem pode entrar no painel. Editores alteram o conteúdo e veem as mensagens; administradores também gerenciam os acessos."
      />
      <Cartao className="mb-6 p-5">
        <h2 className="mb-4 text-[16px] font-semibold">Novo acesso</h2>
        <NovoUsuario />
      </Cartao>
      <Cartao>
        <ul className="divide-y divide-[#efede8]">
          {usuarios.map((u) => (
            <li key={u.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[15px] font-medium">
                  {u.nome}
                  {u.id === eu.id && <Selo cor="azul">Você</Selo>}
                  {!u.ativo && <Selo cor="vermelho">Desativado</Selo>}
                  {u.ativo && u.trocarSenha && <Selo cor="amarelo">Senha provisória</Selo>}
                </p>
                <p className="text-[13px] text-pedra">
                  {u.email} · último acesso: {dataHora(u.ultimoAcesso)}
                </p>
              </div>
              <AcoesUsuario id={u.id} email={u.email} ativo={u.ativo} papel={u.papel} souEu={u.id === eu.id} />
            </li>
          ))}
        </ul>
      </Cartao>
    </>
  );
}
