import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getUsuario } from "@/lib/auth";

/**
 * Autoriza uploads feitos direto do navegador para o Vercel Blob (fotos e vídeos
 * da biblioteca de mídia). Só gera o token para quem está logado no painel.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const resposta = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const u = await getUsuario();
        if (!u) throw new Error("Sessão expirada. Entre novamente no painel.");
        if (!pathname.startsWith("midia/")) throw new Error("Destino inválido.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml", "video/mp4", "video/webm"],
          maximumSizeInBytes: 60 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(resposta);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
