import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// Usaremos PDF_API_KEY para la clave de PDFShift
const PDF_API_KEY = Deno.env.get("PDF_API_KEY"); 
const RESEND_ENDPOINT = "https://api.resend.com/emails";

// ⚠️ CAMBIO 1: Nuevo Endpoint de PDFShift
const PDF_API_ENDPOINT = "https://api.pdfshift.io/v3/convert"; 

const TU_CORREO_DE_NEGOCIO = "jeki18ros@gmail.com"; 

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- Generar el HTML del pedido ---
function generarHTMLPedido(pedido: any) {
  const productosHTML = pedido.productos
    .map(
      (p: any) => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: 600;">${p.nombre}</td>
            <td style="padding: 10px 0; text-align: center;">${p.cantidad}</td>
            <td style="padding: 10px 0;">${p.especificaciones || "—"}</td>
        </tr>
    `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { background-color: #f7d246; color: #0b132b; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
            .section { margin-top: 20px; border: 1px solid #eee; padding: 15px; border-radius: 6px; }
            h2, h3 { color: #0b132b; border-bottom: 2px solid #f7d246; padding-bottom: 5px; }
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

            <p style="text-align: center; margin-top: 30px; color: #666;">Gracias por su preferencia.</p>
        </div>
    </body>
    </html>
  `;
}

// --- Generar PDF usando GOTENBERG ---
async function generatePdfFromHtml(htmlContent: string): Promise<string> {
  if (!PDF_API_KEY) {
    throw new Error("PDF_API_KEY (de PDFShift) no está configurada.");
  }

  // ⚠️ CAMBIO 2: Crear la cadena de Basic Auth (base64(API_KEY:))
  // PDFShift usa el formato 'clave:', Base64-codificado.
  const authString = btoa(`${PDF_API_KEY as string}:`); 

  // ⚠️ CAMBIO 3: Crear el cuerpo JSON para PDFShift
  const payload = JSON.stringify({
    source: htmlContent, // El HTML a convertir
    filename: "OrdenDeCompra.pdf", // Opcional, pero recomendable
    // Aquí podrías añadir más opciones de PDFShift si lo necesitaras
  });

  const response = await fetch(PDF_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${authString}`, // Usar Basic Auth
    },
    body: payload,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error en PDFShift:", errorBody);
    throw new Error(`No se pudo generar el PDF. Estado: ${response.status}`);
  }
  
  // El resto de la lógica (manejo de ArrayBuffer y Base64) se mantiene igual
  const pdfArrayBuffer = await response.arrayBuffer();
  const pdfUint8 = new Uint8Array(pdfArrayBuffer);
  const base64Pdf = btoa(String.fromCharCode(...pdfUint8));

  return base64Pdf;
}

// ------------------------------------
// --- EDGE FUNCTION PRINCIPAL (NO CAMBIA) ---
// ------------------------------------
serve(async (req: Request) => {
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
    if (!RESEND_API_KEY || !PDF_API_KEY) {
        throw new Error("Claves de API de Resend o PDFShift no están configuradas.");
    }
    
    const pedido = await req.json();

    if (!pedido || !pedido.cliente || pedido.productos.length === 0) {
      return new Response(JSON.stringify({ message: "Datos del pedido incompletos o inválidos" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const htmlContent = generarHTMLPedido(pedido);
    const pdfBase64 = await generatePdfFromHtml(htmlContent);

    const nombreLimpio = pedido.cliente.nombre
        .replace(/\s+/g, '-') 
        .replace(/[^a-zA-Z0-9-]/g, ''); 

    const attachment = {
      filename: `OrdenDeCompra_${nombreLimpio}_${pedido.fechaPedido}.pdf`,
      content: pdfBase64,
    };

    const emails = [
      {
        from: "onboarding@resend.dev",
        to: TU_CORREO_DE_NEGOCIO,
        subject: `🛒 Nuevo Pedido de ${pedido.cliente.nombre}`,
        html: `<p>Se ha recibido una nueva orden de compra. Adjunto el PDF.</p>${htmlContent}`,
        attachments: [attachment],
      },
      {
        from: "onboarding@resend.dev",
        to: pedido.cliente.correo,
        subject: `✔ Confirmación de tu Pedido - ${pedido.fechaPedido}`,
        html: `<p>Hola ${pedido.cliente.nombre}, gracias por tu compra. Adjuntamos el PDF con los detalles de tu orden. Te contactaremos pronto para confirmar los detalles.</p>`,
        attachments: [attachment],
      },
    ];

    const resendResponses = await Promise.all(
      emails.map((email) =>
        fetch(RESEND_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(email),
        })
      ),
    );

    if (resendResponses.some(res => !res.ok)) {
        console.error("Fallo al enviar uno o más correos a través de Resend.");
    }

    return new Response(
      JSON.stringify({ message: "PDF generado y correos enviados con éxito." }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error en la Edge Function (Catch):", error);
    return new Response(
      JSON.stringify({ message: `Error interno: ${error.message}` }),
      { status: 500, headers: corsHeaders },
    );
  }
});