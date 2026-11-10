"use server";

/**
 * Formulários do site (Fale conosco, Trabalhe conosco, Linha especial).
 *
 * ⚠️ Por enquanto as mensagens são só validadas: o envio/armazenamento real
 * (Neon + e-mail para a equipe) entra na etapa de publicação, junto com o admin.
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

const txt = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function enviarContato(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  if (txt(fd, "website")) return { ok: true, mensagem: "Recebemos sua mensagem." }; // honeypot anti-spam

  const dados = {
    nome: txt(fd, "nome"),
    empresa: txt(fd, "empresa"),
    email: txt(fd, "email"),
    telefone: txt(fd, "telefone"),
    segmento: txt(fd, "segmento"),
    assunto: txt(fd, "assunto"),
    mensagem: txt(fd, "mensagem"),
    origem: txt(fd, "origem"),
  };
  const erros: Record<string, string> = {};
  if (dados.nome.length < 2) erros.nome = "Informe seu nome.";
  if (!EMAIL.test(dados.email)) erros.email = "Informe um e-mail válido.";
  if (dados.mensagem.length < 10) erros.mensagem = "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).";
  if (!fd.get("consentimento")) erros.consentimento = "É preciso autorizar o contato.";
  if (Object.keys(erros).length) return { ok: false, mensagem: "Revise os campos destacados.", erros, valores: dados };

  // TODO(publicação): gravar no Neon e notificar a equipe por e-mail.
  console.info("[contato]", { assunto: dados.assunto, segmento: dados.segmento, origem: dados.origem });

  return {
    ok: true,
    mensagem: `Obrigado, ${dados.nome.split(" ")[0]}! Recebemos sua mensagem e nossa equipe retorna em até 1 dia útil.`,
  };
}

export async function enviarCandidatura(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  if (txt(fd, "website")) return { ok: true, mensagem: "Recebemos sua candidatura." };

  const nome = txt(fd, "nome");
  const email = txt(fd, "email");
  const vaga = txt(fd, "vaga");
  const cv = fd.get("curriculo");
  const erros: Record<string, string> = {};
  if (nome.length < 2) erros.nome = "Informe seu nome.";
  if (!EMAIL.test(email)) erros.email = "Informe um e-mail válido.";
  if (!vaga) erros.vaga = "Escolha uma vaga ou o banco de talentos.";
  if (!(cv instanceof File) || cv.size === 0) erros.curriculo = "Anexe seu currículo.";
  else if (!CV_TIPOS.includes(cv.type)) erros.curriculo = "Envie o currículo em PDF ou Word.";
  else if (cv.size > CV_MAX) erros.curriculo = "O arquivo deve ter no máximo 4 MB.";
  if (!fd.get("consentimento")) erros.consentimento = "É preciso autorizar o uso dos dados para o processo seletivo.";
  const valores = { nome, email, vaga, telefone: txt(fd, "telefone"), cidade: txt(fd, "cidade"), link: txt(fd, "link"), mensagem: txt(fd, "mensagem") };
  if (Object.keys(erros).length) return { ok: false, mensagem: "Revise os campos destacados.", erros, valores };

  // TODO(publicação): salvar o currículo (Vercel Blob) e a candidatura (Neon).
  console.info("[candidatura]", { vaga, tamanhoCv: (cv as File).size });

  return {
    ok: true,
    mensagem: `Obrigado, ${nome.split(" ")[0]}! Recebemos sua candidatura e entraremos em contato se o seu perfil combinar com a vaga.`,
  };
}
