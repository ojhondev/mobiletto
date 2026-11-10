"use server";

import { db, schema } from "@/lib/db";
import { enviarArquivo } from "@/lib/armazenamento";

/**
 * Formulários públicos (Fale conosco, Trabalhe conosco, Linha especial).
 * Tudo é gravado em `mensagens` e aparece na caixa de entrada do painel.
 */

export type EstadoForm = {
  ok: boolean;
  mensagem: string;
  erros?: Partial<Record<string, string>>;
  /** valores digitados, para repreencher o formulário quando a validação falha */
  valores?: Record<string, string>;
} | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CV_TIPOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const CV_MAX = 4 * 1024 * 1024;

const txt = (fd: FormData, k: string, max = 4000) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function enviarContato(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  if (txt(fd, "website")) return { ok: true, mensagem: "Recebemos sua mensagem." }; // honeypot anti-spam

  const dados = {
    nome: txt(fd, "nome", 200),
    empresa: txt(fd, "empresa", 200),
    email: txt(fd, "email", 200),
    telefone: txt(fd, "telefone", 60),
    segmento: txt(fd, "segmento", 80),
    assunto: txt(fd, "assunto", 80),
    mensagem: txt(fd, "mensagem"),
    origem: txt(fd, "origem", 80),
  };
  const erros: Record<string, string> = {};
  if (dados.nome.length < 2) erros.nome = "Informe seu nome.";
  if (!EMAIL.test(dados.email)) erros.email = "Informe um e-mail válido.";
  if (dados.mensagem.length < 10) erros.mensagem = "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).";
  if (!fd.get("consentimento")) erros.consentimento = "É preciso autorizar o contato.";
  if (Object.keys(erros).length) return { ok: false, mensagem: "Revise os campos destacados.", erros, valores: dados };

  try {
    await db.insert(schema.mensagens).values({
      tipo: dados.origem === "linha-especial" ? "linha-especial" : "contato",
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      empresa: dados.empresa,
      assunto: dados.assunto,
      segmento: dados.segmento,
      mensagem: dados.mensagem,
      extra: { origem: dados.origem },
    });
  } catch (e) {
    console.error("[contato]", e);
    return { ok: false, mensagem: "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.", valores: dados };
  }

  return { ok: true, mensagem: `Obrigado, ${dados.nome.split(" ")[0]}!` };
}

export async function enviarCandidatura(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  if (txt(fd, "website")) return { ok: true, mensagem: "Recebemos sua candidatura." };

  const valores = {
    nome: txt(fd, "nome", 200),
    email: txt(fd, "email", 200),
    vaga: txt(fd, "vaga", 120),
    telefone: txt(fd, "telefone", 60),
    cidade: txt(fd, "cidade", 120),
    link: txt(fd, "link", 400),
    mensagem: txt(fd, "mensagem"),
  };
  const cv = fd.get("curriculo");
  const erros: Record<string, string> = {};
  if (valores.nome.length < 2) erros.nome = "Informe seu nome.";
  if (!EMAIL.test(valores.email)) erros.email = "Informe um e-mail válido.";
  if (!valores.vaga) erros.vaga = "Escolha uma vaga ou o banco de talentos.";
  if (!(cv instanceof File) || cv.size === 0) erros.curriculo = "Anexe seu currículo.";
  else if (!CV_TIPOS.includes(cv.type)) erros.curriculo = "Envie o currículo em PDF ou Word.";
  else if (cv.size > CV_MAX) erros.curriculo = "O arquivo deve ter no máximo 4 MB.";
  if (!fd.get("consentimento")) erros.consentimento = "É preciso autorizar o uso dos dados para o processo seletivo.";
  if (Object.keys(erros).length) return { ok: false, mensagem: "Revise os campos destacados.", erros, valores };

  try {
    const arquivo = await enviarArquivo(cv as File, "curriculos");
    await db.insert(schema.mensagens).values({
      tipo: "candidatura",
      nome: valores.nome,
      email: valores.email,
      telefone: valores.telefone,
      assunto: valores.vaga,
      mensagem: valores.mensagem,
      extra: { cidade: valores.cidade, link: valores.link },
      arquivo: arquivo.url,
    });
  } catch (e) {
    console.error("[candidatura]", e);
    return { ok: false, mensagem: "Não foi possível enviar agora. Tente novamente em instantes.", valores };
  }

  return {
    ok: true,
    mensagem: `Obrigado, ${valores.nome.split(" ")[0]}! Recebemos sua candidatura e entraremos em contato se o seu perfil combinar com a vaga.`,
  };
}
