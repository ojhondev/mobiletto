import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Faq, Rotulo } from "@/components/site/Blocos";
import { FormContato } from "@/components/site/Formularios";
import { contato, faqs, whatsappUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Fale conosco",
  description: "Solicite um orçamento ou um projeto de mobiliário corporativo. Fale com a equipe da Mobiletto.",
};

export default function FaleConosco() {
  const canais = [
    { icone: MessageCircle, rotulo: "WhatsApp", valor: contato.whatsappLabel, href: whatsappUrl() },
    { icone: Mail, rotulo: "E-mail", valor: contato.email, href: `mailto:${contato.email}` },
    { icone: Phone, rotulo: "Telefone", valor: contato.telefone, href: `tel:${contato.telefone.replace(/\D/g, "")}` },
    { icone: MapPin, rotulo: "Fábrica e showroom", valor: `${contato.endereco} · ${contato.cidade}` },
    { icone: Clock, rotulo: "Horário", valor: contato.horario },
  ];
  return (
    <>
      <section className="shell grid gap-14 pt-14 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
        <div className="reveal">
          <Rotulo>Fale conosco</Rotulo>
          <h1 className="mt-5 max-w-[12ch] text-display">Vamos falar do seu espaço.</h1>
          <p className="mt-7 max-w-[34rem] text-lead text-pedra">
            Orçamentos, projetos, material técnico ou pós-venda. Conte o que você precisa e nossa equipe retorna em até 1
            dia útil.
          </p>
          <ul className="mt-12 border-t border-linha">
            {canais.map(({ icone: Icone, rotulo, valor, href }) => (
              <li key={rotulo} className="border-b border-linha">
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[28px_1fr] gap-3 py-4"
                  >
                    <Icone className="mt-0.5 size-5 text-azul" strokeWidth={1.5} />
                    <span>
                      <span className="block text-[13px] text-pedra">{rotulo}</span>
                      <span className="block text-[17px] group-hover:text-azul">{valor}</span>
                    </span>
                  </a>
                ) : (
                  <div className="grid grid-cols-[28px_1fr] gap-3 py-4">
                    <Icone className="mt-0.5 size-5 text-azul" strokeWidth={1.5} />
                    <span>
                      <span className="block text-[13px] text-pedra">{rotulo}</span>
                      <span className="block text-[17px]">{valor}</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal bg-marfim-suave p-6 md:p-10" style={{ "--d": ".08s" } as React.CSSProperties}>
          <h2 className="text-h3">Envie sua mensagem</h2>
          <p className="mt-2 mb-8 text-[15px] text-pedra">Respondemos pelo e-mail ou WhatsApp que você informar.</p>
          <FormContato />
        </div>
      </section>
      <Faq itens={faqs} />
    </>
  );
}
