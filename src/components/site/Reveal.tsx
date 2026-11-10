"use client";

import { useEffect } from "react";

/**
 * Liga a revelação suave dos elementos `.reveal` quando entram na tela.
 * Montado uma vez no layout; se o JS falhar, o CSS de <noscript> mantém tudo visível.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = () => document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      els().forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const observeAll = () => els().forEach((el) => io.observe(el));
    observeAll();
    // novas páginas (navegação client-side) trazem novos elementos
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return (
    <noscript>
      <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
    </noscript>
  );
}
