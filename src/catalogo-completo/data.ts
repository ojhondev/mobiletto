export type Finish = { id: string; name: string; color: string; note: string };

export type Product = {
  id: "lina" | "brisa" | "orla";
  name: string;
  kind: string;
  code: string;
  line: string;
  tagline: string;
  description: string;
  finishLabel: string;
  finishes: Finish[];
  dims: { l: number; p: number; a: number; extra?: string };
  specs: [string, string][];
  b2b: [string, string][];
  /** índice da página de produto (a ficha técnica é a seguinte) */
  page: number;
};

export const products: Product[] = [
  {
    id: "lina",
    name: "Poltrona Lina",
    kind: "Poltrona",
    code: "MBT-AU-1021",
    line: "Linha Aurora",
    tagline: "Curvas generosas, estrutura que dura décadas.",
    description:
      "Encosto envolvente e braços arredondados sobre base em madeira maciça. Pensada para lobbies, salas de espera e projetos residenciais de alto padrão.",
    finishLabel: "Revestimento",
    finishes: [
      { id: "linho", name: "Linho Areia", color: "#d6c6a8", note: "Tecido 100% linho, 38.000 ciclos Martindale" },
      { id: "boucle", name: "Bouclé Off", color: "#ebe4d6", note: "Bouclé de alta resistência, toque macio" },
      { id: "veludo", name: "Veludo Musgo", color: "#5f6b48", note: "Veludo técnico, antimanchas" },
      { id: "couro", name: "Couro Conhaque", color: "#8b4a28", note: "Couro natural curtido ao vegetal" },
    ],
    dims: { l: 78, p: 82, a: 76, extra: "Altura do assento 42 cm" },
    specs: [
      ["Estrutura", "Madeira maciça de tauari, tratada"],
      ["Estofamento", "Espuma D33 + manta acrílica"],
      ["Pés", "Freijó torneado, verniz PU fosco"],
      ["Peso", "21 kg"],
      ["Garantia", "5 anos estrutura · 1 ano revestimento"],
    ],
    b2b: [
      ["Pedido mínimo", "4 unidades"],
      ["Prazo de produção", "25 dias úteis"],
      ["Embalagem", "1 un./volume · 0,62 m³"],
    ],
    page: 5,
  },
  {
    id: "brisa",
    name: "Aparador Brisa",
    kind: "Aparador",
    code: "MBT-AU-2040",
    line: "Linha Aurora",
    tagline: "Ripado artesanal com portas de toque.",
    description:
      "Quatro portas com abertura por toque, duas delas em ripado de madeira maciça. Prateleiras internas reguláveis e pés recuados que deixam o volume flutuar.",
    finishLabel: "Madeira",
    finishes: [
      { id: "freijo", name: "Freijó", color: "#b98a58", note: "Lâmina natural de freijó, veio aberto" },
      { id: "carvalho", name: "Carvalho Claro", color: "#cfb085", note: "Lâmina de carvalho europeu" },
      { id: "nogueira", name: "Nogueira", color: "#6b4a32", note: "Lâmina de nogueira americana" },
      { id: "laca", name: "Laca Off-White", color: "#e6e0d4", note: "Laca PU acetinada, 7 demãos" },
    ],
    dims: { l: 180, p: 45, a: 78 },
    specs: [
      ["Corpo", "MDF 25 mm com lâmina natural"],
      ["Portas", "Ripado maciço, abertura por toque"],
      ["Interno", "2 prateleiras reguláveis por vão"],
      ["Peso", "64 kg"],
      ["Garantia", "5 anos"],
    ],
    b2b: [
      ["Pedido mínimo", "2 unidades"],
      ["Prazo de produção", "30 dias úteis"],
      ["Embalagem", "2 volumes · 0,78 m³"],
    ],
    page: 7,
  },
  {
    id: "orla",
    name: "Mesa Orla",
    kind: "Mesa de jantar",
    code: "MBT-AU-3012",
    line: "Linha Aurora",
    tagline: "Oito lugares, nenhuma perna no caminho.",
    description:
      "Tampo de cantos suavizados sobre pés inclinados em madeira maciça, recuados para liberar as cabeceiras. Disponível também em 180 e 260 cm.",
    finishLabel: "Tampo",
    finishes: [
      { id: "carvalho", name: "Carvalho Claro", color: "#cfb085", note: "Lâmina de carvalho com verniz fosco" },
      { id: "nogueira", name: "Nogueira", color: "#6b4a32", note: "Lâmina de nogueira americana" },
      { id: "marmore", name: "Mármore Carrara", color: "#e9e7e2", note: "Mármore natural, impermeabilizado" },
      { id: "grafite", name: "Laca Grafite", color: "#3d3b38", note: "Laca PU acetinada" },
    ],
    dims: { l: 220, p: 100, a: 76 },
    specs: [
      ["Tampo", "MDF 30 mm laminado ou mármore 20 mm"],
      ["Pés", "Tauari maciço, travessa em aço"],
      ["Capacidade", "8 lugares"],
      ["Peso", "72 kg"],
      ["Garantia", "5 anos"],
    ],
    b2b: [
      ["Pedido mínimo", "1 unidade"],
      ["Prazo de produção", "30 dias úteis"],
      ["Embalagem", "3 volumes · 0,91 m³"],
    ],
    page: 9,
  },
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<
  Product["id"],
  Product
>;

/** Títulos usados no índice, miniaturas e cabeçalho do visualizador. */
export const pageTitles = [
  "Capa",
  "Manifesto",
  "Índice",
  "Linha Aurora",
  "Ambiente",
  "Poltrona Lina",
  "Lina · Ficha técnica",
  "Aparador Brisa",
  "Brisa · Ficha técnica",
  "Mesa Orla",
  "Orla · Ficha técnica",
  "Mostruário",
  "Como comprar",
  "Contracapa",
];

export const PAGE_COUNT = pageTitles.length;
