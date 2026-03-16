import { NextRequest, NextResponse } from "next/server";
import { sendQuoteNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nome, empresa, email, telefone, produtos, quantidade, prazo, mensagem } = body;

    if (!nome || !empresa || !email || !telefone || !produtos?.length || !quantidade) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido." },
        { status: 400 }
      );
    }

    await sendQuoteNotification({
      nome,
      empresa,
      email,
      telefone,
      produtos,
      quantidade,
      prazo: prazo || "Sem urgência",
      mensagem: mensagem || "",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao processar orçamento:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar solicitação." },
      { status: 500 }
    );
  }
}
