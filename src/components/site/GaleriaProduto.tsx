"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Galeria da página de produto: foto principal, miniaturas e tela cheia (setas e teclado). */
export function GaleriaProduto({ imagens, nome }: { imagens: string[]; nome: string }) {
  const [i, setI] = useState(0);
  const [cheia, setCheia] = useState(false);
  const n = imagens.length;
  const ir = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    if (!cheia) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCheia(false);
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cheia, ir]);

  if (!n) return <div className="foto aspect-[4/3] bg-marfim-suave" />;

  return (
    <div>
      <div className="group foto relative aspect-[4/3] bg-marfim-suave">
        {imagens.map((src, k) => (
          <Image
            key={src}
            src={src}
            alt={`${nome} — foto ${k + 1}`}
            fill
            priority={k === 0}
            sizes="(min-width:1024px) 58vw, 100vw"
            className={cn("object-cover transition-opacity duration-500", k === i ? "opacity-100" : "opacity-0")}
          />
        ))}
        <button
          type="button"
          onClick={() => setCheia(true)}
          className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-tinta transition-colors hover:bg-white"
          aria-label="Ver em tela cheia"
        >
          <Expand className="size-4" strokeWidth={1.6} />
        </button>
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(-1)}
              className="absolute top-1/2 left-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => ir(1)}
              className="absolute top-1/2 right-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Próxima foto"
            >
              <ChevronRight className="size-4" strokeWidth={1.8} />
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {imagens.map((src, k) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(k)}
              className={cn("relative aspect-square overflow-hidden bg-marfim-suave ring-offset-2 transition", k === i ? "ring-2 ring-azul" : "opacity-70 hover:opacity-100")}
              aria-label={`Ver foto ${k + 1}`}
              aria-current={k === i}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {cheia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95" role="dialog" aria-modal aria-label={nome} onClick={() => setCheia(false)}>
          <div className="relative h-[86vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Image src={imagens[i]} alt={nome} fill sizes="92vw" className="object-contain" />
          </div>
          <button type="button" onClick={() => setCheia(false)} className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Fechar">
            <X className="size-5" />
          </button>
          {n > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  ir(-1);
                }}
                className="absolute left-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  ir(1);
                }}
                className="absolute right-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Próxima foto"
              >
                <ChevronRight className="size-5" />
              </button>
              <p className="absolute bottom-5 text-[14px] text-white/70">
                {i + 1} / {n}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
