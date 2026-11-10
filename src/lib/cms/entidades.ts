import type { Campo } from "./campos";

/**
 * Itens gerenciáveis pelo painel. Os nomes dos campos são os mesmos das colunas
 * do banco (src/lib/db/schema.ts), então o formulário salva direto na tabela.
 */

export type TipoEntidade = "produtos" | "categorias" | "segmentos" | "cases" | "vagas";

type DefEntidade = {
  singular: string;
  plural: string;
  /** campo usado como nome na lista e para gerar o slug */
  titulo: string;
  /** campo com a imagem de capa na lista */
  capa?: string;
  descricao: string;
  campos: Campo[];
  /** caminho público do item (para o botão "ver no site") */
  link: (slug: string) => string;
};

const PUBLICADO: Campo = { tipo: "booleano", nome: "publicado", rotulo: "Publicado no site" };
const SLUG: Campo = {
  tipo: "texto",
  nome: "slug",
  rotulo: "Endereço (slug)",
  ajuda: "Parte final do link. Deixe vazio para gerar a partir do nome.",
};
const PARES = (nome: string, rotulo: string, item: string): Campo => ({
  tipo: "itens",
  nome,
  rotulo,
  item,
  campos: [
    { tipo: "texto", nome: "rotulo", rotulo: "Nome" },
    { tipo: "texto", nome: "valor", rotulo: "Valor" },
  ],
});

export const ENTIDADES: Record<TipoEntidade, DefEntidade> = {
  produtos: {
    singular: "produto",
    plural: "Produtos",
    titulo: "nome",
    descricao: "Itens do catálogo. Cada produto tem página própria com fotos, medidas e aplicações.",
    link: (s) => `/catalogo/${s}`,
    campos: [
      { tipo: "texto", nome: "nome", rotulo: "Nome do produto" },
      { tipo: "select", nome: "categoriaId", rotulo: "Categoria", opcoes: "categorias" },
      { tipo: "texto", nome: "codigo", rotulo: "Código / referência", ajuda: "Opcional. Ex.: MBT-EST-04" },
      { tipo: "textarea", nome: "resumo", rotulo: "Resumo (aparece abaixo do nome)", linhas: 2 },
      { tipo: "textarea", nome: "descricao", rotulo: "Descrição completa", linhas: 6, ajuda: "Separe os parágrafos com uma linha em branco." },
      { tipo: "imagens", nome: "imagens", rotulo: "Fotos (a primeira é a capa)" },
      PARES("medidas", "Medidas", "medida"),
      PARES("especificacoes", "Especificações técnicas", "especificação"),
      { tipo: "lista", nome: "aplicacoes", rotulo: "Aplicações (onde usar)", item: "aplicação" },
      { tipo: "lista", nome: "acabamentos", rotulo: "Acabamentos disponíveis", item: "acabamento" },
      { tipo: "lista", nome: "diferenciais", rotulo: "Diferenciais", item: "diferencial" },
      SLUG,
      { tipo: "booleano", nome: "destaque", rotulo: "Destaque (aparece primeiro)" },
      PUBLICADO,
    ],
  },
  categorias: {
    singular: "categoria",
    plural: "Categorias",
    titulo: "nome",
    capa: "capa",
    descricao: "Agrupam os produtos na página Catálogo, na ordem desta lista.",
    link: (s) => `/catalogo#${s}`,
    campos: [
      { tipo: "texto", nome: "nome", rotulo: "Nome da categoria" },
      { tipo: "textarea", nome: "descricao", rotulo: "Descrição", linhas: 3 },
      { tipo: "lista", nome: "tags", rotulo: "Etiquetas (tipos de item)", item: "etiqueta" },
      { tipo: "imagem", nome: "capa", rotulo: "Imagem de capa" },
      SLUG,
      PUBLICADO,
    ],
  },
  segmentos: {
    singular: "segmento",
    plural: "Segmentos",
    titulo: "nome",
    capa: "imagem",
    descricao: "Escritórios, recepções, hotelaria… Aparecem no menu Soluções, no filtro de cases e no Sobre nós.",
    link: (s) => `/cases?segmento=${s}`,
    campos: [
      { tipo: "texto", nome: "nome", rotulo: "Nome" },
      { tipo: "textarea", nome: "resumo", rotulo: "Resumo", linhas: 2 },
      { tipo: "imagem", nome: "imagem", rotulo: "Imagem" },
      SLUG,
      PUBLICADO,
    ],
  },
  cases: {
    singular: "case",
    plural: "Cases",
    titulo: "titulo",
    capa: "capa",
    descricao: "Projetos entregues. Cada case tem página própria com desafio, solução e galeria.",
    link: (s) => `/cases/${s}`,
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "select", nome: "segmento", rotulo: "Segmento", opcoes: "segmentos" },
      { tipo: "texto", nome: "cidade", rotulo: "Cidade — UF" },
      { tipo: "texto", nome: "ano", rotulo: "Ano" },
      { tipo: "lista", nome: "escopo", rotulo: "Escopo", item: "item" },
      { tipo: "textarea", nome: "resumo", rotulo: "Resumo", linhas: 2 },
      { tipo: "textarea", nome: "desafio", rotulo: "O desafio", linhas: 4 },
      { tipo: "textarea", nome: "solucao", rotulo: "A solução", linhas: 4 },
      { tipo: "imagem", nome: "capa", rotulo: "Foto de capa" },
      { tipo: "imagens", nome: "galeria", rotulo: "Galeria" },
      SLUG,
      { tipo: "booleano", nome: "destaque", rotulo: "Destaque" },
      PUBLICADO,
    ],
  },
  vagas: {
    singular: "vaga",
    plural: "Vagas",
    titulo: "titulo",
    descricao: "Vagas abertas na página Trabalhe conosco.",
    link: () => `/trabalhe-conosco#vagas`,
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Cargo" },
      { tipo: "texto", nome: "area", rotulo: "Área" },
      { tipo: "texto", nome: "local", rotulo: "Local" },
      { tipo: "texto", nome: "regime", rotulo: "Regime", placeholder: "CLT, PJ, estágio…" },
      { tipo: "textarea", nome: "descricao", rotulo: "Descrição (opcional)", linhas: 4 },
      SLUG,
      PUBLICADO,
    ],
  },
};

export const TIPOS = Object.keys(ENTIDADES) as TipoEntidade[];
export const ehTipo = (t: string): t is TipoEntidade => t in ENTIDADES;
