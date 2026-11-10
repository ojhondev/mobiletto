/**
 * Conteúdo-base usado SÓ pelo seed (scripts/seed.ts) para popular o banco.
 * O site lê tudo do banco (src/lib/cms) e a equipe edita pelo painel (/painel).
 */

export const contato = {
  whatsapp: "5500000000000", // confirmar
  whatsappLabel: "(00) 00000-0000", // confirmar
  telefone: "(00) 0000-0000", // confirmar
  email: "contato@mobiletto.com.br", // confirmar
  emailCarreiras: "carreiras@mobiletto.com.br", // confirmar
  endereco: "Endereço da fábrica e showroom", // confirmar
  cidade: "Cidade — UF", // confirmar
  horario: "Segunda a sexta, 8h às 18h",
  instagram: "https://instagram.com/", // confirmar
  linkedin: "https://linkedin.com/", // confirmar
};

export const whatsappUrl = (texto = "Olá! Gostaria de falar sobre um projeto de mobiliário corporativo.") =>
  `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(texto)}`;

/* ------------------------------------------------------------- segmentos */

export type SegmentoId = "escritorios" | "recepcoes" | "hotelaria" | "restaurantes" | "areas-comuns";

export const segmentos: { id: SegmentoId; nome: string; resumo: string; imagem: string }[] = [
  {
    id: "escritorios",
    nome: "Escritórios",
    resumo: "Estações de trabalho, salas de reunião, diretorias e escritórios particulares.",
    imagem: "/images/escritorio-contemporaneo.jpg",
  },
  {
    id: "recepcoes",
    nome: "Recepções",
    resumo: "Balcões, lobbies e salas de espera que recebem bem desde a porta.",
    imagem: "/images/recepcao-marmore.jpg",
  },
  {
    id: "hotelaria",
    nome: "Hotelaria",
    resumo: "Lobbies, lounges e quartos com acabamento de alto tráfego.",
    imagem: "/images/hotel-madeira.jpg",
  },
  {
    id: "restaurantes",
    nome: "Restaurantes",
    resumo: "Salões, bares e refeitórios corporativos pensados para o uso intenso.",
    imagem: "/images/restaurante.jpg",
  },
  {
    id: "areas-comuns",
    nome: "Áreas comuns",
    resumo: "Lounges, coworkings, auditórios e espaços de convivência.",
    imagem: "/images/lounge-plantas.jpg",
  },
];

export const segmentoNome = (id: SegmentoId) => segmentos.find((s) => s.id === id)?.nome ?? id;

/** Faixa abaixo do hero (no lugar da faixa de logos de clientes da referência). */
export const faixaSegmentos = [
  "Escritórios",
  "Recepções",
  "Hotéis",
  "Restaurantes",
  "Coworkings",
  "Clínicas",
  "Auditórios",
  "Varejo",
];

/* ------------------------------------------------------------------ home */

export const diferenciais = [
  {
    titulo: "Fabricação própria",
    texto: "Projetamos e fabricamos na nossa estrutura. Controle de prazo, de acabamento e de qualidade do início ao fim.",
    imagem: "/images/marcenaria-lapis.jpg",
  },
  {
    titulo: "Projeto sob medida",
    texto: "Cada ambiente começa pela planta. Desenhamos o mobiliário para o seu espaço, não o contrário.",
    imagem: "/produtos/mesa-l-painel-ripado.jpg",
  },
  {
    titulo: "Do simples ao sofisticado",
    texto: "Da estação de trabalho de linha ao lobby de hotel com marcenaria exclusiva, no padrão que o projeto pede.",
    imagem: "/images/recepcao-marmore.jpg",
  },
  {
    titulo: "Entrega e instalação",
    texto: "Equipe própria de montagem, cronograma alinhado com a obra e pós-venda depois da entrega.",
    imagem: "/images/cadeiras-conferencia.jpg",
  },
];

export const servico = {
  mobiliario: { titulo: "Mobiliário corporativo", imagem: "/produtos/sala-diretoria-madeira.jpg" },
  etapas: [
    { titulo: "Projeto 3D do seu espaço", imagem: "/produtos/layout-escritorio-completo.jpg" },
    { titulo: "Fabricação própria", imagem: "/images/marcenaria-bancada.jpg" },
    { titulo: "Instalação completa", imagem: "/images/escritorio-open.jpg" },
    { titulo: "Pós-venda e garantia", imagem: "/images/lobby-recepcao.jpg" },
  ],
};

export const numeros = [
  { valor: "100%", rotulo: "Fabricação própria", texto: "Do projeto à montagem, sem terceirizar o que define a qualidade." }, // confirmar
  { valor: "5 anos", rotulo: "de garantia estrutural", texto: "Estruturas e marcenaria pensadas para o uso corporativo intenso." }, // confirmar
  { valor: "+1.000", rotulo: "ambientes mobiliados", texto: "Escritórios, recepções, hotéis e restaurantes em todo o país." }, // confirmar
];

export const destaquePrazo = {
  rotulo: "Projeto 3D em até",
  valor: "5",
  unidade: "dias úteis",
  nota: "após o envio da planta", // confirmar
};

export const faqs = [
  {
    p: "A Mobiletto atende apenas empresas?",
    r: "Nosso foco é o mobiliário corporativo: empresas, escritórios particulares, recepções, hotéis, restaurantes e áreas comuns. Atendemos projetos de todos os portes, do simples ao sofisticado.",
  },
  {
    p: "Vocês fazem o projeto do ambiente?",
    r: "Sim. A partir da planta e do briefing, nossa equipe desenvolve o layout e o projeto 3D do espaço, com a especificação de cada peça e acabamento.",
  },
  {
    p: "Posso trabalhar com o meu arquiteto?",
    r: "Claro. Trabalhamos lado a lado com arquitetos e designers de interiores, fabricando o mobiliário especificado no projeto deles ou desenvolvendo soluções em conjunto.",
  },
  {
    p: "Qual é o prazo de fabricação?",
    r: "O prazo depende do volume e do nível de personalização. Ele é definido na proposta e alinhado ao cronograma da sua obra.",
  },
  {
    p: "Vocês atendem fora da cidade?",
    r: "Sim. Entregamos e instalamos em todo o território nacional, com equipe própria de montagem.", // confirmar
  },
  {
    p: "Existe garantia e pós-venda?",
    r: "Sim. Todos os produtos têm garantia e um canal de pós-venda para ajustes, reposições e ampliações do ambiente.",
  },
];

/* ----------------------------------------------------------------- cases */

export type Case = {
  slug: string;
  titulo: string;
  segmento: SegmentoId;
  cidade: string;
  ano: string;
  escopo: string[];
  resumo: string;
  desafio: string;
  solucao: string;
  capa: string;
  galeria: string[];
};

// confirmar: cases de exemplo até a Mobiletto enviar os projetos reais
export const cases: Case[] = [
  {
    slug: "sede-escritorio-de-advocacia",
    titulo: "Sede de escritório de advocacia",
    segmento: "escritorios",
    cidade: "São Paulo — SP",
    ano: "2025",
    escopo: ["Salas de reunião", "Diretoria", "Marcenaria em madeira"],
    resumo: "Salas de reunião e diretoria com marcenaria em madeira natural e mesas sob medida.",
    desafio:
      "Um escritório tradicional que precisava transmitir solidez sem parecer antigo, com salas de reunião para até 14 pessoas e diretorias reservadas.",
    solucao:
      "Mesas de reunião sob medida em madeira natural, painéis de marcenaria com tratamento acústico e cadeiras executivas com braço, em uma paleta sóbria e duradoura.",
    capa: "/images/reuniao-madeira.jpg",
    galeria: ["/images/conferencia-oval.jpg", "/images/mesa-escritorio.jpg", "/images/reuniao-madeira.jpg"],
  },
  {
    slug: "lobby-edificio-corporativo",
    titulo: "Lobby de edifício corporativo",
    segmento: "recepcoes",
    cidade: "Campinas — SP",
    ano: "2025",
    escopo: ["Balcão de recepção", "Lobby", "Painéis ripados"],
    resumo: "Balcão de recepção em pedra e madeira, painéis ripados e área de espera.",
    desafio: "Criar uma recepção imponente para um edifício multiempresas, com circulação intensa o dia inteiro.",
    solucao:
      "Balcão monolítico com tampo em pedra e frente em lâmina de madeira, painéis ripados do piso ao teto e assentos resistentes ao alto tráfego.",
    capa: "/images/lobby-recepcao.jpg",
    galeria: ["/images/recepcao-marmore.jpg", "/images/lobby-recepcao.jpg", "/images/corredor-vidro.jpg"],
  },
  {
    slug: "hotel-lobby-e-lounge",
    titulo: "Hotel — lobby e lounge",
    segmento: "hotelaria",
    cidade: "Belo Horizonte — MG",
    ano: "2024",
    escopo: ["Lobby", "Lounge", "Poltronas e sofás"],
    resumo: "Lounge com sofás, poltronas e mesas laterais em um lobby de pé-direito duplo.",
    desafio: "Um lobby amplo que precisava de pontos de permanência acolhedores sem perder a leitura do espaço.",
    solucao:
      "Ilhas de estar com sofás modulares, poltronas estofadas e mesas em madeira escura, organizadas em torno de painéis de marcenaria.",
    capa: "/images/hotel-madeira.jpg",
    galeria: ["/images/hotel-lounge.jpg", "/images/hotel-lobby.jpg", "/images/poltrona-hotel.jpg"],
  },
  {
    slug: "restaurante-contemporaneo",
    titulo: "Restaurante contemporâneo",
    segmento: "restaurantes",
    cidade: "Curitiba — PR",
    ano: "2024",
    escopo: ["Salão", "Bar", "Estofados sob medida"],
    resumo: "Salão com estofados sob medida, mesas em madeira e bar em marcenaria escura.",
    desafio: "Aproveitar ao máximo o salão sem abrir mão do conforto em refeições longas.",
    solucao:
      "Bancos estofados contínuos nas paredes, mesas de tampo maciço e cadeiras robustas, com acabamentos fáceis de limpar.",
    capa: "/images/restaurante.jpg",
    galeria: ["/images/restaurante-2.jpg", "/images/restaurante.jpg"],
  },
  {
    slug: "open-space-empresa-de-tecnologia",
    titulo: "Open space — empresa de tecnologia",
    segmento: "escritorios",
    cidade: "Florianópolis — SC",
    ano: "2025",
    escopo: ["Estações de trabalho", "Salas envidraçadas", "Lounge"],
    resumo: "Estações para 120 pessoas, salas de reunião envidraçadas e áreas de descompressão.",
    desafio: "Uma equipe em crescimento rápido que precisava de um layout flexível e fácil de reconfigurar.",
    solucao:
      "Estações modulares com eletrificação embutida, salas de reunião de diferentes tamanhos e lounges com assentos informais.",
    capa: "/images/escritorio-contemporaneo.jpg",
    galeria: ["/images/escritorio-estacoes.jpg", "/images/escritorio-open.jpg", "/images/lounge-plantas.jpg"],
  },
  {
    slug: "sala-do-conselho",
    titulo: "Sala do conselho",
    segmento: "escritorios",
    cidade: "São Paulo — SP",
    ano: "2024",
    escopo: ["Mesa de conselho", "Cadeiras executivas", "Integração de tecnologia"],
    resumo: "Mesa de conselho para 18 lugares com tecnologia integrada e cadeiras executivas.",
    desafio: "Uma sala de decisões com vista panorâmica, que pedia presença sem competir com a paisagem.",
    solucao:
      "Mesa de grandes dimensões com caixas de tomada e cabeamento ocultos, cadeiras executivas e aparadores técnicos em marcenaria.",
    capa: "/images/conferencia-longa.jpg",
    galeria: ["/images/reuniao-cidade.jpg", "/images/conferencia-por-do-sol.jpg", "/images/conferencia-longa.jpg"],
  },
  {
    slug: "recepcao-executiva",
    titulo: "Recepção executiva",
    segmento: "recepcoes",
    cidade: "Goiânia — GO",
    ano: "2025",
    escopo: ["Balcão em pedra", "Iluminação integrada", "Sala de espera"],
    resumo: "Balcão em pedra escura com iluminação integrada e sala de espera em couro.",
    desafio: "Uma recepção que precisava traduzir o posicionamento premium da empresa logo na entrada.",
    solucao: "Balcão revestido em pedra escura com frisos iluminados, poltronas em couro e mesas de apoio em metal.",
    capa: "/images/recepcao-marmore-preto.jpg",
    galeria: ["/images/recepcao-marmore-preto.jpg", "/images/cadeira-couro.jpg"],
  },
  {
    slug: "coworking-areas-comuns",
    titulo: "Coworking — áreas comuns",
    segmento: "areas-comuns",
    cidade: "Rio de Janeiro — RJ",
    ano: "2024",
    escopo: ["Lounges", "Salas privativas", "Café"],
    resumo: "Lounges, salas privativas envidraçadas e área de café para um coworking de alto padrão.",
    desafio: "Espaços que servem a muitas empresas ao mesmo tempo, com uso intenso e perfis diferentes.",
    solucao: "Mobiliário modular e resistente, com zonas de foco, colaboração e convivência claramente definidas.",
    capa: "/images/lounge-couro.jpg",
    galeria: ["/images/lounge-couro.jpg", "/images/corredor-vidro.jpg", "/images/escritorio-vidro.jpg"],
  },
];

/** Fotos da faixa-galeria da home (formato retrato). */
export const galeriaHome = [
  "/produtos/sala-de-reuniao-10-lugares.jpg",
  "/images/hotel-madeira.jpg",
  "/produtos/balcao-recepcao.jpg",
  "/images/conferencia-oval.jpg",
  "/produtos/estacoes-em-ilha.jpg",
  "/images/recepcao-marmore-preto.jpg",
  "/produtos/mesa-diretor-armario.jpg",
  "/images/lobby-recepcao.jpg",
  "/images/restaurante-2.jpg",
];

/* -------------------------------------------------------------- catálogo */

export type Produto = { nome: string; imagem: string };

/** Fotos reais de produtos enviadas pela Mobiletto (pasta ARQUIVOS do Drive). */
export const categorias: {
  id: string;
  nome: string;
  texto: string;
  itens: string[];
  imagem: string;
  produtos: Produto[];
}[] = [
  {
    id: "estacoes",
    nome: "Estações de trabalho",
    texto: "Plataformas compartilhadas, estações em ilha e mesas operacionais com divisórias e eletrificação.",
    itens: ["Plataformas de 2 a 8 lugares", "Divisórias e painéis", "Calhas de eletrificação", "Gaveteiros integrados"],
    imagem: "/produtos/estacoes-em-ilha.jpg",
    produtos: [
      { nome: "Estação plataforma 4 lugares", imagem: "/produtos/estacao-plataforma-4-lugares.jpg" },
      { nome: "Estação dupla com divisória", imagem: "/produtos/estacao-dupla-divisoria.jpg" },
      { nome: "Estações em ilha", imagem: "/produtos/estacoes-em-ilha.jpg" },
      { nome: "Plataforma compartilhada", imagem: "/produtos/plataforma-compartilhada.jpg" },
    ],
  },
  {
    id: "mesas",
    nome: "Mesas de trabalho",
    texto: "Mesas retas e em L, com gaveteiros, nichos e balcões de apoio, em madeira e metal.",
    itens: ["Mesas em L", "Mesas retas", "Pés quadro em aço", "Tampos em madeira ou branco"],
    imagem: "/produtos/mesa-l-gaveteiro.jpg",
    produtos: [
      { nome: "Mesa em L com gaveteiro", imagem: "/produtos/mesa-l-gaveteiro.jpg" },
      { nome: "Mesa em L com balcão", imagem: "/produtos/mesa-l-balcao.jpg" },
      { nome: "Mesa em L com nicho", imagem: "/produtos/mesa-l-nicho-branca.jpg" },
      { nome: "Mesa reta pé quadro", imagem: "/produtos/mesa-reta-pe-quadro.jpg" },
      { nome: "Mesa de trabalho com floreira", imagem: "/produtos/mesa-trabalho-floreira.jpg" },
      { nome: "Mesa em L com painel ripado", imagem: "/produtos/mesa-l-painel-ripado.jpg" },
    ],
  },
  {
    id: "diretoria",
    nome: "Diretoria e executivo",
    texto: "Mesas executivas, aparadores e armários para salas de direção e escritórios particulares.",
    itens: ["Mesas executivas", "Aparadores", "Armários e estantes", "Painéis de marcenaria"],
    imagem: "/produtos/sala-diretoria-madeira.jpg",
    produtos: [
      { nome: "Sala de diretoria em madeira", imagem: "/produtos/sala-diretoria-madeira.jpg" },
      { nome: "Mesa diretor com armário", imagem: "/produtos/mesa-diretor-armario.jpg" },
      { nome: "Mesa em L com aparador", imagem: "/produtos/mesa-l-aparador.jpg" },
      { nome: "Mesa em L com armário baixo", imagem: "/produtos/mesa-l-armario-baixo.jpg" },
    ],
  },
  {
    id: "reuniao",
    nome: "Salas de reunião",
    texto: "Mesas de reunião e de conselho sob medida, com caixas de tomada e cabeamento integrados.",
    itens: ["Mesas de 4 a 20 lugares", "Caixas de tomada", "Aparadores técnicos", "Painéis de marcenaria"],
    imagem: "/produtos/sala-de-reuniao-10-lugares.jpg",
    produtos: [{ nome: "Sala de reunião 10 lugares", imagem: "/produtos/sala-de-reuniao-10-lugares.jpg" }],
  },
  {
    id: "recepcao",
    nome: "Recepção e balcões",
    texto: "Balcões de atendimento, recepções e expositores com iluminação integrada.",
    itens: ["Balcões de recepção", "Balcões expositores", "Iluminação em LED", "Acabamentos nobres"],
    imagem: "/produtos/balcao-recepcao.jpg",
    produtos: [
      { nome: "Balcão de recepção", imagem: "/produtos/balcao-recepcao.jpg" },
      { nome: "Balcão expositor iluminado", imagem: "/produtos/balcao-expositor-iluminado.jpg" },
    ],
  },
  {
    id: "armazenamento",
    nome: "Armazenamento",
    texto: "Armários, estantes e gaveteiros que organizam sem pesar no ambiente.",
    itens: ["Armários altos e baixos", "Estantes", "Gaveteiros volantes", "Gaveteiros com nicho"],
    imagem: "/produtos/armarios-e-estantes.jpg",
    produtos: [
      { nome: "Armários e estantes", imagem: "/produtos/armarios-e-estantes.jpg" },
      { nome: "Gaveteiros volantes", imagem: "/produtos/gaveteiros-volantes.jpg" },
      { nome: "Gaveteiro volante", imagem: "/produtos/gaveteiro-volante-branco.jpg" },
      { nome: "Gaveteiro com nicho", imagem: "/produtos/gaveteiro-com-nicho.jpg" },
    ],
  },
  {
    id: "layouts",
    nome: "Projetos de layout",
    texto: "Ambientes completos planejados e mobiliados pela Mobiletto, do open space à área de convivência.",
    itens: ["Layout e planta", "Projeto 3D", "Mobiliário completo", "Instalação"],
    imagem: "/produtos/layout-escritorio-completo.jpg",
    produtos: [
      { nome: "Escritório completo", imagem: "/produtos/layout-escritorio-completo.jpg" },
      { nome: "Open space com lounge", imagem: "/produtos/layout-open-space-lounge.jpg" },
    ],
  },
];

/* ---------------------------------------------------------------- sobre */

export const valores = ["Planejamento", "Precisão", "Arquitetura", "Funcionalidade", "Sofisticação", "Design", "Organização"];

export const processo = [
  {
    titulo: "Briefing e medição",
    texto: "Entendemos a operação, o número de pessoas e o padrão desejado. Medimos o espaço ou partimos da planta.",
    imagem: "/images/mesa-escritorio.jpg",
  },
  {
    titulo: "Projeto 3D",
    texto: "Desenvolvemos layout, especificação e acabamentos, com visualização 3D para aprovação.",
    imagem: "/produtos/layout-open-space-lounge.jpg",
  },
  {
    titulo: "Fabricação",
    texto: "Produção na nossa estrutura, com controle de qualidade em cada etapa.",
    imagem: "/images/marcenaria-ferramentas.jpg",
  },
  {
    titulo: "Instalação",
    texto: "Montagem com equipe própria, no cronograma da obra, e acompanhamento depois da entrega.",
    imagem: "/images/escritorio-open.jpg",
  },
];

/* ------------------------------------------------------------- carreiras */

export const beneficios = [
  { titulo: "Fábrica de verdade", texto: "Você vê o projeto sair do papel e virar ambiente, do corte à montagem." },
  { titulo: "Projetos diversos", texto: "Escritórios, hotéis, restaurantes: cada obra é um desafio diferente." },
  { titulo: "Crescimento", texto: "Treinamento contínuo e espaço para crescer junto com a empresa." },
  { titulo: "Ambiente sério", texto: "Prazos cumpridos, segurança no trabalho e respeito no dia a dia." },
];

// confirmar: vagas de exemplo
export const vagas = [
  { id: "marceneiro", titulo: "Marceneiro(a)", area: "Produção", local: "Fábrica", regime: "CLT" },
  { id: "montador", titulo: "Montador(a) de móveis", area: "Instalação", local: "Obras", regime: "CLT" },
  { id: "projetista", titulo: "Projetista de interiores", area: "Projetos", local: "Escritório", regime: "CLT" },
  { id: "comercial", titulo: "Consultor(a) comercial B2B", area: "Comercial", local: "Híbrido", regime: "CLT" },
];

/* ------------------------------------------------------------ navegação */

export const nav = [
  { href: "/sobre-nos", label: "Sobre nós" },
  {
    label: "Soluções",
    children: segmentos.map((s) => ({ href: `/cases?segmento=${s.id}`, label: s.nome, resumo: s.resumo })),
  },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/cases", label: "Cases" },
  { href: "/trabalhe-conosco", label: "Trabalhe conosco" },
] as const;
