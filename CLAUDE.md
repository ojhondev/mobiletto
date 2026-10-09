@AGENTS.md

# Mobiletto — protótipo do catálogo "físico"

Indústria de móveis B2B. Este repositório é um **protótipo** da aba Catálogo:
páginas A4 que viram como um catálogo de papel, com interações por página.

- Stack: Next.js 16 (App Router) + Tailwind v4 + shadcn/ui (base-nova). Sem banco ainda.
- Dev: `npm run dev -- -p 3017` (config `mobiletto` em `A:\Velo\.claude\launch.json`).
- `/` redireciona para `/catalogo`.

## Estrutura (`src/catalog/`)
- `Book.tsx` — motor de virar páginas em CSS 3D. Folhas (leaves) giram 0° → -180°
  em torno da lombada; ângulos animados por rAF direto no DOM (sem re-render por
  quadro). Modo duplo (desktop, spread) e simples (celular, 1 página). Arraste,
  clique na borda, teclado, `#pagina-N` na URL.
- Páginas desenhadas em 595×842 px (A4 a 72 dpi) e escaladas com `transform: scale`.
- `pages.tsx` — conteúdo de cada página (capa, manifesto, índice, abertura, ambiente,
  produto + ficha técnica ×3, mostruário, como comprar, contracapa).
- `data.ts` — produtos fictícios (Poltrona Lina, Aparador Brisa, Mesa Orla).
- `illustrations.tsx` — ilustrações SVG (cor do acabamento parametrizada) e
  desenhos técnicos que "se desenham" (`pathLength=1` + dashoffset).
- `store.tsx` — acabamento escolhido por produto + lista de cotação (localStorage).
- `QuoteSheet.tsx` — lista de cotação (shadcn Sheet); `PrintCatalog.tsx` — PDF A4
  só com as páginas marcadas (via `window.print()`).
- `catalog.css` — física visual do papel (sombras, lombada, dobra de canto, etc.).

## Atenção
- Tokens de cor próprios: `paper`, `ink`, `clay`, `sand`, `moss`, `stone`.
  Não usar `text-muted` (colide com o token do shadcn) — usar `text-stone`.
- Textos, números e contatos são placeholders do protótipo.
