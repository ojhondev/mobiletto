"use client";

import { upload } from "@vercel/blob/client";
import { registrarMidia, type MidiaLeve } from "@/app/painel/acoes";

/**
 * Envio de arquivos do painel: imagens são reduzidas no navegador (até 2400px,
 * WebP) e vão direto para o Vercel Blob; depois registramos na biblioteca.
 */

const MAX_LADO = 2400;
export const ACEITOS = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm";

function nomeBase(nome: string) {
  return (
    nome
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "arquivo"
  );
}

async function comprimir(file: File): Promise<{ arquivo: Blob; tipo: string; ext: string; largura?: number; altura?: number }> {
  const ext = (file.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
  // vídeo, SVG e GIF (animação) seguem como vieram
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return { arquivo: file, tipo: file.type, ext };
  }
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const escala = Math.min(1, MAX_LADO / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * escala);
  const h = Math.round(bmp.height * escala);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const webp = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/webp", 0.85));
  // se já era pequena e a conversão não ajudou, mantém o original
  if (!webp || (escala === 1 && webp.size >= file.size)) return { arquivo: file, tipo: file.type, ext, largura: w, altura: h };
  return { arquivo: webp, tipo: "image/webp", ext: ".webp", largura: w, altura: h };
}

export async function enviarParaBiblioteca(arquivos: File[], aoProgredir?: (feito: number, total: number) => void): Promise<MidiaLeve[]> {
  const enviados: MidiaLeve[] = [];
  for (const [i, file] of arquivos.entries()) {
    const c = await comprimir(file);
    const blob = await upload(`midia/${nomeBase(file.name)}${c.ext}`, c.arquivo, {
      access: "public",
      handleUploadUrl: "/api/painel/upload",
      contentType: c.tipo,
      multipart: c.arquivo.size > 8 * 1024 * 1024,
    });
    enviados.push(
      await registrarMidia({ url: blob.url, nome: file.name, tipo: c.tipo, tamanho: c.arquivo.size, largura: c.largura, altura: c.altura }),
    );
    aoProgredir?.(i + 1, arquivos.length);
  }
  return enviados;
}
