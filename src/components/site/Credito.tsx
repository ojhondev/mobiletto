import Image from "next/image";

const LINK = "https://www.devjhon.tech";

/**
 * Assinatura "Desenvolvido por @devjhon" do rodapé — leva para www.devjhon.tech.
 * Discreta em P&B; no hover a foto ganha cor e o texto "gira" no mesmo lugar,
 * virando o selo "Crie seu site ou aplicativo agora, fale comigo".
 * Em telas de toque (sem hover) os dois se alternam sozinhos.
 */
export function Credito() {
  return (
    <a
      href={LINK}
      target="_blank"
      rel="noopener"
      className="credito group inline-flex items-center gap-2.5 font-[family-name:var(--font-plex)] tracking-normal"
      aria-label="Mobiletto — desenvolvido por @devjhon. Crie seu site ou aplicativo: www.devjhon.tech"
    >
      <span className="relative shrink-0">
        <Image
          src="/ojhondev.webp"
          alt=""
          width={192}
          height={192}
          sizes="32px"
          className="credito-foto size-8 rounded-full object-cover opacity-70 ring-2 ring-linha grayscale transition-all duration-500 group-hover:opacity-100 group-hover:ring-[#3ddc84] group-hover:grayscale-0"
        />
        <span className="credito-ponto absolute -right-0.5 -bottom-0.5 size-2.5 scale-0 rounded-full bg-[#3ddc84] ring-2 ring-white transition-transform duration-300 group-hover:scale-100" />
      </span>
      <span className="credito-troca" aria-hidden>
        <span className="credito-texto text-pedra">
          Desenvolvido por <strong className="font-bold text-tinta">@devjhon</strong>
        </span>
        <span className="credito-cta credito-selo bg-[#0E1014] px-3 py-1.5 text-[11px] font-medium tracking-[0.06em] whitespace-nowrap text-[#7cf5a8] uppercase">
          Crie seu site ou aplicativo agora, fale comigo
        </span>
      </span>
    </a>
  );
}
