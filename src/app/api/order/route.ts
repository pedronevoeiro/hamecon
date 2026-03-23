import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_CONFIG } from "@/lib/constants";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY não configurada. Emails não serão enviados.");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

type OrderItem = {
  id: number;
  nome: string;
  sku: string;
  preco: number;
  qty: number;
};

type OrderData = {
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
  items: OrderItem[];
  total: number;
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export async function POST(request: Request) {
  try {
    const data: OrderData = await request.json();

    if (
      !data.nome ||
      !data.empresa ||
      !data.email ||
      !data.telefone ||
      !data.items?.length
    ) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const itemsHtml = data.items
      .map(
        (i) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${i.sku}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${i.nome}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${i.qty}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatPrice(i.preco)}/un</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${formatPrice(i.preco * i.qty)}</td>
      </tr>`
      )
      .join("");

    const htmlAdmin = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e4c36; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <img src="${SITE_CONFIG.url}/logo.svg" alt="Hamecon" style="height: 50px; filter: brightness(0) invert(1);" />
        <h1 style="color: #fff; margin: 16px 0 0; font-size: 22px;">Novo Pedido Recebido</h1>
      </div>

      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1e4c36; font-size: 18px; margin-top: 0;">Dados do Cliente</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #718096; width: 130px;">Nome:</td><td style="padding: 6px 0; font-weight: bold;">${data.nome}</td></tr>
          <tr><td style="padding: 6px 0; color: #718096;">Empresa:</td><td style="padding: 6px 0; font-weight: bold;">${data.empresa}</td></tr>
          <tr><td style="padding: 6px 0; color: #718096;">Email:</td><td style="padding: 6px 0;">${data.email}</td></tr>
          <tr><td style="padding: 6px 0; color: #718096;">Telefone:</td><td style="padding: 6px 0;">${data.telefone}</td></tr>
          ${data.cnpj ? `<tr><td style="padding: 6px 0; color: #718096;">CNPJ:</td><td style="padding: 6px 0;">${data.cnpj}</td></tr>` : ""}
        </table>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

        <h2 style="color: #1e4c36; font-size: 18px;">Endereço de Entrega</h2>
        <p style="color: #4a5568; margin: 4px 0;">${data.endereco}</p>
        <p style="color: #4a5568; margin: 4px 0;">${data.cidade} - ${data.estado} | CEP: ${data.cep}</p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

        <h2 style="color: #1e4c36; font-size: 18px;">Itens do Pedido</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #f7fafc;">
              <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">SKU</th>
              <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Produto</th>
              <th style="padding: 8px 12px; text-align: center; border-bottom: 2px solid #e2e8f0;">Qtd</th>
              <th style="padding: 8px 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Unit.</th>
              <th style="padding: 8px 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="padding: 12px 12px; text-align: right; font-weight: bold; font-size: 16px;">Total Estimado:</td>
              <td style="padding: 12px 12px; text-align: right; font-weight: bold; font-size: 16px; color: #1e4c36;">${formatPrice(data.total)}</td>
            </tr>
          </tfoot>
        </table>

        ${data.mensagem ? `
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <h2 style="color: #1e4c36; font-size: 18px;">Observações</h2>
        <p style="color: #4a5568; line-height: 1.6; white-space: pre-wrap;">${data.mensagem}</p>
        ` : ""}

        <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <strong style="color: #92400e;">Lembrete:</strong>
          <span style="color: #92400e;"> Solicitar logotipo ao cliente para preparação dos modelos virtuais.</span>
        </div>
      </div>
    </div>`;

    const itemsList = data.items
      .map((i) => `<li style="padding: 4px 0;">${i.nome} (${i.sku}) — ${i.qty}x ${formatPrice(i.preco)}/un</li>`)
      .join("");

    const htmlClient = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e4c36; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <img src="${SITE_CONFIG.url}/logo.svg" alt="Hamecon" style="height: 50px; filter: brightness(0) invert(1);" />
      </div>

      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
        <h1 style="color: #1e4c36; font-size: 22px; margin-top: 0;">Pedido recebido!</h1>
        <p style="color: #4a5568; line-height: 1.6;">
          Olá <strong>${data.nome}</strong>,
        </p>
        <p style="color: #4a5568; line-height: 1.6;">
          Recebemos seu pedido e nossa equipe já está trabalhando nele. Em breve entraremos em contato para confirmar os detalhes.
        </p>

        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e4c36; margin-top: 0;">Itens do pedido:</h3>
          <ul style="color: #2d3748; margin: 0; padding-left: 20px;">${itemsList}</ul>
          <p style="color: #718096; margin: 12px 0 0;">Total estimado: <strong style="color: #1e4c36;">${formatPrice(data.total)}</strong></p>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <strong style="color: #92400e;">Próximo passo:</strong>
          <p style="color: #92400e; margin: 8px 0 0;">
            Enviaremos um email solicitando o logotipo da sua empresa para preparação dos modelos virtuais antes do início da produção. Você receberá uma prévia digital para aprovação.
          </p>
        </div>

        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 0;">
          Atenciosamente,<br />
          <strong>Equipe Hamecon</strong>
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
        <p>Hamecon - Brindes Corporativos Personalizados</p>
        <p>gestao@hamecon.com.br</p>
      </div>
    </div>`;

    const resend = getResend();
    if (resend) {
      await Promise.all([
        resend.emails.send({
          from: `Hamecon Pedidos <orcamentos@hamecon.com.br>`,
          to: SITE_CONFIG.orderNotificationEmail,
          subject: `Novo Pedido - ${data.empresa} - ${data.nome} (${data.items.length} itens)`,
          html: htmlAdmin,
        }),
        resend.emails.send({
          from: `Hamecon <orcamentos@hamecon.com.br>`,
          to: data.email,
          subject: `Pedido recebido - Hamecon`,
          html: htmlClient,
        }),
      ]);
    } else {
      console.log("Pedido recebido:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao processar pedido:", err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
