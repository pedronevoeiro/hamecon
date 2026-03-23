"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import catalogData from "@/data/catalogo.json";

type Product = {
  id: number;
  nome: string;
  sku: string;
  preco: number;
  descricao: string;
  descricao_html: string;
  img: string;
  imgs: { src: string; alt: string }[];
  cat: string;
  estoque: boolean;
};

const products = catalogData as Product[];

const categories = Array.from(new Set(products.map((p) => p.cat))).sort();

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CatalogoPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "name">(
    "price-asc"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState(0);

  const filtered = useMemo(() => {
    let result = products;

    if (category !== "Todos") {
      result = result.filter((p) => p.cat === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.preco - b.preco);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.preco - a.preco);
        break;
      case "name":
        result = [...result].sort((a, b) => a.nome.localeCompare(b.nome));
        break;
    }

    return result;
  }, [search, category, sort]);

  const openProduct = useCallback((p: Product) => {
    setSelectedProduct(p);
    setMainImage(0);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: products.length };
    for (const p of products) {
      counts[p.cat] = (counts[p.cat] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Catálogo de Produtos
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado{filtered.length !== 1 ? "s" : ""} &mdash; preços com
              personalização inclusa
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar - Categories */}
          <aside className="shrink-0 lg:w-56">
            <div className="sticky top-20">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Categorias
              </h2>
              <nav className="flex flex-row flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">
                {["Todos", ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      category === cat
                        ? "bg-[#1e4c36] font-medium text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`ml-2 text-xs ${
                        category === cat ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Sort */}
              <h2 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ordenar por
              </h2>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 outline-none focus:border-[#1e4c36]"
                >
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="name">Nome A-Z</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                <Search className="mb-4 h-10 w-10 text-gray-300" />
                <p className="text-lg font-medium text-gray-500">
                  Nenhum produto encontrado
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Tente uma busca diferente ou mude a categoria
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openProduct(p)}
                    className="group overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm transition-all hover:border-[#1e4c36]/30 hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.img}
                        alt={p.nome}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      />
                      {p.imgs.length > 1 && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#1e4c36] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
                          {p.imgs.length} fotos
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        {p.sku}
                      </p>
                      <span className="mt-0.5 inline-block rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                        {p.cat}
                      </span>
                      <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                        {p.nome}
                      </h3>
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <p className="text-lg font-bold text-[#1e4c36]">
                          {formatPrice(p.preco)}<span className="text-xs font-medium text-gray-400">/un</span>
                        </p>
                        <p className="text-[11px] text-gray-400">
                          personalização inclusa
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Gallery */}
              <div className="bg-gray-50 p-6 md:rounded-l-2xl">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      selectedProduct.imgs[mainImage]?.src ||
                      selectedProduct.img
                    }
                    alt={selectedProduct.nome}
                    className="max-h-full max-w-full object-contain p-4"
                  />
                </div>
                {selectedProduct.imgs.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {selectedProduct.imgs.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setMainImage(i)}
                        className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                          mainImage === i
                            ? "border-[#1e4c36]"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.src}
                          alt={`Foto ${i + 1}`}
                          className="max-h-full max-w-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 md:p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                  {selectedProduct.sku}
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {selectedProduct.nome}
                </h2>

                <div className="mt-4 rounded-xl bg-emerald-50 p-4">
                  <p className="text-2xl font-bold text-[#1e4c36]">
                    {formatPrice(selectedProduct.preco)}<span className="text-sm font-medium text-gray-400">/un</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    personalização inclusa
                  </p>
                </div>

                {selectedProduct.descricao_html ? (
                  <div
                    className="prose prose-sm mt-5 max-h-48 overflow-y-auto text-gray-600 [&_strong]:text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: selectedProduct.descricao_html,
                    }}
                  />
                ) : selectedProduct.descricao ? (
                  <p className="mt-5 max-h-48 overflow-y-auto text-sm leading-relaxed text-gray-600">
                    {selectedProduct.descricao}
                  </p>
                ) : null}

                <Button
                  asChild
                  size="lg"
                  className="mt-6 w-full bg-[#1e4c36] hover:bg-[#163a29]"
                >
                  <a href="/#orcamento">
                    <Send className="mr-2 h-4 w-4" />
                    Solicitar Orçamento
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
