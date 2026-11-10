"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { products } from "./data";
import { Armchair, Sideboard, Table } from "./illustrations";
import { minQty, useCatalog } from "./store";

export function QuoteSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { quote, setQty, finish, goTo } = useCatalog();
  const [sent, setSent] = useState(false);
  const items = products.filter((p) => quote[p.id]);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setSent(false);
      }}
    >
      <SheetContent className="flex w-full flex-col gap-0 bg-paper p-0 sm:max-w-md">
        <SheetHeader className="border-b border-ink/10 px-6 pt-6 pb-5">
          <SheetTitle className="font-display text-[26px] font-light text-ink">Lista de cotação</SheetTitle>
          <SheetDescription className="text-[13px] text-stone">
            Páginas com o canto dobrado. Ajuste as quantidades e envie ao seu representante.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!items.length && (
            <div className="grid place-items-center py-16 text-center">
              <div className="corner-demo mb-5" />
              <p className="font-display text-[19px] text-ink">Nenhuma página dobrada ainda.</p>
              <p className="mt-1 max-w-[30ch] text-[13px] text-stone">
                Nas páginas de produto, clique no canto superior para dobrá-lo.
              </p>
            </div>
          )}
          <ul className="grid gap-3">
            {items.map((p) => {
              const f = p.finishes.find((x) => x.id === finish[p.id]) ?? p.finishes[0];
              const q = quote[p.id] ?? 0;
              const min = minQty(p);
              return (
                <li key={p.id} className="grid grid-cols-[72px_1fr] gap-4 border-b border-ink/10 pb-3">
                  <button
                    type="button"
                    className="grid h-[72px] place-items-center bg-sand/40 p-2"
                    onClick={() => {
                      onOpenChange(false);
                      goTo(p.page);
                    }}
                    title="Ver no catálogo"
                  >
                    {p.id === "lina" ? (
                      <Armchair fabric={f.color} className="w-full" />
                    ) : p.id === "brisa" ? (
                      <Sideboard wood={f.color} className="w-full" />
                    ) : (
                      <Table top={f.color} className="w-full" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-[17px] leading-tight text-ink">{p.name}</p>
                        <p className="text-[11.5px] text-stone">
                          {p.code} · {f.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQty(p.id, 0)}
                        className="text-[11px] text-stone underline-offset-2 hover:text-clay hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-ink/20">
                        <button
                          type="button"
                          className="h-8 w-8 text-ink disabled:opacity-30"
                          onClick={() => setQty(p.id, q - 1)}
                          disabled={q <= min}
                          aria-label="Diminuir"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-[13px] tabular-nums">{q}</span>
                        <button
                          type="button"
                          className="h-8 w-8 text-ink"
                          onClick={() => setQty(p.id, q + 1)}
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[11px] text-stone">mín. {min} un.</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {!!items.length && !sent && (
            <form
              id="quote-form"
              className="mt-6 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <p className="text-[11px] tracking-[0.18em] text-stone uppercase">Seus dados</p>
              <div className="grid gap-1.5">
                <Label htmlFor="q-empresa">Empresa</Label>
                <Input id="q-empresa" required placeholder="Razão social ou nome fantasia" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="q-cnpj">CNPJ</Label>
                  <Input id="q-cnpj" required placeholder="00.000.000/0000-00" inputMode="numeric" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="q-uf">Estado</Label>
                  <Input id="q-uf" placeholder="SP" maxLength={2} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="q-email">E-mail</Label>
                <Input id="q-email" type="email" required placeholder="compras@empresa.com.br" />
              </div>
            </form>
          )}
          {sent && (
            <div className="mt-6 bg-ink p-5 text-paper">
              <p className="font-display text-[20px]">Lista enviada.</p>
              <p className="mt-1 text-[13px] text-paper/70">
                Protótipo: no produto final, a lista segue para o representante da região, com retorno em até 1 dia
                útil.
              </p>
            </div>
          )}
        </div>

        {!!items.length && (
          <SheetFooter className="gap-2 border-t border-ink/10 px-6 py-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full border-ink/20 bg-transparent"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => window.print(), 350);
              }}
            >
              Gerar PDF das páginas
            </Button>
            <Button
              type="submit"
              form="quote-form"
              disabled={sent}
              className="flex-1 rounded-full bg-ink text-paper hover:bg-clay"
            >
              Enviar cotação
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
