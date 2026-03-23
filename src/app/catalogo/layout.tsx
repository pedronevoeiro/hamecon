import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
  description:
    "Confira nosso catálogo com mais de 433 produtos personalizados. Canetas, mochilas, cadernos, garrafas e muito mais com personalização inclusa.",
  openGraph: {
    title: "Catálogo de Produtos | Hamecon",
    description:
      "433+ produtos com personalização inclusa. Confira preços e solicite seu orçamento.",
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
