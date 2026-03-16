"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuoteFormProps {
  products: string[];
}

export function QuoteForm({ products }: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    quantidade: "",
    prazo: "",
    mensagem: "",
  });

  function toggleProduct(name: string) {
    setSelectedProducts((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      toast.error("Selecione pelo menos um produto de interesse.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          produtos: selectedProducts,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar solicitação.");
      }

      setIsSuccess(true);
      toast.success("Orçamento solicitado com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-[#1e4c36]/20 bg-[#1e4c36]/5 p-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-[#1e4c36]" />
        <h3 className="mt-4 text-2xl font-bold text-gray-900">Orçamento Enviado!</h3>
        <p className="mt-2 text-gray-600">
          Seu pedido de orçamento foi enviado para nossa equipe. Em breve você receberá um contato com a proposta personalizada.
        </p>
        <Button
          className="mt-6 bg-[#1e4c36] hover:bg-[#163a29]"
          onClick={() => {
            setIsSuccess(false);
            setSelectedProducts([]);
            setForm({ nome: "", empresa: "", email: "", telefone: "", quantidade: "", prazo: "", mensagem: "" });
          }}
        >
          Enviar outro orçamento
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
      {/* Contact Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="mb-1 block text-sm font-medium text-gray-700">
            Nome completo *
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            value={form.nome}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36] focus:outline-none"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label htmlFor="empresa" className="mb-1 block text-sm font-medium text-gray-700">
            Empresa *
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            required
            value={form.empresa}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36] focus:outline-none"
            placeholder="Nome da empresa"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36] focus:outline-none"
            placeholder="email@empresa.com.br"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="mb-1 block text-sm font-medium text-gray-700">
            Telefone / WhatsApp *
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            required
            value={form.telefone}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36] focus:outline-none"
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      {/* Product Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Produtos de interesse * <span className="text-xs text-gray-400">(selecione um ou mais)</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {products.map((product) => (
            <button
              key={product}
              type="button"
              onClick={() => toggleProduct(product)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                selectedProducts.includes(product)
                  ? "border-[#1e4c36] bg-[#1e4c36]/10 font-medium text-[#1e4c36]"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {selectedProducts.includes(product) && (
                <CheckCircle className="mr-1 inline h-3.5 w-3.5" />
              )}
              {product}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="quantidade" className="mb-1 block text-sm font-medium text-gray-700">
            Quantidade estimada *
          </label>
          <select
            id="quantidade"
            name="quantidade"
            required
            value={form.quantidade}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36] focus:outline-none"
          >
            <option value="">Selecione...</option>
            <option value="1-50">1 a 50 unidades</option>
            <option value="51-100">51 a 100 unidades</option>
            <option value="101-250">101 a 250 unidades</option>
            <option value="251-500">251 a 500 unidades</option>
            <option value="501-1000">501 a 1.000 unidades</option>
            <option value="1001+">Mais de 1.000 unidades</option>
          </select>
        </div>
        <div>
          <label htmlFor="prazo" className="mb-1 block text-sm font-medium text-gray-700">
            Prazo desejado
          </label>
          <select
            id="prazo"
            name="prazo"
            value={form.prazo}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36] focus:outline-none"
          >
            <option value="">Selecione...</option>
            <option value="Urgente (até 7 dias)">Urgente (até 7 dias)</option>
            <option value="Normal (15 dias)">Normal (15 dias)</option>
            <option value="Flexível (30 dias)">Flexível (30 dias)</option>
            <option value="Sem urgência">Sem urgência</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1 block text-sm font-medium text-gray-700">
          Mensagem adicional
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          value={form.mensagem}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-[#1e4c36] focus:ring-1 focus:ring-[#1e4c36] focus:outline-none"
          placeholder="Descreva detalhes adicionais, cores preferidas, evento específico..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1e4c36] py-6 text-lg hover:bg-[#163a29] disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Enviar Solicitação de Orçamento
          </>
        )}
      </Button>

      <p className="text-center text-xs text-gray-400">
        Ao enviar, você receberá um email de confirmação. Respondemos em até 24 horas.
      </p>
    </form>
  );
}
