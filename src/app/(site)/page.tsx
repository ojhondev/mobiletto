import Image from "next/image";
import Link from "next/link";
import { Botao } from "@/components/site/Botao";
import { ChamadaDupla, FaixaFoto, Faq, TituloSecao } from "@/components/site/Blocos";
import { Galeria } from "@/components/site/Galeria";
import {
  destaquePrazo,
  diferenciais,
  faixaSegmentos,
  faqs,
  galeriaHome,
  numeros,
  servico,
} from "@/content/site";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate flex min-h-[640px] items-center justify-center overflow-hidden h-[calc(100svh-40px)] max-h-[980px] bg-tinta text-white">
        <video
          className="absolute inset-0 -z-10 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.jpg"
          aria-hidden
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        {/* o vídeo tem tons claros (madeira, parede ripada): camada preta para a copy ter contraste */}
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.35),transparent_70%)]" />
        <div className="shell pb-16 text-center">
          <h1 className="reveal is-in mx-auto max-w-[17ch] text-h1">Mobiliário corporativo, do projeto à instalação.</h1>
          <p className="reveal is-in mx-auto mt-6 max-w-[40rem] text-lead text-white/90" style={d(0.08)}>
            Escritórios, empresas, recepções e hotéis. Projetamos, fabricamos e instalamos — do simples ao sofisticado.
          </p>
          <div className="reveal is-in mt-10 flex flex-wrap justify-center gap-3" style={d(0.16)}>
            <Botao href="/fale-conosco?assunto=projeto">Solicitar projeto gratuito</Botao>
            <Botao href="#solucoes" variante="claro">
              Conheça as soluções
            </Botao>
          </div>
        </div>
      </section>

      {/* ----------------------------------------- faixa de segmentos (cartão) */}
      <section className="shell relative z-10 -mt-[88px]">
        <div className="reveal bg-white px-6 py-9 md:px-10">
          <p className="text-center text-[19px] md:text-[21px]">Mobiliário corporativo para todos os segmentos de interiores</p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:justify-between md:gap-x-6">
            {faixaSegmentos.map((s) => (
              <li key={s} className="text-[19px] font-semibold tracking-[-0.04em] text-tinta/80 md:text-[22px]">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------- por que a Mobiletto */}
      <section id="solucoes" className="shell scroll-mt-24 pt-24 pb-20 md:pt-32 md:pb-28">
        <TituloSecao
          titulo="Por que a Mobiletto"
          sub="Uma fábrica que pensa como arquitetura: projeto, produção e instalação no mesmo lugar."
        />
        <div className="mt-14 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((item, i) => (
            <article key={item.titulo} className="reveal" style={d(i * 0.06)}>
              <div className="foto aspect-[4/3]">
                <Image
                  src={item.imagem}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw"
                  className="object-cover brightness-[1.08] contrast-[0.92] grayscale"
                />
              </div>
              <div className="px-1 pt-6 md:px-3">
                <h3 className="max-w-[16ch] text-[20px] leading-tight">
                  {String(i + 1).padStart(2, "0")}. {item.titulo}
                </h3>
                <p className="mt-3 text-[15px] leading-snug text-pedra">{item.texto}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="reveal mt-14 text-center">
          <Botao href="/sobre-nos">Conheça a Mobiletto</Botao>
        </div>
      </section>

      {/* ------------------------------------------------ projeto, fábrica e obra */}
      <section className="shell pb-6">
        <h2 className="reveal text-h1">Projeto, fábrica e obra.</h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_2fr]">
          <div className="reveal flex flex-col gap-3">
            <p className="bg-marfim-suave px-2 py-1 text-[15px] font-medium">
              O <span className="text-azul">MOBILIÁRIO</span>
            </p>
            <Link href="/catalogo" className="group foto block aspect-[4/5] lg:aspect-auto lg:flex-1">
              <Image src={servico.mobiliario.imagem} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
              <span className="absolute top-3 left-3 text-[15px] font-medium text-white drop-shadow-[0_1px_6px_rgba(0,0,0,.45)]">
                {servico.mobiliario.titulo}
              </span>
            </Link>
          </div>
          <div className="reveal flex flex-col gap-3" style={d(0.08)}>
            <p className="bg-marfim-suave px-2 py-1 text-[15px] font-medium">
              O <span className="text-azul">SERVIÇO</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {servico.etapas.map((e) => (
                <Link key={e.titulo} href="/sobre-nos#processo" className="group foto block aspect-[3/2]">
                  <Image src={e.imagem} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  <span className="absolute top-3 left-3 text-[15px] font-medium text-white drop-shadow-[0_1px_6px_rgba(0,0,0,.45)]">
                    {e.titulo}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ChamadaDupla
        titulo="Quer saber mais?"
        fantasma={{ href: "/catalogo", label: "Ver o catálogo" }}
        primario={{ href: "/fale-conosco?assunto=orcamento", label: "Solicitar orçamento" }}
      />

      {/* ------------------------------------------------------------- galeria */}
      <section className="pb-24 md:pb-32">
        <div className="shell">
          <TituloSecao
            alinhamento="esquerda"
            titulo="Ambientes entregues pela Mobiletto"
            sub="Escritórios, recepções, hotéis e restaurantes — do simples ao sofisticado."
          />
        </div>
        <div className="reveal mt-8">
          <Galeria
            fotos={galeriaHome.map((src) => ({ src, alt: "" }))}
            link={{ href: "/cases", label: "Ver todos os cases" }}
          />
        </div>
      </section>

      {/* --------------------------------------------------- destaque de prazo */}
      <section className="shell grid gap-14 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <div className="reveal">
          <h2 className="max-w-[18ch] text-h2">Do simples ao sofisticado, no prazo da sua obra.</h2>
          <p className="mt-6 max-w-[30rem] text-[22px] leading-snug text-pedra md:text-[24px]">
            Um único parceiro para projetar, fabricar e instalar. Menos fornecedores, mais controle sobre o resultado.
          </p>
          <Botao href="/fale-conosco?assunto=orcamento" variante="fantasma" className="mt-10">
            Solicitar orçamento
          </Botao>
        </div>
        <div className="reveal relative mx-auto aspect-[5/3] w-full max-w-[560px] text-azul" style={d(0.1)}>
          <span className="absolute top-0 right-0 h-[30%] w-[22%] border-t-[3px] border-r-[3px] border-azul" />
          <span className="absolute bottom-0 left-0 h-[30%] w-[22%] border-b-[3px] border-l-[3px] border-azul" />
          <p className="absolute top-0 left-[8%] text-[20px] md:text-[22px]">{destaquePrazo.rotulo}</p>
          <p className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-start">
            <span className="text-[clamp(5rem,12vw,9rem)] leading-none tracking-[-0.05em]">{destaquePrazo.valor}</span>
            <span className="mt-4 ml-3 text-[18px] md:text-[20px]">{destaquePrazo.unidade}</span>
          </p>
          <p className="absolute right-0 bottom-0 text-[16px] md:text-[18px]">{destaquePrazo.nota}</p>
        </div>
      </section>

      {/* ------------------------------------------------------------- números */}
      <section className="shell grid gap-12 py-20 md:grid-cols-3 md:gap-10 md:py-28">
        {numeros.map((n, i) => (
          <div key={n.rotulo} className="reveal text-center" style={d(i * 0.08)}>
            <p className="text-[clamp(3.5rem,6vw,5.5rem)] leading-none tracking-[-0.045em]">{n.valor}</p>
            <p className="mt-3 text-[18px]">{n.rotulo}</p>
            <div className="mt-6 border-t border-linha pt-6">
              <p className="mx-auto max-w-[28ch] text-[14px] leading-snug text-pedra">{n.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <Faq itens={faqs}>
        <Botao href="/fale-conosco">Ainda tem dúvidas? Fale conosco</Botao>
      </Faq>

      <FaixaFoto
        imagem="/images/marcenaria-ferramentas.jpg"
        titulo="Planejar é desenhar o espaço. Precisão, materialidade e organização em ambientes feitos para funcionar."
        botao={{ href: "/sobre-nos", label: "Conheça nossa história" }}
      />
    </>
  );
}
