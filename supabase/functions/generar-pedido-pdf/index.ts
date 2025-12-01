// supabase/functions/generar-pedido-pdf/index.ts
// ==============================================
// 📄 Generar un PDF de un pedido (orden + productos)
// Insertar en DB → Crear PDF → Guardar en Storage → Devolver URL
// ==============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { cliente, productos, fecha_entrega, comentarios } = await req.json();

    // ================================
    //   VALIDAR INPUT BÁSICO
    // ================================
    if (!cliente || !productos || productos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Datos incompletos para generar el pedido." }),
        { status: 400 }
      );
    }

    // ================================
    //   LEER VARIABLES DE ENTORNO
    // ================================
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const pdfApiKey = Deno.env.get("PDF-API-KEY"); // PDFShift
    if (!pdfApiKey) {
      return new Response(JSON.stringify({ error: "PDF API KEY no encontrada." }), {
        status: 500,
      });
    }

    const headers = {
      "apikey": supabaseServiceKey,
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
    };

    // ================================
    //   INSERTAR ORDEN EN TABLA ordenes
    // ================================
    const ordenInsert = await fetch(`${supabaseUrl}/rest/v1/ordenes`, {
      method: "POST",
      headers,
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
      console.log(ordenData);
      throw new Error("Error creando orden en la BD.");
    }

    const orden_id = ordenData[0].id;

    // ================================
    //   INSERTAR PRODUCTOS DE LA ORDEN
    // ================================
    const productosConOrden = productos.map((p) => ({
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
    }));

    const productosInsert = await fetch(`${supabaseUrl}/rest/v1/ordenes_productos`, {
      method: "POST",
      headers,
      body: JSON.stringify(productosConOrden),
    });

    if (!productosInsert.ok) {
      const err = await productosInsert.json();
      console.log(err);
      throw new Error("Error insertando productos en la orden.");
    }

    // ================================
    //   GENERAR HTML DEL PDF
    // ================================
    const html = `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              background: #f7f7f7;
            }
            .card {
              background: white;
              padding: 24px;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            h1 { color: #b8860b; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; font-size: 14px; }
            th { background: #eee; }
          </style>
        </head>

        <body>
          <div class="card">
            <h1>Pedido #${orden_id}</h1>

            <h3>Datos del Cliente</h3>
            <p><strong>Nombre:</strong> ${cliente.nombre}</p>
            <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
            <p><strong>Correo:</strong> ${cliente.correo}</p>
            <p><strong>Dirección:</strong> ${cliente.direccion}</p>

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
    //   GENERAR PDF CON PDFSHIFT
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
        use_print: false,
      }),
    });

    if (!pdfResponse.ok) {
      throw new Error("Error generando PDF con PDFShift.");
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    // ================================
    //   GUARDAR PDF EN SUPABASE STORAGE
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
      console.log(await uploadRes.text());
      throw new Error("Error subiendo PDF a Supabase Storage.");
    }

    // URL pública del PDF
    const pdf_url = `${supabaseUrl}/storage/v1/object/public/documents/${fileName}`;

    // ================================
    //   RESPUESTA FINAL
    // ================================
    return new Response(
      JSON.stringify({ success: true, orden_id, pdf_url }),
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
