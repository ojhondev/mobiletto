"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Botao } from "./Botao";

/**
 * Faixa-galeria full-bleed com fotos em retrato e setas circulares
 * no canto inferior direito (padrão "client gallery" da referência).
 */
export function Galeria({
  fotos,
  link,
}: {
  fotos: { src: string; alt: string }[];
  link?: { href: string; label: string };
}) {
  const rail = useRef<HTMLDivElement>(null);
  const passo = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 8) * 2, behavior: "smooth" });
  };

  return (
    <div>
      <div ref={rail} className="rail flex gap-2 overflow-x-auto px-[clamp(1.25rem,3.4vw,3rem)]">
        {fotos.map((f) => (
          <div key={f.src} className="foto aspect-[3/4] w-[72vw] shrink-0 sm:w-[44vw] lg:w-[27.5vw]">
            <Image src={f.src} alt={f.alt} fill sizes="(min-width:1024px) 28vw, (min-width:640px) 44vw, 72vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="shell mt-6 flex items-center justify-between gap-4">
        {link ? (
          <Botao href={link.href} variante="fantasma">
            {link.label}
          </Botao>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => passo(-1)}
            className="grid size-10 place-items-center rounded-full bg-cinza-claro transition-colors hover:bg-tinta hover:text-white"
            aria-label="Fotos anteriores"
          >
            <ChevronLeft className="size-4" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => passo(1)}
            className="grid size-10 place-items-center rounded-full bg-cinza-claro transition-colors hover:bg-tinta hover:text-white"
            aria-label="Próximas fotos"
          >
            <ChevronRight className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
