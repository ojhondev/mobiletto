/**
 * Tipos de campo do painel. Formulários de seções e de itens (produtos, cases…)
 * são montados a partir destas definições — sem escrever um formulário por tela.
 */

export type Opcao = { valor: string; rotulo: string };

type Base = { nome: string; rotulo: string; ajuda?: string };

export type Campo =
  | (Base & { tipo: "texto"; placeholder?: string })
  | (Base & { tipo: "textarea"; linhas?: number })
  | (Base & { tipo: "imagem" })
  | (Base & { tipo: "imagens" })
  | (Base & { tipo: "video" })
  | (Base & { tipo: "lista"; item?: string })
  | (Base & { tipo: "booleano" })
  | (Base & { tipo: "select"; opcoes: Opcao[] | "categorias" | "segmentos" })
  | (Base & { tipo: "itens"; item: string; campos: Campo[] });

/** Valor vazio de cada tipo (novo item, campo ausente no banco). */
export function vazio(c: Campo): unknown {
  switch (c.tipo) {
    case "imagens":
    case "lista":
    case "itens":
      return [];
    case "booleano":
      return false;
    default:
      return "";
  }
}

/** Normaliza um valor vindo do formulário para o tipo do campo (defesa no servidor). */
export function normalizar(campos: Campo[], dados: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const c of campos) {
    const v = dados[c.nome];
    switch (c.tipo) {
      case "imagens":
      case "lista":
        out[c.nome] = Array.isArray(v) ? v.map((x) => String(x ?? "").trim()).filter(Boolean) : [];
        break;
      case "itens":
        out[c.nome] = Array.isArray(v)
          ? v.filter((x) => x && typeof x === "object").map((x) => normalizar(c.campos, x as Record<string, unknown>))
          : [];
        break;
      case "booleano":
        out[c.nome] = v === true || v === "true" || v === "on";
        break;
      default:
        out[c.nome] = typeof v === "string" ? v.trim() : v == null ? "" : String(v);
    }
  }
  return out;
}
