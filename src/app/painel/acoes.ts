"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, desc, eq, gt, lt, ne } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { criarSessao, encerrarSessao, exigirAdmin, exigirUsuario } from "@/lib/auth";
import { apagarArquivo } from "@/lib/armazenamento";
import { normalizar } from "@/lib/cms/campos";
import { ENTIDADES, ehTipo, type TipoEntidade } from "@/lib/cms/entidades";
import { SECOES, type ChaveSecao } from "@/lib/cms/secoes";
import { conferirSenha, hashSenha, SENHA_MINIMA, senhaProvisoria } from "@/lib/senha";

/**
 * Ações do painel. TODA ação confere a sessão no servidor (exigirUsuario/exigirAdmin)
 * — não confiar em botão escondido. Mudança de conteúdo revalida o site inteiro.
 */

export type Resultado = { ok: boolean; erro?: string; id?: number | string };

/** Republica o site inteiro e registra quando isso aconteceu (mostrado no topo do painel). */
async function atualizarSite(por?: string) {
  revalidatePath("/", "layout");
  const valor = { em: new Date().toISOString(), por: por ?? "" };
  await db
    .insert(schema.secoes)
    .values({ chave: "_publicacao", valor, atualizadoPor: por })
    .onConflictDoUpdate({ target: schema.secoes.chave, set: { valor, atualizadoEm: new Date(), atualizadoPor: por } });
}

const TABELAS = {
  produtos: schema.produtos,
  categorias: schema.categorias,
  segmentos: schema.segmentos,
  cases: schema.cases,
  vagas: schema.vagas,
} as const;

function slugify(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "item"
  );
}

/* ================================================================ acesso */

export type EstadoLogin = { erro?: string; email?: string } | null;

export async function entrar(_prev: EstadoLogin, fd: FormData): Promise<EstadoLogin> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const senha = String(fd.get("senha") ?? "");
  if (!email || !senha) return { erro: "Informe e-mail e senha.", email };
  const [u] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email)).limit(1);
  // mesma mensagem para e-mail inexistente e senha errada
  if (!u || !u.ativo || !conferirSenha(senha, u.senhaHash)) return { erro: "E-mail ou senha incorretos.", email };
  await db.update(schema.usuarios).set({ ultimoAcesso: new Date() }).where(eq(schema.usuarios.id, u.id));
  await criarSessao(u.id, u.versaoSessao);
  const voltar = String(fd.get("voltar") ?? "");
  // só volta para dentro do painel (evita redirecionamento para outro site)
  const destino = /^\/painel(\/|$)/.test(voltar) ? voltar : "/painel";
  redirect(u.trocarSenha ? "/painel/primeiro-acesso" : destino);
}

export async function sair() {
  await encerrarSessao();
  redirect("/painel/login");
}

export type EstadoSenha = { erro?: string; ok?: boolean } | null;

export async function trocarSenha(_prev: EstadoSenha, fd: FormData): Promise<EstadoSenha> {
  const eu = await exigirUsuario({ permitirTrocaPendente: true });
  const atual = String(fd.get("atual") ?? "");
  const nova = String(fd.get("nova") ?? "");
  const confirmar = String(fd.get("confirmar") ?? "");
  const [u] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, eu.id)).limit(1);
  if (!u || !conferirSenha(atual, u.senhaHash)) return { erro: "A senha atual não confere." };
  if (nova.length < SENHA_MINIMA) return { erro: `A nova senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.` };
  if (nova !== confirmar) return { erro: "A confirmação não é igual à nova senha." };
  if (nova === atual) return { erro: "Escolha uma senha diferente da atual." };
  const versao = u.versaoSessao + 1;
  await db.update(schema.usuarios).set({ senhaHash: hashSenha(nova), trocarSenha: false, versaoSessao: versao }).where(eq(schema.usuarios.id, u.id));
  await criarSessao(u.id, versao); // mantém este aparelho logado e derruba os outros
  if (u.trocarSenha) redirect("/painel");
  return { ok: true };
}

/* ============================================================== seções */

export async function salvarSecao(chave: string, dados: Record<string, unknown>): Promise<Resultado> {
  const eu = await exigirUsuario();
  if (!(chave in SECOES)) return { ok: false, erro: "Seção desconhecida." };
  const valor = normalizar(SECOES[chave as ChaveSecao].campos, dados);
  await db
    .insert(schema.secoes)
    .values({ chave, valor, atualizadoPor: eu.nome })
    .onConflictDoUpdate({ target: schema.secoes.chave, set: { valor, atualizadoEm: new Date(), atualizadoPor: eu.nome } });
  await atualizarSite();
  return { ok: true };
}

export async function restaurarSecao(chave: string): Promise<Resultado> {
  await exigirUsuario();
  await db.delete(schema.secoes).where(eq(schema.secoes.chave, chave));
  await atualizarSite();
  return { ok: true };
}

/* ============================================================ entidades */

async function slugUnico(tipo: TipoEntidade, base: string, id: number | null) {
  const t = TABELAS[tipo];
  let slug = slugify(base);
  for (let n = 2; ; n++) {
    const [existe] = await db
      .select({ id: t.id })
      .from(t)
      .where(id ? and(eq(t.slug, slug), ne(t.id, id)) : eq(t.slug, slug))
      .limit(1);
    if (!existe) return slug;
    slug = `${slugify(base)}-${n}`;
  }
}

export async function salvarEntidade(tipo: string, id: number | null, dados: Record<string, unknown>): Promise<Resultado> {
  await exigirUsuario();
  if (!ehTipo(tipo)) return { ok: false, erro: "Tipo inválido." };
  const def = ENTIDADES[tipo];
  const v = normalizar(def.campos, dados) as Record<string, unknown>;
  const nome = String(v[def.titulo] ?? "").trim();
  if (!nome) return { ok: false, erro: `Preencha o campo "${def.campos.find((c) => c.nome === def.titulo)?.rotulo}".` };
  v.slug = await slugUnico(tipo, String(v.slug || nome), id);
  if ("categoriaId" in v) v.categoriaId = v.categoriaId ? Number(v.categoriaId) : null;
  const t = TABELAS[tipo];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- colunas validadas pela definição da entidade
  const valores = { ...v, atualizadoEm: new Date() } as any;
  let novoId = id;
  if (id) {
    await db.update(t).set(valores).where(eq(t.id, id));
  } else {
    const [ultimo] = await db.select({ ordem: t.ordem }).from(t).orderBy(desc(t.ordem)).limit(1);
    const [criado] = await db
      .insert(t)
      .values({ ...valores, ordem: (ultimo?.ordem ?? -1) + 1 })
      .returning({ id: t.id });
    novoId = criado.id;
  }
  await atualizarSite();
  return { ok: true, id: novoId ?? undefined };
}

export async function excluirEntidade(tipo: string, id: number): Promise<Resultado> {
  await exigirUsuario();
  if (!ehTipo(tipo)) return { ok: false, erro: "Tipo inválido." };
  const t = TABELAS[tipo];
  await db.delete(t).where(eq(t.id, id));
  await atualizarSite();
  return { ok: true };
}

export async function duplicarEntidade(tipo: string, id: number): Promise<Resultado> {
  await exigirUsuario();
  if (!ehTipo(tipo)) return { ok: false, erro: "Tipo inválido." };
  const t = TABELAS[tipo];
  const [orig] = await db.select().from(t).where(eq(t.id, id)).limit(1);
  if (!orig) return { ok: false, erro: "Item não encontrado." };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, ...resto } = orig as Record<string, unknown>;
  const titulo = String(resto[ENTIDADES[tipo].titulo]);
  const copia = { ...resto, [ENTIDADES[tipo].titulo]: `${titulo} (cópia)`, publicado: false, atualizadoEm: new Date() };
  copia.slug = await slugUnico(tipo, `${titulo}-copia`, null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [criado] = await db.insert(t).values(copia as any).returning({ id: t.id });
  await atualizarSite();
  return { ok: true, id: criado.id };
}

export async function alternarPublicado(tipo: string, id: number): Promise<Resultado> {
  await exigirUsuario();
  if (!ehTipo(tipo)) return { ok: false, erro: "Tipo inválido." };
  const t = TABELAS[tipo];
  const [item] = await db.select({ publicado: t.publicado }).from(t).where(eq(t.id, id)).limit(1);
  if (!item) return { ok: false, erro: "Item não encontrado." };
  await db.update(t).set({ publicado: !item.publicado }).where(eq(t.id, id));
  await atualizarSite();
  return { ok: true };
}

/** Troca a posição com o vizinho de cima (-1) ou de baixo (+1). */
export async function moverEntidade(tipo: string, id: number, direcao: -1 | 1): Promise<Resultado> {
  await exigirUsuario();
  if (!ehTipo(tipo)) return { ok: false, erro: "Tipo inválido." };
  const t = TABELAS[tipo];
  // normaliza a ordem (0,1,2…) antes de trocar, para itens com ordem repetida
  const todos = await db.select({ id: t.id, ordem: t.ordem }).from(t).orderBy(asc(t.ordem), asc(t.id));
  for (const [i, x] of todos.entries()) if (x.ordem !== i) await db.update(t).set({ ordem: i }).where(eq(t.id, x.id));
  const pos = todos.findIndex((x) => x.id === id);
  const alvo = todos[pos + direcao];
  if (pos < 0 || !alvo) return { ok: true };
  await db.update(t).set({ ordem: pos + direcao }).where(eq(t.id, id));
  await db.update(t).set({ ordem: pos }).where(eq(t.id, alvo.id));
  await atualizarSite();
  return { ok: true };
}

/* ================================================================ mídia */

export type MidiaLeve = { id: number; url: string; nome: string; tipo: string; largura: number | null; altura: number | null; alt: string; origem: string };

export async function buscarMidias(): Promise<MidiaLeve[]> {
  await exigirUsuario();
  return db
    .select({
      id: schema.midias.id,
      url: schema.midias.url,
      nome: schema.midias.nome,
      tipo: schema.midias.tipo,
      largura: schema.midias.largura,
      altura: schema.midias.altura,
      alt: schema.midias.alt,
      origem: schema.midias.origem,
    })
    .from(schema.midias)
    .orderBy(desc(schema.midias.criadoEm), desc(schema.midias.id));
}

/** Registra no banco um arquivo que o navegador acabou de enviar ao Blob. */
export async function registrarMidia(m: { url: string; nome: string; tipo: string; tamanho: number; largura?: number; altura?: number }): Promise<MidiaLeve> {
  await exigirUsuario();
  if (!m.url.includes(".blob.vercel-storage.com/")) throw new Error("URL inválida.");
  const [criada] = await db
    .insert(schema.midias)
    .values({ url: m.url, nome: m.nome.slice(0, 200), tipo: m.tipo, tamanho: m.tamanho, largura: m.largura ?? null, altura: m.altura ?? null, origem: "blob" })
    .onConflictDoNothing()
    .returning();
  return { id: criada.id, url: criada.url, nome: criada.nome, tipo: criada.tipo, largura: criada.largura, altura: criada.altura, alt: criada.alt, origem: criada.origem };
}

export async function atualizarAlt(id: number, alt: string): Promise<Resultado> {
  await exigirUsuario();
  await db.update(schema.midias).set({ alt: alt.slice(0, 300) }).where(eq(schema.midias.id, id));
  return { ok: true };
}

export async function excluirMidia(id: number): Promise<Resultado> {
  await exigirUsuario();
  const [m] = await db.select().from(schema.midias).where(eq(schema.midias.id, id)).limit(1);
  if (!m) return { ok: true };
  if (m.origem === "blob") await apagarArquivo(m.url);
  await db.delete(schema.midias).where(eq(schema.midias.id, id));
  return { ok: true };
}

/* ============================================================ mensagens */

export async function mudarStatus(id: number, status: "nova" | "em-andamento" | "concluida"): Promise<Resultado> {
  await exigirUsuario();
  await db.update(schema.mensagens).set({ status }).where(eq(schema.mensagens.id, id));
  revalidatePath("/painel", "layout");
  return { ok: true };
}

export async function salvarAnotacoes(id: number, anotacoes: string): Promise<Resultado> {
  await exigirUsuario();
  await db.update(schema.mensagens).set({ anotacoes: anotacoes.slice(0, 5000) }).where(eq(schema.mensagens.id, id));
  return { ok: true };
}

export async function excluirMensagem(id: number): Promise<Resultado> {
  await exigirUsuario();
  const [m] = await db.select().from(schema.mensagens).where(eq(schema.mensagens.id, id)).limit(1);
  if (m?.arquivo) await apagarArquivo(m.arquivo);
  await db.delete(schema.mensagens).where(eq(schema.mensagens.id, id));
  revalidatePath("/painel", "layout");
  return { ok: true };
}

/* ============================================================= usuários */

export type EstadoUsuario = { erro?: string; senha?: string; email?: string } | null;

export async function criarUsuario(_prev: EstadoUsuario, fd: FormData): Promise<EstadoUsuario> {
  await exigirAdmin();
  const nome = String(fd.get("nome") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const papel = fd.get("papel") === "admin" ? "admin" : "editor";
  if (nome.length < 2) return { erro: "Informe o nome." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { erro: "Informe um e-mail válido." };
  const [existe] = await db.select({ id: schema.usuarios.id }).from(schema.usuarios).where(eq(schema.usuarios.email, email)).limit(1);
  if (existe) return { erro: "Já existe uma conta com este e-mail." };
  const senha = senhaProvisoria();
  await db.insert(schema.usuarios).values({ nome, email, papel, senhaHash: hashSenha(senha), trocarSenha: true });
  revalidatePath("/painel/usuarios");
  return { senha, email };
}

export async function redefinirSenha(id: string): Promise<{ senha?: string; erro?: string }> {
  await exigirAdmin();
  const [u] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, id)).limit(1);
  if (!u) return { erro: "Conta não encontrada." };
  const senha = senhaProvisoria();
  await db
    .update(schema.usuarios)
    .set({ senhaHash: hashSenha(senha), trocarSenha: true, versaoSessao: u.versaoSessao + 1 })
    .where(eq(schema.usuarios.id, id));
  revalidatePath("/painel/usuarios");
  return { senha };
}

export async function alternarAtivo(id: string): Promise<Resultado> {
  const eu = await exigirAdmin();
  if (eu.id === id) return { ok: false, erro: "Você não pode desativar a própria conta." };
  const [u] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, id)).limit(1);
  if (!u) return { ok: false, erro: "Conta não encontrada." };
  if (u.ativo && u.papel === "admin") {
    const admins = await db
      .select({ id: schema.usuarios.id })
      .from(schema.usuarios)
      .where(and(eq(schema.usuarios.papel, "admin"), eq(schema.usuarios.ativo, true)));
    if (admins.length <= 1) return { ok: false, erro: "É preciso manter pelo menos um administrador ativo." };
  }
  await db.update(schema.usuarios).set({ ativo: !u.ativo, versaoSessao: u.versaoSessao + 1 }).where(eq(schema.usuarios.id, id));
  revalidatePath("/painel/usuarios");
  return { ok: true };
}

export async function mudarPapel(id: string, papel: "admin" | "editor"): Promise<Resultado> {
  const eu = await exigirAdmin();
  if (eu.id === id && papel !== "admin") return { ok: false, erro: "Você não pode remover o próprio acesso de administrador." };
  await db.update(schema.usuarios).set({ papel }).where(eq(schema.usuarios.id, id));
  revalidatePath("/painel/usuarios");
  return { ok: true };
}

/* ================================================ navegação entre itens */

/** Próximo/anterior na lista (setas na tela de edição). */
export async function vizinho(tipo: string, ordem: number, direcao: -1 | 1) {
  await exigirUsuario();
  if (!ehTipo(tipo)) return null;
  const t = TABELAS[tipo];
  const [v] = await db
    .select({ id: t.id })
    .from(t)
    .where(direcao === 1 ? gt(t.ordem, ordem) : lt(t.ordem, ordem))
    .orderBy(direcao === 1 ? asc(t.ordem) : desc(t.ordem))
    .limit(1);
  return v?.id ?? null;
}

/* ============================================================ publicação */

/** Botão "Salvar e publicar" do topo do painel: força a republicação de todas as páginas. */
export async function publicarSite(): Promise<Resultado & { em?: string }> {
  const eu = await exigirUsuario();
  await atualizarSite(eu.nome);
  return { ok: true, em: new Date().toISOString() };
}

/* ================================================================ leads */

export async function mudarStatusLead(id: number, status: "novo" | "em-contato" | "convertido" | "descartado"): Promise<Resultado> {
  await exigirUsuario();
  await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
  revalidatePath("/painel", "layout");
  return { ok: true };
}

export async function salvarAnotacoesLead(id: number, anotacoes: string): Promise<Resultado> {
  await exigirUsuario();
  await db.update(schema.leads).set({ anotacoes: anotacoes.slice(0, 5000) }).where(eq(schema.leads.id, id));
  return { ok: true };
}

export async function excluirLead(id: number): Promise<Resultado> {
  await exigirUsuario();
  await db.delete(schema.leads).where(eq(schema.leads.id, id));
  revalidatePath("/painel", "layout");
  return { ok: true };
}
