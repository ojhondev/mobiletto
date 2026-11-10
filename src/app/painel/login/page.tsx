import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUsuario } from "@/lib/auth";
import { FormLogin } from "@/components/painel/FormulariosConta";

export const metadata: Metadata = { title: "Entrar no painel", robots: { index: false, follow: false } };

export default async function Login({ searchParams }: PageProps<"/painel/login">) {
  if (await getUsuario()) redirect("/painel");
  const voltar = (await searchParams).voltar;
  return (
    <div className="painel grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-azul lg:block">
        <Image src="/produtos/sala-diretoria-madeira.jpg" alt="" fill priority sizes="50vw" className="object-cover opacity-35" />
        <div className="relative flex h-full flex-col justify-between p-12 text-marfim">
          <Image src="/brand/mobiletto-wordmark-marfim.png" alt="Mobiletto" width={1600} height={324} sizes="180px" className="h-[28px] w-auto self-start" />
          <div>
            <p className="max-w-[18ch] text-[40px] leading-[1.05] tracking-[-0.03em]">Todo o site da Mobiletto, em um só lugar.</p>
            <p className="mt-4 max-w-[40ch] text-[16px] text-marfim/75">Textos, imagens, catálogo, cases, vagas e mensagens recebidas pelo site.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-[#f6f6f3] px-5 py-16">
        <div className="w-full max-w-[400px]">
          <Image src="/brand/mobiletto-simbolo-azul.png" alt="" width={800} height={875} sizes="56px" className="mb-8 h-14 w-auto" />
          <h1 className="text-[28px] font-semibold tracking-[-0.02em]">Painel administrativo</h1>
          <p className="mt-1.5 mb-8 text-[15px] text-pedra">Entre com o e-mail e a senha da sua conta.</p>
          <FormLogin voltar={typeof voltar === "string" ? voltar : undefined} />
          <p className="mt-8 text-[13px] text-pedra">
            Esqueceu a senha? Peça a um administrador para gerar uma nova em Usuários e acessos.
          </p>
          <Link href="/" className="mt-6 inline-block text-[13px] text-pedra hover:text-tinta">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
