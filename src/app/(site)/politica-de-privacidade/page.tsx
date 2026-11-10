import type { Metadata } from "next";
import { Rotulo } from "@/components/site/Blocos";
import { getSecoes } from "@/lib/cms/dados";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a Mobiletto trata os dados pessoais enviados pelo site.",
};

export default async function Privacidade() {
  const { privacidade: p, contato } = await getSecoes("privacidade", "contato");
  return (
    <section className="shell grid gap-12 pt-14 pb-24 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
      <div>
        <Rotulo>Privacidade</Rotulo>
        <h1 className="mt-5 max-w-[12ch] text-h1">{p.titulo}</h1>
      </div>
      <div className="grid max-w-[44rem] gap-10">
        {p.secoes.map((s, i) => (
          <div key={s.t + i}>
            <h2 className="text-[22px]">{s.t}</h2>
            <p className="mt-3 text-[16px] leading-relaxed whitespace-pre-line text-pedra">{s.p}</p>
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
