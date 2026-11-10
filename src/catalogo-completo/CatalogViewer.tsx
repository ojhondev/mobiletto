"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Book, PAGE_H, PAGE_W, type BookApi } from "./Book";
import { PAGE_COUNT, pageTitles } from "./data";
import { CatalogPage, Logo } from "./pages";
import { QuoteSheet } from "./QuoteSheet";
import { PrintCatalog } from "./PrintCatalog";
import { CatalogProvider, useCatalog } from "./store";
import { playPaper } from "./sound";

function readHashPage() {
  if (typeof window === "undefined") return 0;
  const m = window.location.hash.match(/pagina-(\d+)/);
  return m ? Math.min(PAGE_COUNT - 1, Math.max(0, Number(m[1]))) : 0;
}

export function CatalogViewer() {
  const api = useRef<BookApi>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const goTo = useCallback((p: number) => api.current?.goToPage(p), []);
  const openQuote = useCallback(() => setQuoteOpen(true), []);
  return (
    <CatalogProvider goTo={goTo} openQuote={openQuote}>
      <Viewer api={api} quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} />
      <PrintCatalog />
    </CatalogProvider>
  );
}

function Viewer({
  api,
  quoteOpen,
  setQuoteOpen,
}: {
  api: React.RefObject<BookApi | null>;
  quoteOpen: boolean;
  setQuoteOpen: (v: boolean) => void;
}) {
  const { quote, goTo } = useCatalog();
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [visible, setVisible] = useState<number[]>([0]);
  const [thumbs, setThumbs] = useState(false);
  const [sound, setSound] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [startPage, setStartPage] = useState<number | null>(null);
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- só existe no cliente
    setStartPage(readHashPage());
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = stageRef.current!;
    const r = el.getBoundingClientRect();
    setSize({ w: r.width, h: r.height });
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, [role=dialog]")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") api.current?.next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") api.current?.prev();
      else if (e.key === "Home") api.current?.goToPage(0);
      else if (e.key === "End") api.current?.goToPage(PAGE_COUNT - 1);
      else return;
      e.preventDefault();
    };
    const onHash = () => api.current?.goToPage(readHashPage());
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [api]);

  const single = size ? size.w < 760 || size.w / size.h < 1.05 : false;
  const span = single ? PAGE_W : 2 * PAGE_W;
  const scale = size ? Math.min((size.w - (single ? 24 : 64)) / span, (size.h - 24) / PAGE_H) : 1;

  const onTurn = useCallback((v: number[]) => {
    setVisible(v);
    try {
      history.replaceState(null, "", v[0] ? `#pagina-${v[v.length - 1]}` : window.location.pathname);
    } catch {}
  }, []);
  const onFlipStart = useCallback(() => {
    if (soundRef.current) playPaper();
  }, []);
  const renderPage = useCallback(
    (i: number, active: boolean) => <CatalogPage index={i} active={active} />,
    [],
  );

  const nQuote = Object.keys(quote).length;
  const label = visible.map((p) => String(p).padStart(2, "0")).join("–");
  const atStart = visible.includes(0);
  const atEnd = visible.includes(PAGE_COUNT - 1);

  const spreads: number[][] = [[0]];
  for (let p = 1; p < PAGE_COUNT - 1; p += 2) spreads.push([p, p + 1]);
  spreads.push([PAGE_COUNT - 1]);

  return (
    <div className="viewer flex h-dvh flex-col overflow-hidden">
      {/* cabeçalho do site */}
      <header className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-4 px-5 text-paper sm:px-8 lg:px-12">
        <a href="#" onClick={() => goTo(0)} aria-label="Mobiletto">
          <Logo light />
        </a>
        <nav className="hidden items-center gap-7 text-[12.5px] whitespace-nowrap text-paper/60 lg:flex">
          <span className="cursor-default">A fábrica</span>
          <span className="cursor-default">Linhas</span>
          <span className="text-paper">Catálogo</span>
          <span className="cursor-default">Representantes</span>
          <span className="cursor-default">Contato</span>
        </nav>
        <div className="flex items-center gap-2">
          <ToolButton onClick={() => setSound((s) => !s)} pressed={sound} title={sound ? "Desligar som de papel" : "Ligar som de papel"}>
            {sound ? <IconSound /> : <IconMute />}
          </ToolButton>
          <ToolButton
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen?.().catch(() => {});
            }}
            title="Tela cheia"
          >
            <IconFull />
          </ToolButton>
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="ml-1 inline-flex h-9 items-center gap-2 rounded-full bg-paper px-4 text-[12px] font-medium text-ink transition-colors hover:bg-sand"
          >
            Cotação
            <span
              className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10.5px] ${
                nQuote ? "bg-clay text-paper" : "bg-ink/10 text-ink/60"
              }`}
            >
              {nQuote}
            </span>
          </button>
        </div>
      </header>

      {/* mesa + livro */}
      <main ref={stageRef} className="relative grid min-h-0 flex-1 place-items-center">
        {size && startPage !== null && (
          <Book
            key={single ? "single" : "double"}
            ref={api}
            count={PAGE_COUNT}
            single={single}
            scale={scale}
            initialPage={visible.length ? visible[visible.length - 1] || startPage : startPage}
            reducedMotion={reduced}
            renderPage={renderPage}
            onTurn={onTurn}
            onSettle={onTurn}
            onFlipStart={onFlipStart}
          />
        )}
      </main>

      {/* barra inferior */}
      <footer className="relative z-20 shrink-0 px-5 pb-4 sm:px-8 lg:px-12">
        <div
          className={`thumbs grid transition-[grid-template-rows,opacity] duration-500 ${
            thumbs ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pt-1 pb-4">
              {spreads.map((s) => {
                const on = s.some((p) => visible.includes(p));
                return (
                  <div
                    key={s[0]}
                    role="button"
                    onClick={() => goTo(s[0])}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goTo(s[0])}
                    className={`group shrink-0 cursor-pointer text-left ${on ? "" : "opacity-60 hover:opacity-100"}`}
                    tabIndex={thumbs ? 0 : -1}
                    aria-label={s.map((p) => pageTitles[p]).join(" e ")}
                  >
                    <div className={`flex ring-offset-2 ring-offset-[#211e1a] ${on ? "ring-2 ring-clay" : ""}`}>
                      {s.map((p) => (
                        <div key={p} className="thumb-page relative overflow-hidden bg-paper" style={{ width: 59.5, height: 84.2 }}>
                          <div inert style={{ width: PAGE_W, height: PAGE_H, transform: "scale(0.1)", transformOrigin: "0 0" }}>
                            {thumbs && <CatalogPage index={p} active={false} />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-1.5 max-w-[119px] truncate text-[10px] text-paper/60">
                      {s.map((p) => pageTitles[p]).join(" · ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setThumbs((t) => !t)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-paper/15 px-3.5 text-[12px] text-paper/80 hover:border-paper/40 hover:text-paper"
            aria-expanded={thumbs}
          >
            <IconGrid /> <span className="hidden sm:inline">Páginas</span>
          </button>
          <div className="flex items-center gap-2">
            <ToolButton onClick={() => api.current?.prev()} disabled={atStart} title="Página anterior">
              <IconArrow dir="left" />
            </ToolButton>
            <div className="min-w-[150px] text-center text-paper">
              <div className="font-display text-[15px] leading-tight">
                {label} <span className="text-paper/40">/ {String(PAGE_COUNT - 1).padStart(2, "0")}</span>
              </div>
              <div className="truncate text-[10.5px] text-paper/50">{visible.map((p) => pageTitles[p]).join(" · ")}</div>
            </div>
            <ToolButton onClick={() => api.current?.next()} disabled={atEnd} title="Próxima página">
              <IconArrow dir="right" />
            </ToolButton>
          </div>
          <p className="hidden w-[150px] text-right text-[10.5px] leading-snug text-paper/40 lg:block">
            Arraste o canto ou use ← →
          </p>
          <span className="w-[42px] lg:hidden" />
        </div>
      </footer>

      <QuoteSheet open={quoteOpen} onOpenChange={setQuoteOpen} />
    </div>
  );
}

function ToolButton({
  children,
  onClick,
  title,
  pressed,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={pressed}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-full border border-paper/15 text-paper/80 transition-colors hover:border-paper/40 hover:text-paper disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

const ic = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const IconArrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg {...ic}>{dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}</svg>
);
const IconGrid = () => (
  <svg {...ic}>
    <rect x="3" y="4" width="7" height="16" rx="1" />
    <rect x="14" y="4" width="7" height="16" rx="1" />
  </svg>
);
const IconFull = () => (
  <svg {...ic}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);
const IconSound = () => (
  <svg {...ic}>
    <path d="M4 10v4h4l5 4V6L8 10H4z" />
    <path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" />
  </svg>
);
const IconMute = () => (
  <svg {...ic}>
    <path d="M4 10v4h4l5 4V6L8 10H4z" />
    <path d="M17 10l4 4M21 10l-4 4" />
  </svg>
);
