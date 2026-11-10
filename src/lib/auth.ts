import "server-only";
import crypto from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

/**
 * Sessão do painel: cookie httpOnly assinado com HMAC (AUTH_SECRET).
 * Token = `usuarioId|versão|expira.assinatura`. A versão muda ao trocar a senha
 * ou desativar a conta, o que derruba todas as sessões abertas.
 */
const COOKIE = "mobiletto_painel";
const DURACAO = 60 * 60 * 24 * 14; // 14 dias

function assinar(payload: string) {
  const segredo = process.env.AUTH_SECRET;
  if (!segredo) throw new Error("AUTH_SECRET não configurado.");
  return crypto.createHmac("sha256", segredo).update(payload).digest("base64url");
}

function lerToken(token: string) {
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const recebido = Buffer.from(token.slice(i + 1));
  const esperado = Buffer.from(assinar(payload));
  if (recebido.length !== esperado.length || !crypto.timingSafeEqual(recebido, esperado)) return null;
  const [id, versao, expira] = payload.split("|");
  if (!id || !(Number(expira) > Date.now())) return null;
  return { id, versao: Number(versao) };
}

export async function criarSessao(id: string, versao: number) {
  const payload = `${id}|${versao}|${Date.now() + DURACAO * 1000}`;
  (await cookies()).set(COOKIE, `${payload}.${assinar(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO,
  });
}

export async function encerrarSessao() {
  (await cookies()).delete(COOKIE);
}

export type UsuarioSessao = { id: string; nome: string; email: string; papel: "admin" | "editor"; trocarSenha: boolean };

export const getUsuario = cache(async (): Promise<UsuarioSessao | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  const t = token ? lerToken(token) : null;
  if (!t) return null;
  const [u] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, t.id)).limit(1);
  if (!u || !u.ativo || u.versaoSessao !== t.versao) return null;
  return { id: u.id, nome: u.nome, email: u.email, papel: u.papel, trocarSenha: u.trocarSenha };
});

/** Exige login (páginas e ações do painel). Quem está com senha provisória troca antes. */
export async function exigirUsuario(opts: { permitirTrocaPendente?: boolean } = {}) {
  const u = await getUsuario();
  if (!u) redirect("/painel/login");
  if (u.trocarSenha && !opts.permitirTrocaPendente) redirect("/painel/primeiro-acesso");
  return u;
}

export async function exigirAdmin() {
  const u = await exigirUsuario();
  if (u.papel !== "admin") redirect("/painel?negado=1");
  return u;
}
