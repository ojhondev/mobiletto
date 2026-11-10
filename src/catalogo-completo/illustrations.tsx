"use client";

import { useId } from "react";

/** Retângulo arredondado como `d` de path (usado pelos desenhos técnicos animados). */
export function rr(x: number, y: number, w: number, h: number, r = 0) {
  r = Math.min(r, w / 2, h / 2);
  return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
}

const WOOD = "#a8794c";
const WOOD_DARK = "#7d5634";

/** Gradiente de volume (luz em cima, sombra embaixo) aplicado sobre cada peça. */
function Volume({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.22" />
      </linearGradient>
    </defs>
  );
}

/* ---------------------------------------------------------------- Poltrona */

export function ArmchairG({ fabric }: { fabric: string }) {
  const id = useId().replace(/:/g, "");
  const v = `url(#v${id})`;
  return (
    <g>
      <Volume id={`v${id}`} />
      <ellipse cx="200" cy="338" rx="165" ry="9" fill="#000" opacity="0.13" />
      <polygon points="128,282 138,282 136,322 131,322" fill={WOOD_DARK} />
      <polygon points="262,282 272,282 269,322 264,322" fill={WOOD_DARK} />
      <polygon points="88,282 106,282 99,336 93,336" fill={WOOD} />
      <polygon points="294,282 312,282 307,336 301,336" fill={WOOD} />
      <rect x="70" y="260" width="260" height="24" rx="6" fill={WOOD} />
      <rect x="70" y="276" width="260" height="8" rx="4" fill="#000" opacity="0.12" />
      <rect x="96" y="36" width="208" height="182" rx="48" fill={fabric} />
      <rect x="96" y="36" width="208" height="182" rx="48" fill={v} />
      <path d="M200 52 V200" stroke="#000" strokeOpacity="0.08" strokeWidth="2" />
      <rect x="52" y="116" width="76" height="154" rx="35" fill={fabric} />
      <rect x="52" y="116" width="76" height="154" rx="35" fill={v} />
      <rect x="272" y="116" width="76" height="154" rx="35" fill={fabric} />
      <rect x="272" y="116" width="76" height="154" rx="35" fill={v} />
      <rect x="114" y="196" width="172" height="68" rx="22" fill={fabric} />
      <rect x="114" y="196" width="172" height="68" rx="22" fill={v} />
      <rect x="126" y="200" width="148" height="10" rx="5" fill="#fff" opacity="0.16" />
    </g>
  );
}

/* ---------------------------------------------------------------- Aparador */

export function SideboardG({ wood }: { wood: string }) {
  const id = useId().replace(/:/g, "");
  const slats = [];
  for (let x = 140; x <= 340; x += 8) slats.push(x);
  return (
    <g>
      <Volume id={`v${id}`} />
      <ellipse cx="240" cy="284" rx="222" ry="7" fill="#000" opacity="0.13" />
      <polygon points="70,226 86,226 81,280 75,280" fill={WOOD_DARK} />
      <polygon points="394,226 410,226 405,280 399,280" fill={WOOD_DARK} />
      <rect x="40" y="226" width="400" height="6" fill="#000" opacity="0.14" />
      <rect x="24" y="52" width="432" height="176" rx="4" fill={wood} />
      <rect x="24" y="52" width="432" height="176" rx="4" fill={`url(#v${id})`} />
      <rect x="24" y="52" width="432" height="6" rx="3" fill="#fff" opacity="0.22" />
      {[24, 132, 240, 348].map((x) => (
        <rect
          key={x}
          x={x + 5}
          y="62"
          width="98"
          height="158"
          rx="2"
          fill="none"
          stroke="#000"
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />
      ))}
      {slats.map((x) =>
        x === 236 || x === 244 ? null : (
          <line key={x} x1={x} y1="64" x2={x} y2="218" stroke="#000" strokeOpacity="0.2" strokeWidth="2.4" />
        ),
      )}
      <rect x="118" y="132" width="4" height="22" rx="2" fill="#000" opacity="0.18" />
      <rect x="358" y="132" width="4" height="22" rx="2" fill="#000" opacity="0.18" />
    </g>
  );
}

/* -------------------------------------------------------------------- Mesa */

export function TableG({ top }: { top: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <Volume id={`v${id}`} />
      <ellipse cx="260" cy="284" rx="232" ry="7" fill="#000" opacity="0.13" />
      <rect x="96" y="138" width="328" height="5" rx="2" fill="#3a3836" />
      <path d="M92 126 L108 126 L80 280 L68 280 Z" fill={WOOD} />
      <path d="M100 126 L116 126 L140 280 L128 280 Z" fill={WOOD_DARK} />
      <path d="M428 126 L412 126 L440 280 L452 280 Z" fill={WOOD} />
      <path d="M420 126 L404 126 L380 280 L392 280 Z" fill={WOOD_DARK} />
      <rect x="20" y="104" width="480" height="22" rx="7" fill={top} />
      <rect x="20" y="104" width="480" height="22" rx="7" fill={`url(#v${id})`} />
      <rect x="30" y="105" width="460" height="4" rx="2" fill="#fff" opacity="0.25" />
    </g>
  );
}

export function Armchair({ fabric, className }: { fabric: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 350" className={className} aria-hidden>
      <ArmchairG fabric={fabric} />
    </svg>
  );
}
export function Sideboard({ wood, className }: { wood: string; className?: string }) {
  return (
    <svg viewBox="0 30 480 265" className={className} aria-hidden>
      <SideboardG wood={wood} />
    </svg>
  );
}
export function Table({ top, className }: { top: string; className?: string }) {
  return (
    <svg viewBox="0 80 520 215" className={className} aria-hidden>
      <TableG top={top} />
    </svg>
  );
}

/* ----------------------------------------------------------------- Ambiente */

export function Room({
  fabric,
  wood,
  top,
}: {
  fabric: string;
  wood: string;
  top: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 600 520" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`light${id}`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="600" height="520" fill="#e8e0d2" />
      <rect y="392" width="600" height="128" fill="#d6c7ae" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={i * 75 - 40} y1="392" x2={i * 95 - 120} y2="520" stroke="#000" strokeOpacity="0.05" />
      ))}
      <rect y="386" width="600" height="8" fill="#cbbb9f" />
      {/* janela em arco */}
      <path d="M50 300 V130 A75 75 0 0 1 200 130 V300 Z" fill="#f6f1e7" />
      <path d="M50 300 V130 A75 75 0 0 1 200 130 V300 Z" fill="none" stroke="#b7a68a" strokeWidth="5" />
      <line x1="125" y1="56" x2="125" y2="300" stroke="#b7a68a" strokeWidth="3" />
      <line x1="50" y1="190" x2="200" y2="190" stroke="#b7a68a" strokeWidth="3" />
      <polygon points="50,300 200,300 330,520 0,520 0,420" fill={`url(#light${id})`} opacity="0.7" />
      {/* quadro */}
      <rect x="330" y="96" width="120" height="150" fill="#f3eee4" stroke="#2b2925" strokeWidth="4" />
      <circle cx="378" cy="150" r="26" fill="#b4532a" />
      <rect x="352" y="178" width="76" height="46" fill="#5f6b48" opacity="0.85" />
      {/* planta */}
      <path d="M530 300 C 500 230 470 220 470 170 C 505 205 520 230 532 290" fill="#5f6b48" />
      <path d="M538 300 C 560 220 590 200 596 150 C 560 190 548 220 536 290" fill="#4f5a3b" />
      <path d="M534 300 C 530 230 540 180 528 130 C 520 190 522 250 530 300" fill="#6d7a54" />
      <path d="M512 296 H556 L548 392 H520 Z" fill="#c9b79a" />
      {/* tapete */}
      <path d="M40 470 L120 404 H560 L600 470 Z" fill="#cdb48f" opacity="0.6" />
      <g transform="translate(250 250) scale(0.55)">
        <SideboardG wood={wood} />
      </g>
      <g transform="translate(300 330) scale(0.55)">
        <TableG top={top} />
      </g>
      <g transform="translate(26 302) scale(0.62)">
        <ArmchairG fabric={fabric} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------ Desenhos técnicos */

export type Dim = { x1: number; y1: number; x2: number; y2: number; label: string };
export type TechView = { label: string; viewBox: string; paths: string[]; dims: Dim[] };

export const techViews: Record<"lina" | "brisa" | "orla", TechView[]> = {
  lina: [
    {
      label: "Vista frontal",
      viewBox: "10 20 400 360",
      paths: [
        rr(96, 36, 208, 182, 48),
        rr(52, 116, 76, 154, 35),
        rr(272, 116, 76, 154, 35),
        rr(114, 196, 172, 68, 22),
        rr(70, 260, 260, 24, 6),
        "M88 284 L106 284 L99 336 L93 336 Z",
        "M294 284 L312 284 L307 336 L301 336 Z",
      ],
      dims: [
        { x1: 52, y1: 360, x2: 348, y2: 360, label: "78" },
        { x1: 380, y1: 36, x2: 380, y2: 336, label: "76" },
      ],
    },
    {
      label: "Vista lateral",
      viewBox: "10 20 400 360",
      paths: [
        "M268 40 C292 34 314 42 316 66 L326 262 L282 262 L262 70 C260 54 262 44 268 40 Z",
        rr(70, 118, 250, 146, 32),
        rr(70, 260, 256, 24, 6),
        "M84 284 L100 284 L94 336 L88 336 Z",
        "M296 284 L312 284 L318 336 L312 336 Z",
      ],
      dims: [
        { x1: 70, y1: 360, x2: 326, y2: 360, label: "82" },
        { x1: 40, y1: 196, x2: 40, y2: 336, label: "42" },
      ],
    },
  ],
  brisa: [
    {
      label: "Vista frontal",
      viewBox: "0 30 500 290",
      paths: [
        rr(24, 52, 432, 176, 4),
        rr(29, 62, 98, 158, 2),
        rr(137, 62, 98, 158, 2),
        rr(245, 62, 98, 158, 2),
        rr(353, 62, 98, 158, 2),
        "M70 228 L86 228 L81 280 L75 280 Z",
        "M394 228 L410 228 L405 280 L399 280 Z",
        "M160 62 V220 M184 62 V220 M208 62 V220 M268 62 V220 M292 62 V220 M316 62 V220",
      ],
      dims: [
        { x1: 24, y1: 304, x2: 456, y2: 304, label: "180" },
        { x1: 478, y1: 52, x2: 478, y2: 280, label: "78" },
      ],
    },
    {
      label: "Vista lateral",
      viewBox: "60 30 400 290",
      paths: [
        rr(186, 52, 108, 176, 4),
        "M200 228 L212 228 L210 280 L204 280 Z",
        "M268 228 L280 228 L278 280 L272 280 Z",
      ],
      dims: [{ x1: 186, y1: 304, x2: 294, y2: 304, label: "45" }],
    },
  ],
  orla: [
    {
      label: "Vista frontal",
      viewBox: "0 80 540 240",
      paths: [
        rr(20, 104, 480, 22, 7),
        rr(96, 138, 328, 5, 2),
        "M92 126 L108 126 L80 280 L68 280 Z",
        "M100 126 L116 126 L140 280 L128 280 Z",
        "M428 126 L412 126 L440 280 L452 280 Z",
        "M420 126 L404 126 L380 280 L392 280 Z",
      ],
      dims: [
        { x1: 20, y1: 304, x2: 500, y2: 304, label: "220" },
        { x1: 522, y1: 104, x2: 522, y2: 280, label: "76" },
      ],
    },
    {
      label: "Vista lateral",
      viewBox: "60 80 400 240",
      paths: [
        rr(151, 104, 218, 22, 7),
        "M176 126 L190 126 L184 280 L172 280 Z",
        "M344 126 L330 126 L336 280 L348 280 Z",
      ],
      dims: [{ x1: 151, y1: 304, x2: 369, y2: 304, label: "100" }],
    },
  ],
};

export function TechDrawing({ view, delay = 0 }: { view: TechView; delay?: number }) {
  return (
    <svg viewBox={view.viewBox} className="h-full w-full overflow-visible" aria-hidden>
      {view.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className="ln"
          style={{ animationDelay: `${delay + i * 0.12}s` }}
        />
      ))}
      {view.dims.map((dm, i) => {
        const horiz = dm.y1 === dm.y2;
        const mx = (dm.x1 + dm.x2) / 2;
        const my = (dm.y1 + dm.y2) / 2;
        const t = 6;
        return (
          <g key={i} className="dim" style={{ animationDelay: `${delay + 1.1 + i * 0.25}s` }}>
            <line x1={dm.x1} y1={dm.y1} x2={dm.x2} y2={dm.y2} />
            <line x1={dm.x1 - t} y1={dm.y1 + t} x2={dm.x1 + t} y2={dm.y1 - t} />
            <line x1={dm.x2 - t} y1={dm.y2 + t} x2={dm.x2 + t} y2={dm.y2 - t} />
            <rect
              x={horiz ? mx - 22 : mx - 14}
              y={horiz ? my - 10 : my - 22}
              width={horiz ? 44 : 28}
              height={horiz ? 20 : 44}
              className="dim-bg"
            />
            <text
              x={mx}
              y={my}
              textAnchor="middle"
              dominantBaseline="central"
              transform={horiz ? undefined : `rotate(-90 ${mx} ${my})`}
            >
              {dm.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
