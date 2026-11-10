import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { SECOES, type ChaveSecao, type ValorSecao } from "./secoes";

const { secoes, segmentos, categorias, produtos, cases, vagas } = schema;

/** Todas as seções salvas, lidas uma vez por requisição/geração de página. */
const todasSecoes = cache(async () => {
  const linhas = await db.select().from(secoes);
  return new Map(linhas.map((l) => [l.chave, l.valor]));
});

/** Conteúdo de uma seção: campos salvos no banco por cima do padrão (campos nunca salvos usam o padrão). */
export async function getSecao<K extends ChaveSecao>(chave: K): Promise<ValorSecao<K>> {
  const padrao = SECOES[chave].padrao as Record<string, unknown>;
  const salvo = (await todasSecoes()).get(chave) ?? {};
  return { ...padrao, ...salvo } as ValorSecao<K>;
}

export async function getSecoes<K extends ChaveSecao>(...chaves: K[]) {
  const vals = await Promise.all(chaves.map((c) => getSecao(c)));
  return Object.fromEntries(chaves.map((c, i) => [c, vals[i]])) as unknown as { [P in K]: ValorSecao<P> };
}

/* ------------------------------------------------------------- listas */

export const segmentosPublicados = cache(() =>
  db.select().from(segmentos).where(eq(segmentos.publicado, true)).orderBy(asc(segmentos.ordem), asc(segmentos.id)),
);

export const catalogo = cache(async () => {
  const [cats, prods] = await Promise.all([
    db.select().from(categorias).where(eq(categorias.publicado, true)).orderBy(asc(categorias.ordem), asc(categorias.id)),
    db
      .select()
      .from(produtos)
      .where(eq(produtos.publicado, true))
      .orderBy(desc(produtos.destaque), asc(produtos.ordem), asc(produtos.id)),
  ]);
  return cats.map((c) => ({ ...c, produtos: prods.filter((p) => p.categoriaId === c.id) }));
});

export async function produtoPorSlug(slug: string) {
  const [p] = await db
    .select()
    .from(produtos)
    .where(and(eq(produtos.slug, slug), eq(produtos.publicado, true)))
    .limit(1);
  if (!p) return null;
  const categoria = p.categoriaId
    ? (await db.select().from(categorias).where(eq(categorias.id, p.categoriaId)).limit(1))[0] ?? null
    : null;
  const relacionados = p.categoriaId
    ? await db
        .select()
        .from(produtos)
        .where(and(eq(produtos.categoriaId, p.categoriaId), eq(produtos.publicado, true), ne(produtos.id, p.id)))
        .orderBy(asc(produtos.ordem))
        .limit(4)
    : [];
  return { produto: p, categoria, relacionados };
}

export const produtosPublicados = cache(() =>
  db.select({ slug: produtos.slug, nome: produtos.nome }).from(produtos).where(eq(produtos.publicado, true)),
);

export const casesPublicados = cache(() =>
  db.select().from(cases).where(eq(cases.publicado, true)).orderBy(desc(cases.destaque), asc(cases.ordem), asc(cases.id)),
);

export async function casePorSlug(slug: string) {
  const [c] = await db
    .select()
    .from(cases)
    .where(and(eq(cases.slug, slug), eq(cases.publicado, true)))
    .limit(1);
  return c ?? null;
}

export const vagasPublicadas = cache(() =>
  db.select().from(vagas).where(eq(vagas.publicado, true)).orderBy(asc(vagas.ordem), asc(vagas.id)),
);

/** Link de WhatsApp a partir do número salvo em Contatos. */
export function linkWhatsapp(numero: string, texto: string) {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`;
}

/** Texto com parágrafos separados por linha em branco. */
export const paragrafos = (t: string) =>
  t
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
