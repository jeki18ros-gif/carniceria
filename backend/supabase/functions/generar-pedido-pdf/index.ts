// supabase/functions/generar-pedido-pdf/index.ts

export const config = {
  runtime: "edge",
  verifyJwt: false,
};

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// =====================================================
//      BASE64 HELPERS
// =====================================================
function encodeBase64(uint8: Uint8Array | string) {
  if (typeof uint8 === "string") return btoa(uint8);

  let bin = "";
  uint8.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function decodeBase64(base64: string) {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);

  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// =====================================================
//      ENV KEYS
// =====================================================
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const PDF_API_KEY = Deno.env.get("PDF_API_KEY");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

const TU_CORREO = "jeki18ros@gmail.com";

// =====================================================
//      CORS
// =====================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// =====================================================
//      GENERAR HTML
// =====================================================
function generarHTMLPedido(pedido: any) {
  const productosHTML = pedido.productos
    .map(
      (p) => `
      <tr>
        <td><b>${p.nombre}</b></td>
        <td>${p.cantidad_valor} ${p.cantidad_unidad}</td>
        <td>
          ${
            Object.entries(p)
              .filter(
                ([key, val]) =>
                  !["id", "nombre", "cantidad_valor", "cantidad_unidad"].includes(
                    key
                  ) && val
              )
              .map(([k, v]) => `• ${k}: ${v}`)
              .join("<br>")
          }
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h1>Orden de Compra</h1>

        <h2>Cliente</h2>
        <p><strong>${pedido.cliente.nombre}</strong></p>
        <p>${pedido.cliente.telefono}</p>
        <p>${pedido.cliente.correo}</p>
        <p>${pedido.cliente.direccion}</p>

        <h2>Productos</h2>
        <table width="100%">
          ${productosHTML}
        </table>

        ${
          pedido.comentarios
            ? `<h3>Comentarios:</h3><p>${pedido.comentarios}</p>`
            : ""
        }
      </body>
    </html>
  `;
}

// =====================================================
//      GENERAR PDF (PDFShift)
// =====================================================
async function generarPdf(html: string) {
  const auth = encodeBase64(`${PDF_API_KEY}:`);

  const res = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ source: html }),
  });

  if (!res.ok) throw new Error("Error generando PDF");

  return new Uint8Array(await res.arrayBuffer());
}

// =====================================================
//      MAIN
// =====================================================
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const pedido = await req.json();

    // =====================================================
    //      1. Buscar o crear cliente
    // =====================================================
    let { data: cliente } = await supabase
      .from("clientes")
      .select("*")
      .eq("correo", pedido.cliente.correo)
      .single();

    if (!cliente) {
      const result = await supabase
        .from("clientes")
        .insert({
          nombre: pedido.cliente.nombre,
          telefono: pedido.cliente.telefono,
          correo: pedido.cliente.correo,
          direccion: pedido.cliente.direccion,
        })
        .select()
        .single();

      cliente = result.data;
    }

    // =====================================================
    //      2. Crear orden
    // =====================================================
    const { data: orden } = await supabase
      .from("ordenes")
      .insert({
        cliente_id: cliente.id,
        entrega_metodo: pedido.cliente.entrega,
        fecha_entrega: pedido.fecha_entrega,
        comentarios: pedido.comentarios,
      })
      .select()
      .single();

    // =====================================================
    //      3. Crear items
    // =====================================================
    const items = pedido.productos.map((p) => ({
      orden_id: orden.id,
      producto_id: p.id,
      cantidad_valor: p.cantidad_valor,
      cantidad_unidad: p.cantidad_unidad,
      tipo_corte: p.tipo_corte,
      parte: p.parte,
      estado: p.estado,
      hueso: p.hueso,
      grasa: p.grasa,
      empaque: p.empaque,
      coccion: p.coccion,
      fecha_deseada: p.fecha_deseada,
      observacion: p.observacion,
    }));

    await supabase.from("orden_items").insert(items);

    // =====================================================
    //      4. Generar PDF
    // =====================================================
    const html = generarHTMLPedido(pedido);
    const pdfBytes = await generarPdf(html);

    const fileName = `orden_${orden.id}.pdf`;

    // =====================================================
    //      5. Subir a Storage
    // =====================================================
    const { data: fileData, error: uploadError } = await supabase.storage
      .from("pedidos")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from("pedidos")
      .getPublicUrl(fileName);

    // =====================================================
    //      6. Registrar el PDF en la tabla
    // =====================================================
    await supabase.from("ordenes_pdfs").insert({
      orden_id: orden.id,
      url_pdf: publicUrl.publicUrl,
      enviado_al_cliente: true,
      enviado_al_admin: true,
    });

    // =====================================================
    //      7. Enviar correos
    // =====================================================
    const attachmentBase64 = encodeBase64(pdfBytes);

    const attachment = {
      filename: fileName,
      content: attachmentBase64,
    };

    // ADMIN
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: TU_CORREO,
        subject: `Nuevo pedido (#${orden.id})`,
        html: "<p>Se registró un nuevo pedido.</p>",
        attachments: [attachment],
      }),
    });

    // CLIENTE
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: cliente.correo,
        subject: `Confirmación de Pedido`,
        html: "<p>Gracias por tu compra.</p>",
        attachments: [attachment],
      }),
    });

    // =====================================================
    //      8. Respuesta final
    // =====================================================
    return new Response(
      JSON.stringify({
        success: true,
        orden_id: orden.id,
        pdf_url: publicUrl.publicUrl,
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
