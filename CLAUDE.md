@AGENTS.md

# Mobiletto — site institucional + painel

Mobiliário corporativo (escritórios, empresas, recepções, hotéis, restaurantes,
áreas comuns) — projeto, fabricação própria e instalação, do simples ao
sofisticado. O site deve passar **robustez**, não "design de interiores delicado".
**Todo o conteúdo é editável pela equipe no painel (`/painel`).**

- Stack: Next.js 16 (App Router, Server Actions; `cacheComponents` **desligado**) +
  Tailwind v4 + Neon Postgres/Drizzle + Vercel Blob. Domínio atual na Wix (migrar na publicação).
- Dev: `npm run dev -- -p 3017` (config `mobiletto` em `A:\Velo\.claude\launch.json`).
- Banco: `npm run db:push` (aplica `src/lib/db/schema.ts`), `npm run db:seed` (carga
  inicial idempotente; cria o 1º admin e grava a senha provisória em `.cache/acesso-inicial.txt`).
- Env (Vercel + `.env.local` via `vercel env pull`): `DATABASE_URL`(+ vars Neon),
  `BLOB_READ_WRITE_TOKEN` (store `mobiletto-midia`, público, gru1), `AUTH_SECRET`.

## Como o conteúdo funciona
- `src/lib/cms/secoes.ts` — **seções** de texto/imagem de cada página: campos do
  formulário + conteúdo padrão. Valor salvo (tabela `secoes`) é mesclado por cima do
  padrão (`getSecao`). Para criar um campo novo no site: adicionar aqui e ler na página.
- `src/lib/cms/entidades.ts` — **itens** (produtos, categorias, segmentos, cases,
  vagas): campos com o MESMO nome das colunas do banco.
- `src/lib/cms/campos.ts` — tipos de campo (texto, textarea, imagem, imagens, vídeo,
  lista, booleano, select, itens). O painel monta os formulários a partir disso
  (`components/painel/EditorCampos.tsx`) — não escrever formulário por tela.
- Site estático; toda ação do painel chama `revalidatePath("/", "layout")` → o site
  atualiza na hora. Consultas públicas em `src/lib/cms/dados.ts`.
- `src/content/site.ts` é só a fonte do seed.

## Painel (`src/app/painel`)
- Login próprio: cookie HMAC + scrypt (`src/lib/auth.ts`). Papéis: `admin` (inclui
  usuários) e `editor`. Senha provisória obriga troca no 1º acesso. **Toda server action
  confere a sessão** (`exigirUsuario`/`exigirAdmin`). Consultas do painel em `src/lib/painel.ts`.
- Uploads: navegador comprime (WebP, ≤2400px) e envia **direto ao Blob** via
  `/api/painel/upload` (token só para logado) → `registrarMidia`. Evita o limite de 4,5MB.
- Formulários públicos gravam em `mensagens` (caixa de entrada); currículo vai ao Blob
  em `curriculos/` com nome aleatório (store é público — link só aparece no painel).
- Futuro: mover o painel para um subdomínio.

## Design = Nornorm (nornorm.com), com a identidade Mobiletto
- Estrutura/componentes da Nornorm (style guide Refero `0769ff4c…`). Destaque
  **Deep Blue #1D344B** (`azul`); fundos branco/`marfim-suave`; **Instrument Sans** com
  tracking **-0.03em** (o painel usa tracking normal via `.painel`).
- Botões cantos 6px, sem sombra. Fotos canto reto (`.foto`). Layout fluido (`.shell`).
- Movimento: fotos "abrem" (clip-path) ao entrar na tela (`.reveal .foto`), faixa de
  segmentos em loop (`Marquee`), contadores (`Contador`), galeria arrastável, overlay
  azul-escuro no hover de fotos com texto (`.foto-texto` / `.foto-hover`). Tudo respeita
  `prefers-reduced-motion`.
- Rodapé: link "Painel administrativo" + "Desenvolvido por @ojhondev" (IBM Plex Mono,
  wa.me/5514998570045).

## Marca
- Logos em `public/brand/` foram **extraídos do PDF do manual** (MuPDF) — nunca
  redesenhar. Material bruto em `.brand-src/` (gitignored).
- Produtos reais em `public/produtos/`; fotos de ambiente do Unsplash em `public/images/`
  (provisórias). Hero: vídeo `public/video/hero.{webm,mp4}` + camada preta.

## Atenção
- Fichas técnicas dos produtos e cases/vagas/contatos/números são **referências** a
  validar com a Mobiletto (editar pelo painel).
- `src/catalogo-completo/` — flipbook 3D do protótipo, **estacionado** (futura página
  "Catálogo Completo"; reimportar `catalog.css` e a fonte Fraunces ao reativar).
- Não usar `text-muted` (colide com o token do shadcn).
