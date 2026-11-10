import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Cartão de produto (catálogo e relacionados): foto com overlay azul no hover e link para a página do produto. */
export function CartaoProduto({
  slug,
  nome,
  resumo,
  imagem,
  grande,
  delay = 0,
}: {
  slug: string;
  nome: string;
  resumo?: string;
  imagem?: string;
  grande?: boolean;
  delay?: number;
}) {
  return (
    <Link href={`/catalogo/${slug}`} className="group reveal block" style={{ "--d": `${delay}s` } as React.CSSProperties}>
      <div className={`foto foto-hover bg-marfim-suave ${grande ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]"}`}>
        {imagem && (
          <Image
            src={imagem}
            alt={nome}
            fill
            sizes={grande ? "100vw" : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"}
            className="object-cover"
          />
        )}
        <span className="legenda bottom-4 left-4 inline-flex translate-y-2 items-center gap-2 rounded-[6px] bg-white px-4 py-2 text-[14px] font-medium text-tinta opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Ver detalhes <ArrowRight className="size-4" strokeWidth={1.6} />
        </span>
      </div>
      <p className="mt-3 text-[17px] leading-tight transition-colors group-hover:text-azul">{nome}</p>
      {resumo && <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-pedra">{resumo}</p>}
    </Link>
  );
}
