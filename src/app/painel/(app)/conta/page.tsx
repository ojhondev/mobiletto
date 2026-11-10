import type { Metadata } from "next";
import { exigirUsuario } from "@/lib/auth";
import { FormTrocarSenha } from "@/components/painel/FormulariosConta";
import { Cabecalho, Cartao } from "@/components/painel/ui";

export const metadata: Metadata = { title: "Minha conta" };

export default async function Conta() {
  const u = await exigirUsuario();
  return (
    <>
      <Cabecalho titulo="Minha conta" descricao={`${u.nome} · ${u.email} · ${u.papel === "admin" ? "Administrador" : "Editor"}`} />
      <Cartao className="max-w-[480px] p-6">
        <h2 className="mb-4 text-[16px] font-semibold">Alterar senha</h2>
        <FormTrocarSenha />
      </Cartao>
    </>
  );
}
