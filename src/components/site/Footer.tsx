import Image from "next/image";
import Link from "next/link";
import { getSecao, linkWhatsapp, segmentosPublicados } from "@/lib/cms/dados";

const OJHONDEV_WHATSAPP = "https://wa.me/5514998570045";

export async function Footer() {
  const [contato, segs] = await Promise.all([getSecao("contato"), segmentosPublicados()]);
  const colunas = [
    {
      titulo: "Empresa",
      links: [
        { href: "/sobre-nos", label: "Sobre nós" },
        { href: "/cases", label: "Cases" },
        { href: "/trabalhe-conosco", label: "Trabalhe conosco" },
        { href: "/politica-de-privacidade", label: "Privacidade" },
      ],
    },
    { titulo: "Soluções", links: segs.map((s) => ({ href: `/cases?segmento=${s.slug}`, label: s.nome })) },
    {
      titulo: "Contato",
      links: [
        { href: "/fale-conosco", label: "Fale conosco" },
        { href: "/fale-conosco?assunto=orcamento", label: "Solicitar orçamento" },
        { href: "/catalogo", label: "Catálogo" },
        { href: linkWhatsapp(contato.whatsapp, contato.mensagemWhatsapp), label: "WhatsApp", externo: true },
      ],
    },
  ];

  return (
    <footer className="bg-white">
      <div className="shell grid gap-12 pt-20 pb-14 md:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 md:flex md:gap-16">
          {colunas.map((c) => (
            <div key={c.titulo}>
              <p className="text-[22px] leading-none">{c.titulo}</p>
              <ul className="mt-5 grid gap-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {"externo" in l && l.externo ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-[14px] hover:text-azul">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-[14px] hover:text-azul">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 md:max-w-[240px]">
            <p className="text-[22px] leading-none">Atendimento</p>
            <div className="mt-5 grid gap-2.5 text-[14px]">
              <a href={`mailto:${contato.email}`} className="hover:text-azul">
                {contato.email}
              </a>
              <span>{contato.telefone}</span>
              <span className="text-pedra">{contato.horario}</span>
              {contato.regiao && <span className="text-pedra">{contato.regiao}</span>}
            </div>
          </div>
        </div>
        <Image src="/brand/mobiletto-simbolo-azul.png" alt="" width={800} height={875} sizes="160px" className="h-[150px] w-auto md:h-[168px]" />
      </div>
      <div className="shell">
        <div className="flex flex-col gap-4 border-t border-linha py-6 text-[13px] lg:flex-row lg:items-center lg:justify-between">
          <span>Mobiletto © 2026 — Todos os direitos reservados</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={contato.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-azul">
              Instagram
            </a>
            <a href={contato.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-azul">
              LinkedIn
            </a>
            <Link href="/politica-de-privacidade" className="hover:text-azul">
              Política de privacidade
            </Link>
            <Link href="/painel" className="hover:text-azul">
              Painel administrativo
            </Link>
            <a
              href={OJHONDEV_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-plex)] tracking-normal text-pedra transition-colors hover:text-tinta"
            >
              Desenvolvido por <strong className="font-bold text-tinta">@ojhondev</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
