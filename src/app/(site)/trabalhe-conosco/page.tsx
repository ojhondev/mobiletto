import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AberturaPagina, Rotulo, TituloSecao } from "@/components/site/Blocos";
import { Botao } from "@/components/site/Botao";
import { FormCandidatura } from "@/components/site/Formularios";
import { getSecoes, vagasPublicadas } from "@/lib/cms/dados";

export const metadata: Metadata = {
  title: "Trabalhe conosco",
  description: "Vagas na Mobiletto: produção, instalação, projetos e comercial. Envie seu currículo.",
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default async function TrabalheConosco() {
  const [s, vagas] = await Promise.all([getSecoes("trabalhe.abertura", "trabalhe.beneficios", "trabalhe.candidatura", "contato"), vagasPublicadas()]);
  const ab = s["trabalhe.abertura"];
  const ben = s["trabalhe.beneficios"];
  const cand = s["trabalhe.candidatura"];

  return (
    <>
      <AberturaPagina rotulo={ab.rotulo} titulo={ab.titulo} texto={ab.texto} imagem={ab.imagem || undefined}>
        <Botao href={vagas.length ? "#vagas" : "#candidatura"}>{vagas.length ? "Ver vagas abertas" : "Enviar currículo"}</Botao>
        <Botao href="#candidatura" variante="fantasma">
          Banco de talentos
        </Botao>
      </AberturaPagina>

      {ben.itens.length > 0 && (
        <section className="bg-marfim-suave">
          <div className="shell py-20 md:py-28">
            <TituloSecao titulo={ben.titulo} sub={ben.texto} />
            <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {ben.itens.map((b, i) => (
                <div key={b.titulo + i} className="reveal border-t border-tinta pt-6" style={d(i * 0.08)}>
                  <p className="text-[20px]">
                    <span className="font-bold">{String(i + 1).padStart(2, "0")}.</span> {b.titulo}
                  </p>
                  <p className="mt-3 text-[15px] leading-snug text-pedra">{b.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="vagas" className="shell scroll-mt-24 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
          <div className="reveal">
            <h2 className="text-h1">{cand.vagasTitulo}</h2>
            <p className="mt-5 max-w-[30ch] text-[16px] text-pedra">{cand.vagasTexto}</p>
          </div>
          {vagas.length > 0 ? (
            <ul className="reveal border-b border-[#9a9a9a]">
              {vagas.map((v) => (
                <li key={v.id} className="border-t border-[#9a9a9a]">
                  <a href={`#candidatura?vaga=${v.slug}`} className="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                    <span>
                      <span className="block text-[22px] leading-tight transition-colors group-hover:text-azul">{v.titulo}</span>
                      <span className="mt-1 block text-[14px] text-pedra">{[v.area, v.local, v.regime].filter(Boolean).join(" · ")}</span>
                      {v.descricao && <span className="mt-2 block max-w-[60ch] text-[15px] text-pedra">{v.descricao}</span>}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[15px] font-medium text-azul">
                      Candidatar-se <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="reveal self-center text-lead text-pedra">No momento não há vagas abertas — cadastre-se no banco de talentos.</p>
          )}
        </div>
      </section>

      <section id="candidatura" className="scroll-mt-24 bg-marfim-suave">
        <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
          <div className="reveal">
            <Rotulo>Candidatura</Rotulo>
            <h2 className="mt-5 max-w-[14ch] text-h2">{cand.titulo}</h2>
            <p className="mt-6 max-w-[34ch] text-[16px] leading-relaxed text-pedra">{cand.texto}</p>
            <p className="mt-6 text-[15px]">
              Dúvidas:{" "}
              <a href={`mailto:${s.contato.emailCarreiras}`} className="underline hover:text-azul">
                {s.contato.emailCarreiras}
              </a>
            </p>
          </div>
          <div className="reveal bg-white p-6 md:p-10" style={d(0.08)}>
            <FormCandidatura vagas={vagas.map((v) => ({ slug: v.slug, titulo: v.titulo }))} />
          </div>
        </div>
      </section>
    </>
  );
}
