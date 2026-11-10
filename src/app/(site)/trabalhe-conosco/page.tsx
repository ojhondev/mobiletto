import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AberturaPagina, Rotulo, TituloSecao } from "@/components/site/Blocos";
import { Botao } from "@/components/site/Botao";
import { FormCandidatura } from "@/components/site/Formularios";
import { beneficios, contato, vagas } from "@/content/site";

export const metadata: Metadata = {
  title: "Trabalhe conosco",
  description: "Vagas na Mobiletto: produção, instalação, projetos e comercial. Envie seu currículo.",
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default function TrabalheConosco() {
  return (
    <>
      <AberturaPagina
        rotulo="Trabalhe conosco"
        titulo="Construa ambientes com a gente."
        texto="Da marcenaria à instalação, do projeto ao comercial: na Mobiletto cada pessoa vê o seu trabalho virar escritório, recepção ou hotel."
        imagem="/images/carpinteiro.jpg"
      >
        <Botao href="#vagas">Ver vagas abertas</Botao>
        <Botao href="#candidatura" variante="fantasma">
          Banco de talentos
        </Botao>
      </AberturaPagina>

      <section className="bg-marfim-suave">
        <div className="shell py-20 md:py-28">
          <TituloSecao titulo="Por que a Mobiletto" sub="Um lugar sério para quem gosta de fazer bem feito." />
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b, i) => (
              <div key={b.titulo} className="reveal border-t border-tinta pt-6" style={d(i * 0.06)}>
                <p className="text-[20px]">
                  <span className="font-bold">{String(i + 1).padStart(2, "0")}.</span> {b.titulo}
                </p>
                <p className="mt-3 text-[15px] leading-snug text-pedra">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vagas" className="shell scroll-mt-24 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
          <div className="reveal">
            <h2 className="text-h1">Vagas abertas</h2>
            <p className="mt-5 max-w-[30ch] text-[16px] text-pedra">
              Não encontrou a sua? Cadastre-se no banco de talentos pelo formulário abaixo.
            </p>
          </div>
          <ul className="reveal border-b border-[#9a9a9a]">
            {vagas.map((v) => (
              <li key={v.id} className="border-t border-[#9a9a9a]">
                <a
                  href={`#candidatura?vaga=${v.id}`}
                  className="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
                >
                  <span>
                    <span className="block text-[22px] leading-tight group-hover:text-azul">{v.titulo}</span>
                    <span className="mt-1 block text-[14px] text-pedra">
                      {v.area} · {v.local} · {v.regime}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-[15px] font-medium text-azul">
                    Candidatar-se <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="candidatura" className="scroll-mt-24 bg-marfim-suave">
        <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
          <div className="reveal">
            <Rotulo>Candidatura</Rotulo>
            <h2 className="mt-5 max-w-[14ch] text-h2">Envie seu currículo.</h2>
            <p className="mt-6 max-w-[34ch] text-[16px] leading-relaxed text-pedra">
              Lemos todas as candidaturas. Se o seu perfil combinar com uma vaga, entramos em contato pelo e-mail ou
              telefone informados.
            </p>
            <p className="mt-6 text-[15px]">
              Dúvidas:{" "}
              <a href={`mailto:${contato.emailCarreiras}`} className="underline hover:text-azul">
                {contato.emailCarreiras}
              </a>
            </p>
          </div>
          <div className="reveal bg-white p-6 md:p-10" style={d(0.08)}>
            <FormCandidatura />
          </div>
        </div>
      </section>
    </>
  );
}
