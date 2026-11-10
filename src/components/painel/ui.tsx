import Link from "next/link";
import { cn } from "@/lib/utils";

/** Peças visuais do painel (servidor ou cliente). */

export const btn = {
  base: "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50",
  primario: "bg-azul text-white hover:bg-azul-escuro",
  secundario: "border border-[#dcdad4] bg-white text-tinta hover:bg-[#f3f2ee]",
  perigo: "border border-[#f0d4cf] bg-white text-[#a12a1b] hover:bg-[#fbeeec]",
  fantasma: "text-tinta hover:bg-[#efeeea]",
  icone: "inline-flex size-9 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-[#efeeea] hover:text-tinta disabled:opacity-30",
};
export const cls = (v: keyof typeof btn = "primario", extra?: string) => cn(btn.base, btn[v], extra);

export function Cabecalho({
  titulo,
  descricao,
  voltar,
  children,
}: {
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  voltar?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {voltar && (
          <Link href={voltar.href} className="mb-2 inline-flex text-[13px] text-pedra hover:text-tinta">
            ← {voltar.label}
          </Link>
        )}
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em]">{titulo}</h1>
        {descricao && <p className="mt-1.5 max-w-[60ch] text-[14.5px] text-pedra">{descricao}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function Cartao({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-xl border border-[#e7e5e0] bg-white", className)}>{children}</div>;
}

export function Selo({ cor = "cinza", children }: { cor?: "cinza" | "verde" | "azul" | "amarelo" | "vermelho"; children: React.ReactNode }) {
  const cores = {
    cinza: "bg-[#f0efeb] text-[#555]",
    verde: "bg-[#e6f4ea] text-[#1e6b34]",
    azul: "bg-[#e7edf4] text-azul",
    amarelo: "bg-[#fdf3dc] text-[#8a5a00]",
    vermelho: "bg-[#fbeeec] text-[#a12a1b]",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap", cores[cor])}>{children}</span>;
}

export function Vazio({ titulo, texto, children }: { titulo: string; texto?: string; children?: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-[#d9d7d0] bg-white px-6 py-16 text-center">
      <p className="text-[17px] font-medium">{titulo}</p>
      {texto && <p className="mt-1 max-w-[44ch] text-[14px] text-pedra">{texto}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
