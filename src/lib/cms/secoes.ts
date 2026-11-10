import type { Campo } from "./campos";

/**
 * Seções editáveis do site. Cada uma tem: onde aparece (página), os campos do
 * formulário no painel e o conteúdo padrão (usado enquanto ninguém editou).
 * O valor salvo no banco é mesclado por cima do padrão — o site nunca fica vazio.
 */

type Def<P> = { pagina: string; titulo: string; descricao?: string; campos: Campo[]; padrao: P };
const def = <P,>(d: Def<P>) => d;

const ITENS_FOTO: Campo[] = [
  { tipo: "texto", nome: "titulo", rotulo: "Título" },
  { tipo: "textarea", nome: "texto", rotulo: "Texto", linhas: 3 },
  { tipo: "imagem", nome: "imagem", rotulo: "Imagem" },
];
const ABERTURA = (comImagem = false): Campo[] => [
  { tipo: "texto", nome: "rotulo", rotulo: "Rótulo (acima do título)" },
  { tipo: "textarea", nome: "titulo", rotulo: "Título", linhas: 2 },
  { tipo: "textarea", nome: "texto", rotulo: "Texto de apoio", linhas: 3 },
  ...(comImagem ? [{ tipo: "imagem", nome: "imagem", rotulo: "Imagem" } as Campo] : []),
];
const FAIXA_FINAL: Campo[] = [
  { tipo: "textarea", nome: "titulo", rotulo: "Frase", linhas: 3 },
  { tipo: "imagem", nome: "imagem", rotulo: "Foto de fundo" },
  { tipo: "texto", nome: "botao", rotulo: "Texto do botão" },
  { tipo: "texto", nome: "link", rotulo: "Link do botão", ajuda: "Ex.: /sobre-nos ou /fale-conosco" },
];
const FAQ: Campo[] = [
  { tipo: "texto", nome: "titulo", rotulo: "Título da seção" },
  {
    tipo: "itens",
    nome: "itens",
    rotulo: "Perguntas",
    item: "pergunta",
    campos: [
      { tipo: "texto", nome: "p", rotulo: "Pergunta" },
      { tipo: "textarea", nome: "r", rotulo: "Resposta", linhas: 3 },
    ],
  },
];

const faqPadrao = [
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
    r: "Sim. Entregamos e instalamos em todo o território nacional, com equipe própria de montagem.",
  },
  {
    p: "Existe garantia e pós-venda?",
    r: "Sim. Todos os produtos têm garantia e um canal de pós-venda para ajustes, reposições e ampliações do ambiente.",
  },
];

export const SECOES = {
  /* ================================================================ geral */
  contato: def({
    pagina: "Geral",
    titulo: "Contatos e redes",
    descricao: "Aparece no rodapé, no Fale conosco e nos botões de WhatsApp.",
    campos: [
      { tipo: "texto", nome: "whatsapp", rotulo: "WhatsApp (só números, com DDI)", placeholder: "5514999990000" },
      { tipo: "texto", nome: "whatsappLabel", rotulo: "WhatsApp (como aparece no site)", placeholder: "(14) 99999-0000" },
      { tipo: "texto", nome: "telefone", rotulo: "Telefone" },
      { tipo: "texto", nome: "email", rotulo: "E-mail comercial" },
      { tipo: "texto", nome: "emailCarreiras", rotulo: "E-mail de carreiras" },
      { tipo: "texto", nome: "endereco", rotulo: "Endereço" },
      { tipo: "texto", nome: "cidade", rotulo: "Cidade — UF" },
      { tipo: "texto", nome: "horario", rotulo: "Horário de atendimento" },
      { tipo: "texto", nome: "instagram", rotulo: "Instagram (link)" },
      { tipo: "texto", nome: "linkedin", rotulo: "LinkedIn (link)" },
      { tipo: "texto", nome: "mensagemWhatsapp", rotulo: "Mensagem inicial do WhatsApp" },
    ],
    padrao: {
      whatsapp: "5500000000000",
      whatsappLabel: "(00) 00000-0000",
      telefone: "(00) 0000-0000",
      email: "contato@mobiletto.com.br",
      emailCarreiras: "carreiras@mobiletto.com.br",
      endereco: "Endereço da fábrica e showroom",
      cidade: "Cidade — UF",
      horario: "Segunda a sexta, 8h às 18h",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/",
      mensagemWhatsapp: "Olá! Gostaria de falar sobre um projeto de mobiliário corporativo.",
    },
  }),
  aviso: def({
    pagina: "Geral",
    titulo: "Barra de aviso (topo)",
    descricao: "Faixa azul acima do menu. Deixe o texto vazio para esconder.",
    campos: [
      { tipo: "texto", nome: "texto", rotulo: "Texto" },
      { tipo: "texto", nome: "link", rotulo: "Link" },
    ],
    padrao: { texto: "Projeto 3D sem custo para empresas — solicite o seu", link: "/fale-conosco?assunto=projeto" },
  }),
  seo: def({
    pagina: "Geral",
    titulo: "Google e compartilhamento",
    descricao: "Título e descrição que aparecem no Google e ao compartilhar o link do site.",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título do site" },
      { tipo: "textarea", nome: "descricao", rotulo: "Descrição", linhas: 3 },
      { tipo: "imagem", nome: "imagem", rotulo: "Imagem de compartilhamento" },
    ],
    padrao: {
      titulo: "Mobiletto · Mobiliário corporativo sob medida",
      descricao:
        "Mobiliário corporativo para escritórios, empresas, recepções, hotéis e restaurantes. Projeto, fabricação própria e instalação — do simples ao sofisticado.",
      imagem: "/brand/mobiletto-assinatura-azul.png",
    },
  }),

  /* ================================================================= home */
  "home.hero": def({
    pagina: "Home",
    titulo: "Abertura (vídeo)",
    campos: [
      { tipo: "textarea", nome: "titulo", rotulo: "Título", linhas: 2 },
      { tipo: "textarea", nome: "texto", rotulo: "Texto de apoio", linhas: 3 },
      { tipo: "texto", nome: "botaoPrimario", rotulo: "Botão principal" },
      { tipo: "texto", nome: "linkPrimario", rotulo: "Link do botão principal" },
      { tipo: "texto", nome: "botaoSecundario", rotulo: "Botão secundário" },
      { tipo: "texto", nome: "linkSecundario", rotulo: "Link do botão secundário" },
      { tipo: "video", nome: "video", rotulo: "Vídeo de fundo (MP4)", ajuda: "Vídeo curto, sem áudio, até ~10 MB." },
      { tipo: "imagem", nome: "poster", rotulo: "Imagem enquanto o vídeo carrega" },
    ],
    padrao: {
      titulo: "Mobiliário corporativo, do projeto à instalação.",
      texto: "Escritórios, empresas, recepções e hotéis. Projetamos, fabricamos e instalamos — do simples ao sofisticado.",
      botaoPrimario: "Solicitar projeto gratuito",
      linkPrimario: "/fale-conosco?assunto=projeto",
      botaoSecundario: "Conheça as soluções",
      linkSecundario: "#solucoes",
      video: "/video/hero.mp4",
      poster: "/video/hero-poster.jpg",
    },
  }),
  "home.faixa": def({
    pagina: "Home",
    titulo: "Faixa de segmentos (em movimento)",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "lista", nome: "itens", rotulo: "Segmentos", item: "segmento" },
    ],
    padrao: {
      titulo: "Mobiliário corporativo para todos os segmentos de interiores",
      itens: ["Escritórios", "Recepções", "Hotéis", "Restaurantes", "Coworkings", "Clínicas", "Auditórios", "Varejo"],
    },
  }),
  "home.diferenciais": def({
    pagina: "Home",
    titulo: "Por que a Mobiletto",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "textarea", nome: "texto", rotulo: "Subtítulo", linhas: 2 },
      { tipo: "itens", nome: "itens", rotulo: "Cartões", item: "cartão", campos: ITENS_FOTO },
      { tipo: "texto", nome: "botao", rotulo: "Texto do botão" },
    ],
    padrao: {
      titulo: "Por que a Mobiletto",
      texto: "Uma fábrica que pensa como arquitetura: projeto, produção e instalação no mesmo lugar.",
      botao: "Conheça a Mobiletto",
      itens: [
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
      ],
    },
  }),
  "home.servico": def({
    pagina: "Home",
    titulo: "Projeto, fábrica e obra",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "texto", nome: "mobiliarioTitulo", rotulo: "Foto grande — legenda" },
      { tipo: "imagem", nome: "mobiliarioImagem", rotulo: "Foto grande" },
      {
        tipo: "itens",
        nome: "etapas",
        rotulo: "Fotos do serviço",
        item: "foto",
        campos: [
          { tipo: "texto", nome: "titulo", rotulo: "Legenda" },
          { tipo: "imagem", nome: "imagem", rotulo: "Imagem" },
        ],
      },
    ],
    padrao: {
      titulo: "Projeto, fábrica e obra.",
      mobiliarioTitulo: "Mobiliário corporativo",
      mobiliarioImagem: "/produtos/sala-diretoria-madeira.jpg",
      etapas: [
        { titulo: "Projeto 3D do seu espaço", imagem: "/produtos/layout-escritorio-completo.jpg" },
        { titulo: "Fabricação própria", imagem: "/images/marcenaria-bancada.jpg" },
        { titulo: "Instalação completa", imagem: "/images/escritorio-open.jpg" },
        { titulo: "Pós-venda e garantia", imagem: "/images/lobby-recepcao.jpg" },
      ],
    },
  }),
  "home.galeria": def({
    pagina: "Home",
    titulo: "Galeria de ambientes",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "textarea", nome: "texto", rotulo: "Subtítulo", linhas: 2 },
      { tipo: "imagens", nome: "fotos", rotulo: "Fotos (formato retrato fica melhor)" },
    ],
    padrao: {
      titulo: "Ambientes entregues pela Mobiletto",
      texto: "Escritórios, recepções, hotéis e restaurantes — do simples ao sofisticado.",
      fotos: [
        "/produtos/sala-de-reuniao-10-lugares.jpg",
        "/images/hotel-madeira.jpg",
        "/produtos/balcao-recepcao.jpg",
        "/images/conferencia-oval.jpg",
        "/produtos/estacoes-em-ilha.jpg",
        "/images/recepcao-marmore-preto.jpg",
        "/produtos/mesa-diretor-armario.jpg",
        "/images/lobby-recepcao.jpg",
        "/images/restaurante-2.jpg",
      ],
    },
  }),
  "home.prazo": def({
    pagina: "Home",
    titulo: "Destaque com número",
    campos: [
      { tipo: "textarea", nome: "titulo", rotulo: "Título", linhas: 2 },
      { tipo: "textarea", nome: "texto", rotulo: "Texto", linhas: 3 },
      { tipo: "texto", nome: "rotulo", rotulo: "Rótulo do número" },
      { tipo: "texto", nome: "valor", rotulo: "Número" },
      { tipo: "texto", nome: "unidade", rotulo: "Unidade" },
      { tipo: "texto", nome: "nota", rotulo: "Observação" },
    ],
    padrao: {
      titulo: "Do simples ao sofisticado, no prazo da sua obra.",
      texto: "Um único parceiro para projetar, fabricar e instalar. Menos fornecedores, mais controle sobre o resultado.",
      rotulo: "Projeto 3D em até",
      valor: "5",
      unidade: "dias úteis",
      nota: "após o envio da planta",
    },
  }),
  "home.numeros": def({
    pagina: "Home",
    titulo: "Números",
    campos: [
      {
        tipo: "itens",
        nome: "itens",
        rotulo: "Números",
        item: "número",
        campos: [
          { tipo: "texto", nome: "valor", rotulo: "Valor" },
          { tipo: "texto", nome: "rotulo", rotulo: "Rótulo" },
          { tipo: "textarea", nome: "texto", rotulo: "Texto", linhas: 2 },
        ],
      },
    ],
    padrao: {
      itens: [
        { valor: "100%", rotulo: "Fabricação própria", texto: "Do projeto à montagem, sem terceirizar o que define a qualidade." },
        { valor: "5 anos", rotulo: "de garantia estrutural", texto: "Estruturas e marcenaria pensadas para o uso corporativo intenso." },
        { valor: "+1.000", rotulo: "ambientes mobiliados", texto: "Escritórios, recepções, hotéis e restaurantes em todo o país." },
      ],
    },
  }),
  "home.faq": def({
    pagina: "Home",
    titulo: "Perguntas frequentes",
    descricao: "Também aparece no Fale conosco.",
    campos: FAQ,
    padrao: { titulo: "Perguntas frequentes", itens: faqPadrao },
  }),
  "home.faixaFinal": def({
    pagina: "Home",
    titulo: "Faixa final com foto",
    campos: FAIXA_FINAL,
    padrao: {
      titulo: "Planejar é desenhar o espaço. Precisão, materialidade e organização em ambientes feitos para funcionar.",
      imagem: "/images/marcenaria-ferramentas.jpg",
      botao: "Conheça nossa história",
      link: "/sobre-nos",
    },
  }),

  /* ============================================================ sobre nós */
  "sobre.abertura": def({
    pagina: "Sobre nós",
    titulo: "Abertura",
    campos: ABERTURA(true),
    padrao: {
      rotulo: "Sobre nós",
      titulo: "Planejar é desenhar o espaço.",
      texto:
        "A Mobiletto transforma precisão, materialidade e organização em ambientes corporativos feitos para funcionar. Projetamos, fabricamos e instalamos mobiliário para empresas de todos os portes — do simples ao sofisticado.",
      imagem: "/images/conferencia-oval.jpg",
    },
  }),
  "sobre.manifesto": def({
    pagina: "Sobre nós",
    titulo: "Manifesto (faixa azul)",
    campos: ABERTURA(),
    padrao: {
      rotulo: "Arquitetura como sistema",
      titulo: "Mobiliário corporativo com a lógica de quem projeta.",
      texto:
        "Módulos, proporção, respiro e acabamento. Cada peça nasce do espaço em que vai viver e da forma como as pessoas vão usá-lo: recepcionar, reunir, concentrar, receber.",
    },
  }),
  "sobre.valores": def({
    pagina: "Sobre nós",
    titulo: "Valores",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "textarea", nome: "texto", rotulo: "Subtítulo", linhas: 2 },
      { tipo: "lista", nome: "itens", rotulo: "Valores", item: "valor" },
    ],
    padrao: {
      titulo: "O que guia cada projeto",
      texto: "Os princípios da marca Mobiletto, do primeiro traço à última peça instalada.",
      itens: ["Planejamento", "Precisão", "Arquitetura", "Funcionalidade", "Sofisticação", "Design", "Organização"],
    },
  }),
  "sobre.processo": def({
    pagina: "Sobre nós",
    titulo: "Como trabalhamos",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "textarea", nome: "texto", rotulo: "Subtítulo", linhas: 2 },
      { tipo: "itens", nome: "itens", rotulo: "Etapas", item: "etapa", campos: ITENS_FOTO },
    ],
    padrao: {
      titulo: "Como trabalhamos",
      texto: "Um único parceiro do briefing à instalação — e depois dela.",
      itens: [
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
        { titulo: "Fabricação", texto: "Produção na nossa estrutura, com controle de qualidade em cada etapa.", imagem: "/images/marcenaria-ferramentas.jpg" },
        {
          titulo: "Instalação",
          texto: "Montagem com equipe própria, no cronograma da obra, e acompanhamento depois da entrega.",
          imagem: "/images/escritorio-open.jpg",
        },
      ],
    },
  }),
  "sobre.fabrica": def({
    pagina: "Sobre nós",
    titulo: "Fábrica",
    campos: [...ABERTURA(true), { tipo: "lista", nome: "itens", rotulo: "Capacidades", item: "item" }],
    padrao: {
      rotulo: "Fabricação própria",
      titulo: "A fábrica é o que garante o padrão.",
      texto:
        "Produzir na nossa estrutura significa controlar prazo, acabamento e qualidade. Madeira, metal, pedra e estofados passam pelas mesmas mãos que vão instalar o seu ambiente.",
      imagem: "/images/marcenaria-bancada.jpg",
      itens: ["Marcenaria sob medida", "Estruturas metálicas", "Estofados", "Montagem e instalação"],
    },
  }),
  "sobre.segmentos": def({
    pagina: "Sobre nós",
    titulo: "Onde atuamos",
    descricao: "Os segmentos em si são editados em Segmentos.",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "textarea", nome: "texto", rotulo: "Subtítulo", linhas: 2 },
    ],
    padrao: { titulo: "Onde atuamos", texto: "Todos os segmentos da arquitetura de interiores corporativa." },
  }),
  "sobre.faixaFinal": def({
    pagina: "Sobre nós",
    titulo: "Faixa final com foto",
    campos: FAIXA_FINAL,
    padrao: {
      titulo: "Do balcão da recepção à sala do conselho, um mesmo padrão de precisão.",
      imagem: "/images/hotel-madeira.jpg",
      botao: "Conheça nossos cases",
      link: "/cases",
    },
  }),

  /* ============================================================= catálogo */
  "catalogo.abertura": def({
    pagina: "Catálogo",
    titulo: "Abertura",
    descricao: "Categorias e produtos são editados em Catálogo.",
    campos: ABERTURA(),
    padrao: {
      rotulo: "Catálogo",
      titulo: "Mobiliário para cada ambiente corporativo.",
      texto:
        "Estações de trabalho, mesas, diretoria, salas de reunião, recepções e armazenamento — tudo fabricado pela Mobiletto e adaptável ao seu projeto, do simples ao sofisticado.",
    },
  }),
  "catalogo.chamada": def({
    pagina: "Catálogo",
    titulo: "Chamada do catálogo completo",
    campos: ABERTURA(),
    padrao: {
      rotulo: "Em breve",
      titulo: "Catálogo completo, com fichas técnicas e acabamentos.",
      texto: "Enquanto isso, nossa equipe envia o material técnico de cada linha junto com a sua proposta.",
    },
  }),
  "catalogo.produto": def({
    pagina: "Catálogo",
    titulo: "Página de produto (textos fixos)",
    campos: [
      { tipo: "textarea", nome: "garantia", rotulo: "Nota de garantia", linhas: 2 },
      { tipo: "textarea", nome: "personalizacao", rotulo: "Nota de personalização", linhas: 2 },
      { tipo: "textarea", nome: "aviso", rotulo: "Aviso sobre imagens e medidas", linhas: 2 },
    ],
    padrao: {
      garantia: "Garantia de fábrica e pós-venda com equipe própria.",
      personalizacao: "Medidas, cores e acabamentos podem ser adaptados ao seu projeto.",
      aviso: "Imagens ilustrativas. Medidas de referência; confirme as dimensões finais na proposta.",
    },
  }),
  "catalogo.faq": def({
    pagina: "Catálogo",
    titulo: "Dúvidas sobre o catálogo",
    campos: FAQ,
    padrao: {
      titulo: "Dúvidas sobre o catálogo",
      itens: [
        {
          p: "Os produtos do catálogo podem ser personalizados?",
          r: "Sim. Dimensões, acabamentos, tecidos e cores podem ser adaptados ao projeto. Também desenvolvemos peças exclusivas a partir do zero.",
        },
        { p: "Existe pedido mínimo?", r: "Depende da linha e do nível de personalização. Na proposta indicamos volumes e prazos para cada item." },
        {
          p: "Vocês enviam amostras de acabamento?",
          r: "Sim. Para projetos em andamento, enviamos amostras de madeiras, tecidos e laminados para aprovação.",
        },
      ],
    },
  }),

  /* ================================================================ cases */
  "cases.abertura": def({
    pagina: "Cases",
    titulo: "Abertura",
    descricao: "Os cases em si são editados em Cases.",
    campos: ABERTURA(),
    padrao: {
      rotulo: "Cases",
      titulo: "Ambientes que já funcionam.",
      texto:
        "Uma seleção de projetos entregues pela Mobiletto em escritórios, recepções, hotéis, restaurantes e áreas comuns — do simples ao sofisticado.",
    },
  }),

  /* ===================================================== trabalhe conosco */
  "trabalhe.abertura": def({
    pagina: "Trabalhe conosco",
    titulo: "Abertura",
    campos: ABERTURA(true),
    padrao: {
      rotulo: "Trabalhe conosco",
      titulo: "Construa ambientes com a gente.",
      texto:
        "Da marcenaria à instalação, do projeto ao comercial: na Mobiletto cada pessoa vê o seu trabalho virar escritório, recepção ou hotel.",
      imagem: "/images/carpinteiro.jpg",
    },
  }),
  "trabalhe.beneficios": def({
    pagina: "Trabalhe conosco",
    titulo: "Por que trabalhar aqui",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "textarea", nome: "texto", rotulo: "Subtítulo", linhas: 2 },
      {
        tipo: "itens",
        nome: "itens",
        rotulo: "Benefícios",
        item: "benefício",
        campos: [
          { tipo: "texto", nome: "titulo", rotulo: "Título" },
          { tipo: "textarea", nome: "texto", rotulo: "Texto", linhas: 2 },
        ],
      },
    ],
    padrao: {
      titulo: "Por que a Mobiletto",
      texto: "Um lugar sério para quem gosta de fazer bem feito.",
      itens: [
        { titulo: "Fábrica de verdade", texto: "Você vê o projeto sair do papel e virar ambiente, do corte à montagem." },
        { titulo: "Projetos diversos", texto: "Escritórios, hotéis, restaurantes: cada obra é um desafio diferente." },
        { titulo: "Crescimento", texto: "Treinamento contínuo e espaço para crescer junto com a empresa." },
        { titulo: "Ambiente sério", texto: "Prazos cumpridos, segurança no trabalho e respeito no dia a dia." },
      ],
    },
  }),
  "trabalhe.candidatura": def({
    pagina: "Trabalhe conosco",
    titulo: "Vagas e candidatura",
    descricao: "As vagas em si são editadas em Vagas.",
    campos: [
      { tipo: "texto", nome: "vagasTitulo", rotulo: "Título das vagas" },
      { tipo: "textarea", nome: "vagasTexto", rotulo: "Texto das vagas", linhas: 2 },
      { tipo: "texto", nome: "titulo", rotulo: "Título do formulário" },
      { tipo: "textarea", nome: "texto", rotulo: "Texto do formulário", linhas: 3 },
    ],
    padrao: {
      vagasTitulo: "Vagas abertas",
      vagasTexto: "Não encontrou a sua? Cadastre-se no banco de talentos pelo formulário abaixo.",
      titulo: "Envie seu currículo.",
      texto: "Lemos todas as candidaturas. Se o seu perfil combinar com uma vaga, entramos em contato pelo e-mail ou telefone informados.",
    },
  }),

  /* ========================================================= fale conosco */
  "fale.abertura": def({
    pagina: "Fale conosco",
    titulo: "Abertura e formulário",
    campos: [
      ...ABERTURA(),
      { tipo: "texto", nome: "formTitulo", rotulo: "Título do formulário" },
      { tipo: "texto", nome: "formTexto", rotulo: "Texto do formulário" },
      { tipo: "textarea", nome: "sucesso", rotulo: "Mensagem após o envio", linhas: 2 },
    ],
    padrao: {
      rotulo: "Fale conosco",
      titulo: "Vamos falar do seu espaço.",
      texto: "Orçamentos, projetos, material técnico ou pós-venda. Conte o que você precisa e nossa equipe retorna em até 1 dia útil.",
      formTitulo: "Envie sua mensagem",
      formTexto: "Respondemos pelo e-mail ou WhatsApp que você informar.",
      sucesso: "Recebemos sua mensagem e nossa equipe retorna em até 1 dia útil.",
    },
  }),

  /* ======================================================= linha especial */
  "linha.hero": def({
    pagina: "Linha especial",
    titulo: "Abertura",
    descricao: "Página oculta: não aparece no menu nem no Google até ser liberada.",
    campos: [
      ...ABERTURA(true),
      { tipo: "booleano", nome: "publicada", rotulo: "Liberar a página (aparece no menu e no Google)" },
    ],
    padrao: {
      rotulo: "Lançamento Mobiletto",
      titulo: "Linha Especial",
      texto: "Uma linha de mobiliário corporativo pensada para diretorias, recepções e salas de conselho que pedem presença.",
      imagem: "/produtos/sala-de-reuniao-10-lugares.jpg",
      publicada: false,
    },
  }),
  "linha.destaques": def({
    pagina: "Linha especial",
    titulo: "Destaques",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      { tipo: "textarea", nome: "texto", rotulo: "Subtítulo", linhas: 2 },
      { tipo: "itens", nome: "itens", rotulo: "Destaques", item: "destaque", campos: ITENS_FOTO },
    ],
    padrao: {
      titulo: "Presença em cada detalhe",
      texto: "Uma linha para os ambientes que representam a empresa.",
      itens: [
        {
          titulo: "Materiais nobres",
          texto: "Madeiras naturais, pedras e metais com acabamento artesanal em cada peça.",
          imagem: "/produtos/sala-diretoria-madeira.jpg",
        },
        {
          titulo: "Desenho exclusivo",
          texto: "Peças assinadas, produzidas em séries limitadas para projetos de alto padrão.",
          imagem: "/produtos/mesa-diretor-armario.jpg",
        },
        { titulo: "Sob medida", texto: "Dimensões, acabamentos e composições ajustados ao ambiente de cada cliente.", imagem: "/produtos/balcao-recepcao.jpg" },
      ],
    },
  }),
  "linha.interesse": def({
    pagina: "Linha especial",
    titulo: "Formulário de interesse",
    campos: ABERTURA(),
    padrao: {
      rotulo: "Pré-lançamento",
      titulo: "Seja o primeiro a conhecer.",
      texto: "Deixe seus dados e enviamos o material completo da linha assim que ela for lançada.",
    },
  }),

  /* ========================================================= privacidade */
  privacidade: def({
    pagina: "Privacidade",
    titulo: "Política de privacidade",
    campos: [
      { tipo: "texto", nome: "titulo", rotulo: "Título" },
      {
        tipo: "itens",
        nome: "secoes",
        rotulo: "Tópicos",
        item: "tópico",
        campos: [
          { tipo: "texto", nome: "t", rotulo: "Título" },
          { tipo: "textarea", nome: "p", rotulo: "Texto", linhas: 4 },
        ],
      },
    ],
    padrao: {
      titulo: "Política de privacidade",
      secoes: [
        {
          t: "Quais dados coletamos",
          p: "Coletamos apenas os dados que você informa nos formulários do site: nome, empresa, e-mail, telefone, mensagem e, no caso de candidaturas, o currículo e as informações profissionais enviadas.",
        },
        {
          t: "Para que usamos",
          p: "Usamos os dados para responder ao seu contato, elaborar propostas e orçamentos e, no caso de candidaturas, para processos seletivos. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.",
        },
        {
          t: "Base legal",
          p: "O tratamento é feito com base no seu consentimento e na execução de procedimentos preliminares a um contrato, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
        },
        {
          t: "Por quanto tempo guardamos",
          p: "Mantemos os dados pelo tempo necessário para atender à finalidade do contato ou do processo seletivo, ou enquanto houver obrigação legal de guarda.",
        },
        {
          t: "Seus direitos",
          p: "Você pode solicitar a qualquer momento o acesso, a correção ou a exclusão dos seus dados, além de revogar o consentimento.",
        },
      ],
    },
  }),
};

export type ChaveSecao = keyof typeof SECOES;
export type ValorSecao<K extends ChaveSecao> = (typeof SECOES)[K]["padrao"];

/** Ordem das páginas no painel. */
export const PAGINAS = ["Geral", "Home", "Sobre nós", "Catálogo", "Cases", "Trabalhe conosco", "Fale conosco", "Linha especial", "Privacidade"];
