"use client";

import { products } from "./data";
import { CatalogPage } from "./pages";
import { useCatalog } from "./store";

/**
 * "Monte seu catálogo": versão para impressão/PDF (A4) só com as páginas
 * dos produtos marcados — capa, produto + ficha de cada um e "como comprar".
 * Fica oculta na tela; aparece apenas no `window.print()`.
 */
export function PrintCatalog() {
  const { quote } = useCatalog();
  const chosen = products.filter((p) => quote[p.id]);
  const pages = [0, ...(chosen.length ? chosen : products).flatMap((p) => [p.page, p.page + 1]), 12, 13];
  return (
    <div className="print-root" aria-hidden inert>
      {pages.map((i, n) => (
        <section key={n} className="print-page">
          <div className="print-inner">
            <CatalogPage index={i} active={false} />
          </div>
        </section>
      ))}
    </div>
  );
}
