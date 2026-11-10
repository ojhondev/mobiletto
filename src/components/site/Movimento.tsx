"use client";

import { useEffect, useRef, useState } from "react";

/** Faixa em loop contínuo (esquerda → direita). Pausa ao passar o mouse. */
export function Marquee({ itens }: { itens: string[] }) {
  // repete a lista até cobrir telas largas; o trilho é duplicado para o loop não ter emenda
  const base = itens.length ? Array.from({ length: Math.max(1, Math.ceil(12 / itens.length)) }, () => itens).flat() : [];
  return (
    <div className="marquee" aria-label={itens.join(", ")}>
      <div className="marquee-trilho" style={{ "--duracao": `${Math.max(24, base.length * 4)}s` } as React.CSSProperties} aria-hidden>
        {[0, 1].map((copia) => (
          <ul key={copia} className="flex shrink-0 items-center">
            {base.map((s, i) => (
              <li key={`${copia}-${i}`} className="flex items-center text-[22px] font-bold tracking-[-0.04em] whitespace-nowrap text-tinta md:text-[26px]">
                <span className="px-7 md:px-10">{s}</span>
                <span className="size-1.5 rounded-full bg-azul/40" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Número que conta até o valor quando aparece na tela.
 * Aceita textos como "100%", "+1.000", "5 anos" — anima só a parte numérica.
 */
export function Contador({ valor, className }: { valor: string; className?: string }) {
  const m = valor.match(/^(\D*?)(\d[\d.,]*)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const alvo = m ? Number(m[2].replace(/\./g, "").replace(",", ".")) : 0;
  const [atual, setAtual] = useState<number | null>(null);

  useEffect(() => {
    if (!m || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setAtual(Math.round(alvo * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        setAtual(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  if (!m) return <span className={className}>{valor}</span>;
  const usaPonto = m[2].includes(".");
  const numero = atual === null ? m[2] : usaPonto ? atual.toLocaleString("pt-BR") : String(atual);
  return (
    <span ref={ref} className={className}>
      {m[1]}
      {numero}
      {m[3]}
    </span>
  );
}
