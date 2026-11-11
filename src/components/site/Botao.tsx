import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Botões do design system (referência Nornorm): retângulo de cantos 6px,
 * 16px/500, padding 12×24. Só o primário é preenchido com a cor da marca;
 * o "fantasma" é contorno preto sobre branco. Sem sombra, sem gradiente.
 */
type Variante = "primario" | "fantasma" | "claro" | "contorno-claro";

const base =
  "inline-flex h-11 min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-6 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul disabled:pointer-events-none disabled:opacity-50";

const variantes: Record<Variante, string> = {
  primario: "bg-azul text-white hover:bg-azul-escuro",
  fantasma: "border border-tinta bg-white text-tinta hover:bg-tinta hover:text-white",
  claro: "border border-white bg-white text-tinta hover:bg-transparent hover:text-white",
  "contorno-claro": "border border-white/80 text-white hover:bg-white hover:text-tinta",
};

export function botaoClasses(variante: Variante = "primario", className?: string) {
  return cn(base, variantes[variante], className);
}

export function Botao({
  href,
  variante = "primario",
  className,
  children,
  externo,
}: {
  href: string;
  variante?: Variante;
  className?: string;
  children: React.ReactNode;
  externo?: boolean;
}) {
  if (externo)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={botaoClasses(variante, className)}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={botaoClasses(variante, className)}>
      {children}
    </Link>
  );
}
