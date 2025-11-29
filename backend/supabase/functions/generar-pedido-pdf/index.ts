// supabase/functions/generar-pedido-pdf/index.ts

export const config = {
  runtime: "edge",
  verifyJwt: false,
};

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// =====================
//   Helpers seguros Base64
// =====================
function encodeBase64(uint8: Uint8Array | string) {
  if (typeof uint8 === "string") {
    return btoa(uint8);
  }
  let binary = "";
  for (let i = 0; i < uint8.length; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

function decodeBase64(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

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
function generarHTMLPedido(pedido) {
  const productosHTML = pedido.productos
    .map(
      (p) => `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;font-weight:bold;">${p.nombre}</td>
          <td style="padding:8px 0;text-align:center;">${p.cantidad}</td>
          <td style="padding:8px 0;">
            ${
              p.especificaciones
                ? Object.entries(p.especificaciones)
                    .filter(([, v]) => v)
                    .map(([k, v]) => `• ${k}: ${v}`)
                    .join("<br>")
                : "—"
            }
          </td>
        </tr>`
    )
    .join("");

  return `
  <html>
    <body style="font-family:Arial;">
      <h1>Orden de Compra</h1>
      <p>Fecha: ${pedido.fechaPedido}</p>

      <h2>Datos del Cliente</h2>
      <p><strong>Nombre:</strong> ${pedido.cliente.nombre}</p>
      <p><strong>Teléfono:</strong> ${pedido.cliente.telefono}</p>
      <p><strong>Correo:</strong> ${pedido.cliente.correo}</p>
      <p><strong>Dirección:</strong> ${pedido.cliente.direccion}</p>
      <p><strong>Entrega:</strong> ${pedido.cliente.entrega}</p>

      <h2>Productos</h2>
      <table width="100%">${productosHTML}</table>

      ${
        pedido.cliente.comentarios
          ? `<h3>Comentarios:</h3><p>${pedido.cliente.comentarios}</p>`
          : ""
      }
    </body>
  </html>`;
}

// ------------------ PDFShift ------------------
async function generarPdfBase64(html) {
  if (!PDF_API_KEY) throw new Error("PDF_API_KEY no configurada");

  const auth = encodeBase64(`${PDF_API_KEY}:`);

  const response = await fetch(PDF_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      source: html,
      filename: "OrdenDeCompra.pdf",
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("No se pudo generar el PDF");
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  return encodeBase64(buffer);
}

// ------------------ EDGE FUNCTION ------------------
serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const pedido = await req.json();

    const html = generarHTMLPedido(pedido);
    const pdfBase64 = await generarPdfBase64(html);

    const nombreArchivo = `Orden_${pedido.cliente.nombre
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")}_${pedido.fechaPedido}.pdf`;

    // envío de correos
    const attachment = { filename: nombreArchivo, content: pdfBase64 };

    await Promise.all([
      fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: TU_CORREO_DE_NEGOCIO,
          subject: `🛒 Nuevo Pedido de ${pedido.cliente.nombre}`,
          html: "<p>Nuevo pedido recibido.</p>",
          attachments: [attachment],
        }),
      }),

      fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: pedido.cliente.correo,
          subject: `✔ Confirmación de Pedido`,
          html: `<p>Gracias por tu pedido, ${pedido.cliente.nombre}.</p>`,
          attachments: [attachment],
        }),
      }),
    ]);

    // devolver PDF al frontend
    const pdfBytes = decodeBase64(pdfBase64);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
