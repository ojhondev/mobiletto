import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { RevealObserver } from "@/components/site/Reveal";
import { getSecoes, segmentosPublicados } from "@/lib/cms/dados";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [{ aviso, "linha.hero": linha }, segs] = await Promise.all([getSecoes("aviso", "linha.hero"), segmentosPublicados()]);
  return (
    <>
      <Header
        aviso={aviso.texto ? aviso : null}
        segmentos={segs.map((s) => ({ slug: s.slug, nome: s.nome, resumo: s.resumo, imagem: s.imagem }))}
        linhaEspecial={linha.publicada ? linha.titulo : null}
      />
      <main>{children}</main>
      <Footer />
      <RevealObserver />
    </>
  );
}
