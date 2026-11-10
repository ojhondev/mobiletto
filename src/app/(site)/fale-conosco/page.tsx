import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Faq, Rotulo } from "@/components/site/Blocos";
import { FormContato } from "@/components/site/Formularios";
import { getSecoes, linkWhatsapp, segmentosPublicados } from "@/lib/cms/dados";

export const metadata: Metadata = {
  title: "Fale conosco",
  description: "Solicite um orçamento ou um projeto de mobiliário corporativo. Fale com a equipe da Mobiletto.",
};

export default async function FaleConosco() {
  const [s, segs] = await Promise.all([getSecoes("fale.abertura", "contato", "home.faq"), segmentosPublicados()]);
  const ab = s["fale.abertura"];
  const contato = s.contato;
  const canais = [
    { icone: MessageCircle, rotulo: "WhatsApp", valor: contato.whatsappLabel, href: linkWhatsapp(contato.whatsapp, contato.mensagemWhatsapp) },
    { icone: Mail, rotulo: "E-mail", valor: contato.email, href: `mailto:${contato.email}` },
    { icone: Phone, rotulo: "Telefone", valor: contato.telefone, href: `tel:${contato.telefone.replace(/\D/g, "")}` },
    { icone: MapPin, rotulo: "Fábrica e showroom", valor: [contato.endereco, contato.cidade].filter(Boolean).join(" · ") },
    { icone: Clock, rotulo: "Horário", valor: contato.horario },
  ].filter((c) => c.valor);

  return (
    <>
      <section className="shell grid gap-14 pt-14 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
        <div className="entra">
          <Rotulo>{ab.rotulo}</Rotulo>
          <h1 className="mt-5 max-w-[12ch] text-display">{ab.titulo}</h1>
          <p className="mt-7 max-w-[34rem] text-lead text-pedra">{ab.texto}</p>
          <ul className="mt-12 border-t border-linha">
            {canais.map(({ icone: Icone, rotulo, valor, href }) => (
              <li key={rotulo} className="border-b border-linha">
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group grid grid-cols-[28px_1fr] gap-3 py-4">
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
        <div className="entra bg-marfim-suave p-6 md:p-10" style={{ "--d": ".1s" } as React.CSSProperties}>
          <h2 className="text-h3">{ab.formTitulo}</h2>
          <p className="mt-2 mb-8 text-[15px] text-pedra">{ab.formTexto}</p>
          <FormContato segmentos={segs.map((x) => ({ slug: x.slug, nome: x.nome }))} sucesso={ab.sucesso} />
        </div>
      </section>
      <Faq titulo={s["home.faq"].titulo} itens={s["home.faq"].itens} />
    </>
  );
}
