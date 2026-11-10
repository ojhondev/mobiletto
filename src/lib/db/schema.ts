import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Banco do site Mobiletto (Neon). As colunas usam os mesmos nomes dos campos
 * do painel (src/lib/cms/entidades.ts), então o formulário salva direto na linha.
 * Aplicar mudanças: `npm run db:push`.
 */

export type Par = { rotulo: string; valor: string };

/* ----------------------------------------------------------------- acesso */

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  /** admin: tudo, inclusive usuários · editor: conteúdo e mensagens */
  papel: text("papel").$type<"admin" | "editor">().notNull().default("editor"),
  ativo: boolean("ativo").notNull().default(true),
  /** muda ao trocar a senha ou desativar: derruba sessões abertas */
  versaoSessao: integer("versao_sessao").notNull().default(1),
  trocarSenha: boolean("trocar_senha").notNull().default(true),
  ultimoAcesso: timestamp("ultimo_acesso"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

/* -------------------------------------------------------------- conteúdo */

/** Textos e imagens das páginas — uma linha por seção, valor livre em JSON. */
export const secoes = pgTable("secoes", {
  chave: text("chave").primaryKey(),
  valor: jsonb("valor").$type<Record<string, unknown>>().notNull().default({}),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
  atualizadoPor: text("atualizado_por"),
});

export const segmentos = pgTable("segmentos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nome: text("nome").notNull(),
  resumo: text("resumo").notNull().default(""),
  imagem: text("imagem").notNull().default(""),
  publicado: boolean("publicado").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

export const categorias = pgTable("categorias", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nome: text("nome").notNull(),
  descricao: text("descricao").notNull().default(""),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  capa: text("capa").notNull().default(""),
  publicado: boolean("publicado").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

export const produtos = pgTable("produtos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categoriaId: integer("categoria_id").references(() => categorias.id, { onDelete: "set null" }),
  nome: text("nome").notNull(),
  codigo: text("codigo").notNull().default(""),
  resumo: text("resumo").notNull().default(""),
  /** parágrafos separados por linha em branco */
  descricao: text("descricao").notNull().default(""),
  imagens: jsonb("imagens").$type<string[]>().notNull().default([]),
  medidas: jsonb("medidas").$type<Par[]>().notNull().default([]),
  especificacoes: jsonb("especificacoes").$type<Par[]>().notNull().default([]),
  aplicacoes: jsonb("aplicacoes").$type<string[]>().notNull().default([]),
  acabamentos: jsonb("acabamentos").$type<string[]>().notNull().default([]),
  diferenciais: jsonb("diferenciais").$type<string[]>().notNull().default([]),
  destaque: boolean("destaque").notNull().default(false),
  publicado: boolean("publicado").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  segmento: text("segmento").notNull().default(""),
  cidade: text("cidade").notNull().default(""),
  ano: text("ano").notNull().default(""),
  escopo: jsonb("escopo").$type<string[]>().notNull().default([]),
  resumo: text("resumo").notNull().default(""),
  desafio: text("desafio").notNull().default(""),
  solucao: text("solucao").notNull().default(""),
  capa: text("capa").notNull().default(""),
  galeria: jsonb("galeria").$type<string[]>().notNull().default([]),
  destaque: boolean("destaque").notNull().default(false),
  publicado: boolean("publicado").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

export const vagas = pgTable("vagas", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  area: text("area").notNull().default(""),
  local: text("local").notNull().default(""),
  regime: text("regime").notNull().default("CLT"),
  descricao: text("descricao").notNull().default(""),
  publicado: boolean("publicado").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

/** Biblioteca de mídia (uploads no Vercel Blob + arquivos de /public já usados no site). */
export const midias = pgTable("midias", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  nome: text("nome").notNull().default(""),
  tipo: text("tipo").notNull().default("image/jpeg"),
  tamanho: integer("tamanho").notNull().default(0),
  largura: integer("largura"),
  altura: integer("altura"),
  alt: text("alt").notNull().default(""),
  /** blob: pode ser apagado do storage · local: arquivo do repositório */
  origem: text("origem").$type<"blob" | "local">().notNull().default("blob"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

/* ------------------------------------------------------------ mensagens */

export const mensagens = pgTable("mensagens", {
  id: serial("id").primaryKey(),
  /** contato · candidatura · linha-especial */
  tipo: text("tipo").notNull(),
  status: text("status").$type<"nova" | "em-andamento" | "concluida">().notNull().default("nova"),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  telefone: text("telefone").notNull().default(""),
  empresa: text("empresa").notNull().default(""),
  assunto: text("assunto").notNull().default(""),
  segmento: text("segmento").notNull().default(""),
  mensagem: text("mensagem").notNull().default(""),
  extra: jsonb("extra").$type<Record<string, string>>().notNull().default({}),
  arquivo: text("arquivo"),
  anotacoes: text("anotacoes").notNull().default(""),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export type Usuario = typeof usuarios.$inferSelect;
export type Segmento = typeof segmentos.$inferSelect;
export type Categoria = typeof categorias.$inferSelect;
export type Produto = typeof produtos.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type Vaga = typeof vagas.$inferSelect;
export type Midia = typeof midias.$inferSelect;
export type Mensagem = typeof mensagens.$inferSelect;
