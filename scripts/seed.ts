/**
 * Carga inicial do banco: `npm run db:seed`.
 * Idempotente — só insere o que ainda não existe (por slug/URL/e-mail).
 * Fichas técnicas dos produtos são REFERÊNCIAS típicas: revisar no painel.
 */
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import * as schema from "../src/lib/db/schema";
import { hashSenha, senhaProvisoria } from "../src/lib/senha";
import { cases as casesBase, segmentos as segmentosBase, vagas as vagasBase } from "../src/content/site";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type P = { rotulo: string; valor: string };
const par = (rotulo: string, valor: string): P => ({ rotulo, valor });

const ACAB_MADEIRA = ["Carvalho", "Freijó", "Nogueira", "Branco", "Grafite", "Preto"];
const ESTRUTURA_ACO = par("Estrutura", "Aço tubular com pintura eletrostática epóxi");
const TAMPO_MDP = par("Tampo", "MDP 25 mm com revestimento melamínico de alta resistência");
const BORDAS = par("Bordas", "Fita de borda em PVC 2 mm, cantos arredondados");

const categorias = [
  {
    slug: "estacoes",
    nome: "Estações de trabalho",
    descricao: "Plataformas compartilhadas, estações em ilha e mesas operacionais com divisórias e eletrificação.",
    tags: ["Plataformas de 2 a 8 lugares", "Divisórias e painéis", "Calhas de eletrificação", "Gaveteiros integrados"],
    capa: "/produtos/estacoes-em-ilha.jpg",
  },
  {
    slug: "mesas",
    nome: "Mesas de trabalho",
    descricao: "Mesas retas e em L, com gaveteiros, nichos e balcões de apoio, em madeira e metal.",
    tags: ["Mesas em L", "Mesas retas", "Pés quadro em aço", "Tampos em madeira ou branco"],
    capa: "/produtos/mesa-l-gaveteiro.jpg",
  },
  {
    slug: "diretoria",
    nome: "Diretoria e executivo",
    descricao: "Mesas executivas, aparadores e armários para salas de direção e escritórios particulares.",
    tags: ["Mesas executivas", "Aparadores", "Armários e estantes", "Painéis de marcenaria"],
    capa: "/produtos/sala-diretoria-madeira.jpg",
  },
  {
    slug: "reuniao",
    nome: "Salas de reunião",
    descricao: "Mesas de reunião e de conselho sob medida, com caixas de tomada e cabeamento integrados.",
    tags: ["Mesas de 4 a 20 lugares", "Caixas de tomada", "Aparadores técnicos", "Painéis de marcenaria"],
    capa: "/produtos/sala-de-reuniao-10-lugares.jpg",
  },
  {
    slug: "recepcao",
    nome: "Recepção e balcões",
    descricao: "Balcões de atendimento, recepções e expositores com iluminação integrada.",
    tags: ["Balcões de recepção", "Balcões expositores", "Iluminação em LED", "Acabamentos nobres"],
    capa: "/produtos/balcao-recepcao.jpg",
  },
  {
    slug: "armazenamento",
    nome: "Armazenamento",
    descricao: "Armários, estantes e gaveteiros que organizam sem pesar no ambiente.",
    tags: ["Armários altos e baixos", "Estantes", "Gaveteiros volantes", "Gaveteiros com nicho"],
    capa: "/produtos/armarios-e-estantes.jpg",
  },
  {
    slug: "layouts",
    nome: "Projetos de layout",
    descricao: "Ambientes completos planejados e mobiliados pela Mobiletto, do open space à área de convivência.",
    tags: ["Layout e planta", "Projeto 3D", "Mobiliário completo", "Instalação"],
    capa: "/produtos/layout-escritorio-completo.jpg",
  },
];

type ProdutoSeed = {
  cat: string;
  nome: string;
  img: string;
  resumo: string;
  descricao: string;
  medidas: P[];
  especificacoes: P[];
  aplicacoes: string[];
  acabamentos?: string[];
  diferenciais: string[];
  destaque?: boolean;
};

const estacao = (lugares: string, extra: P[] = []) => [
  par("Largura por posto", "120 cm (opções de 100 a 160 cm)"),
  par("Profundidade", lugares),
  par("Altura", "74 cm"),
  ...extra,
];

const produtos: ProdutoSeed[] = [
  {
    cat: "estacoes",
    nome: "Estação plataforma 4 lugares",
    img: "estacao-plataforma-4-lugares",
    resumo: "Plataforma face a face para quatro pessoas, com divisória central e eletrificação embutida.",
    descricao:
      "Uma plataforma compartilhada que organiza equipes em blocos de quatro posições, otimizando a área do escritório sem perder o espaço individual de cada pessoa.\n\nA divisória central garante privacidade visual e acústica, enquanto a calha de eletrificação sob o tampo deixa tomadas e cabos de rede acessíveis e escondidos.",
    medidas: estacao("125 cm (face a face)", [par("Divisória", "Altura de 30 cm acima do tampo")]),
    especificacoes: [TAMPO_MDP, ESTRUTURA_ACO, par("Divisória", "Painel em MDF revestido ou tecido acústico"), par("Eletrificação", "Calha metálica com tomadas e pontos de rede"), BORDAS],
    aplicacoes: ["Open space", "Escritórios corporativos", "Call center", "Coworking"],
    diferenciais: ["Modular: amplia para 6 ou 8 lugares", "Cabos escondidos sob o tampo", "Niveladores para pisos irregulares"],
    destaque: true,
  },
  {
    cat: "estacoes",
    nome: "Estação dupla com divisória",
    img: "estacao-dupla-divisoria",
    resumo: "Duas posições face a face com divisória frontal e gaveteiros sob o tampo.",
    descricao:
      "Estação compacta para duplas que trabalham lado a lado, com divisória frontal que delimita cada posição.\n\nAceita gaveteiros volantes ou fixos e pode ser combinada em linha para formar ilhas maiores.",
    medidas: estacao("125 cm (face a face)"),
    especificacoes: [TAMPO_MDP, ESTRUTURA_ACO, par("Divisória", "Painel frontal em melamínico branco"), par("Eletrificação", "Calha central com passa-cabos")],
    aplicacoes: ["Equipes administrativas", "Escritórios de contabilidade", "Atendimento interno"],
    diferenciais: ["Combina em linha para formar ilhas", "Gaveteiro integrado ou volante"],
  },
  {
    cat: "estacoes",
    nome: "Estações em ilha",
    img: "estacoes-em-ilha",
    resumo: "Conjunto de estações em ilha com armários baixos de apoio e circulação livre.",
    descricao:
      "Ilhas de trabalho dimensionadas para o layout do cliente, com armários baixos que servem de apoio e de divisão entre equipes.\n\nUma solução versátil para escritórios que precisam acomodar muitas pessoas mantendo a circulação organizada.",
    medidas: estacao("Variável conforme o layout", [par("Armário de apoio", "Altura de 74 cm")]),
    especificacoes: [TAMPO_MDP, ESTRUTURA_ACO, par("Apoio", "Armários baixos com portas e prateleiras"), BORDAS],
    aplicacoes: ["Open space", "Sedes administrativas", "Escritórios em crescimento"],
    diferenciais: ["Projetado para a planta do cliente", "Armários de apoio integrados ao layout"],
  },
  {
    cat: "estacoes",
    nome: "Plataforma compartilhada",
    img: "plataforma-compartilhada",
    resumo: "Bancadas contínuas para equipes, com áreas de apoio e convivência integradas.",
    descricao:
      "Plataformas contínuas para espaços colaborativos, que combinam posições de trabalho com áreas de apoio e encontro.\n\nIdeal para empresas que adotam o trabalho híbrido e precisam de posições compartilhadas.",
    medidas: estacao("140 cm (face a face)", [par("Comprimento", "Sob medida, em módulos de 120 cm")]),
    especificacoes: [TAMPO_MDP, ESTRUTURA_ACO, par("Eletrificação", "Calha contínua com tomadas por posição")],
    aplicacoes: ["Coworking", "Escritórios híbridos", "Startups", "Áreas colaborativas"],
    diferenciais: ["Comprimento sob medida", "Posições compartilhadas para trabalho híbrido"],
  },
  {
    cat: "mesas",
    nome: "Mesa em L com gaveteiro",
    img: "mesa-l-gaveteiro",
    resumo: "Mesa em L com pé quadro em aço e gaveteiro fixo com nicho.",
    descricao:
      "Mesa em L que amplia a área de trabalho e organiza o posto com gaveteiro fixo e nicho aberto.\n\nO pé quadro em aço preto dá leveza visual e robustez para o uso diário.",
    medidas: [par("Largura", "160 cm"), par("Retorno", "120 cm"), par("Profundidade", "60 cm"), par("Altura", "75 cm")],
    especificacoes: [TAMPO_MDP, par("Pés", "Quadro em aço 50×50 mm, pintura epóxi preta"), par("Gaveteiro", "3 gavetas com corrediças telescópicas"), BORDAS],
    aplicacoes: ["Escritórios particulares", "Gerências", "Home office corporativo"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Lado do retorno à escolha", "Passa-cabos no tampo"],
    destaque: true,
  },
  {
    cat: "mesas",
    nome: "Mesa em L com balcão",
    img: "mesa-l-balcao",
    resumo: "Mesa em L com balcão de apoio e gaveteiro lateral integrado.",
    descricao: "Composição em L com balcão lateral para impressora, documentos e apoio, deixando o tampo principal livre.",
    medidas: [par("Largura", "150 cm"), par("Retorno", "140 cm"), par("Profundidade", "60 cm"), par("Altura", "75 cm")],
    especificacoes: [TAMPO_MDP, par("Balcão", "Corpo em MDP 18 mm com gavetas"), BORDAS],
    aplicacoes: ["Gerências", "Coordenações", "Escritórios particulares"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Balcão com gavetas de apoio", "Tampo principal livre"],
  },
  {
    cat: "mesas",
    nome: "Mesa em L com nicho",
    img: "mesa-l-nicho-branca",
    resumo: "Mesa em L branca com nicho aberto e prateleira de apoio.",
    descricao: "Mesa em L com nicho aberto e prateleira elevada, em acabamento branco que ilumina o ambiente.",
    medidas: [par("Largura", "160 cm"), par("Retorno", "150 cm"), par("Profundidade", "60 cm"), par("Altura", "75 cm")],
    especificacoes: [TAMPO_MDP, ESTRUTURA_ACO, par("Nicho", "Prateleira elevada em MDP 18 mm")],
    aplicacoes: ["Escritórios", "Consultórios", "Salas de atendimento"],
    acabamentos: ["Branco", "Carvalho", "Grafite"],
    diferenciais: ["Prateleira elevada de apoio", "Visual leve e claro"],
  },
  {
    cat: "mesas",
    nome: "Mesa reta pé quadro",
    img: "mesa-reta-pe-quadro",
    resumo: "Mesa reta com pé quadro em aço e painel frontal de privacidade.",
    descricao: "Mesa reta de linhas simples, com painel frontal e pé quadro em aço — um clássico para postos individuais.",
    medidas: [par("Largura", "120 a 180 cm"), par("Profundidade", "60 ou 70 cm"), par("Altura", "75 cm")],
    especificacoes: [TAMPO_MDP, par("Pés", "Quadro em aço 50×50 mm"), par("Painel frontal", "MDP 18 mm")],
    aplicacoes: ["Postos individuais", "Recepções internas", "Salas de apoio"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Disponível em várias larguras", "Painel frontal de privacidade"],
  },
  {
    cat: "mesas",
    nome: "Mesa de trabalho com floreira",
    img: "mesa-trabalho-floreira",
    resumo: "Mesa de trabalho com floreira integrada que divide e humaniza o ambiente.",
    descricao: "Uma mesa de trabalho com floreira integrada à marcenaria, que traz vegetação para o posto e cria divisões naturais.",
    medidas: [par("Largura", "140 cm"), par("Profundidade", "70 cm"), par("Altura", "75 cm"), par("Floreira", "Altura de 110 cm")],
    especificacoes: [TAMPO_MDP, par("Floreira", "MDF naval com caixa impermeabilizada"), ESTRUTURA_ACO],
    aplicacoes: ["Escritórios biofílicos", "Coworking", "Áreas de convivência"],
    acabamentos: ["Carvalho", "Branco", "Freijó"],
    diferenciais: ["Floreira impermeabilizada", "Divide o ambiente com vegetação"],
  },
  {
    cat: "mesas",
    nome: "Mesa em L com painel ripado",
    img: "mesa-l-painel-ripado",
    resumo: "Mesa em L com painel ripado, painel acústico e armário suspenso.",
    descricao: "Composição completa de posto de trabalho: mesa em L, painel acústico em tecido, painel ripado e armário suspenso.",
    medidas: [par("Largura", "180 cm"), par("Retorno", "140 cm"), par("Profundidade", "60 cm"), par("Altura", "75 cm")],
    especificacoes: [TAMPO_MDP, par("Painel acústico", "Tecido sobre placa de lã de PET"), par("Ripado", "MDF com lâmina de madeira"), par("Armário suspenso", "Portas basculantes")],
    aplicacoes: ["Salas de gerência", "Escritórios particulares", "Postos fechados"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Painel acústico", "Armário suspenso integrado"],
  },
  {
    cat: "diretoria",
    nome: "Sala de diretoria em madeira",
    img: "sala-diretoria-madeira",
    resumo: "Mesa executiva em madeira com painel ripado e cadeiras de visitante.",
    descricao:
      "Uma sala de direção completa em madeira, com mesa executiva de linhas sólidas, painel ripado do piso ao teto e marcenaria sob medida.\n\nProjetada para transmitir solidez e acolher reuniões curtas com visitantes.",
    medidas: [par("Mesa", "200 × 90 cm"), par("Altura", "76 cm"), par("Painel ripado", "Sob medida")],
    especificacoes: [par("Tampo", "MDF 30 mm com lâmina natural de madeira"), par("Painel", "Ripado em MDF com lâmina natural"), par("Acabamento", "Verniz PU fosco")],
    aplicacoes: ["Diretorias", "Presidência", "Escritórios de advocacia"],
    acabamentos: ["Nogueira", "Freijó", "Carvalho"],
    diferenciais: ["Lâmina natural de madeira", "Marcenaria sob medida para a sala"],
    destaque: true,
  },
  {
    cat: "diretoria",
    nome: "Mesa diretor com armário",
    img: "mesa-diretor-armario",
    resumo: "Mesa diretor com tampo em vidro, base em madeira e armário de apoio.",
    descricao: "Mesa de diretoria com tampo em vidro e base em madeira, acompanhada de armário de apoio com portas e nichos.",
    medidas: [par("Mesa", "180 × 80 cm"), par("Altura", "76 cm"), par("Armário", "180 × 45 × 75 cm")],
    especificacoes: [par("Tampo", "Vidro temperado 10 mm"), par("Base", "MDF 25 mm com lâmina de madeira"), par("Armário", "Portas com amortecedor")],
    aplicacoes: ["Diretorias", "Salas executivas"],
    acabamentos: ["Carvalho", "Nogueira", "Preto"],
    diferenciais: ["Tampo em vidro temperado", "Armário com amortecedor"],
  },
  {
    cat: "diretoria",
    nome: "Mesa em L com aparador",
    img: "mesa-l-aparador",
    resumo: "Mesa em L executiva com aparador baixo e espaço para TV.",
    descricao: "Mesa em L de linha executiva com aparador baixo integrado, que organiza documentos e equipamentos.",
    medidas: [par("Largura", "180 cm"), par("Retorno", "160 cm"), par("Profundidade", "70 cm"), par("Altura", "76 cm")],
    especificacoes: [par("Tampo", "MDP 30 mm"), par("Pés", "Quadro em aço preto"), par("Aparador", "Portas e gavetas")],
    aplicacoes: ["Gerências", "Diretorias", "Escritórios particulares"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Aparador integrado", "Tampo 30 mm"],
  },
  {
    cat: "diretoria",
    nome: "Mesa em L com armário baixo",
    img: "mesa-l-armario-baixo",
    resumo: "Mesa em L com armário baixo, em madeira e branco, com mesa de reunião redonda.",
    descricao: "Composição de sala executiva com mesa em L, armário baixo e mesa redonda para pequenas reuniões.",
    medidas: [par("Largura", "180 cm"), par("Retorno", "160 cm"), par("Mesa redonda", "Ø 90 cm"), par("Altura", "75 cm")],
    especificacoes: [TAMPO_MDP, ESTRUTURA_ACO, par("Armário", "MDP 18 mm, portas e prateleiras")],
    aplicacoes: ["Gerências", "Escritórios particulares"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Composição com mesa de reunião", "Armário baixo de apoio"],
  },
  {
    cat: "reuniao",
    nome: "Sala de reunião 10 lugares",
    img: "sala-de-reuniao-10-lugares",
    resumo: "Mesa de reunião para 10 pessoas com caixas de tomada e aparador técnico.",
    descricao:
      "Mesa de reunião retangular para até 10 lugares, com caixas de tomada embutidas no tampo e cabeamento oculto pela estrutura.\n\nO aparador técnico em marcenaria acomoda equipamentos de vídeo e apoio para coffee break.",
    medidas: [par("Mesa", "300 × 120 cm"), par("Altura", "75 cm"), par("Lugares", "Até 10 pessoas")],
    especificacoes: [par("Tampo", "MDF 30 mm com lâmina de madeira"), par("Tomadas", "2 caixas com tomadas, USB e rede"), par("Base", "Painel em madeira com passagem de cabos")],
    aplicacoes: ["Salas de reunião", "Salas do conselho", "Treinamentos"],
    acabamentos: ["Carvalho", "Freijó", "Nogueira"],
    diferenciais: ["Caixas de tomada embutidas", "Cabeamento oculto", "Disponível de 4 a 20 lugares"],
    destaque: true,
  },
  {
    cat: "recepcao",
    nome: "Balcão de recepção",
    img: "balcao-recepcao",
    resumo: "Balcão de recepção em madeira e preto com iluminação em LED.",
    descricao:
      "Balcão de recepção desenhado para receber bem desde a porta: frente em madeira, corpo em preto e friso de LED que destaca o volume.\n\nO lado interno é organizado para o trabalho da recepção, com nichos, gaveteiros e passagem de cabos.",
    medidas: [par("Largura", "Sob medida (a partir de 180 cm)"), par("Altura", "110 cm (atendimento) / 75 cm (trabalho)"), par("Profundidade", "70 cm")],
    especificacoes: [par("Corpo", "MDF 25 mm laqueado"), par("Frente", "Lâmina de madeira natural"), par("Iluminação", "Fita de LED embutida")],
    aplicacoes: ["Recepções corporativas", "Clínicas", "Hotéis", "Showrooms"],
    acabamentos: ["Madeira + preto", "Madeira + branco", "Pedra + madeira"],
    diferenciais: ["Iluminação em LED integrada", "Dupla altura: atendimento e trabalho", "Totalmente sob medida"],
    destaque: true,
  },
  {
    cat: "recepcao",
    nome: "Balcão expositor iluminado",
    img: "balcao-expositor-iluminado",
    resumo: "Balcão expositor em L com tampo em madeira e iluminação perimetral.",
    descricao: "Balcão expositor em L para showrooms e lojas, com tampo em madeira, corpo preto e iluminação perimetral em LED.",
    medidas: [par("Largura", "Sob medida"), par("Altura", "95 cm"), par("Profundidade", "60 cm")],
    especificacoes: [par("Corpo", "MDF 25 mm com pintura PU preta"), par("Tampo", "Lâmina de madeira natural"), par("Iluminação", "LED perimetral")],
    aplicacoes: ["Showrooms", "Varejo", "Lojas de fábrica"],
    acabamentos: ["Madeira + preto", "Madeira + grafite"],
    diferenciais: ["Iluminação perimetral", "Formato sob medida"],
  },
  {
    cat: "armazenamento",
    nome: "Armários e estantes",
    img: "armarios-e-estantes",
    resumo: "Linha de armários altos e baixos e estantes, combináveis entre si.",
    descricao: "Armários altos e baixos e estantes abertas que se combinam para organizar documentos e materiais sem pesar no ambiente.",
    medidas: [par("Largura", "80 cm por módulo"), par("Altura", "74, 110, 160 ou 210 cm"), par("Profundidade", "45 cm")],
    especificacoes: [par("Corpo", "MDP 18 mm"), par("Portas", "Dobradiças com amortecedor"), par("Fechadura", "Opcional")],
    aplicacoes: ["Escritórios", "Arquivos", "Salas de gerência"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Módulos combináveis", "Fechadura opcional"],
  },
  {
    cat: "armazenamento",
    nome: "Gaveteiros volantes",
    img: "gaveteiros-volantes",
    resumo: "Gaveteiros volantes com rodízios, em madeira e branco.",
    descricao: "Gaveteiros com rodízios que acompanham o posto de trabalho e liberam o espaço sob a mesa.",
    medidas: [par("Largura", "40 cm"), par("Profundidade", "50 cm"), par("Altura", "60 cm")],
    especificacoes: [par("Corpo", "MDP 18 mm"), par("Gavetas", "3 gavetas com corrediças telescópicas"), par("Rodízios", "Duplos, com trava")],
    aplicacoes: ["Estações de trabalho", "Mesas individuais"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Fechadura com chave", "Rodízios com trava"],
  },
  {
    cat: "armazenamento",
    nome: "Gaveteiro volante",
    img: "gaveteiro-volante-branco",
    resumo: "Gaveteiro volante branco com gaveta e porta.",
    descricao: "Gaveteiro volante branco de linhas limpas, com gaveta superior e porta inferior para pastas.",
    medidas: [par("Largura", "40 cm"), par("Profundidade", "50 cm"), par("Altura", "60 cm")],
    especificacoes: [par("Corpo", "MDP 18 mm branco"), par("Puxadores", "Alumínio escovado"), par("Rodízios", "Duplos")],
    aplicacoes: ["Estações de trabalho", "Consultórios"],
    acabamentos: ["Branco", "Grafite"],
    diferenciais: ["Espaço para pastas suspensas"],
  },
  {
    cat: "armazenamento",
    nome: "Gaveteiro com nicho",
    img: "gaveteiro-com-nicho",
    resumo: "Gaveteiro volante com gaveta e nicho aberto para documentos.",
    descricao: "Gaveteiro volante com gaveta superior e nicho aberto, prático para pastas e documentos de uso diário.",
    medidas: [par("Largura", "40 cm"), par("Profundidade", "50 cm"), par("Altura", "60 cm")],
    especificacoes: [par("Corpo", "MDP 18 mm"), par("Gaveta", "Corrediça telescópica"), par("Rodízios", "Duplos, com trava")],
    aplicacoes: ["Estações de trabalho", "Mesas individuais"],
    acabamentos: ACAB_MADEIRA,
    diferenciais: ["Nicho aberto para pastas"],
  },
  {
    cat: "layouts",
    nome: "Escritório completo",
    img: "layout-escritorio-completo",
    resumo: "Projeto de escritório completo: estações, salas envidraçadas e áreas de apoio.",
    descricao:
      "Exemplo de projeto completo desenvolvido pela Mobiletto: da planta ao 3D, com estações de trabalho, salas de reunião envidraçadas e áreas de apoio.\n\nCada projeto é desenhado para a operação do cliente e entregue instalado.",
    medidas: [par("Área", "Sob medida para a planta"), par("Postos", "Conforme a equipe")],
    especificacoes: [par("Entrega", "Projeto 3D, fabricação e instalação"), par("Prazo", "Definido na proposta")],
    aplicacoes: ["Sedes corporativas", "Escritórios novos", "Mudanças e ampliações"],
    diferenciais: ["Projeto 3D para aprovação", "Um único fornecedor do projeto à instalação"],
  },
  {
    cat: "layouts",
    nome: "Open space com lounge",
    img: "layout-open-space-lounge",
    resumo: "Open space com estações, área de descompressão e mobiliário de convivência.",
    descricao: "Projeto de open space que integra estações de trabalho, lounge com sofás e áreas de encontro em um mesmo ambiente.",
    medidas: [par("Área", "Sob medida para a planta")],
    especificacoes: [par("Entrega", "Projeto 3D, fabricação e instalação")],
    aplicacoes: ["Empresas de tecnologia", "Coworkings", "Agências"],
    diferenciais: ["Zonas de foco e convivência", "Mobiliário de lounge integrado"],
  },
];

async function main() {
  // segmentos
  for (const [i, s] of segmentosBase.entries()) {
    await db
      .insert(schema.segmentos)
      .values({ slug: s.id, nome: s.nome, resumo: s.resumo, imagem: s.imagem, ordem: i })
      .onConflictDoNothing();
  }
  // categorias
  for (const [i, c] of categorias.entries()) {
    await db.insert(schema.categorias).values({ ...c, ordem: i }).onConflictDoNothing();
  }
  const cats = await db.select().from(schema.categorias);
  const idCat = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
  // produtos
  for (const [i, p] of produtos.entries()) {
    await db
      .insert(schema.produtos)
      .values({
        slug: slugify(p.nome),
        categoriaId: idCat[p.cat],
        nome: p.nome,
        resumo: p.resumo,
        descricao: p.descricao,
        imagens: [`/produtos/${p.img}.jpg`],
        medidas: p.medidas,
        especificacoes: p.especificacoes,
        aplicacoes: p.aplicacoes,
        acabamentos: p.acabamentos ?? [],
        diferenciais: p.diferenciais,
        destaque: !!p.destaque,
        ordem: i,
      })
      .onConflictDoNothing();
  }
  // cases
  for (const [i, c] of casesBase.entries()) {
    await db
      .insert(schema.cases)
      .values({
        slug: c.slug,
        titulo: c.titulo,
        segmento: c.segmento,
        cidade: c.cidade,
        ano: c.ano,
        escopo: c.escopo,
        resumo: c.resumo,
        desafio: c.desafio,
        solucao: c.solucao,
        capa: c.capa,
        galeria: c.galeria,
        ordem: i,
      })
      .onConflictDoNothing();
  }
  // vagas
  for (const [i, v] of vagasBase.entries()) {
    await db
      .insert(schema.vagas)
      .values({ slug: v.id, titulo: v.titulo, area: v.area, local: v.local, regime: v.regime, ordem: i })
      .onConflictDoNothing();
  }
  // biblioteca de mídia: imagens que já estão no repositório
  for (const pasta of ["images", "produtos", "brand", "video"]) {
    const dir = path.join(process.cwd(), "public", pasta);
    if (!fs.existsSync(dir)) continue;
    for (const arq of fs.readdirSync(dir)) {
      if (!/\.(jpe?g|png|webp)$/i.test(arq)) continue;
      const full = path.join(dir, arq);
      const meta = await sharp(full).metadata();
      await db
        .insert(schema.midias)
        .values({
          url: `/${pasta}/${arq}`,
          nome: arq,
          tipo: `image/${meta.format === "jpeg" ? "jpeg" : meta.format}`,
          tamanho: fs.statSync(full).size,
          largura: meta.width,
          altura: meta.height,
          origem: "local",
        })
        .onConflictDoNothing();
    }
  }
  // primeira conta de administrador
  const email = (process.env.ADMIN_EMAIL || "admin@mobiletto.com.br").toLowerCase();
  const [existe] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email)).limit(1);
  if (!existe) {
    const senha = senhaProvisoria();
    await db.insert(schema.usuarios).values({ nome: "Administrador", email, senhaHash: hashSenha(senha), papel: "admin", trocarSenha: true });
    fs.mkdirSync(".cache", { recursive: true });
    fs.writeFileSync(
      ".cache/acesso-inicial.txt",
      `Painel Mobiletto — acesso inicial\n\nEndereço: /painel\nE-mail: ${email}\nSenha provisória: ${senha}\n\nNo primeiro login o painel pede uma senha nova.\n`,
    );
    console.log(`Admin criado: ${email} (senha provisória em .cache/acesso-inicial.txt)`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contar = async (t: any) => (await db.select().from(t)).length;
  console.log(
    "OK —",
    `${await contar(schema.segmentos)} segmentos,`,
    `${await contar(schema.categorias)} categorias,`,
    `${await contar(schema.produtos)} produtos,`,
    `${await contar(schema.cases)} cases,`,
    `${await contar(schema.vagas)} vagas,`,
    `${await contar(schema.midias)} mídias`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
