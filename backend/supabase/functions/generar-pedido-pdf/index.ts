// filename: functions/generar-pedido-pdf/index.ts

export const config = {
  runtime: "edge",
  verifyJwt: false,
};

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// -------------------------
// UTILIDADES
// -------------------------
function encodeBase64(uint8: Uint8Array | string) {
  if (typeof uint8 === "string") return btoa(uint8);
  let bin = "";
  uint8.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

async function bufferToUint8Array(buffer: ArrayBuffer) {
  return new Uint8Array(buffer);
}

// -------------------------
// ENV / CONFIG
// -------------------------
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY"); // required for sending mail
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "no-reply@tu-dominio.com";
const PDF_API_KEY = Deno.env.get("PDF_API_KEY"); // servicio para generar pdf (pdfshift u otro)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // service role para funciones server-side
const INCOMING_API_KEY = Deno.env.get("INCOMING_API_KEY"); // opcional: si está definido, se exige que la petición lleve x-api-key
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "jeki18ros@gmail.com";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "*").split(",");

// validaciones mínimas de env
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
}

// -------------------------
// CLIENTE SUPABASE
// -------------------------
const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!, {
  auth: { persistSession: false },
});

// -------------------------
// CORS
// -------------------------
function buildCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "content-type, apikey, x-api-key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (!origin) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "null";
  }

  return headers;
}

// -------------------------
// HTML / PDF
// -------------------------
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
      <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
        <h1>Orden de Pedido</h1>

        <h2>Cliente</h2>
        <p><strong>${cliente.nombre}</strong></p>
        <p>Tel: ${cliente.telefono}</p>
        <p>Email: ${cliente.correo}</p>
        <p>Dirección: ${cliente.direccion}</p>

        <h2>Detalles de Entrega</h2>
        <p>Método: ${pedido.entrega_metodo}</p>
        <p>Fecha entrega: ${pedido.fecha_entrega || "-"}</p>
        <p>Horario: ${pedido.horario || "-"}</p>

        <h2 style="margin-top:20px;">Productos</h2>
        <table width="100%" cellspacing="0" cellpadding="6" style="border-collapse: collapse;">
          <thead>
            <tr style="background:#f7f7f7;">
              <th style="text-align:left; padding:8px;">Producto</th>
              <th style="text-align:left; padding:8px;">Cantidad</th>
              <th style="text-align:left; padding:8px;">Detalles</th>
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

        <p style="font-size: 12px; color: #666; margin-top:30px;">
          Documento generado: ${new Date().toLocaleString()}
        </p>
      </body>
    </html>
  `;
}

async function generarPdf(html: string) {
  if (!PDF_API_KEY) throw new Error("Falta PDF_API_KEY");
  const auth = encodeBase64(`${PDF_API_KEY}:`);
  const res = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ source: html }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error PDF:", res.status, text);
    // Línea 153 modificada para DEBUGGING:
throw new Error(`PDFShift falló con código ${res.status}. Mensaje de PDFShift: ${text}`);
  }

  const ab = await res.arrayBuffer();
  return new Uint8Array(ab);
}

// -------------------------
// MAIN
// -------------------------
serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // seguridad: si INCOMING_API_KEY está definida → exigir header x-api-key
    if (INCOMING_API_KEY) {
      const incoming = req.headers.get("x-api-key") || req.headers.get("apikey");
      if (!incoming || incoming !== INCOMING_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized - invalid x-api-key" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();

    // --------- VALIDACIONES BÁSICAS ----------
    if (!payload) throw new Error("Cuerpo de la petición vacío");
    const clientePayload = payload.cliente;
    const productosPayload = payload.productos;

    if (!clientePayload?.correo) throw new Error("Falta correo del cliente");
    if (!clientePayload?.nombre) throw new Error("Falta nombre del cliente");
    if (!clientePayload?.telefono) throw new Error("Falta teléfono del cliente");
    if (!clientePayload?.direccion) throw new Error("Falta dirección del cliente");
    if (!Array.isArray(productosPayload) || productosPayload.length === 0)
      throw new Error("Debe incluir al menos un producto");

    // Opcional: tamaño máximo razonable de pedido
    if (productosPayload.length > 200) throw new Error("Pedido demasiado grande");

    // --------- 1) Buscar o crear cliente ----------
    let { data: cliente, error: clienteError } = await supabase
      .from("clientes")
      .select("*")
      .eq("correo", clientePayload.correo)
      .limit(1)
      .maybeSingle();

    if (clienteError) throw clienteError;

    if (!cliente) {
      const { data: nuevoCliente, error: nuevoClienteErr } = await supabase
        .from("clientes")
        .insert({
          nombre: clientePayload.nombre,
          telefono: clientePayload.telefono,
          correo: clientePayload.correo,
          direccion: clientePayload.direccion,
        })
        .select()
        .single();

      if (nuevoClienteErr) throw nuevoClienteErr;
      cliente = nuevoCliente;
    }

    // --------- 2) VALIDAR PRODUCTOS EXISTENTES Y TOMAR PRECIOS ----------
    const productoIds = productosPayload.map((p: any) => p.id).filter(Boolean);
    if (productoIds.length === 0) throw new Error("Productos sin id válidos");

    const { data: productsFromDb, error: prodErr } = await supabase
      .from("productos")
      .select("*")
      .in("id", productoIds);

    if (prodErr) throw prodErr;

    const productsMap = new Map<number, any>();
    productsFromDb?.forEach((pr: any) => productsMap.set(Number(pr.id), pr));

    // Validar que todos existan
    const missing = productoIds.filter((id: any) => !productsMap.has(Number(id)));
    if (missing.length) throw new Error(`Productos no encontrados: ${missing.join(", ")}`);

    // --------- 3) Crear orden ----------
    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .insert({
        cliente_id: cliente.id,
        entrega_metodo: payload.entrega_metodo ?? clientePayload.entrega ?? "tienda",
        fecha_entrega: payload.fecha_entrega ?? null,
        horario: payload.horario ?? null,
        comentarios: payload.comentarios ?? null,
      })
      .select()
      .single();

    if (ordenError) throw ordenError;

    // --------- 4) Crear orden_items (con datos sencillos) ----------
    // Nota: tu schema no tiene precio_unitario/subtotal — si quieres persistirlos, tendrías que modificar schema.
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

    const { error: itemsError } = await supabase.from("orden_items").insert(itemsToInsert);
    if (itemsError) throw itemsError;

    // --------- 5) Preparar items para PDF (con precios traídos de la tabla productos) ----------
    const itemsConPrecio = productosPayload.map((p: any) => {
      const dbProd = productsMap.get(Number(p.id));
      const precio_unitario = dbProd?.precio ? Number(dbProd.precio) : 0;
      const cantidadNumeric = Number(p.cantidad_valor) || 1;
      const subtotal = Number((precio_unitario * cantidadNumeric).toFixed(2));
      return {
        id: p.id,
        nombre: dbProd?.nombre ?? p.nombre ?? "Producto",
        cantidad_valor: p.cantidad_valor ?? "1",
        cantidad_unidad: p.cantidad_unidad ?? "",
        precio_unitario,
        subtotal,
        // conservar otras especificaciones para extender si quieres
        tipo_corte: p.tipo_corte,
        parte: p.parte,
        observacion: p.observacion,
      };
    });

    // --------- 6) Generar HTML y PDF ----------
    const html = generarHTMLPedido(payload, cliente, itemsConPrecio);
    const pdfBytes = await generarPdf(html); // Uint8Array

    // --------- 7) Subir al storage en carpeta por orden ----------
    const filePath = `pedidos/${orden.id}/orden_${orden.id}.pdf`;
    // En supabase-js v2: upload(path, file)
    // convert Uint8Array a Blob para compatibilidad
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    const uploadRes = await supabase.storage.from("pedidos").upload(filePath, pdfBlob, {
      contentType: "application/pdf",
      upsert: true,
    });

    if (uploadRes.error) {
      console.error("Upload error:", uploadRes.error);
      throw uploadRes.error;
    }

    // Obtener URL pública (v2)
    const { data: publicUrlData, error: publicUrlErr } = await supabase.storage
      .from("pedidos")
      .getPublicUrl(filePath);

    if (publicUrlErr) {
      console.warn("Error obteniendo publicUrl:", publicUrlErr);
    }

    const publicUrl = publicUrlData?.publicUrl ?? null;

    // --------- 8) Registrar en ordenes_pdfs ----------
    const { error: pdfInsertErr } = await supabase.from("ordenes_pdfs").insert({
      orden_id: orden.id,
      url_pdf: publicUrl ?? filePath,
      enviado_al_cliente: false,
      enviado_al_admin: false,
    });

    if (pdfInsertErr) console.warn("No se pudo registrar ordenes_pdfs:", pdfInsertErr);

    // --------- 9) Enviar correos (Resend) con attachment ----------
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY no definido, se omite envío de correos.");
    } else {
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

        const text = await r.text();
        if (!r.ok) {
          console.error(`Error al enviar email a ${to}:`, r.status, text);
          return { ok: false, status: r.status, body: text };
        }
        return { ok: true, status: r.status, body: text };
      };

      // admin
      const adminResp = await send(
        ADMIN_EMAIL,
        `Nuevo pedido #${orden.id}`,
        `<p>Nuevo pedido recibido. ID: ${orden.id}</p><p>Ver PDF: ${publicUrl ?? "Adjunto"}</p>`
      );

      // cliente
      const clienteResp = await send(
        cliente.correo,
        `Confirmación de Pedido #${orden.id}`,
        `<p>Gracias por tu compra, ${cliente.nombre}.</p><p>Adjuntamos el detalle del pedido.</p>`
      );

      // actualizar tabla ordenes_pdfs con resultado (opcional)
      await supabase
        .from("ordenes_pdfs")
        .update({
          enviado_al_admin: adminResp.ok,
          enviado_al_cliente: clienteResp.ok,
        })
        .eq("orden_id", orden.id);
    }

    // --------- 10) Respuesta ----------
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
    const origin = req.headers.get("origin");
    const corsHeaders = buildCorsHeaders(origin);
    return new Response(
      JSON.stringify({ success: false, error: err.message ?? String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
