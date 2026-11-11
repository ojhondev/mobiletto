"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  Briefcase,
  ExternalLink,
  FileText,
  FolderTree,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Magnet,
  Menu,
  Package,
  PanelsTopLeft,
  Shapes,
  UserCog,
  UserRound,
  X,
} from "lucide-react";
import { sair } from "@/app/painel/acoes";
import { PublicacaoProvider } from "./Publicacao";
import type { UsuarioSessao } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icone: React.ElementType; badge?: number };

function grupos(u: UsuarioSessao, novas: number, leads: number): { titulo: string; itens: Item[] }[] {
  return [
    { titulo: "Visão geral", itens: [{ href: "/painel", label: "Painel", icone: LayoutDashboard }] },
    {
      titulo: "Conteúdo do site",
      itens: [
        { href: "/painel/paginas", label: "Páginas e textos", icone: PanelsTopLeft },
        { href: "/painel/produtos", label: "Produtos", icone: Package },
        { href: "/painel/categorias", label: "Categorias", icone: FolderTree },
        { href: "/painel/cases", label: "Cases", icone: FileText },
        { href: "/painel/segmentos", label: "Segmentos", icone: Shapes },
        { href: "/painel/vagas", label: "Vagas", icone: Briefcase },
        { href: "/painel/midia", label: "Biblioteca de mídia", icone: Images },
      ],
    },
    {
      titulo: "Contatos",
      itens: [
        { href: "/painel/leads", label: "Leads do popup", icone: Magnet, badge: leads },
        { href: "/painel/mensagens", label: "Mensagens", icone: Inbox, badge: novas },
      ],
    },
    { titulo: "Captação", itens: [{ href: "/painel/paginas/popup", label: "Popup de orçamento", icone: PanelsTopLeft }] },
    {
      titulo: "Sistema",
      itens: [
        ...(u.papel === "admin" ? [{ href: "/painel/usuarios", label: "Usuários e acessos", icone: UserCog }] : []),
        { href: "/painel/conta", label: "Minha conta", icone: UserRound },
      ],
    },
  ];
}

const ativo = (pathname: string, href: string) => (href === "/painel" ? pathname === "/painel" : pathname.startsWith(href));

export function Shell({
  usuario,
  novas,
  leads,
  ultimaPublicacao,
  children,
}: {
  usuario: UsuarioSessao;
  novas: number;
  leads: number;
  ultimaPublicacao: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o menu do celular ao navegar
  useEffect(() => setAberto(false), [pathname]);

  const menu = (
    <nav className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#e7e5e0] px-5">
        <Link href="/painel" className="flex items-center gap-2.5" aria-label="Painel Mobiletto">
          <Image src="/brand/mobiletto-wordmark-azul.png" alt="Mobiletto" width={1600} height={293} sizes="120px" className="h-[19px] w-auto" />
          <span className="rounded bg-[#e7edf4] px-1.5 py-0.5 text-[10.5px] font-semibold tracking-wide text-azul uppercase">Painel</span>
        </Link>
        <button type="button" onClick={() => setAberto(false)} className="grid size-9 place-items-center rounded-lg hover:bg-[#efeeea] lg:hidden" aria-label="Fechar menu">
          <X className="size-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {grupos(usuario, novas, leads).map((g) => (
          <div key={g.titulo} className="mb-5">
            <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.12em] text-[#8c8a84] uppercase">{g.titulo}</p>
            <ul className="grid gap-0.5">
              {g.itens.map(({ href, label, icone: Icone, badge }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors",
                      ativo(pathname, href) ? "bg-[#e7edf4] font-medium text-azul" : "text-[#3a3a3a] hover:bg-[#efeeea]",
                    )}
                  >
                    <Icone className="size-[18px] shrink-0" strokeWidth={1.7} />
                    <span className="flex-1">{label}</span>
                    {!!badge && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-azul px-1.5 text-[11px] font-semibold text-white">{badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="shrink-0 border-t border-[#e7e5e0] p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 flex h-10 items-center justify-between rounded-lg border border-[#e7e5e0] bg-white px-3 text-[14px] hover:border-azul/40"
        >
          Ver o site <ExternalLink className="size-4 text-pedra" />
        </a>
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-azul text-[13px] font-semibold text-white">
            {usuario.nome
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13.5px] font-medium">{usuario.nome}</span>
            <span className="block truncate text-[12px] text-pedra">{usuario.papel === "admin" ? "Administrador" : "Editor"}</span>
          </span>
          <form action={sair}>
            <button type="submit" className="grid size-9 place-items-center rounded-lg text-pedra hover:bg-[#efeeea] hover:text-tinta" title="Sair" aria-label="Sair">
              <LogOut className="size-[18px]" strokeWidth={1.7} />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="painel min-h-svh bg-[#f6f6f3] text-tinta">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-[#e7e5e0] bg-[#fbfbf9] lg:flex">{menu}</aside>
      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setAberto(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(300px,86vw)] flex-col bg-[#fbfbf9] shadow-xl">{menu}</aside>
        </div>
      )}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e7e5e0] bg-[#fbfbf9]/95 px-4 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setAberto(true)} className="grid size-10 place-items-center rounded-lg hover:bg-[#efeeea]" aria-label="Abrir menu">
          <Menu className="size-5" />
        </button>
        <Image src="/brand/mobiletto-wordmark-azul.png" alt="Mobiletto" width={1600} height={293} sizes="110px" className="h-[17px] w-auto" />
        {novas + leads > 0 && (
          <Link href="/painel/mensagens" className="ml-auto flex items-center gap-1.5 rounded-full bg-azul px-3 py-1 text-[12px] font-medium text-white">
            <Inbox className="size-3.5" /> {novas + leads}
          </Link>
        )}
      </header>
      <main className="lg:pl-[264px]">
        <PublicacaoProvider ultima={ultimaPublicacao}>
          <div className="mx-auto w-full max-w-[1280px] px-4 py-7 md:px-8 md:py-10">{children}</div>
        </PublicacaoProvider>
      </main>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
