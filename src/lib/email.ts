import { Resend } from "resend";
import { SITE_CONFIG } from "./constants";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY não configurada. Emails não serão enviados.");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

interface QuoteEmailData {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  produtos: string[];
  quantidade: string;
  prazo: string;
  mensagem: string;
}

export async function sendQuoteNotification(data: QuoteEmailData) {
  const produtosList = data.produtos.map((p) => `<li style="padding: 4px 0;">${p}</li>`).join("");

  const htmlAdmin = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e4c36; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <img src="${SITE_CONFIG.url}/logo.svg" alt="Hamecon" style="height: 50px; filter: brightness(0) invert(1);" />
        <h1 style="color: #fff; margin: 16px 0 0; font-size: 22px;">Nova Solicitação de Orçamento</h1>
      </div>

      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1e4c36; font-size: 18px; margin-top: 0;">Dados do Solicitante</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #718096; width: 120px;">Nome:</td><td style="padding: 8px 0; font-weight: bold;">${data.nome}</td></tr>
          <tr><td style="padding: 8px 0; color: #718096;">Empresa:</td><td style="padding: 8px 0; font-weight: bold;">${data.empresa}</td></tr>
          <tr><td style="padding: 8px 0; color: #718096;">Email:</td><td style="padding: 8px 0;">${data.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #718096;">Telefone:</td><td style="padding: 8px 0;">${data.telefone}</td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

        <h2 style="color: #1e4c36; font-size: 18px;">Detalhes do Pedido</h2>
        <p style="color: #718096; margin-bottom: 4px;">Produtos de interesse:</p>
        <ul style="color: #2d3748; margin: 0; padding-left: 20px;">${produtosList}</ul>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; color: #718096; width: 120px;">Quantidade:</td><td style="padding: 8px 0; font-weight: bold;">${data.quantidade}</td></tr>
          <tr><td style="padding: 8px 0; color: #718096;">Prazo:</td><td style="padding: 8px 0; font-weight: bold;">${data.prazo}</td></tr>
        </table>

        ${data.mensagem ? `
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <h2 style="color: #1e4c36; font-size: 18px;">Mensagem</h2>
        <p style="color: #4a5568; line-height: 1.6; white-space: pre-wrap;">${data.mensagem}</p>
        ` : ""}
      </div>
    </div>
  `;

  const htmlClient = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e4c36; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <img src="${SITE_CONFIG.url}/logo.svg" alt="Hamecon" style="height: 50px; filter: brightness(0) invert(1);" />
      </div>

      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
        <h1 style="color: #1e4c36; font-size: 22px; margin-top: 0;">Recebemos sua solicitação!</h1>
        <p style="color: #4a5568; line-height: 1.6;">
          Olá <strong>${data.nome}</strong>,
        </p>
        <p style="color: #4a5568; line-height: 1.6;">
          Agradecemos o seu interesse nos brindes corporativos Hamecon. Recebemos sua solicitação de orçamento e nossa equipe entrará em contato em breve.
        </p>

        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e4c36; margin-top: 0;">Resumo do seu pedido:</h3>
          <p style="color: #718096; margin-bottom: 4px;">Produtos:</p>
          <ul style="color: #2d3748; margin: 0 0 12px; padding-left: 20px;">${produtosList}</ul>
          <p style="color: #718096; margin: 0;">Quantidade estimada: <strong style="color: #2d3748;">${data.quantidade}</strong></p>
          <p style="color: #718096; margin: 4px 0 0;">Prazo desejado: <strong style="color: #2d3748;">${data.prazo}</strong></p>
        </div>

        <p style="color: #4a5568; line-height: 1.6;">
          Se tiver alguma dúvida, responda este email ou entre em contato pelo telefone.
        </p>

        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 0;">
          Atenciosamente,<br />
          <strong>Equipe Hamecon</strong>
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
        <p>Hamecon - Brindes Corporativos Personalizados</p>
        <p>gestao@hamecon.com.br</p>
      </div>
    </div>
  `;

  const resend = getResend();
  if (!resend) {
    console.log("Email não enviado (RESEND_API_KEY não configurada)");
    console.log("Dados do orçamento:", JSON.stringify(data, null, 2));
    return;
  }

  // Send notification to admin
  await resend.emails.send({
    from: `Hamecon Orçamentos <orcamentos@hamecon.com.br>`,
    to: SITE_CONFIG.orderNotificationEmail,
    subject: `Novo Orçamento - ${data.empresa} - ${data.nome}`,
    html: htmlAdmin,
  });

  // Send confirmation to client
  await resend.emails.send({
    from: `Hamecon <orcamentos@hamecon.com.br>`,
    to: data.email,
    subject: `Recebemos sua solicitação de orçamento - Hamecon`,
    html: htmlClient,
  });
}
