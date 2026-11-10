import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mobiletto.com.br"),
  title: {
    default: "Mobiletto · Mobiliário corporativo sob medida",
    template: "%s · Mobiletto",
  },
  description:
    "Mobiliário corporativo para escritórios, empresas, recepções, hotéis e restaurantes. Projeto, fabricação própria e instalação — do simples ao sofisticado.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Mobiletto",
    images: ["/brand/mobiletto-assinatura-azul.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1d344b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} h-full`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
