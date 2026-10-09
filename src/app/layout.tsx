import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mobiletto",
  description: "Móveis para projetos. Venda exclusiva para empresas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", display.variable, sans.variable, mono.variable, "font-sans", geist.variable)}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
