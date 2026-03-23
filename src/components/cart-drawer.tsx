"use client";

import { useCart } from "@/contexts/cart-context";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CartDrawer() {
  const { items, removeItem, updateQty, total, totalItems, isOpen, setIsOpen } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#1e4c36]" />
            <h2 className="text-lg font-bold text-gray-900">
              Carrinho
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({totalItems} {totalItems === 1 ? "item" : "itens"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-gray-200" />
              <p className="text-sm font-medium text-gray-500">
                Seu carrinho está vazio
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Adicione produtos do catálogo
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/catalogo">Ver Catálogo</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                >
                  {/* Image */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.nome}
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        {item.sku}
                      </p>
                      <p className="line-clamp-2 text-sm font-medium text-gray-900">
                        {item.nome}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-[#1e4c36]">
                          {formatPrice(item.preco * item.qty)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50/80 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total estimado</span>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(total)}
              </span>
            </div>

            <div className="mb-3 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
              <strong>Nota:</strong> Os preços são por unidade. O valor final
              depende da quantidade. Pedido mínimo a consultar.
            </div>

            <Button
              asChild
              className="w-full bg-[#1e4c36] hover:bg-[#163a29]"
              size="lg"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/checkout">Finalizar Pedido</Link>
            </Button>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium text-gray-500 transition-colors hover:text-[#1e4c36]"
            >
              <ArrowLeft className="h-4 w-4" />
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
