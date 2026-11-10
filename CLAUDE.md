@AGENTS.md

# Mobiletto — site institucional

Mobiliário corporativo (escritórios, empresas, recepções, hotéis, restaurantes,
áreas comuns) — projeto, fabricação própria e instalação, do simples ao
sofisticado. O site deve passar **robustez**, não "design de interiores delicado".

- Stack: Next.js 16 (App Router, `cacheComponents`) + Tailwind v4. Sem banco ainda
  (Neon/Vercel/admin entram na publicação; o domínio atual está na Wix).
- Dev: `npm run dev -- -p 3017` (config `mobiletto` em `A:\Velo\.claude\launch.json`).

## Design = Nornorm (nornorm.com), com a identidade Mobiletto
- Estrutura, componentes e ritmo copiados da Nornorm (style guide Refero
  `0769ff4c…`): hero full-bleed com texto central e par de botões, faixa branca
  sobreposta ao hero, cards "01." com foto P&B, grade "O MOBILIÁRIO | O SERVIÇO",
  galeria em retrato com setas circulares, número em colchetes, FAQ em
  details/summary, faixa escura com foto, rodapé com símbolo grande.
- Cor de destaque da Nornorm (cobalto) → **Deep Blue #1D344B** (`azul`), usado só em
  logo, botão primário, estados ativos e rótulos. Fundos: branco e
  `marfim-suave #F8F6F1`. Texto `tinta`, secundário `pedra #6a6a6a`.
- Tipografia: **Instrument Sans** (fonte de texto do manual) em tudo, tracking
  **-0.03em** global (assinatura da referência). Escala: `text-display/h1/h2/h3/lead`.
- Botões (`components/site/Botao.tsx`): cantos 6px, sem sombra; só o primário é
  preenchido. Fotos sempre com canto reto (`.foto`). Layout fluido (`.shell`).

## Marca
- Logos em `public/brand/` foram **extraídos do PDF do manual** (imagens embutidas +
  SMask, via MuPDF) — nunca redesenhar. O wordmark marfim é um recorte exato da
  assinatura marfim. Material bruto em `.brand-src/` (gitignored).
- Produtos reais (renders enviados pela Mobiletto) em `public/produtos/`; fotos de
  ambiente do Unsplash (licença livre) em `public/images/` são provisórias.
- Hero da home: vídeo `public/video/hero.{webm,mp4}` (sem áudio) com camada preta
  `bg-black/55` para legibilidade.

## Estrutura
- `src/content/site.ts` — TODO o conteúdo (segmentos, cases, catálogo, FAQ, vagas,
  contatos). Itens `// confirmar` são placeholders a validar com o cliente.
- `src/app/(site)/` — páginas: home, sobre-nos, catalogo, cases (+ [slug]),
  trabalhe-conosco, fale-conosco, politica-de-privacidade, **linha-especial (oculta:
  noindex, fora do menu e do sitemap)**.
- `src/app/actions.ts` — Server Actions dos formulários: por enquanto só validam;
  gravar no Neon / Blob e enviar e-mail fica para a publicação.
- `src/catalogo-completo/` — protótipo do catálogo "físico" (flipbook 3D),
  **estacionado**: vai virar a página "Catálogo Completo" depois. Sem rota hoje; ao
  reativar, reimportar `catalog.css` e voltar a fonte Fraunces (usa os tokens antigos
  `paper/ink/clay/sand/moss/stone`).

## Atenção
- Não usar `text-muted` (colide com o token do shadcn).
- `cacheComponents`: nada de `new Date()` em Server Component; `useSearchParams` só
  dentro de `<Suspense>` (ver `CasesGrid`).
