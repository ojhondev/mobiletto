import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { getSecao } from "@/lib/cms/dados";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

/** Só para a assinatura "Desenvolvido por @devjhon" no rodapé. */
const mono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSecao("seo");
  return {
    metadataBase: new URL("https://www.mobiletto.com.br"),
    title: { default: seo.titulo, template: "%s · Mobiletto" },
    description: seo.descricao,
    openGraph: { type: "website", locale: "pt_BR", siteName: "Mobiletto", images: seo.imagem ? [seo.imagem] : [] },
  };
}

export const viewport: Viewport = {
  themeColor: "#1d344b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable} h-full`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
