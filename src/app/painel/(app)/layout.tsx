import type { Metadata } from "next";
import { exigirUsuario } from "@/lib/auth";
import { mensagensNovas } from "@/lib/painel";
import { Shell } from "@/components/painel/Shell";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel Mobiletto" },
  robots: { index: false, follow: false },
};

export default async function PainelLayout({ children }: LayoutProps<"/painel">) {
  const usuario = await exigirUsuario();
  const novas = await mensagensNovas();
  return (
    <Shell usuario={usuario} novas={novas}>
      {children}
    </Shell>
  );
}
