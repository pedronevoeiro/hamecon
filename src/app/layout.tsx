import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hamecon | Brindes Corporativos Personalizados",
    template: "%s | Hamecon",
  },
  description:
    "Brindes corporativos personalizados com a sua marca. Canecas, camisetas, cadernos, mochilas, garrafas térmicas e muito mais. Solicite seu orçamento sem compromisso.",
  keywords: [
    "brindes corporativos",
    "brindes personalizados",
    "brindes empresa",
    "brinde promocional",
    "caneca personalizada",
    "camiseta corporativa",
    "caderno personalizado",
    "mochila corporativa",
    "garrafa termica personalizada",
    "pen drive personalizado",
    "kit executivo",
    "brindes sustentaveis",
    "brinde com logo",
    "presente corporativo",
  ],
  authors: [{ name: "Hamecon" }],
  creator: "Hamecon",
  metadataBase: new URL("https://hamecon.com.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://hamecon.com.br",
    siteName: "Hamecon",
    title: "Hamecon | Brindes Corporativos Personalizados",
    description:
      "Brindes corporativos personalizados com a sua marca. Solicite seu orçamento sem compromisso.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hamecon - Brindes Corporativos Personalizados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamecon | Brindes Corporativos Personalizados",
    description:
      "Brindes corporativos personalizados com a sua marca. Solicite seu orçamento.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://hamecon.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
