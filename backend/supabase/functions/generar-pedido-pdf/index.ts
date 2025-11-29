// generar-pedido-pdf/index.ts
export const config = {
  runtime: "edge",
   verifyJwt: false
};

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// ------------------ ENV KEYS ------------------
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
};

// ------------------ HTML GENERATOR ------------------
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
                      .filter(([, value]) => value && value !== "")
                      .map(([key, value]) => `• ${key}: ${value}`)
                      .join("<br/>")
                  : "—"
              }
            </td>
        </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { background-color: #f7d246; color: #0b132b; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
            .section { margin-top: 20px; border: 1px solid #eee; padding: 15px; border-radius: 6px; }
            h3 { color: #0b132b; border-bottom: 2px solid #f7d246; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f9f9f9; padding: 10px 0; text-align: left; }
            .comment { background-color: #fffbe6; padding: 10px; border-radius: 4px; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Orden de Compra #${Math.floor(Math.random() * 90000) + 10000}</h1>
                <p>Fecha: ${pedido.fechaPedido}</p>
            </div>

            <div class="section">
                <h3>Datos del Cliente</h3>
                <p><strong>Nombre:</strong> ${pedido.cliente.nombre}</p>
                <p><strong>Teléfono:</strong> ${pedido.cliente.telefono}</p>
                <p><strong>Correo:</strong> ${pedido.cliente.correo}</p>
                <p><strong>Dirección:</strong> ${pedido.cliente.direccion}</p>
                <p><strong>Entrega:</strong> ${
                  pedido.cliente.entrega === "tienda"
                    ? "Recoger en Tienda"
                    : "A Domicilio"
                }</p>
                <p><strong>Fecha/Hora Solicitada:</strong> ${
                  pedido.cliente.fechaEntrega
                } / ${pedido.cliente.horario || "N/A"}</p>
            </div>

            <div class="section">
                <h3>Detalle de Productos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th style="text-align: center;">Cantidad</th>
                            <th>Especificaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosHTML}
                    </tbody>
                </table>
            </div>

            ${
              pedido.cliente.comentarios
                ? `<div class="comment"><strong>Comentarios Adicionales:</strong> ${pedido.cliente.comentarios}</div>`
                : ""
            }

            <p style="text-align: center; margin-top: 30px; color: #666;">
              Gracias por su preferencia.
            </p>
        </div>
    </body>
    </html>
  `;
}

// ------------------ PDF SHIFT ------------------
async function generatePdfFromHtml(htmlContent: string): Promise<string> {
  if (!PDF_API_KEY) throw new Error("PDF_API_KEY no está configurada.");

  const authString = btoa(`${PDF_API_KEY}:`);

  const response = await fetch(PDF_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({
      source: htmlContent,
      filename: "OrdenDeCompra.pdf",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error de PDFShift:", errorBody);
    throw new Error(`Error generando PDF (${response.status})`);
  }

  const pdfBuffer = new Uint8Array(await response.arrayBuffer());
  return btoa(String.fromCharCode(...pdfBuffer));
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

    if (!pedido || !pedido.cliente || pedido.productos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Datos del pedido incompletos" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const htmlContent = generarHTMLPedido(pedido);
    const pdfBase64 = await generatePdfFromHtml(htmlContent);

    const nombreLimpio = pedido.cliente.nombre
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");

    const attachment = {
      filename: `OrdenDeCompra_${nombreLimpio}_${pedido.fechaPedido}.pdf`,
      content: pdfBase64,
    };

    if (!RESEND_API_KEY)
      throw new Error("RESEND_API_KEY no está configurada.");

    const emails = [
      {
        from: "onboarding@resend.dev",
        to: TU_CORREO_DE_NEGOCIO,
        subject: `🛒 Nuevo Pedido de ${pedido.cliente.nombre}`,
        html: `<p>Nuevo pedido recibido. PDF adjunto.</p>${htmlContent}`,
        attachments: [attachment],
      },
      {
        from: "onboarding@resend.dev",
        to: pedido.cliente.correo,
        subject: `✔ Confirmación de tu Pedido - ${pedido.fechaPedido}`,
        html: `<p>Hola ${pedido.cliente.nombre}, gracias por tu compra. Adjuntamos el PDF con los detalles.</p>`,
        attachments: [attachment],
      },
    ];

    await Promise.all(
      emails.map((email) =>
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
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error("Error en Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
