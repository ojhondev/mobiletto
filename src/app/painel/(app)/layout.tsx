import type { Metadata } from "next";
import { exigirUsuario } from "@/lib/auth";
import { contarLeadsNovos, dataHora, mensagensNovas, ultimaPublicacao } from "@/lib/painel";
import { Shell } from "@/components/painel/Shell";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel Mobiletto" },
  robots: { index: false, follow: false },
};

export default async function PainelLayout({ children }: LayoutProps<"/painel">) {
  const usuario = await exigirUsuario();
  const [novas, leads, publicacao] = await Promise.all([mensagensNovas(), contarLeadsNovos(), ultimaPublicacao()]);
  return (
    <Shell usuario={usuario} novas={novas} leads={leads} ultimaPublicacao={publicacao ? dataHora(publicacao.em).replace(/\/\d{4}/, "") : null}>
      {children}
    </Shell>
  );
}
