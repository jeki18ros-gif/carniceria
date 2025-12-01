// supabase/functions/generar-pedido-pdf/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // ================================
  //   CORS
  // ================================
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cliente, productos, fecha_entrega, comentarios } = await req.json();

    if (!cliente || !productos || productos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Datos incompletos para generar el pedido." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ================================
    // VARIABLES DE ENTORNO
    // ================================
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const pdfApiKey = Deno.env.get("PDF-API-KEY");

    if (!pdfApiKey) {
      return new Response(JSON.stringify({ error: "PDF API KEY no encontrada." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const dbHeaders = {
      "apikey": supabaseServiceKey,
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
    };

    // ================================
    // INSERTAR ORDEN
    // ================================
    const ordenInsert = await fetch(`${supabaseUrl}/rest/v1/ordenes`, {
      method: "POST",
      headers: dbHeaders,
      body: JSON.stringify({
        cliente_nombre: cliente.nombre,
        cliente_telefono: cliente.telefono,
        cliente_correo: cliente.correo,
        cliente_direccion: cliente.direccion,
        entrega: cliente.entrega,
        comentarios,
        fecha_entrega,
        created_at: new Date().toISOString(),
      }),
    });

    const ordenData = await ordenInsert.json();

    if (!ordenInsert.ok) {
      return new Response(JSON.stringify(ordenData), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const orden_id = ordenData[0].id;

    // ================================
    // INSERTAR PRODUCTOS
    // ================================
    const productosInsert = await fetch(
      `${supabaseUrl}/rest/v1/ordenes_productos`,
      {
        method: "POST",
        headers: dbHeaders,
        body: JSON.stringify(
          productos.map((p) => ({
            orden_id,
            producto_id: p.id,
            nombre: p.nombre,
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
          }))
        ),
      }
    );

    if (!productosInsert.ok) {
      const err = await productosInsert.json();
      return new Response(JSON.stringify(err), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // ================================
    // GENERAR HTML
    // ================================
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; background: #f7f7f7; }
            .card { background: white; padding: 24px; border-radius: 16px; }
            h1 { color: #b8860b; text-align: center; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          </style>
        </head>

        <body>
          <div class="card">
            <h1>Pedido #${orden_id}</h1>
            <h3>Datos del Cliente</h3>
            <p><strong>Nombre:</strong> ${cliente.nombre}</p>
            <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
            <p><strong>Correo:</strong> ${cliente.correo}</p>

            <h3>Productos</h3>
            <table>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Especificaciones</th>
              </tr>
              ${productos
                .map(
                  (p) => `
                    <tr>
                      <td>${p.nombre}</td>
                      <td>${p.cantidad_valor} ${p.cantidad_unidad}</td>
                      <td>${p.observacion || "-"}</td>
                    </tr>
                  `
                )
                .join("")}
            </table>

            <h3>Comentarios</h3>
            <p>${comentarios || "Sin comentarios"}</p>
          </div>
        </body>
      </html>
    `;

    // ================================
    // GENERAR PDF
    // ================================
    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(pdfApiKey + ":"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: html,
        format: "A4",
        use_print: true,
      }),
    });

    if (!pdfResponse.ok) {
      const err = await pdfResponse.text();
      return new Response(
        JSON.stringify({ error: "Error generando PDF", details: err }),
        { status: 500, headers: corsHeaders }
      );
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    // ================================
    // SUBIR PDF A STORAGE
    // ================================
    const fileName = `pedido_${orden_id}.pdf`;

    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/documents/${fileName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/pdf",
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "apikey": supabaseServiceKey,
        },
        body: pdfArrayBuffer,
      }
    );

    if (!uploadRes.ok) {
      return new Response(uploadRes.statusText, {
        status: 500,
        headers: corsHeaders,
      });
    }

    const pdf_url = `${supabaseUrl}/storage/v1/object/public/documents/${fileName}`;

    // =================================
    // RESPUESTA FINAL CON CORS
    // =================================
    return new Response(
      JSON.stringify({
        success: true,
        orden_id,
        pdf_url,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
