import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { exigirUsuario } from "@/lib/auth";
import { FormTrocarSenha } from "@/components/painel/FormulariosConta";

export const metadata: Metadata = { title: "Primeiro acesso", robots: { index: false, follow: false } };

export default async function PrimeiroAcesso() {
  const u = await exigirUsuario({ permitirTrocaPendente: true });
  if (!u.trocarSenha) redirect("/painel");
  return (
    <div className="painel flex min-h-svh items-center justify-center bg-[#f6f6f3] px-5 py-16">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#e7e5e0] bg-white p-8">
        <Image src="/brand/mobiletto-simbolo-azul.png" alt="" width={800} height={875} sizes="48px" className="mb-6 h-12 w-auto" />
        <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Olá, {u.nome.split(" ")[0]}!</h1>
        <p className="mt-1.5 mb-7 text-[15px] text-pedra">Antes de começar, troque a senha provisória por uma senha só sua.</p>
        <FormTrocarSenha primeiroAcesso />
      </div>
    </div>
  );
}
