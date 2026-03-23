"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, ChevronDown, ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import catalogData from "@/data/catalogo.json";

type ProductColor = {
  nome: string;
  hex: string;
  img: string;
  imgIdx: number;
};

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
  cores: ProductColor[];
};

const products = catalogData as Product[];

const categories = Array.from(new Set(products.map((p) => p.cat))).sort();

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Color picker shown inline on cards and in modal */
function ColorPicker({
  colors,
  selected,
  onSelect,
  size = "sm",
}: {
  colors: ProductColor[];
  selected: string | null;
  onSelect: (color: ProductColor) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => (
        <button
          key={c.nome}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(c);
          }}
          title={c.nome}
          className={`${dim} rounded-full border-2 transition-all ${
            selected === c.nome
              ? "border-[#1e4c36] ring-2 ring-[#1e4c36]/20"
              : "border-gray-200 hover:border-gray-400"
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  );
}

export default function CatalogoPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "name">(
    "price-asc"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState(0);
  const [modalColor, setModalColor] = useState<string | null>(null);
  // Track selected color per product id for the grid cards
  const [cardColors, setCardColors] = useState<Record<number, ProductColor>>({});

  const { addItem, setIsOpen: setCartOpen } = useCart();

  const handleAddItem = useCallback(
    (p: Product, color?: ProductColor | null) => {
      // If product has colors and none selected, prompt
      if (p.cores.length > 0 && !color) {
        toast.error("Selecione uma cor antes de adicionar", { duration: 2000 });
        return;
      }
      addItem({
        id: p.id,
        nome: p.nome,
        sku: p.sku,
        preco: p.preco,
        img: color?.img || p.img,
        cor: color?.nome,
        corHex: color?.hex,
      });
      toast.success(
        color
          ? `${p.nome} (${color.nome}) adicionado`
          : `${p.nome} adicionado`,
        {
          action: {
            label: "Ver carrinho",
            onClick: () => setCartOpen(true),
          },
          duration: 3000,
        }
      );
    },
    [addItem, setCartOpen]
  );

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
    setModalColor(null);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setModalColor(null);
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

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
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

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-[#1e4c36] sm:w-auto"
              >
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome A-Z</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
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
                {filtered.map((p) => {
                  const selectedCardColor = cardColors[p.id] || null;
                  const cardImg = selectedCardColor?.img || p.img;

                  return (
                    <div
                      key={p.id}
                      className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-[#1e4c36]/30 hover:shadow-lg"
                    >
                      <button
                        onClick={() => openProduct(p)}
                        className="w-full text-left"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cardImg}
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
                        <div className="p-4 pb-2">
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
                              {formatPrice(p.preco)}
                              <span className="text-xs font-medium text-gray-400">
                                /un
                              </span>
                            </p>
                            <p className="text-[11px] text-gray-400">
                              personalização inclusa
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Color picker + Add to cart */}
                      <div className="space-y-2 px-4 pb-4">
                        {p.cores.length > 0 && (
                          <div>
                            <p className="mb-1.5 text-[11px] font-medium text-gray-500">
                              {selectedCardColor
                                ? `Cor: ${selectedCardColor.nome}`
                                : "Selecione a cor:"}
                            </p>
                            <ColorPicker
                              colors={p.cores}
                              selected={selectedCardColor?.nome || null}
                              onSelect={(c) =>
                                setCardColors((prev) => ({
                                  ...prev,
                                  [p.id]: c,
                                }))
                              }
                            />
                          </div>
                        )}
                        <button
                          onClick={() =>
                            handleAddItem(p, selectedCardColor)
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1e4c36] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#163a29]"
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar ao carrinho
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ModalDetail
          product={selectedProduct}
          mainImage={mainImage}
          setMainImage={setMainImage}
          modalColor={modalColor}
          setModalColor={setModalColor}
          onClose={closeModal}
          onAdd={handleAddItem}
        />
      )}
    </>
  );
}

/** Product detail modal — extracted to keep the main component clean */
function ModalDetail({
  product,
  mainImage,
  setMainImage,
  modalColor,
  setModalColor,
  onClose,
  onAdd,
}: {
  product: Product;
  mainImage: number;
  setMainImage: (i: number) => void;
  modalColor: string | null;
  setModalColor: (c: string | null) => void;
  onClose: () => void;
  onAdd: (p: Product, color?: ProductColor | null) => void;
}) {
  const selectedColor = product.cores.find((c) => c.nome === modalColor) || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
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
                  product.imgs[mainImage]?.src || product.img
                }
                alt={product.nome}
                className="max-h-full max-w-full object-contain p-4"
              />
            </div>
            {product.imgs.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {product.imgs.map((img, i) => (
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
              {product.sku}
            </p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {product.nome}
            </h2>

            <div className="mt-4 rounded-xl bg-emerald-50 p-4">
              <p className="text-2xl font-bold text-[#1e4c36]">
                {formatPrice(product.preco)}
                <span className="text-sm font-medium text-gray-400">/un</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                personalização inclusa
              </p>
            </div>

            {/* Color selector */}
            {product.cores.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Cor:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedColor?.nome || "Selecione"}
                  </span>
                </p>
                <ColorPicker
                  colors={product.cores}
                  selected={modalColor}
                  onSelect={(c) => {
                    setModalColor(c.nome);
                    setMainImage(c.imgIdx);
                  }}
                  size="md"
                />
              </div>
            )}

            {product.descricao_html ? (
              <div
                className="prose prose-sm mt-5 max-h-48 overflow-y-auto text-gray-600 [&_strong]:text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: product.descricao_html,
                }}
              />
            ) : product.descricao ? (
              <p className="mt-5 max-h-48 overflow-y-auto text-sm leading-relaxed text-gray-600">
                {product.descricao}
              </p>
            ) : null}

            <Button
              size="lg"
              className="mt-6 w-full bg-[#1e4c36] hover:bg-[#163a29]"
              onClick={() => {
                onAdd(product, selectedColor);
                if (product.cores.length === 0 || selectedColor) {
                  onClose();
                }
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
