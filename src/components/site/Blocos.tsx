import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Botao } from "./Botao";
import { cn } from "@/lib/utils";

/** Cabeçalho de seção centralizado (padrão da referência): título 48px + subtítulo cinza. */
export function TituloSecao({
  titulo,
  sub,
  alinhamento = "centro",
  className,
}: {
  titulo: React.ReactNode;
  sub?: React.ReactNode;
  alinhamento?: "centro" | "esquerda";
  className?: string;
}) {
  return (
    <div className={cn("reveal", alinhamento === "centro" ? "mx-auto max-w-[56rem] text-center" : "max-w-[48rem]", className)}>
      <h2 className="text-h2">{titulo}</h2>
      {sub && <p className="mt-4 text-lead text-pedra">{sub}</p>}
    </div>
  );
}

/** Rótulo pequeno acima de títulos internos. */
export function Rotulo({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[14px] font-medium text-azul", className)}>{children}</p>;
}

/** Abertura das páginas internas: título grande à esquerda, texto e foto. */
export function AberturaPagina({
  rotulo,
  titulo,
  texto,
  imagem,
  children,
}: {
  rotulo: string;
  titulo: React.ReactNode;
  texto: React.ReactNode;
  imagem?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="shell pt-14 pb-16 md:pt-20 md:pb-24">
      <div className={cn("grid gap-10", imagem && "lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-16")}>
        <div className="reveal">
          <Rotulo>{rotulo}</Rotulo>
          <h1 className="mt-5 max-w-[16ch] text-display">{titulo}</h1>
          <p className="mt-7 max-w-[38rem] text-lead text-pedra">{texto}</p>
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
        {imagem && (
          <div className="foto reveal aspect-[4/3]" style={{ "--d": ".1s" } as React.CSSProperties}>
            <Image src={imagem} alt="" fill priority sizes="(min-width:1024px) 48vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

/** Faixa escura full-bleed com foto (fechamento das páginas, como na referência). */
export function FaixaFoto({
  imagem,
  titulo,
  botao,
}: {
  imagem: string;
  titulo: React.ReactNode;
  botao?: { href: string; label: string };
}) {
  return (
    <section className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-tinta text-white md:min-h-[620px]">
      <Image src={imagem} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/45 to-black/10" />
      <div className="shell py-20">
        <p className="reveal max-w-[22ch] text-h2">{titulo}</p>
        {botao && (
          <div className="reveal mt-12" style={{ "--d": ".1s" } as React.CSSProperties}>
            <Botao href={botao.href} variante="claro">
              {botao.label}
            </Botao>
          </div>
        )}
      </div>
    </section>
  );
}

/** Perguntas frequentes: título à esquerda, lista à direita (details/summary, sem JS). */
export function Faq({
  titulo = "Perguntas frequentes",
  itens,
  children,
}: {
  titulo?: string;
  itens: { p: string; r: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="shell py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
        <h2 className="reveal text-h1">{titulo}</h2>
        <div className="reveal">
          <div className="border-b border-[#9a9a9a]">
            {itens.map((f) => (
              <details key={f.p} className="faq border-t border-[#9a9a9a]">
                <summary className="flex items-center justify-between gap-6 py-5 text-[17px] md:text-[18px]">
                  {f.p}
                  <ChevronDown className="tri size-5 shrink-0 fill-tinta" strokeWidth={0} />
                </summary>
                <p className="max-w-[60ch] pb-6 text-[16px] leading-relaxed text-pedra">{f.r}</p>
              </details>
            ))}
          </div>
          {children && <div className="mt-10">{children}</div>}
        </div>
      </div>
    </section>
  );
}

/** Chamada centralizada com o par de botões (primário + fantasma). */
export function ChamadaDupla({
  titulo,
  primario,
  fantasma,
}: {
  titulo: React.ReactNode;
  primario: { href: string; label: string };
  fantasma: { href: string; label: string };
}) {
  return (
    <section className="shell py-20 text-center md:py-28">
      <h2 className="reveal text-h2">{titulo}</h2>
      <div className="reveal mt-9 flex flex-wrap justify-center gap-3" style={{ "--d": ".08s" } as React.CSSProperties}>
        <Botao href={fantasma.href} variante="fantasma">
          {fantasma.label}
        </Botao>
        <Botao href={primario.href}>{primario.label}</Botao>
      </div>
    </section>
  );
}
