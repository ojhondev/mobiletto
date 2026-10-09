import { redirect } from "next/navigation";

// Protótipo: o site institucional ainda não existe; a home abre direto o catálogo.
export default function Home() {
  redirect("/catalogo");
}
