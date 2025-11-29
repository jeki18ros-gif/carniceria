// supabase/functions/generar-pedido-pdf/index.ts
export const config = {
  runtime: "edge",
  verifyJwt: false,
};

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const PDF_API_KEY = Deno.env.get("PDF_API_KEY");

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const PDF_API_ENDPOINT = "https://api.pdfshift.io/v3/convert/pdf";

const TU_CORREO_DE_NEGOCIO = "jeki18ros@gmail.com";

// ------------------ CORS ------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ------------------ GENERAR HTML ------------------
function generarHTMLPedido(pedido: any) {
  const productosHTML = pedido.productos
    .map(
      (p: any) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0; font-weight: 600;">${p.nombre}</td>
          <td style="padding: 10px 0; text-align: center;">${p.cantidad}</td>
          <td style="padding: 10px 0;">
            ${
              p.especificaciones
                ? Object.entries(p.especificaciones)
                    .filter(([, value]) => value)
                    .map(([key, value]) => `• ${key}: ${value}`)
                    .join("<br>")
                : "—"
            }
          </td>
        </tr>
      `
    )
    .join("");

  return `
  <html>
    <body style="font-family: Arial;">
      <h1>Orden de Compra</h1>
      <p>Fecha: ${pedido.fechaPedido}</p>

      <h2>Datos del Cliente</h2>
      <p><strong>Nombre:</strong> ${pedido.cliente.nombre}</p>
      <p><strong>Teléfono:</strong> ${pedido.cliente.telefono}</p>
      <p><strong>Correo:</strong> ${pedido.cliente.correo}</p>
      <p><strong>Dirección:</strong> ${pedido.cliente.direccion}</p>
      <p><strong>Entrega:</strong> ${pedido.cliente.entrega}</p>

      <h2>Productos</h2>
      <table width="100%">
        ${productosHTML}
      </table>

      ${
        pedido.cliente.comentarios
          ? `<h3>Comentarios:</h3><p>${pedido.cliente.comentarios}</p>`
          : ""
      }
    </body>
  </html>`;
}

// ------------------ PDF CREATOR ------------------
async function generatePdfFromHtml(htmlContent: string): Promise<string> {
  if (!PDF_API_KEY) throw new Error("PDF_API_KEY no configurada");

  const response = await fetch(PDF_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(PDF_API_KEY + ":")}`,
    },
    body: JSON.stringify({
      source: htmlContent,
      filename: "OrdenDeCompra.pdf",
    }),
  });

  if (!response.ok) {
    console.error("PDFShift error:", await response.text());
    throw new Error("Error generando el PDF");
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  return btoa(String.fromCharCode(...buffer));
}

// ------------------ EDGE FUNCTION ------------------
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Método no permitido" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const pedido = await req.json();

    if (!pedido || !pedido.cliente || !pedido.productos?.length) {
      return new Response(
        JSON.stringify({ error: "Datos del pedido incompletos" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Generar HTML y PDF
    const htmlContent = generarHTMLPedido(pedido);
    const pdfBase64 = await generatePdfFromHtml(htmlContent);

    const nombreSanitizado = pedido.cliente.nombre
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");

    const attachment = {
      filename: `Orden_${nombreSanitizado}_${pedido.fechaPedido}.pdf`,
      content: pdfBase64,
    };

    if (!RESEND_API_KEY)
      throw new Error("RESEND_API_KEY no configurada");

    // Crear correos
    const correos = [
      {
        from: "onboarding@resend.dev",
        to: TU_CORREO_DE_NEGOCIO,
        subject: `🛒 Nuevo Pedido de ${pedido.cliente.nombre}`,
        html: "<p>Nuevo pedido recibido.</p>",
        attachments: [attachment],
      },
      {
        from: "onboarding@resend.dev",
        to: pedido.cliente.correo,
        subject: `✔ Confirmación de Pedido`,
        html: `<p>Gracias por tu pedido, ${pedido.cliente.nombre}.</p>`,
        attachments: [attachment],
      },
    ];

    // Enviar correos en paralelo
    await Promise.all(
      correos.map((email) =>
        fetch(RESEND_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(email),
        })
      )
    );

    return new Response(
      JSON.stringify({ message: "PDF generado y correos enviados" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
