"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { botaoClasses } from "./Botao";
import { cn } from "@/lib/utils";

/** Páginas que abrem com foto/vídeo full-bleed: o cabeçalho começa transparente sobre ela. */
const PAGINAS_COM_HERO = ["/", "/linha-especial"];
const AVISO_KEY = "mobiletto:aviso-fechado";

type SegmentoMenu = { slug: string; nome: string; resumo: string; imagem: string };

export function Header({
  aviso,
  segmentos,
  linhaEspecial,
}: {
  aviso: { texto: string; link: string } | null;
  segmentos: SegmentoMenu[];
  /** nome da Linha Especial quando liberada no painel */
  linhaEspecial: string | null;
}) {
  const pathname = usePathname();
  const sobreHero = PAGINAS_COM_HERO.includes(pathname);
  const avisoRef = useRef<HTMLDivElement>(null);
  const [avisoAberto, setAvisoAberto] = useState(!!aviso);
  const [top, setTop] = useState(0);
  const [rolou, setRolou] = useState(false);
  const [menu, setMenu] = useState(false);
  const [solucoes, setSolucoes] = useState(false);

  const links = [
    { href: "/sobre-nos", label: "Sobre nós" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/cases", label: "Cases" },
    ...(linhaEspecial ? [{ href: "/linha-especial", label: linhaEspecial }] : []),
    { href: "/trabalhe-conosco", label: "Trabalhe conosco" },
  ];

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- preferência salva só existe no cliente
      if (sessionStorage.getItem(AVISO_KEY) === aviso?.texto) setAvisoAberto(false);
    } catch {}
  }, [aviso?.texto]);

  useEffect(() => {
    const onScroll = () => {
      const h = avisoRef.current?.offsetHeight ?? 0;
      setTop(Math.max(0, h - window.scrollY));
      setRolou(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [avisoAberto]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha menus ao trocar de página
    setMenu(false);
    setSolucoes(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const transparente = sobreHero && !rolou && !menu;
  const ativo = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {aviso && avisoAberto && (
        <div ref={avisoRef} className="relative z-[60] bg-azul text-white">
          <Link
            href={aviso.link || "/fale-conosco"}
            className="shell flex min-h-10 items-center justify-center gap-2 py-2 pr-12 text-center text-[14px] leading-tight sm:text-[15px]"
          >
            {aviso.texto}
            <ArrowRight className="size-4 shrink-0" strokeWidth={1.6} />
          </Link>
          <button
            type="button"
            onClick={() => {
              setAvisoAberto(false);
              try {
                sessionStorage.setItem(AVISO_KEY, aviso.texto);
              } catch {}
            }}
            className="absolute top-1/2 right-[clamp(1rem,3.4vw,3rem)] grid size-7 -translate-y-1/2 place-items-center"
            aria-label="Fechar aviso"
          >
            <X className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      )}

      <header
        className={cn(
          "fixed inset-x-0 z-50 transition-colors duration-300",
          transparente ? "bg-transparent text-white" : "border-b border-linha bg-white text-tinta",
        )}
        style={{ top }}
      >
        <div className="shell flex h-[72px] items-center gap-8">
          <Link href="/" aria-label="Mobiletto — página inicial" className="shrink-0">
            <Image
              src={transparente ? "/brand/mobiletto-wordmark-marfim.png" : "/brand/mobiletto-wordmark-azul.png"}
              alt="Mobiletto"
              width={1600}
              height={transparente ? 324 : 293}
              priority
              sizes="160px"
              className="h-[26px] w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            <Link
              href="/sobre-nos"
              className={cn("rounded-lg px-3 py-2 text-[15px] font-medium transition-opacity hover:opacity-70", ativo("/sobre-nos") && !transparente && "text-azul")}
            >
              Sobre nós
            </Link>
            {segmentos.length > 0 && (
              <div className="relative" onMouseEnter={() => setSolucoes(true)} onMouseLeave={() => setSolucoes(false)}>
                <button
                  type="button"
                  onClick={() => setSolucoes((v) => !v)}
                  aria-expanded={solucoes}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-opacity hover:opacity-70"
                >
                  Soluções
                  <ChevronDown className={cn("size-3.5 transition-transform", solucoes && "rotate-180")} strokeWidth={2} />
                </button>
                {solucoes && (
                  <div className="absolute top-full left-0 pt-3">
                    <div className="menu-pop grid w-[560px] grid-cols-2 gap-1 rounded-lg border border-linha bg-white p-2 text-tinta">
                      {segmentos.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/cases?segmento=${s.slug}`}
                          className="grid grid-cols-[56px_1fr] items-center gap-3 rounded-md p-2 transition-colors hover:bg-marfim-suave"
                        >
                          <span className="foto block aspect-square">
                            {s.imagem && <Image src={s.imagem} alt="" fill sizes="56px" className="object-cover" />}
                          </span>
                          <span>
                            <span className="block text-[15px] font-medium">{s.nome}</span>
                            <span className="block text-[13px] leading-snug text-pedra">{s.resumo}</span>
                          </span>
                        </Link>
                      ))}
                      <Link
                        href="/fale-conosco?assunto=projeto"
                        className="flex items-center justify-between rounded-md bg-marfim-suave p-3 text-[14px] font-medium"
                      >
                        Não encontrou seu segmento? Fale com a gente
                        <ArrowRight className="size-4" strokeWidth={1.6} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            {links.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ativo(l.href) ? "page" : undefined}
                className={cn("rounded-lg px-3 py-2 text-[15px] font-medium transition-opacity hover:opacity-70", ativo(l.href) && !transparente && "text-azul")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/fale-conosco" className="hidden rounded-lg px-3 py-2 text-[15px] font-medium transition-opacity hover:opacity-70 md:block">
              Fale conosco
            </Link>
            <Link href="/fale-conosco?assunto=orcamento" className={botaoClasses("primario", "hidden h-10 min-h-10 px-5 sm:inline-flex")}>
              Solicitar orçamento
            </Link>
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              className="grid size-10 place-items-center lg:hidden"
              aria-label={menu ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menu}
            >
              {menu ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {menu && (
          <div className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-white text-tinta lg:hidden" style={{ top: top + 72 }}>
            <nav className="shell flex flex-col py-6" aria-label="Menu">
              {[{ href: "/", label: "Início" }, ...links, { href: "/fale-conosco", label: "Fale conosco" }].map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="menu-item border-b border-linha py-4 text-[28px] leading-none"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {l.label}
                </Link>
              ))}
              {segmentos.length > 0 && (
                <>
                  <p className="mt-8 text-[13px] text-pedra uppercase">Soluções</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {segmentos.map((s) => (
                      <Link key={s.slug} href={`/cases?segmento=${s.slug}`} className="rounded-full border border-linha px-4 py-2 text-[15px]">
                        {s.nome}
                      </Link>
                    ))}
                  </div>
                </>
              )}
              <Link href="/fale-conosco?assunto=orcamento" className={botaoClasses("primario", "mt-8 w-full")}>
                Solicitar orçamento
              </Link>
            </nav>
          </div>
        )}
      </header>

      {!sobreHero && <div className="h-[72px]" aria-hidden />}
    </>
  );
}
