"use client";

import { useState } from "react";
import { pageTitles, productById, products, type Product } from "./data";
import { Armchair, Room, Sideboard, Table, TechDrawing, techViews } from "./illustrations";
import { useCatalog } from "./store";

export type PageProps = { index: number; active: boolean };

/* ------------------------------------------------------------ utilitários */

function Folio({ index, light }: { index: number; light?: boolean }) {
  const left = index % 2 === 1;
  return (
    <div
      className={`absolute bottom-7 flex items-center gap-3 text-[9px] tracking-[0.22em] uppercase ${
        light ? "text-paper/55" : "text-stone"
      } ${left ? "left-11" : "right-11 flex-row-reverse"}`}
    >
      <span className="font-display text-[13px] tracking-normal">{String(index).padStart(2, "0")}</span>
      <span>Mobiletto · Catálogo 2027</span>
    </div>
  );
}

/** "Dobrar o canto": marca o produto na lista de cotação. */
function CornerFold({ product, side }: { product: Product; side: "left" | "right" }) {
  const { quote, toggleQuote } = useCatalog();
  const on = !!quote[product.id];
  return (
    <button
      type="button"
      onClick={() => toggleQuote(product.id)}
      className={`corner-fold group absolute top-0 z-10 h-20 w-20 ${side === "left" ? "left-0" : "right-0"} ${
        on ? "is-on" : ""
      }`}
      data-side={side}
      aria-pressed={on}
      title={on ? "Remover da lista de cotação" : "Dobrar o canto: adicionar à cotação"}
    >
      <span className="fold" />
      <span
        className={`absolute top-6 text-[8.5px] font-semibold tracking-[0.16em] whitespace-nowrap uppercase opacity-0 transition-opacity group-hover:opacity-100 ${
          side === "left" ? "left-[68px]" : "right-[68px]"
        } ${on ? "text-clay opacity-100" : "text-stone"}`}
      >
        {on ? "Na cotação" : "Dobrar canto"}
      </span>
    </button>
  );
}

function ProductArt({ product, color, className }: { product: Product; color: string; className?: string }) {
  if (product.id === "lina") return <Armchair fabric={color} className={className} />;
  if (product.id === "brisa") return <Sideboard wood={color} className={className} />;
  return <Table top={color} className={className} />;
}

/* ----------------------------------------------------------------- páginas */

function Cover({ index }: PageProps) {
  return (
    <div className="hardcover relative flex h-full flex-col bg-ink px-12 pt-12 pb-10 text-paper">
      <div className="flex items-start justify-between">
        <Logo light />
        <span className="text-[9px] tracking-[0.3em] text-paper/60 uppercase">Venda exclusiva B2B</span>
      </div>
      <div className="mt-16">
        <p className="text-[10px] tracking-[0.35em] text-sand uppercase">Coleção</p>
        <h1 className="font-display mt-2 text-[96px] leading-[0.88] font-light tracking-[-0.03em]">
          Catálogo
          <br />
          <em className="text-clay-soft font-normal">2027</em>
        </h1>
      </div>
      <div className="relative mt-auto">
        <div className="absolute -top-6 right-0 left-0 mx-auto h-[300px] w-[300px] rounded-full bg-clay/90" />
        <Armchair fabric="#d6c6a8" className="relative mx-auto w-[380px]" />
      </div>
      <div className="mt-6 flex items-end justify-between border-t border-paper/15 pt-4 text-[10px] tracking-[0.18em] text-paper/70 uppercase">
        <span>Linha Aurora</span>
        <span>Móveis para projetos</span>
      </div>
      <span className="sr-only">Página {index}</span>
    </div>
  );
}

function Manifesto({ index }: PageProps) {
  const stats: [string, string][] = [
    ["30", "anos de fábrica"],
    ["12 mil m²", "de parque fabril"],
    ["800+", "lojistas e escritórios"],
    ["27", "estados atendidos"],
  ];
  return (
    <div className="relative flex h-full flex-col bg-paper px-12 pt-14 pb-16">
      <p className="text-[10px] tracking-[0.3em] text-clay uppercase">Manifesto</p>
      <h2 className="font-display mt-4 text-[44px] leading-[1.02] font-light tracking-[-0.02em] text-ink">
        Feito para quem
        <br />
        <em>projeta.</em>
      </h2>
      <div className="mt-8 grid gap-4 text-[12px] leading-[1.7] text-ink/80">
        <p>
          A Mobiletto fabrica móveis para arquitetos, lojistas, hotéis e escritórios. Não vendemos no varejo: cada peça
          sai da fábrica para um projeto, com prazo, volume e acabamento combinados.
        </p>
        <p>
          Este catálogo foi feito para ser folheado como os de papel. Vire as páginas, troque acabamentos, veja os
          desenhos técnicos se formarem e dobre o canto do que interessa: no fim, sua lista de cotação estará pronta.
        </p>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/15 pt-6">
        {stats.map(([n, l]) => (
          <div key={l}>
            <div className="font-display text-[30px] leading-none text-ink">{n}</div>
            <div className="mt-1 text-[9.5px] tracking-[0.16em] text-stone uppercase">{l}</div>
          </div>
        ))}
      </div>
      <Folio index={index} />
    </div>
  );
}

function Index({ index }: PageProps) {
  const { goTo } = useCatalog();
  const entries = [3, 4, 5, 7, 9, 11, 12];
  return (
    <div className="relative flex h-full flex-col bg-paper px-12 pt-14 pb-16">
      <p className="text-[10px] tracking-[0.3em] text-clay uppercase">Índice</p>
      <h2 className="font-display mt-4 text-[44px] leading-none font-light tracking-[-0.02em] text-ink">Sumário</h2>
      <ol className="mt-10 grid">
        {entries.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => goTo(p)}
              className="group flex w-full items-baseline gap-3 border-b border-ink/10 py-[13px] text-left"
            >
              <span className="font-display w-7 text-[13px] text-stone">{String(p).padStart(2, "0")}</span>
              <span className="font-display text-[19px] text-ink transition-colors group-hover:text-clay">
                {pageTitles[p]}
              </span>
              <span className="mx-1 flex-1 translate-y-[-3px] border-b border-dotted border-ink/25" />
              <span className="text-[9px] tracking-[0.2em] text-stone uppercase transition-transform group-hover:translate-x-1 group-hover:text-clay">
                Ir →
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-auto max-w-[34ch] text-[10.5px] leading-[1.6] text-stone">
        Dica: arraste o canto da página, use as setas do teclado ou toque nas bordas para folhear.
      </p>
      <Folio index={index} />
    </div>
  );
}

function Opener({ index, active }: PageProps) {
  return (
    <div className={`opener relative h-full overflow-hidden bg-clay text-paper ${active ? "is-active" : ""}`}>
      <div className="sun absolute top-[210px] left-1/2 h-[330px] w-[330px] -translate-x-1/2 rounded-full bg-[#e8a86b]" />
      <div className="absolute inset-x-0 bottom-0 h-[330px] bg-[#8f3e1d]" />
      <div className="absolute inset-x-0 bottom-0 h-[190px] bg-[#6f2f15]" />
      <div className="relative px-12 pt-14">
        <p className="text-[10px] tracking-[0.35em] text-paper/75 uppercase">Linha 2027</p>
        <h2 className="font-display mt-3 text-[120px] leading-[0.85] font-light tracking-[-0.04em]">Aurora</h2>
      </div>
      <div className="absolute inset-x-12 bottom-16 grid grid-cols-[1fr_auto] items-end gap-6">
        <p className="max-w-[30ch] text-[12px] leading-[1.7] text-paper/85">
          Madeira maciça, curvas suaves e tons de terra. Uma linha pensada para hotelaria, áreas comuns e residências de
          alto padrão.
        </p>
        <div className="text-right text-[9.5px] tracking-[0.18em] text-paper/70 uppercase">
          3 peças
          <br />
          12 acabamentos
        </div>
      </div>
      <Folio index={index} light />
    </div>
  );
}

function Ambient({ index }: PageProps) {
  const { finish, goTo } = useCatalog();
  const [open, setOpen] = useState<Product["id"] | null>(null);
  const color = (id: Product["id"]) =>
    productById[id].finishes.find((f) => f.id === finish[id])?.color ?? productById[id].finishes[0].color;
  const spots: { id: Product["id"]; x: number; y: number }[] = [
    { id: "lina", x: 25, y: 70 },
    { id: "brisa", x: 52, y: 53 },
    { id: "orla", x: 76, y: 70 },
  ];
  return (
    <div className="relative flex h-full flex-col bg-paper px-10 pt-12 pb-16">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] tracking-[0.3em] text-clay uppercase">Ambiente · Linha Aurora</p>
        <p className="text-[9px] tracking-[0.16em] text-stone uppercase">Toque nos pontos</p>
      </div>
      <div className="relative mt-5 aspect-[600/520] w-full overflow-hidden" onClick={() => setOpen(null)}>
        <Room fabric={color("lina")} wood={color("brisa")} top={color("orla")} />
        {spots.map((s) => {
          const p = productById[s.id];
          const isOpen = open === s.id;
          return (
            <div key={s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(isOpen ? null : s.id);
                }}
                className="hotspot -translate-x-1/2 -translate-y-1/2"
                aria-label={p.name}
                aria-expanded={isOpen}
              >
                <span>{isOpen ? "×" : "+"}</span>
              </button>
              {isOpen && (
                <div
                  className="postit absolute bottom-6 z-20 w-[170px] p-3.5 text-ink"
                  style={s.x > 60 ? { right: -14 } : { left: -14 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[8.5px] tracking-[0.18em] text-stone uppercase">{p.code}</p>
                  <p className="font-display mt-1 text-[17px] leading-tight">{p.name}</p>
                  <p className="mt-1 text-[10px] leading-[1.5] text-ink/70">{p.tagline}</p>
                  <button
                    type="button"
                    onClick={() => goTo(p.page)}
                    className="mt-2.5 text-[9.5px] font-semibold tracking-[0.14em] text-clay uppercase"
                  >
                    Ver página {String(p.page).padStart(2, "0")} →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <h3 className="font-display mt-6 text-[28px] leading-[1.05] font-light tracking-[-0.01em] text-ink">
        Sala integrada, <em>tons de terra.</em>
      </h3>
      <p className="mt-2 max-w-[48ch] text-[11px] leading-[1.65] text-ink/75">
        Os acabamentos que você escolher nas páginas de produto aparecem aqui. Combine revestimentos e madeiras antes de
        fechar o pedido.
      </p>
      <Folio index={index} />
    </div>
  );
}

function ProductPage({ index, product }: PageProps & { product: Product }) {
  const { finish, setFinish, quote, toggleQuote } = useCatalog();
  const current = product.finishes.find((f) => f.id === finish[product.id]) ?? product.finishes[0];
  const inQuote = !!quote[product.id];
  return (
    <div className="relative flex h-full flex-col bg-paper">
      <CornerFold product={product} side="left" />
      <div
        className="relative flex h-[372px] items-end justify-center overflow-hidden px-10 pb-8 transition-colors duration-700"
        style={{ background: `color-mix(in srgb, ${current.color} 22%, #f4efe6)` }}
      >
        <span className="font-display absolute top-8 right-10 text-[11px] tracking-[0.2em] text-ink/50 uppercase">
          {product.line}
        </span>
        <div key={current.id} className="swap-in w-full">
          <ProductArt
            product={product}
            color={current.color}
            className={product.id === "lina" ? "mx-auto w-[300px]" : "mx-auto w-full"}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-11 pt-8 pb-16">
        <p className="text-[9.5px] tracking-[0.22em] text-stone uppercase">
          {product.kind} · {product.code}
        </p>
        <h2 className="font-display mt-2 text-[46px] leading-[0.95] font-light tracking-[-0.025em] text-ink">
          {product.name}
        </h2>
        <p className="font-display mt-2 text-[16px] text-clay italic">{product.tagline}</p>
        <p className="mt-3 max-w-[50ch] text-[11px] leading-[1.7] text-ink/75">{product.description}</p>

        <div className="mt-auto">
          <div className="flex items-baseline justify-between">
            <p className="text-[9px] tracking-[0.22em] text-stone uppercase">{product.finishLabel}</p>
            <p className="text-[10px] text-ink/60">{current.note}</p>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            {product.finishes.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFinish(product.id, f.id)}
                className={`swatch ${f.id === current.id ? "is-on" : ""}`}
                style={{ background: f.color }}
                aria-label={f.name}
                aria-pressed={f.id === current.id}
                title={f.name}
              />
            ))}
            <span className="font-display ml-2 text-[15px] text-ink">{current.name}</span>
          </div>
          <button
            type="button"
            onClick={() => toggleQuote(product.id)}
            className={`mt-5 inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${
              inQuote ? "border-clay bg-clay text-paper" : "border-ink/25 text-ink hover:border-ink"
            }`}
          >
            {inQuote ? "✓ Na lista de cotação" : "+ Adicionar à cotação"}
          </button>
        </div>
      </div>
      <Folio index={index} />
    </div>
  );
}

function SpecPage({ index, active, product }: PageProps & { product: Product }) {
  const { finish } = useCatalog();
  const current = product.finishes.find((f) => f.id === finish[product.id]) ?? product.finishes[0];
  const views = techViews[product.id];
  return (
    <div className={`blueprint relative flex h-full flex-col bg-paper px-11 pt-12 pb-16 ${active ? "is-active" : ""}`}>
      <div className="flex items-baseline justify-between border-b border-ink/15 pb-3">
        <p className="text-[10px] tracking-[0.3em] text-clay uppercase">Ficha técnica</p>
        <p className="font-mono text-[9.5px] text-stone">{product.code}</p>
      </div>
      <div className="grid-paper relative mt-5 grid h-[268px] grid-cols-[1.35fr_1fr] gap-4 p-4">
        {views.map((v, i) => (
          <figure key={v.label} className="flex min-h-0 flex-col">
            <div className="min-h-0 flex-1">
              <TechDrawing view={v} delay={i * 0.5} />
            </div>
            <figcaption className="mt-1 text-[8.5px] tracking-[0.18em] text-stone uppercase">{v.label}</figcaption>
          </figure>
        ))}
        <span className="absolute top-3 right-4 text-[8px] tracking-[0.16em] text-stone uppercase">Medidas em cm</span>
      </div>

      <div className="mt-5 grid grid-cols-3 border-y border-ink/15">
        {(
          [
            ["Largura", product.dims.l],
            ["Profundidade", product.dims.p],
            ["Altura", product.dims.a],
          ] as const
        ).map(([l, v], i) => (
          <div key={l} className={`py-3 ${i ? "border-l border-ink/15 pl-4" : ""}`}>
            <div className="text-[8.5px] tracking-[0.2em] text-stone uppercase">{l}</div>
            <div className="font-display text-[26px] leading-tight text-ink">
              {v}
              <span className="ml-0.5 text-[12px] text-stone">cm</span>
            </div>
          </div>
        ))}
      </div>
      {product.dims.extra && <p className="mt-2 text-[10px] text-stone">{product.dims.extra}</p>}

      <table className="mt-4 w-full text-[10.5px]">
        <tbody>
          {product.specs.map(([k, v]) => (
            <tr key={k} className="border-b border-ink/10">
              <td className="w-[34%] py-[7px] text-stone">{k}</td>
              <td className="py-[7px] text-ink">{v}</td>
            </tr>
          ))}
          <tr className="border-b border-ink/10">
            <td className="py-[7px] text-stone">{product.finishLabel}</td>
            <td className="py-[7px] text-ink">
              <span
                className="mr-2 inline-block h-2.5 w-2.5 translate-y-[1px] rounded-full ring-1 ring-ink/20 transition-colors"
                style={{ background: current.color }}
              />
              {current.name}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-auto grid grid-cols-3 gap-3 bg-ink px-4 py-3.5 text-paper">
        {product.b2b.map(([k, v]) => (
          <div key={k}>
            <div className="text-[8px] tracking-[0.18em] text-paper/55 uppercase">{k}</div>
            <div className="mt-1 text-[11px]">{v}</div>
          </div>
        ))}
      </div>
      <Folio index={index} />
    </div>
  );
}

function Swatches({ index }: PageProps) {
  const { setFinish, goTo } = useCatalog();
  return (
    <div className="relative flex h-full flex-col bg-paper px-11 pt-14 pb-16">
      <p className="text-[10px] tracking-[0.3em] text-clay uppercase">Mostruário</p>
      <h2 className="font-display mt-4 text-[40px] leading-none font-light tracking-[-0.02em] text-ink">
        Acabamentos
      </h2>
      <p className="mt-3 max-w-[46ch] text-[11px] leading-[1.65] text-ink/70">
        Amostras físicas são enviadas sem custo para lojistas cadastrados. Toque em uma amostra para aplicá-la ao
        produto.
      </p>
      <div className="mt-7 grid gap-6">
        {products.map((p) => (
          <div key={p.id}>
            <p className="text-[9px] tracking-[0.2em] text-stone uppercase">
              {p.finishLabel} · {p.name}
            </p>
            <div className="mt-2.5 grid grid-cols-4 gap-3">
              {p.finishes.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFinish(p.id, f.id);
                    goTo(p.page);
                  }}
                  className="sample group text-left"
                  style={{ rotate: `${[-1.5, 1, -0.5, 1.5][i]}deg` }}
                >
                  <span className="tape" />
                  <span className="block h-[58px] w-full" style={{ background: f.color }} />
                  <span className="mt-1.5 block text-[9.5px] leading-tight text-ink group-hover:text-clay">
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Folio index={index} />
    </div>
  );
}

function HowToBuy({ index }: PageProps) {
  const { quote, openQuote } = useCatalog();
  const n = Object.keys(quote).length;
  const steps: [string, string][] = [
    ["Cadastro", "Lojistas, arquitetos e empresas com CNPJ ativo."],
    ["Representante", "Um consultor da sua região acompanha o projeto."],
    ["Pedido", "Volumes mínimos por peça, indicados em cada ficha."],
    ["Produção e entrega", "De 25 a 30 dias úteis, frete para todo o Brasil."],
  ];
  return (
    <div className="relative flex h-full flex-col bg-paper px-11 pt-14 pb-16">
      <p className="text-[10px] tracking-[0.3em] text-clay uppercase">Para empresas</p>
      <h2 className="font-display mt-4 text-[40px] leading-[1.02] font-light tracking-[-0.02em] text-ink">
        Como <em>comprar</em>
      </h2>
      <ol className="mt-8 grid gap-0">
        {steps.map(([t, d], i) => (
          <li key={t} className="grid grid-cols-[44px_1fr] border-t border-ink/12 py-4">
            <span className="font-display text-[22px] leading-none text-clay">{i + 1}</span>
            <div>
              <p className="font-display text-[18px] leading-tight text-ink">{t}</p>
              <p className="mt-1 text-[10.5px] leading-[1.6] text-ink/70">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-auto bg-sand/45 p-5">
        <p className="font-display text-[19px] leading-tight text-ink">
          {n ? `Você dobrou o canto de ${n} ${n > 1 ? "páginas" : "página"}.` : "Dobre o canto das páginas que interessam."}
        </p>
        <p className="mt-1 text-[10.5px] leading-[1.6] text-ink/70">
          Revise quantidades e envie sua lista ao representante, ou gere um PDF só com as páginas escolhidas.
        </p>
        <button
          type="button"
          onClick={openQuote}
          className="mt-3.5 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[10px] font-semibold tracking-[0.14em] text-paper uppercase hover:bg-clay"
        >
          Abrir lista de cotação →
        </button>
      </div>
      <Folio index={index} />
    </div>
  );
}

function BackCover({ index }: PageProps) {
  return (
    <div className="hardcover relative flex h-full flex-col items-center justify-center bg-ink px-12 text-center text-paper">
      <Logo light big />
      <p className="mt-5 text-[10px] tracking-[0.3em] text-paper/60 uppercase">Móveis para projetos · desde 1997</p>
      <div className="mt-16 grid gap-1 text-[11px] text-paper/80">
        <p>comercial@mobiletto.com.br</p>
        <p>mobiletto.com.br</p>
      </div>
      <p className="absolute bottom-10 text-[8.5px] tracking-[0.2em] text-paper/40 uppercase">
        Catálogo 2027 · imagens ilustrativas
      </p>
      <span className="sr-only">Página {index}</span>
    </div>
  );
}

export function Logo({ light, big }: { light?: boolean; big?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${light ? "text-paper" : "text-ink"}`}>
      <svg viewBox="0 0 32 32" className={big ? "h-10 w-10" : "h-6 w-6"} aria-hidden>
        <rect x="3" y="14" width="26" height="9" rx="4.5" fill="currentColor" />
        <rect x="6" y="6" width="20" height="11" rx="5.5" fill="#b4532a" />
        <rect x="7" y="23" width="3" height="6" rx="1" fill="currentColor" />
        <rect x="22" y="23" width="3" height="6" rx="1" fill="currentColor" />
      </svg>
      <span className={`font-display tracking-[0.02em] ${big ? "text-[40px]" : "text-[19px]"}`}>mobiletto</span>
    </span>
  );
}

/* ----------------------------------------------------------------- mapa */

export function CatalogPage(props: PageProps) {
  switch (props.index) {
    case 0:
      return <Cover {...props} />;
    case 1:
      return <Manifesto {...props} />;
    case 2:
      return <Index {...props} />;
    case 3:
      return <Opener {...props} />;
    case 4:
      return <Ambient {...props} />;
    case 5:
      return <ProductPage {...props} product={productById.lina} />;
    case 6:
      return <SpecPage {...props} product={productById.lina} />;
    case 7:
      return <ProductPage {...props} product={productById.brisa} />;
    case 8:
      return <SpecPage {...props} product={productById.brisa} />;
    case 9:
      return <ProductPage {...props} product={productById.orla} />;
    case 10:
      return <SpecPage {...props} product={productById.orla} />;
    case 11:
      return <Swatches {...props} />;
    case 12:
      return <HowToBuy {...props} />;
    default:
      return <BackCover {...props} />;
  }
}
