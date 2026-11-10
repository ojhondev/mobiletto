import type { Metadata } from "next";
import { Rotulo } from "@/components/site/Blocos";
import { contato } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a Mobiletto trata os dados pessoais enviados pelo site.",
};

// confirmar: texto-base; revisar com o jurídico/DPO da Mobiletto antes de publicar
const secoes = [
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
];

export default function Privacidade() {
  return (
    <section className="shell grid gap-12 pt-14 pb-24 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
      <div>
        <Rotulo>Privacidade</Rotulo>
        <h1 className="mt-5 max-w-[12ch] text-h1">Política de privacidade</h1>
      </div>
      <div className="grid max-w-[44rem] gap-10">
        {secoes.map((s) => (
          <div key={s.t}>
            <h2 className="text-[22px]">{s.t}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-pedra">{s.p}</p>
          </div>
        ))}
        <div>
          <h2 className="text-[22px]">Contato</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-pedra">
            Para exercer seus direitos ou tirar dúvidas, escreva para{" "}
            <a href={`mailto:${contato.email}`} className="text-tinta underline">
              {contato.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
