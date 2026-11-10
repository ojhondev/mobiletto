"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

/**
 * Motor de "virar página" em CSS 3D.
 *
 * O livro é uma pilha de folhas (leaves). Em modo duplo cada folha tem frente
 * (página par, à direita) e verso (página ímpar, à esquerda); em modo simples
 * (celular) cada folha é uma página com verso em branco. Uma folha gira de 0°
 * (à direita) até -180° (à esquerda) em torno da lombada. Os ângulos são
 * animados por requestAnimationFrame direto no DOM — sem re-render por quadro —
 * o que permite arrastar a folha com o dedo e calcular a sombra do papel.
 */

export const PAGE_W = 595;
export const PAGE_H = 842;

export type BookApi = {
  next: () => void;
  prev: () => void;
  goToPage: (page: number) => void;
};

type Props = {
  count: number;
  single: boolean;
  scale: number;
  initialPage: number;
  reducedMotion: boolean;
  renderPage: (index: number, active: boolean) => React.ReactNode;
  onTurn?: (visible: number[]) => void;
  onSettle?: (visible: number[]) => void;
  onFlipStart?: () => void;
};

const DURATION = 820;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const INTERACTIVE = "button, a, input, select, textarea, label, [data-noflip]";

export const Book = forwardRef<BookApi, Props>(function Book(
  { count, single, scale, initialPage, reducedMotion, renderPage, onTurn, onSettle, onFlipStart },
  ref,
) {
  const leaves = single ? count : count / 2;
  const front = (k: number) => (single ? k : 2 * k);
  const back = (k: number) => (single ? null : 2 * k + 1);
  const pageToTurned = useCallback((p: number) => (single ? p : Math.floor((p + 1) / 2)), [single]);
  const visibleOf = useCallback(
    (t: number) => (single ? [t] : [2 * t - 1, 2 * t].filter((p) => p >= 0 && p < count)),
    [single, count],
  );

  const [turned, setTurned] = useState(() => Math.min(pageToTurned(initialPage), leaves - (single ? 1 : 0)));
  const [settled, setSettled] = useState(turned);
  const [edge, setEdge] = useState<"next" | "prev" | null>(null);
  const turnedRef = useRef(turned);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafEls = useRef<(HTMLDivElement | null)[]>([]);
  const angles = useRef<number[]>(Array.from({ length: leaves }, (_, k) => (k < turned ? -180 : 0)));
  const animating = useRef<Map<number, number>>(new Map()); // folha -> token
  const pending = useRef(0);
  const drag = useRef<{
    k: number;
    dir: 1 | -1;
    x0: number;
    moved: boolean;
    lastX: number;
    lastT: number;
    v: number;
  } | null>(null);

  const maxTurned = single ? leaves - 1 : leaves;
  const reach = single ? 1 : 2; // folhas mantidas montadas em volta da atual
  const windowRef = useRef<number[]>([turned]); // centros: folhas montadas = centro ± reach

  /* -------------------------------------------------------- aplica no DOM */
  const apply = useCallback(
    (k: number) => {
      const el = leafEls.current[k];
      if (!el) return;
      const a = angles.current[k];
      el.style.transform = `rotateY(${a}deg)`;
      const live = animating.current.has(k) || drag.current?.k === k;
      el.style.zIndex = String((live ? 1000 : 0) + (a < -90 ? k : leaves - k));
      el.style.setProperty("--s", Math.sin((Math.abs(a) * Math.PI) / 180).toFixed(3));
      // em modo simples a folha virada sai do quadro; escondê-la evita sobreposição
      el.style.visibility = single && a <= -179.5 ? "hidden" : "visible";
      // Só as folhas perto da página atual existem como camada 3D. Manter as 14
      // vivas estoura a memória de GPU no iPhone (Safari derruba a página).
      const near = windowRef.current.some((c) => Math.abs(k - c) <= reach);
      el.style.display = live || near ? "" : "none";
    },
    [leaves, single, reach],
  );

  const applyAll = useCallback(() => {
    for (let k = 0; k < leaves; k++) apply(k);
  }, [apply, leaves]);

  useLayoutEffect(() => {
    applyAll();
  }, [applyAll]);

  /* ------------------------------------------------------------- animação */
  const animate = useCallback(
    (k: number, to: number, delay: number, dur: number) =>
      new Promise<void>((resolve) => {
        const token = Math.random();
        animating.current.set(k, token);
        const from = angles.current[k];
        const d = reducedMotion ? 0 : dur * (Math.abs(to - from) / 180) + 120;
        let start = 0;
        const step = (now: number) => {
          if (animating.current.get(k) !== token) return resolve();
          if (!start) start = now + delay;
          const t = d <= 0 ? 1 : Math.min(1, Math.max(0, (now - start) / d));
          angles.current[k] = from + (to - from) * ease(t);
          apply(k);
          if (t < 1) requestAnimationFrame(step);
          else {
            animating.current.delete(k);
            apply(k);
            resolve();
          }
        };
        requestAnimationFrame(step);
      }),
    [apply, reducedMotion],
  );

  const commit = useCallback(
    (target: number, flips: Promise<void>[]) => {
      const cur = turnedRef.current;
      windowRef.current = [cur, target];
      turnedRef.current = target;
      setTurned(target);
      onTurn?.(visibleOf(target));
      const id = ++pending.current;
      Promise.all(flips).then(() => {
        if (id !== pending.current) return;
        windowRef.current = [target];
        applyAll();
        setSettled(target);
        onSettle?.(visibleOf(target));
      });
    },
    [onTurn, onSettle, visibleOf, applyAll],
  );

  const flipTo = useCallback(
    (target: number) => {
      target = Math.max(0, Math.min(maxTurned, target));
      const cur = turnedRef.current;
      if (target === cur) return;
      onFlipStart?.();
      const fwd = target > cur;
      let ks: number[] = [];
      if (fwd) for (let k = cur; k < target; k++) ks.push(k);
      else for (let k = cur - 1; k >= target; k--) ks.push(k);
      // Saltos longos (índice, miniaturas): as folhas do meio vão direto para o
      // destino e só a de cima/baixo anima — leve no celular e sem "metralhadora".
      if (ks.length > (single ? 1 : 3)) {
        const keep = single ? (fwd ? [cur] : [target]) : [ks[0], ks[ks.length - 1]];
        for (const k of ks) {
          if (keep.includes(k)) continue;
          animating.current.delete(k);
          angles.current[k] = fwd ? -180 : 0;
        }
        ks = keep;
      }
      const stagger = Math.min(110, 420 / ks.length);
      const flips = ks.map((k, i) => animate(k, fwd ? -180 : 0, i * stagger, DURATION));
      commit(target, flips);
      applyAll();
    },
    [animate, commit, maxTurned, onFlipStart, single, applyAll],
  );

  useImperativeHandle(
    ref,
    () => ({
      next: () => flipTo(turnedRef.current + 1),
      prev: () => flipTo(turnedRef.current - 1),
      goToPage: (p: number) => flipTo(pageToTurned(p)),
    }),
    [flipTo, pageToTurned],
  );

  useEffect(() => {
    onSettle?.(visibleOf(turnedRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------------------------------- arraste */
  const localX = (clientX: number) => {
    const r = bookRef.current!.getBoundingClientRect();
    return (clientX - r.left) / scale;
  };
  const span = single ? PAGE_W : 2 * PAGE_W;

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest(INTERACTIVE)) return;
    const x = localX(e.clientX);
    const fwd = single ? x > PAGE_W / 2 : x > PAGE_W;
    const t = turnedRef.current;
    if (fwd && t >= maxTurned) return;
    if (!fwd && t <= 0) return;
    drag.current = {
      k: fwd ? t : t - 1,
      dir: fwd ? 1 : -1,
      x0: e.clientX,
      moved: false,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) {
      if (e.pointerType !== "mouse") return;
      const x = localX(e.clientX);
      const t = turnedRef.current;
      const zone = PAGE_W * 0.16;
      setEdge(x > span - zone && x < span && t < maxTurned ? "next" : x < zone && x > 0 && t > 0 ? "prev" : null);
      return;
    }
    const dx = (e.clientX - d.x0) / scale;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      animating.current.delete(d.k);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onFlipStart?.();
    }
    const now = performance.now();
    d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;
    const reach = single ? PAGE_W * 0.85 : PAGE_W * 1.5;
    const p = Math.max(0, Math.min(1, (d.dir === 1 ? -dx : dx) / reach));
    angles.current[d.k] = d.dir === 1 ? -180 * p : -180 * (1 - p);
    apply(d.k);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      // clique simples: só vira se foi na borda externa da página
      const x = localX(e.clientX);
      const zone = single ? PAGE_W * 0.28 : PAGE_W * 0.2;
      if (d.dir === 1 && x > span - zone) flipTo(turnedRef.current + 1);
      if (d.dir === -1 && x < zone) flipTo(turnedRef.current - 1);
      return;
    }
    const a = angles.current[d.k];
    const flick = d.dir === 1 ? d.v < -0.45 : d.v > 0.45;
    const done = flick || (d.dir === 1 ? a < -55 : a > -125);
    const target = d.dir === 1 ? (done ? -180 : 0) : done ? 0 : -180;
    const flip = animate(d.k, target, 0, DURATION * 0.8);
    if (done) commit(turnedRef.current + d.dir, [flip]);
    else apply(d.k);
  };

  /* ------------------------------------------------------------ renderização */
  const near = (k: number) => Math.abs(k - turned) <= reach || Math.abs(k - settled) <= reach;
  const shift = single ? 0 : turned === 0 ? -PAGE_W / 2 : turned === leaves ? PAGE_W / 2 : 0;
  const isActive = (p: number | null) => p !== null && visibleOf(settled).includes(p) && settled === turned;

  return (
    <div
      className="book-frame"
      style={{ width: span * scale, height: PAGE_H * scale }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => setEdge(null)}
      data-edge={edge ?? undefined}
    >
      <div
        className="book-scale"
        style={{ width: span, height: PAGE_H, transform: `scale(${scale})`, transformOrigin: "0 0" }}
      >
        <div
          ref={bookRef}
          className={`book ${single ? "is-single" : "is-double"}`}
          style={{ width: span, height: PAGE_H, transform: `translateX(${shift}px)` }}
        >
          {Array.from({ length: leaves }, (_, k) => {
            const f = front(k);
            const b = back(k);
            return (
              <div
                key={k}
                ref={(el) => {
                  leafEls.current[k] = el;
                }}
                className="leaf"
                style={{ left: single ? 0 : PAGE_W, width: PAGE_W, height: PAGE_H }}
              >
                <div className="face face-front">
                  {near(k) && renderPage(f, isActive(f))}
                  <div className="gutter" />
                  <div className="shade" />
                </div>
                <div className="face face-back">
                  {b !== null ? near(k) && renderPage(b, isActive(b)) : <div className="paper-back" />}
                  <div className="gutter" />
                  <div className="shade" />
                </div>
              </div>
            );
          })}
          {!single && <div className="spine" style={{ left: PAGE_W, opacity: turned > 0 && turned < leaves ? 1 : 0 }} />}
          <div className="curl curl-next" />
          {!single && <div className="curl curl-prev" />}
        </div>
      </div>
    </div>
  );
});
