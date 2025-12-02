import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.esm.min.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// =========================================
// ENVIRONMENT VARIABLES
// =========================================
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Supabase admin client
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

// =========================================
// CORS
// =========================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// =========================================
// SERVIDOR PRINCIPAL
// =========================================
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    // =========================================
    // 1️⃣ RECIBIR DATA DEL FRONTEND
    // =========================================
    const pedido = await req.json();
    const { cliente, productos, fecha_entrega, comentarios } = pedido;

    if (!cliente?.nombre || !cliente?.correo) {
      return new Response(
        JSON.stringify({ error: "Datos insuficientes del cliente." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // =========================================
    // 2️⃣ INSERTAR ORDEN
    // =========================================
    const { data: ordenData, error: ordenError } = await supabase
      .from("ordenes")
      .insert({
        nombre_cliente: cliente.nombre,
        cliente_telefono: cliente.telefono || null,
        cliente_correo: cliente.correo,
        cliente_direccion: cliente.direccion || null,
        entrega: cliente.entrega || null,
        comentarios: cliente.comentarios || comentarios || null,
        fecha_entrega: fecha_entrega || null,
      })
      .select()
      .single();

    if (ordenError) throw ordenError;

    const orden_id = ordenData.id;

    // =========================================
    // 3️⃣ INSERTAR PRODUCTOS
    // =========================================
    const productosList = productos.map((p: any) => ({
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

    const { error: productosError } = await supabase
      .from("ordenes_productos")
      .insert(productosList);

    if (productosError) throw productosError;

    // =========================================
    // 4️⃣ GENERAR PDF
    // =========================================
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 760;
    const line = (text: string, size = 12, isBold = false) => {
      page.drawText(text, {
        x: 50,
        y,
        size,
        font: isBold ? bold : font,
        color: rgb(0, 0, 0),
      });
      y -= size + 6;
    };

    // Header
    page.drawText("Orden de Pedido", { x: 200, y, size: 22, font: bold });
    y -= 40;

    // Datos del Cliente
    line("Datos del Cliente", 16, true);
    line(`Nombre: ${cliente.nombre}`);
    line(`Correo: ${cliente.correo}`);
    line(`Teléfono: ${cliente.telefono || "No indicado"}`);
    line(`Dirección: ${cliente.direccion || "No indicada"}`);
    line(`Entrega: ${cliente.entrega || "No indicado"}`);
    line(`Fecha de Entrega: ${fecha_entrega || "No indicada"}`);
    line(`Comentarios: ${cliente.comentarios || "Ninguno"}`);

    y -= 10;

    // Productos
    line("Productos Solicitados", 16, true);
    productos.forEach((p: any, index: number) => {
      line(`Producto ${index + 1}: ${p.nombre}`, 14, true);
      Object.entries(p).forEach(([key, value]) => {
        if (key !== "nombre") line(`- ${key}: ${value || "N/A"}`);
      });
      y -= 10;
    });

    const pdfBytes = await pdfDoc.save();

    // =========================================
    // 5️⃣ SUBIR PDF A SUPABASE STORAGE
    // =========================================
    const filename = `pedido-${orden_id}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("pedidos-pdf")
      .upload(filename, pdfBytes, {
        contentType: "application/pdf",
      });

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data: publicURL } = supabase
      .storage
      .from("pedidos-pdf")
      .getPublicUrl(filename);

    const pdf_url = publicURL.publicUrl;

    // =========================================
    // 6️⃣ GUARDAR URL EN TABLA pedidos_pdf
    // =========================================
    await supabase.from("pedidos_pdf").insert({
      orden_id,
      pdf_url,
    });

   // =========================================
// 7️⃣ PREPARAMOS LOS DATOS PARA EL FRONTEND
// =========================================

const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

const orderSummaryHtml = `
  <h2>Pedido registrado</h2>
  <p><strong>Cliente:</strong> ${cliente.nombre}</p>
  <p><strong>Email:</strong> ${cliente.correo}</p>
  <p><strong>Fecha de entrega:</strong> ${fecha_entrega}</p>
  <hr/>
  <h3>Productos</h3>
  <ul>
    ${productos.map(p => `<li>${p.nombre}</li>`).join("")}
  </ul>
`;

return new Response(
  JSON.stringify({
    message: "Pedido generado",
    orden_id,
    pdf_url,
    pdfBase64,
    customerName: cliente.nombre,
    customerEmail: cliente.correo,
    orderSummaryHtml
  }),
  { status: 200, headers: corsHeaders }
);


    // =========================================
    // 8️⃣ RESPUESTA FINAL
    // =========================================
    return new Response(
      JSON.stringify({
        message: "Pedido procesado correctamente",
        orden_id,
        pdf_url,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("❌ Error general:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
