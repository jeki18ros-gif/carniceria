// filename: functions/generar-pedido-pdf/index.ts

export const config = {
  runtime: "edge",
  verifyJwt: false,
};

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* -------------------------
   UTILIDADES
------------------------- */
function encodeBase64(uint8: Uint8Array | string) {
  if (typeof uint8 === "string") return btoa(uint8);
  let bin = "";
  uint8.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

/* -------------------------
   ENV / CONFIG
------------------------- */
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "no-reply@tu-dominio.com";
const PDF_GENERATOR_URL = Deno.env.get("PDF_GENERATOR_URL"); // Vercel puppeteer
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "jeki18ros@gmail.com";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "*").split(",");

// Detener si falta SUPABASE o PDF
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
}
if (!PDF_GENERATOR_URL) {
  console.error("❌ Falta PDF_GENERATOR_URL (requerida)");
}

/* -------------------------
   CLIENTE SUPABASE
------------------------- */
const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!, {
  auth: { persistSession: false },
});

/* -------------------------
   CORS
------------------------- */
function buildCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "content-type, apikey, x-api-key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (!origin) headers["Access-Control-Allow-Origin"] = "*";
  else if (ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin))
    headers["Access-Control-Allow-Origin"] = origin;
  else headers["Access-Control-Allow-Origin"] = "null";

  return headers;
}

/* -------------------------
   GENERAR PDF (Vercel)
------------------------- */
async function generarPdf(html: string) {
  if (!PDF_GENERATOR_URL) {
    throw new Error("PDF_GENERATOR_URL no está definido en las variables de entorno.");
  }

  const res = await fetch(PDF_GENERATOR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, fileName: "orden_de_compra.pdf" }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error del generador PDF (${res.status}): ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/* -------------------------
   HTML DEL PEDIDO
------------------------- */
function generarHTMLPedido(pedido: any, cliente: any, items: any[]) {
  const productosHTML = items
    .map(
      (p) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding:8px;"><b>${p.nombre}</b></td>
        <td style="padding:8px;">${p.cantidad_valor} ${p.cantidad_unidad}</td>
        <td style="padding:8px;">
          ${p.tipo_corte ?? ""}
          ${p.parte ?? ""}
          ${p.estado ?? ""}
          ${p.hueso ?? ""}
          ${p.grasa ?? ""}
          ${p.empaque ?? ""}
          ${p.coccion ?? ""}
          ${p.observacion ? "<br><i>" + p.observacion + "</i>" : ""}
        </td>
      </tr>`
    )
    .join("");

  return `
    <html>
      <body style="font-family: Arial; padding:20px;">
        <h1>Orden de Pedido</h1>

        <h2>Cliente</h2>
        <p><strong>${cliente.nombre}</strong></p>
        <p>Tel: ${cliente.telefono}</p>
        <p>Email: ${cliente.correo}</p>
        <p>Dirección: ${cliente.direccion}</p>

        <h2>Entrega</h2>
        <p>Método: ${pedido.entrega_metodo}</p>
        <p>Fecha: ${pedido.fecha_entrega ?? "-"}</p>
        <p>Horario: ${pedido.horario ?? "-"}</p>

        <h2 style="margin-top:20px;">Productos</h2>
        <table width="100%" cellspacing="0" cellpadding="6" style="border-collapse: collapse;">
          <thead>
            <tr style="background:#f7f7f7;">
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>

        ${
          pedido.comentarios
            ? `<h3 style="margin-top:20px;">Comentarios</h3><p>${pedido.comentarios}</p>`
            : ""
        }

        <p style="font-size:12px; color:#666; margin-top:30px;">
          Generado: ${new Date().toLocaleString()}
        </p>
      </body>
    </html>
  `;
}

/* -------------------------
   MAIN FUNCTION
------------------------- */
serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* -------------------------
       1) PARSE BODY
    ------------------------- */
    const payload = await req.json();
    if (!payload) throw new Error("No se recibió cuerpo JSON.");

    const clientePayload = payload.cliente;
    const productosPayload = payload.productos;

    if (!clientePayload?.correo) throw new Error("Falta correo del cliente.");
    if (!clientePayload?.nombre) throw new Error("Falta nombre del cliente.");
    if (!clientePayload?.telefono) throw new Error("Falta teléfono del cliente.");
    if (!clientePayload?.direccion) throw new Error("Falta dirección del cliente.");

    if (!Array.isArray(productosPayload) || productosPayload.length === 0)
      throw new Error("Debe incluir productos.");

    /* -------------------------
       2) BUSCAR/CREAR CLIENTE
    ------------------------- */
    let { data: cliente } = await supabase
      .from("clientes")
      .select("*")
      .eq("correo", clientePayload.correo)
      .maybeSingle();

    if (!cliente) {
      const insert = await supabase
        .from("clientes")
        .insert({
          nombre: clientePayload.nombre,
          telefono: clientePayload.telefono,
          correo: clientePayload.correo,
          direccion: clientePayload.direccion,
        })
        .select()
        .single();

      if (insert.error) throw insert.error;
      cliente = insert.data;
    }

    /* -------------------------
       3) VALIDAR PRODUCTOS
    ------------------------- */
    const productoIds = productosPayload.map((p: any) => Number(p.id));
    const { data: productsDb, error: prodErr } = await supabase
      .from("productos")
      .select("*")
      .in("id", productoIds);

    if (prodErr) throw prodErr;

    const productsMap = new Map<number, any>();
    productsDb?.forEach((p) => productsMap.set(Number(p.id), p));

    /* -------------------------
       4) CREAR ORDEN
    ------------------------- */
    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .insert({
        cliente_id: cliente.id,
        entrega_metodo: payload.entrega_metodo ?? "tienda",
        fecha_entrega: payload.fecha_entrega ?? null,
        horario: payload.horario ?? null,
        comentarios: payload.comentarios ?? null,
      })
      .select()
      .single();

    if (ordenError) throw ordenError;

    /* -------------------------
       5) INSERTAR ITEMS
    ------------------------- */
    const itemsToInsert = productosPayload.map((p: any) => ({
      orden_id: orden.id,
      producto_id: p.id,
      cantidad_valor: p.cantidad_valor ?? "1",
      cantidad_unidad: p.cantidad_unidad ?? "",
      tipo_corte: p.tipo_corte ?? null,
      parte: p.parte ?? null,
      estado: p.estado ?? null,
      hueso: p.hueso ?? null,
      grasa: p.grasa ?? null,
      empaque: p.empaque ?? null,
      coccion: p.coccion ?? null,
      fecha_deseada: p.fecha_deseada ?? null,
      observacion: p.observacion ?? null,
    }));

    await supabase.from("orden_items").insert(itemsToInsert);

    /* -------------------------
       6) PREPARAR ITEMS PARA PDF
    ------------------------- */
    const itemsConPrecio = productosPayload.map((p: any) => {
      const dbProd = productsMap.get(Number(p.id));
      const precio_unitario = Number(dbProd?.precio ?? 0);
      const cantidad = Number(p.cantidad_valor) || 1;
      return {
        id: p.id,
        nombre: dbProd?.nombre ?? "Producto",
        cantidad_valor: p.cantidad_valor,
        cantidad_unidad: p.cantidad_unidad,
        precio_unitario,
        subtotal: Number((precio_unitario * cantidad).toFixed(2)),
        tipo_corte: p.tipo_corte,
        parte: p.parte,
        observacion: p.observacion,
      };
    });

    /* -------------------------
       7) GENERAR HTML Y PDF
    ------------------------- */
    // ✔ FIX PRINCIPAL
    const html = generarHTMLPedido(orden, cliente, itemsConPrecio);

    const pdfBytes = await generarPdf(html);

    /* -------------------------
       8) SUBIR PDF A STORAGE
    ------------------------- */
    const filePath = `pedidos/${orden.id}/orden_${orden.id}.pdf`;

    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    const upload = await supabase.storage
      .from("pedidos")
      .upload(filePath, pdfBlob, { upsert: true });

    if (upload.error) throw upload.error;

    const { data: publicUrlData } = await supabase.storage
      .from("pedidos")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl ?? null;

    /* -------------------------
       9) REGISTRAR PDF
    ------------------------- */
    await supabase.from("ordenes_pdfs").insert({
      orden_id: orden.id,
      url_pdf: publicUrl ?? filePath,
      enviado_al_cliente: false,
      enviado_al_admin: false,
    });

    /* -------------------------
       10) ENVIAR EMAILS (Resend)
    ------------------------- */
    if (RESEND_API_KEY) {
      const attachment = {
        filename: `orden_${orden.id}.pdf`,
        content: encodeBase64(pdfBytes),
      };

      const send = async (to: string, subject: string, htmlBody: string) => {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: RESEND_FROM,
            to,
            subject,
            html: htmlBody,
            attachments: [attachment],
          }),
        });
        return r.ok;
      };

      const okAdmin = await send(
        ADMIN_EMAIL,
        `Nuevo Pedido #${orden.id}`,
        `<p>Nuevo pedido recibido. PDF adjunto.</p>`
      );

      const okCliente = await send(
        cliente.correo,
        `Confirmación de Pedido #${orden.id}`,
        `<p>Gracias por tu compra, ${cliente.nombre}.</p>`
      );

      await supabase
        .from("ordenes_pdfs")
        .update({
          enviado_al_admin: okAdmin,
          enviado_al_cliente: okCliente,
        })
        .eq("orden_id", orden.id);
    }

    /* -------------------------
       RESPUESTA
    ------------------------- */
    return new Response(
      JSON.stringify({
        success: true,
        orden_id: orden.id,
        pdf_url: publicUrl,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("❌ ERROR:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message ?? String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
