import Image from "next/image";
import Link from "next/link";
import { Botao } from "@/components/site/Botao";
import { ChamadaDupla, FaixaFoto, Faq, TituloSecao } from "@/components/site/Blocos";
import { Galeria } from "@/components/site/Galeria";
import { Contador, Marquee } from "@/components/site/Movimento";
import { getSecoes } from "@/lib/cms/dados";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default async function Home() {
  const s = await getSecoes(
    "home.hero",
    "home.faixa",
    "home.diferenciais",
    "home.servico",
    "home.galeria",
    "home.prazo",
    "home.numeros",
    "home.faq",
    "home.faixaFinal",
  );
  const hero = s["home.hero"];
  const dif = s["home.diferenciais"];
  const serv = s["home.servico"];
  const gal = s["home.galeria"];
  const prazo = s["home.prazo"];
  const ehWebm = (u: string) => u.endsWith(".webm");

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate flex h-[calc(100svh-40px)] max-h-[980px] min-h-[640px] items-center justify-center overflow-hidden bg-tinta text-white">
        {hero.video ? (
          <video
            key={hero.video}
            className="absolute inset-0 -z-10 size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={hero.poster || undefined}
            aria-hidden
          >
            {/* o vídeo original tem versão WebM mais leve; vídeos enviados pelo painel tocam como vieram */}
            {hero.video === "/video/hero.mp4" && <source src="/video/hero.webm" type="video/webm" />}
            <source src={hero.video} type={ehWebm(hero.video) ? "video/webm" : "video/mp4"} />
          </video>
        ) : (
          hero.poster && <Image src={hero.poster} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        )}
        {/* camada preta para a copy ter contraste sobre o vídeo claro */}
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.35),transparent_70%)]" />
        <div className="shell pb-16 text-center">
          <h1 className="entra mx-auto max-w-[17ch] text-h1">{hero.titulo}</h1>
          <p className="entra mx-auto mt-6 max-w-[40rem] text-lead text-white/90" style={d(0.12)}>
            {hero.texto}
          </p>
          <div className="entra mt-10 flex flex-wrap justify-center gap-3" style={d(0.24)}>
            {hero.botaoPrimario && <Botao href={hero.linkPrimario || "/fale-conosco"}>{hero.botaoPrimario}</Botao>}
            {hero.botaoSecundario && (
              <Botao href={hero.linkSecundario || "#solucoes"} variante="claro">
                {hero.botaoSecundario}
              </Botao>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------- faixa de segmentos em loop (cartão) */}
      <section className="shell relative z-10 -mt-[88px]">
        <div className="reveal bg-white py-9">
          <p className="px-6 text-center text-[19px] md:text-[21px]">{s["home.faixa"].titulo}</p>
          <div className="mt-7">
            <Marquee itens={s["home.faixa"].itens} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- por que a Mobiletto */}
      <section id="solucoes" className="shell scroll-mt-24 pt-24 pb-20 md:pt-32 md:pb-28">
        <TituloSecao titulo={dif.titulo} sub={dif.texto} />
        <div className="mt-14 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {dif.itens.map((item, i) => (
            <article key={item.titulo + i} className="reveal" style={d(i * 0.08)}>
              <div className="foto aspect-[4/3]">
                {item.imagem && (
                  <Image
                    src={item.imagem}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw"
                    className="object-cover brightness-[1.08] contrast-[0.92] grayscale"
                  />
                )}
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
        {dif.botao && (
          <div className="reveal mt-14 text-center">
            <Botao href="/sobre-nos">{dif.botao}</Botao>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ projeto, fábrica e obra */}
      <section className="shell pb-6">
        <h2 className="reveal text-h1">{serv.titulo}</h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_2fr]">
          <div className="reveal flex flex-col gap-3">
            <p className="bg-marfim-suave px-2 py-1 text-[15px] font-medium">
              O <span className="text-azul">MOBILIÁRIO</span>
            </p>
            <Link href="/catalogo" className="group foto foto-texto block aspect-[4/5] lg:aspect-auto lg:flex-1">
              {serv.mobiliarioImagem && (
                <Image src={serv.mobiliarioImagem} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
              )}
              <span className="legenda top-3 left-3 text-[15px] font-medium text-white">{serv.mobiliarioTitulo}</span>
              <span className="legenda bottom-3 left-3 translate-y-2 text-[14px] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Ver catálogo →
              </span>
            </Link>
          </div>
          <div className="reveal flex flex-col gap-3" style={d(0.1)}>
            <p className="bg-marfim-suave px-2 py-1 text-[15px] font-medium">
              O <span className="text-azul">SERVIÇO</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {serv.etapas.map((e, i) => (
                <Link key={e.titulo + i} href="/sobre-nos#processo" className="group foto foto-texto block aspect-[3/2]" style={d(0.1 + i * 0.08)}>
                  {e.imagem && (
                    <Image src={e.imagem} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  )}
                  <span className="legenda top-3 left-3 text-[15px] font-medium text-white">{e.titulo}</span>
                  <span className="legenda bottom-3 left-3 translate-y-2 text-[14px] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Como trabalhamos →
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
      {gal.fotos.length > 0 && (
        <section className="pb-24 md:pb-32">
          <div className="shell">
            <TituloSecao alinhamento="esquerda" titulo={gal.titulo} sub={gal.texto} />
          </div>
          <div className="reveal mt-8">
            <Galeria fotos={gal.fotos.map((src) => ({ src, alt: "" }))} link={{ href: "/cases", label: "Ver todos os cases" }} />
          </div>
        </section>
      )}

      {/* --------------------------------------------------- destaque de prazo */}
      <section className="shell grid gap-14 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <div className="reveal">
          <h2 className="max-w-[18ch] text-h2">{prazo.titulo}</h2>
          <p className="mt-6 max-w-[30rem] text-[22px] leading-snug text-pedra md:text-[24px]">{prazo.texto}</p>
          <Botao href="/fale-conosco?assunto=orcamento" variante="fantasma" className="mt-10">
            Solicitar orçamento
          </Botao>
        </div>
        <div className="reveal relative mx-auto aspect-[5/3] w-full max-w-[560px] text-azul" style={d(0.1)}>
          <span className="canto-a absolute top-0 right-0 h-[30%] w-[22%] border-t-[3px] border-r-[3px] border-azul" />
          <span className="canto-b absolute bottom-0 left-0 h-[30%] w-[22%] border-b-[3px] border-l-[3px] border-azul" />
          <p className="absolute top-0 left-[8%] text-[20px] md:text-[22px]">{prazo.rotulo}</p>
          <p className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-start">
            <Contador valor={prazo.valor} className="text-[clamp(5rem,12vw,9rem)] leading-none tracking-[-0.05em]" />
            <span className="mt-4 ml-3 text-[18px] md:text-[20px]">{prazo.unidade}</span>
          </p>
          <p className="absolute right-0 bottom-0 text-[16px] md:text-[18px]">{prazo.nota}</p>
        </div>
      </section>

      {/* ------------------------------------------------------------- números */}
      <section className="shell grid gap-12 py-20 md:grid-cols-3 md:gap-10 md:py-28">
        {s["home.numeros"].itens.map((n, i) => (
          <div key={n.rotulo + i} className="reveal text-center" style={d(i * 0.1)}>
            <Contador valor={n.valor} className="block text-[clamp(3.5rem,6vw,5.5rem)] leading-none tracking-[-0.045em]" />
            <p className="mt-3 text-[18px]">{n.rotulo}</p>
            <div className="mt-6 border-t border-linha pt-6">
              <p className="mx-auto max-w-[28ch] text-[14px] leading-snug text-pedra">{n.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <Faq titulo={s["home.faq"].titulo} itens={s["home.faq"].itens}>
        <Botao href="/fale-conosco">Ainda tem dúvidas? Fale conosco</Botao>
      </Faq>

      <FaixaFoto
        imagem={s["home.faixaFinal"].imagem}
        titulo={s["home.faixaFinal"].titulo}
        botao={s["home.faixaFinal"].botao ? { href: s["home.faixaFinal"].link || "/sobre-nos", label: s["home.faixaFinal"].botao } : undefined}
      />
    </>
  );
}
