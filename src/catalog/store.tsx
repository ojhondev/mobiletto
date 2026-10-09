"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "./data";

type ProductId = Product["id"];

type CatalogState = {
  finish: Record<ProductId, string>;
  setFinish: (p: ProductId, f: string) => void;
  quote: Partial<Record<ProductId, number>>;
  toggleQuote: (p: ProductId) => void;
  setQty: (p: ProductId, qty: number) => void;
  goTo: (page: number) => void;
  openQuote: () => void;
};

const Ctx = createContext<CatalogState | null>(null);

const KEY = "mobiletto:cotacao";

export function CatalogProvider({
  children,
  goTo,
  openQuote,
}: {
  children: React.ReactNode;
  goTo: (page: number) => void;
  openQuote: () => void;
}) {
  const [finish, setFinishState] = useState(
    () => Object.fromEntries(products.map((p) => [p.id, p.finishes[0].id])) as Record<ProductId, string>,
  );
  const [quote, setQuote] = useState<Partial<Record<ProductId, number>>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação do localStorage
      if (raw) setQuote(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Partial<Record<ProductId, number>>) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    return next;
  };

  const toggleQuote = useCallback((p: ProductId) => {
    setQuote((q) => {
      const next = { ...q };
      if (next[p]) delete next[p];
      else next[p] = minQty(products.find((x) => x.id === p)!);
      return persist(next);
    });
  }, []);

  const setQty = useCallback((p: ProductId, qty: number) => {
    setQuote((q) => {
      const next = { ...q };
      if (qty <= 0) delete next[p];
      else next[p] = qty;
      return persist(next);
    });
  }, []);

  const setFinish = useCallback((p: ProductId, f: string) => setFinishState((s) => ({ ...s, [p]: f })), []);

  const value = useMemo(
    () => ({ finish, setFinish, quote, toggleQuote, setQty, goTo, openQuote }),
    [finish, setFinish, quote, toggleQuote, setQty, goTo, openQuote],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCatalog fora do CatalogProvider");
  return c;
}

export function minQty(p: Product) {
  return Number(p.b2b[0][1].match(/\d+/)?.[0] ?? 1);
}
