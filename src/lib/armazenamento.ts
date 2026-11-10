import "server-only";
import crypto from "node:crypto";
import { del, put } from "@vercel/blob";

/** Arquivos enviados pelo servidor ao Vercel Blob (currículos) e remoção de arquivos. */

function nomeSeguro(nome: string) {
  const base = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return base || "arquivo";
}

export async function enviarArquivo(arquivo: File, pasta: string) {
  const ext = (arquivo.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
  // pasta + nome aleatório longo: o link só é conhecido por quem acessa o painel
  const caminho = `${pasta}/${nomeSeguro(arquivo.name)}-${crypto.randomBytes(12).toString("hex")}${ext}`;
  const blob = await put(caminho, arquivo, { access: "public", contentType: arquivo.type || undefined });
  return { url: blob.url, nome: arquivo.name, tipo: arquivo.type, tamanho: arquivo.size };
}

export async function apagarArquivo(url: string) {
  if (!url.includes(".blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch {}
}
