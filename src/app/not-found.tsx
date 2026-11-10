import Image from "next/image";
import Link from "next/link";
import { Botao } from "@/components/site/Botao";

export default function NotFound() {
  return (
    <main className="shell flex min-h-svh flex-col items-start justify-center gap-8 py-20">
      <Link href="/">
        <Image src="/brand/mobiletto-wordmark-azul.png" alt="Mobiletto" width={1600} height={293} sizes="160px" className="h-[26px] w-auto" />
      </Link>
      <h1 className="max-w-[14ch] text-display">Esta página não existe.</h1>
      <p className="max-w-[36rem] text-lead text-pedra">O endereço pode ter mudado. Volte para o início ou fale com a nossa equipe.</p>
      <div className="flex flex-wrap gap-3">
        <Botao href="/">Ir para o início</Botao>
        <Botao href="/fale-conosco" variante="fantasma">
          Fale conosco
        </Botao>
      </div>
    </main>
  );
}
