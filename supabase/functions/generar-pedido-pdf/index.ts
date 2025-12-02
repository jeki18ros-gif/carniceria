// ========= generar-pedido-pdf (CORREGIDA & SINCRONIZADA) ========= //

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { PDFDocument, StandardFonts } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============ CONFIG ============ //

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============ CORS ============ //

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ============ SERVE ============ //

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { productos, totalGeneral, cliente } = await req.json();

    // ===== VALIDACIÓN =====

    if (!cliente?.nombre_cliente || !cliente?.correo) {
      return new Response(
        JSON.stringify({ message: "Datos insuficientes del cliente." }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!productos || productos.length === 0) {
      return new Response(
        JSON.stringify({ message: "No hay productos en el pedido." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ===== CREAR ORDEN =====

    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .insert({
        nombre_cliente: cliente.nombre_cliente,
        telefono: cliente.telefono || null,
        correo: cliente.correo,
        descripcion: productos.map((p) => p.nombre).join(", "),
        total_general: totalGeneral,
      })
      .select()
      .single();

    if (ordenError) {
      console.error("Error insertando orden:", ordenError);
      throw new Error("No se pudo registrar la orden");
    }

    const orden_id = orden.id;

    // ===== GUARDAR PRODUCTOS =====

    for (const p of productos) {
      await supabase.from("ordenes_productos").insert({
        orden_id,
        producto_id: p.id,
        cantidad_valor: p.cantidad_valor,
        cantidad_unidad: p.cantidad_unidad,

        // ESPECIFICACIONES SINCRONIZADAS
        tipo_corte: p.tipo_corte,
        parte: p.parte,
        estado: p.estado,
        hueso: p.hueso,
        grasa: p.grasa,
        empaque: p.empaque,
        coccion: p.coccion,
        fecha_deseada: p.fecha_deseada,
        observacion: p.observacion,
      });
    }

    // ===== GENERAR PDF =====

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 760;

    const drawPageHeader = () => {
      page.drawText("Pedido del Cliente", { x: 50, y, size: 22, font });
      y -= 40;

      page.drawText(`Nombre: ${cliente.nombre_cliente}`, { x: 50, y, size: 14, font });
      y -= 20;

      if (cliente.telefono) {
        page.drawText(`Teléfono: ${cliente.telefono}`, { x: 50, y, size: 14, font });
        y -= 20;
      }

      page.drawText(`Correo: ${cliente.correo}`, { x: 50, y, size: 14, font });
      y -= 30;

      page.drawText("Productos:", { x: 50, y, size: 16, font });
      y -= 20;
    };

    drawPageHeader();

    for (const p of productos) {
      if (y < 120) {
        page = pdfDoc.addPage([600, 800]);
        y = 760;
        drawPageHeader();
      }

      page.drawText(`• ${p.nombre} — ${p.cantidad_valor} ${p.cantidad_unidad}`, {
        x: 50,
        y,
        size: 12,
        font,
      });

      y -= 15;

      const specs = [
        p.tipo_corte && `Corte: ${p.tipo_corte}`,
        p.parte && `Parte: ${p.parte}`,
        p.estado && `Estado: ${p.estado}`,
        p.hueso && `Hueso: ${p.hueso}`,
        p.grasa && `Grasa: ${p.grasa}`,
        p.empaque && `Empaque: ${p.empaque}`,
        p.coccion && `Cocción: ${p.coccion}`,
        p.fecha_deseada && `Fecha deseada: ${p.fecha_deseada}`,
        p.observacion && `Obs: ${p.observacion}`,
      ].filter(Boolean);

      for (const s of specs) {
        if (y < 80) {
          page = pdfDoc.addPage([600, 800]);
          y = 760;
        }

        page.drawText(`   - ${s}`, { x: 60, y, size: 10, font });
        y -= 12;
      }

      y -= 10;
    }

    page.drawText(`TOTAL GENERAL: S/ ${totalGeneral}`, {
      x: 50,
      y: y - 20,
      size: 16,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    // ===== SUBIR PDF =====

    const fileName = `pedido_${orden_id}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error subiendo PDF:", uploadError);
      throw new Error("No se pudo subir el PDF");
    }

    const { data: urlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);

    const pdf_url = urlData.publicUrl;

    // ===== ENVIAR EMAIL (Resend) =====

    const orderSummaryHtml = productos
      .map(
        (p) => `
        <div style="margin-bottom:10px">
          <strong>${p.nombre}</strong> — ${p.cantidad_valor} ${p.cantidad_unidad}<br/>
          ${p.tipo_corte ? `Corte: ${p.tipo_corte}<br/>` : ""}
          ${p.parte ? `Parte: ${p.parte}<br/>` : ""}
          ${p.estado ? `Estado: ${p.estado}<br/>` : ""}
          ${p.hueso ? `Hueso: ${p.hueso}<br/>` : ""}
          ${p.grasa ? `Grasa: ${p.grasa}<br/>` : ""}
          ${p.empaque ? `Empaque: ${p.empaque}<br/>` : ""}
          ${p.coccion ? `Cocción: ${p.coccion}<br/>` : ""}
          ${p.fecha_deseada ? `Fecha deseada: ${p.fecha_deseada}<br/>` : ""}
          ${p.observacion ? `Obs: ${p.observacion}<br/>` : ""}
        </div>
      `
      )
      .join("");

    await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["jeki18ros@gmail.com", cliente.correo],
        subject: `Nuevo Pedido de ${cliente.nombre_cliente}`,
        html: `
          <h2>Nuevo Pedido Registrado</h2>
          <p><strong>Cliente:</strong> ${cliente.nombre_cliente}</p>
          <p><strong>Correo:</strong> ${cliente.correo}</p>
          <hr/>
          ${orderSummaryHtml}
        `,
        attachments: [
          {
            filename: "pedido.pdf",
            content: pdfBase64,
            encoding: "base64",
          },
        ],
      }),
    });

    // ===== RESPUESTA FINAL =====

    return new Response(
      JSON.stringify({
        message: "Pedido generado y enviado correctamente.",
        orden_id,
        pdf_url,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("ERROR GENERAL:", err);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor", error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
