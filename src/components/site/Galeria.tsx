"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Botao } from "./Botao";

/**
 * Faixa-galeria full-bleed com fotos em retrato (padrão "client gallery" da referência).
 * Arrastável com o mouse (com inércia), deslizável no toque e com setas.
 */
export function Galeria({ fotos, link }: { fotos: { src: string; alt: string }[]; link?: { href: string; label: string } }) {
  const rail = useRef<HTMLDivElement>(null);
  const arraste = useRef({ ativo: false, x: 0, inicio: 0, moveu: false, v: 0, ultX: 0, ultT: 0, raf: 0 });

  const passo = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 8) * 2, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return; // toque usa a rolagem nativa
    const el = e.currentTarget;
    const a = arraste.current;
    cancelAnimationFrame(a.raf);
    Object.assign(a, { ativo: true, x: e.clientX, inicio: el.scrollLeft, moveu: false, v: 0, ultX: e.clientX, ultT: performance.now() });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = arraste.current;
    if (!a.ativo) return;
    const el = e.currentTarget;
    const dx = e.clientX - a.x;
    if (!a.moveu && Math.abs(dx) > 4) {
      a.moveu = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add("arrastando");
    }
    if (!a.moveu) return;
    el.scrollLeft = a.inicio - dx;
    const agora = performance.now();
    a.v = (e.clientX - a.ultX) / Math.max(1, agora - a.ultT);
    a.ultX = e.clientX;
    a.ultT = agora;
  };

  const soltar = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = arraste.current;
    if (!a.ativo) return;
    a.ativo = false;
    const el = e.currentTarget;
    if (!a.moveu) return;
    // inércia: continua deslizando e desacelera
    let v = -a.v * 16;
    const deslizar = () => {
      el.scrollLeft += v;
      v *= 0.94;
      if (Math.abs(v) > 0.5) a.raf = requestAnimationFrame(deslizar);
      else el.classList.remove("arrastando");
    };
    a.raf = requestAnimationFrame(deslizar);
  };

  return (
    <div>
      <div
        ref={rail}
        className="rail flex cursor-grab gap-2 overflow-x-auto px-[clamp(1.25rem,3.4vw,3rem)] select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onDragStart={(e) => e.preventDefault()}
      >
        {fotos.map((f, i) => (
          <div key={f.src + i} className="foto aspect-[3/4] w-[72vw] shrink-0 sm:w-[44vw] lg:w-[27.5vw]" style={{ transitionDelay: `${Math.min(i, 4) * 0.08}s` }}>
            <Image
              src={f.src}
              alt={f.alt}
              fill
              draggable={false}
              sizes="(min-width:1024px) 28vw, (min-width:640px) 44vw, 72vw"
              className="object-cover"
            />
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
        <div className="flex items-center gap-2">
          <span className="mr-2 hidden text-[13px] text-pedra sm:inline">Arraste para ver mais</span>
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
