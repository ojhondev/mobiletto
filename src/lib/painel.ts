import "server-only";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { Campo, Opcao } from "@/lib/cms/campos";
import type { TipoEntidade } from "@/lib/cms/entidades";

/** Consultas usadas só pelas telas do painel (nunca exportar de um arquivo "use server"). */

const TABELAS = {
  produtos: schema.produtos,
  categorias: schema.categorias,
  segmentos: schema.segmentos,
  cases: schema.cases,
  vagas: schema.vagas,
} as const;

export async function listarEntidades(tipo: TipoEntidade) {
  const t = TABELAS[tipo];
  return (await db.select().from(t).orderBy(asc(t.ordem), asc(t.id))) as Record<string, unknown>[];
}

export async function entidadePorId(tipo: TipoEntidade, id: number) {
  const t = TABELAS[tipo];
  const [item] = await db.select().from(t).where(eq(t.id, id)).limit(1);
  return (item as Record<string, unknown> | undefined) ?? null;
}

/** Opções dinâmicas dos campos "select" (categorias, segmentos). */
export async function opcoesDinamicas(campos: Campo[]): Promise<Record<string, Opcao[]>> {
  const out: Record<string, Opcao[]> = {};
  for (const c of campos) {
    if (c.tipo !== "select" || Array.isArray(c.opcoes)) continue;
    if (c.opcoes === "categorias") {
      const cats = await db.select().from(schema.categorias).orderBy(asc(schema.categorias.ordem));
      out[c.nome] = cats.map((x) => ({ valor: String(x.id), rotulo: x.nome }));
    } else {
      const segs = await db.select().from(schema.segmentos).orderBy(asc(schema.segmentos.ordem));
      out[c.nome] = segs.map((x) => ({ valor: x.slug, rotulo: x.nome }));
    }
  }
  return out;
}

export async function nomesCategorias() {
  const cats = await db.select({ id: schema.categorias.id, nome: schema.categorias.nome }).from(schema.categorias);
  return new Map(cats.map((c) => [c.id, c.nome]));
}

export async function contagens() {
  const [prod, cat, cs, vg, mid, novas] = await Promise.all([
    db.select({ n: count() }).from(schema.produtos),
    db.select({ n: count() }).from(schema.categorias),
    db.select({ n: count() }).from(schema.cases),
    db.select({ n: count() }).from(schema.vagas),
    db.select({ n: count() }).from(schema.midias),
    db.select({ n: count() }).from(schema.mensagens).where(eq(schema.mensagens.status, "nova")),
  ]);
  return { produtos: prod[0].n, categorias: cat[0].n, cases: cs[0].n, vagas: vg[0].n, midias: mid[0].n, novas: novas[0].n };
}

export async function mensagensNovas() {
  const [r] = await db.select({ n: count() }).from(schema.mensagens).where(eq(schema.mensagens.status, "nova"));
  return r.n;
}

export async function ultimasMensagens(limite = 6) {
  return db.select().from(schema.mensagens).orderBy(desc(schema.mensagens.criadoEm)).limit(limite);
}

export async function listarMensagens(filtro: { tipo?: string; status?: string }) {
  const conds = [];
  if (filtro.tipo) conds.push(eq(schema.mensagens.tipo, filtro.tipo));
  if (filtro.status) conds.push(eq(schema.mensagens.status, filtro.status as "nova"));
  return db
    .select()
    .from(schema.mensagens)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(schema.mensagens.criadoEm));
}

export async function mensagemPorId(id: number) {
  const [m] = await db.select().from(schema.mensagens).where(eq(schema.mensagens.id, id)).limit(1);
  return m ?? null;
}

export async function secoesSalvas() {
  const linhas = await db.select({ chave: schema.secoes.chave, em: schema.secoes.atualizadoEm, por: schema.secoes.atualizadoPor }).from(schema.secoes);
  return new Map(linhas.map((l) => [l.chave, l]));
}

export async function listarUsuarios() {
  return db
    .select({
      id: schema.usuarios.id,
      nome: schema.usuarios.nome,
      email: schema.usuarios.email,
      papel: schema.usuarios.papel,
      ativo: schema.usuarios.ativo,
      trocarSenha: schema.usuarios.trocarSenha,
      ultimoAcesso: schema.usuarios.ultimoAcesso,
    })
    .from(schema.usuarios)
    .orderBy(asc(schema.usuarios.criadoEm));
}

/** Data/hora em Brasília (o servidor roda em UTC). */
export function dataHora(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(
    new Date(d),
  );
}
