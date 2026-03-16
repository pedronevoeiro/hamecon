import Image from "next/image";
import {
  Gift,
  Building2,
  Users,
  Award,
  Package,
  Send,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteForm } from "@/components/quote-form";

const products = [
  { name: "Canecas", desc: "Cerâmica, porcelana e magic mug com gravação UV ou sublimação total", image: "/images/caneca-tim.jpg", brand: "TIM" },
  { name: "Camisetas & Polos", desc: "Algodão, dry-fit e piquet com bordado ou serigrafia de alta definição", image: "/images/camiseta-xp.jpg", brand: "XP" },
  { name: "Cadernos & Agendas", desc: "Capa dura, couro sintético ou reciclado com logo em hot stamping", image: "/images/caderno-scansource.jpg", brand: "ScanSource" },
  { name: "Canetas", desc: "Metal, plástico e bambu com gravação a laser ou impressão tampográfica", image: "/images/caneta-sicoob-v3.jpg", brand: "Sicoob" },
  { name: "Mochilas & Bolsas", desc: "Executivas, esportivas e ecobags com bordado ou silk screen", image: "/images/mochila-bradesco.jpg", brand: "Bradesco" },
  { name: "Garrafas Térmicas", desc: "Inox, alumínio e plástico BPA-free com gravação a laser premium", image: "/images/garrafa-nubank-v2.jpg", brand: "Nubank" },
  { name: "Pen Drives", desc: "Diversos formatos e capacidades com personalização full color", image: "/images/pendrive-natura.jpg", brand: "Natura" },
  { name: "Ecobags", desc: "Algodão cru, TNT e nylon reciclado com estampa em serigrafia", image: "/images/ecobag-natura.jpg", brand: "Natura" },
];

const stats = [
  { value: "500+", label: "Empresas Atendidas" },
  { value: "50k+", label: "Brindes Entregues" },
  { value: "98%", label: "Clientes Satisfeitos" },
  { value: "24h", label: "Resposta ao Orçamento" },
];

export default function Home() {
  return (
    <>
      <JsonLd />

      {/* Hero - sem imagem de fundo */}
      <section className="relative overflow-hidden bg-[#1e4c36]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Gift className="h-4 w-4" />
              Brindes que marcam presença
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Brindes corporativos{" "}
              <span className="text-emerald-300">
                personalizados
              </span>{" "}
              com a sua marca
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
              Fortaleça o relacionamento com clientes e colaboradores.
              Canecas, camisetas, cadernos, mochilas e centenas de opções
              personalizadas com o logo da sua empresa.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white px-8 text-lg text-[#1e4c36] hover:bg-gray-100"
              >
                <a href="#orcamento">
                  <Send className="mr-2 h-5 w-5" />
                  Solicitar Orçamento
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white bg-transparent px-8 text-lg text-white hover:bg-white/10">
                <a href="#produtos">Ver Produtos</a>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70 sm:gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                Sem pedido mínimo
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                Entrega Brasil todo
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                Orçamento em 24h
              </div>
            </div>

            {/* Showcase mini product previews */}
            <div className="mt-14 grid grid-cols-4 gap-3 sm:gap-4 mx-auto max-w-lg">
              {products.slice(0, 4).map((p) => (
                <div key={p.name} className="relative aspect-square overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-white py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-[#1e4c36]">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products with real images */}
      <section id="produtos" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Nossos Produtos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Confira algumas das opções mais procuradas por empresas de todos os tamanhos
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card
                key={product.name}
                className="group overflow-hidden border border-gray-100 shadow-sm transition-all hover:border-[#1e4c36]/30 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={`${product.name} personalizado - ${product.brand}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-[#1e4c36] px-3 py-1 text-[11px] font-semibold text-white shadow">
                    Ex: {product.brand}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{product.desc}</p>
                  <a
                    href="#orcamento"
                    className="mt-3 inline-flex items-center text-sm font-medium text-[#1e4c36] transition-colors hover:text-[#163a29]"
                  >
                    Solicitar orçamento →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className="bg-[#1e4c36] px-8 hover:bg-[#163a29]">
              <a href="#orcamento">
                <Send className="mr-2 h-5 w-5" />
                Solicitar Orçamento para Estes Produtos
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Como funciona
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Em 4 passos simples, seus brindes personalizados estão prontos
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                icon: Send,
                step: "1",
                title: "Solicite o orçamento",
                desc: "Preencha o formulário com os produtos desejados e quantidade estimada.",
              },
              {
                icon: Users,
                step: "2",
                title: "Consultoria gratuita",
                desc: "Nossa equipe entra em contato para entender suas necessidades e sugerir as melhores opções.",
              },
              {
                icon: Award,
                step: "3",
                title: "Aprovação da arte",
                desc: "Criamos mockups personalizados com sua marca para aprovação antes da produção.",
              },
              {
                icon: Package,
                step: "4",
                title: "Entrega garantida",
                desc: "Produzimos e entregamos seus brindes no prazo combinado em qualquer lugar do Brasil.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-[#1e4c36] text-sm font-bold text-white">
                  {item.step}
                </div>
                <div className="mb-4 mt-2 inline-flex rounded-xl bg-[#1e4c36]/10 p-3">
                  <item.icon className="h-6 w-6 text-[#1e4c36]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className="bg-[#1e4c36] px-8 hover:bg-[#163a29]">
              <a href="#orcamento">
                <Send className="mr-2 h-5 w-5" />
                Começar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="sobre" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Por que escolher a Hamecon?
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Somos especialistas em brindes corporativos personalizados.
                Trabalhamos com as melhores marcas e fornecedores para
                garantir qualidade e pontualidade em cada entrega.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Personalização de alta qualidade",
                  "Entrega para todo o Brasil",
                  "Atendimento consultivo",
                  "Orçamento sem compromisso",
                  "Mockup digital gratuito",
                  "Garantia de satisfação",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-[#1e4c36]" />
                    <span className="text-sm text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "Eventos Corporativos", desc: "Feiras, convenções e lançamentos" },
                { icon: Users, label: "Endomarketing", desc: "Motivação e integração de equipes" },
                { icon: Gift, label: "Datas Especiais", desc: "Natal, aniversários e comemorações" },
                { icon: Award, label: "Premiações", desc: "Reconhecimento de metas e resultados" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 p-5 shadow-sm">
                  <item.icon className="h-8 w-8 text-[#1e4c36]" />
                  <h3 className="mt-3 font-semibold text-gray-900">{item.label}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-[#1e4c36] px-8 hover:bg-[#163a29]">
                <a href="#orcamento">
                  <Send className="mr-2 h-5 w-5" />
                  Fale com um Consultor
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="orcamento" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Solicite seu orçamento
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Preencha o formulário abaixo e receba uma proposta personalizada em até 24 horas
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <QuoteForm products={products.map((p) => p.name)} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1e4c36] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Pronto para fortalecer sua marca?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Solicite agora um orçamento sem compromisso e surpreenda seus clientes e colaboradores com brindes de qualidade.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-white px-8 text-lg text-[#1e4c36] hover:bg-gray-100"
          >
            <a href="#orcamento">
              <Send className="mr-2 h-5 w-5" />
              Solicitar Orçamento Gratuito
            </a>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqData.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200">
                <summary className="flex cursor-pointer items-center justify-between p-5 text-left font-medium text-gray-900">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-gray-600">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="mb-4 text-gray-500">Ainda tem dúvidas? Fale diretamente com a nossa equipe.</p>
            <Button asChild size="lg" className="bg-[#1e4c36] px-8 hover:bg-[#163a29]">
              <a href="#orcamento">
                <Send className="mr-2 h-5 w-5" />
                Solicitar Orçamento Gratuito
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

const faqData = [
  {
    q: "Qual o pedido mínimo?",
    a: "Trabalhamos com flexibilidade. O pedido mínimo varia de acordo com o produto e tipo de personalização. Entre em contato para saber mais sobre o produto de seu interesse.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "Trabalhamos para atender a necessidade de cada cliente. O prazo varia conforme o produto, quantidade e tipo de personalização, mas nos adaptamos para cumprir o seu cronograma. Informamos o prazo exato no orçamento.",
  },
  {
    q: "Vocês fazem mockup antes da produção?",
    a: "Sim! Criamos mockups digitais gratuitos para sua aprovação antes de iniciar qualquer produção. Você visualiza exatamente como ficará o brinde com a sua marca.",
  },
  {
    q: "Entregam em todo o Brasil?",
    a: "Sim, entregamos em todo o território nacional. O frete é calculado de acordo com a localidade e quantidade de itens.",
  },
  {
    q: "Quais tipos de personalização vocês oferecem?",
    a: "Trabalhamos com diversas técnicas: serigrafia, sublimação, gravação a laser, bordado, hot stamping, tampografia e impressão UV. A técnica ideal depende do material e resultado desejado.",
  },
  {
    q: "Posso enviar meu próprio design?",
    a: "Claro! Você pode enviar seu logotipo e arte. Caso precise, nossa equipe de design também pode criar ou adaptar a arte para o melhor resultado em cada produto.",
  },
  {
    q: "Como solicito um orçamento?",
    a: "Basta preencher o formulário nesta página com os produtos de interesse e quantidade estimada. Nossa equipe responderá em até 24 horas com uma proposta personalizada.",
  },
];

function JsonLd() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Hamecon",
      url: "https://hamecon.com.br",
      logo: "https://hamecon.com.br/logo.svg",
      description: "Brindes corporativos personalizados com a sua marca.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "gestao@hamecon.com.br",
        contactType: "sales",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <>
      {jsonLd.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
