import crypto from "node:crypto";

/** scrypt "sal:hash" — sem dependência externa. */
export function hashSenha(senha: string) {
  const sal = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

export function conferirSenha(senha: string, guardada: string) {
  const [sal, hash] = guardada.split(":");
  if (!sal || !hash) return false;
  const teste = crypto.scryptSync(senha, sal, 64);
  const esperado = Buffer.from(hash, "hex");
  return teste.length === esperado.length && crypto.timingSafeEqual(teste, esperado);
}

/** Senha provisória legível (sem caracteres ambíguos). */
export function senhaProvisoria() {
  const letras = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(12);
  return Array.from(bytes, (b) => letras[b % letras.length]).join("");
}

export const SENHA_MINIMA = 8;
