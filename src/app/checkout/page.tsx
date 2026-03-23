"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type FormData = {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  mensagem: string;
};

export default function CheckoutPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState<FormData>({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    mensagem: "",
  });

  const updateField = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            id: i.id,
            nome: i.nome,
            sku: i.sku,
            preco: i.preco,
            qty: i.qty,
          })),
          total,
        }),
      });

      if (!res.ok) throw new Error("Falha ao enviar pedido");

      setIsSuccess(true);
      clearCart();
    } catch {
      alert("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-[#1e4c36]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Pedido enviado com sucesso!
        </h1>
        <p className="mt-3 max-w-md text-gray-500">
          Recebemos sua solicitação e entraremos em contato em breve para
          confirmar os detalhes e solicitar o logotipo para personalização.
        </p>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Próximo passo:</strong> Enviaremos um email solicitando o
          logotipo da sua empresa para preparação dos modelos virtuais antes do
          início da produção.
        </div>
        <Button asChild className="mt-8 bg-[#1e4c36] hover:bg-[#163a29]">
          <Link href="/catalogo">Continuar comprando</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-gray-200" />
        <h1 className="text-xl font-bold text-gray-900">
          Seu carrinho está vazio
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Adicione produtos do catálogo para continuar
        </p>
        <Button asChild className="mt-6 bg-[#1e4c36] hover:bg-[#163a29]">
          <Link href="/catalogo">Ver Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-[#1e4c36]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
        Finalizar Pedido
      </h1>

      {/* Info banner */}
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">Como funciona?</p>
          <p className="mt-1">
            Após o envio do pedido, nossa equipe entrará em contato para
            confirmação e{" "}
            <strong>
              solicitará o logotipo da sua empresa para preparação dos modelos
              virtuais
            </strong>{" "}
            antes do início da produção. Você receberá uma prévia digital para
            aprovação.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form - Left */}
          <div className="lg:col-span-3">
            {/* Contact info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Dados para contato
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => updateField("nome", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.empresa}
                    onChange={(e) => updateField("empresa", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.telefone}
                    onChange={(e) => updateField("telefone", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={form.cnpj}
                    onChange={(e) => updateField("cnpj", e.target.value)}
                    placeholder="Opcional"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Endereço de entrega
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Endereço completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.endereco}
                    onChange={(e) => updateField("endereco", e.target.value)}
                    placeholder="Rua, número, complemento"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.cidade}
                    onChange={(e) => updateField("cidade", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Estado *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.estado}
                      onChange={(e) => updateField("estado", e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      CEP *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.cep}
                      onChange={(e) => updateField("cep", e.target.value)}
                      placeholder="00000-000"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Observações
              </h2>
              <textarea
                value={form.mensagem}
                onChange={(e) => updateField("mensagem", e.target.value)}
                rows={3}
                placeholder="Informações adicionais, prazos, especificações de cores..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36]"
              />
            </div>
          </div>

          {/* Order Summary - Right */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-xl border border-gray-200 bg-white">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Resumo do Pedido
                </h2>
              </div>

              <div className="max-h-96 overflow-y-auto px-6 py-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg bg-gray-50 p-2.5"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.img}
                          alt={item.nome}
                          className="max-h-full max-w-full object-contain p-0.5"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <p className="line-clamp-1 text-xs font-medium text-gray-900">
                          {item.nome}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-medium">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1e4c36]">
                              {formatPrice(item.preco * item.qty)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-gray-300 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total estimado</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Valor por unidade &times; quantidade. Frete será calculado
                  após confirmação.
                </p>
              </div>

              <div className="border-t px-6 py-4">
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-xs leading-relaxed text-amber-700">
                    Após o pagamento, solicitaremos o <strong>logotipo</strong>{" "}
                    da sua empresa para preparação dos modelos virtuais antes do
                    início da produção.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1e4c36] hover:bg-[#163a29]"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Pedido"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
