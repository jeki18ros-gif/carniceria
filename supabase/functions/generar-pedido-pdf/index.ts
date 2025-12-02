import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { PDFDocument, StandardFonts } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============ CONFIG ============ //

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============ CORS ============ //

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Función para convertir Uint8Array a Base64 de forma robusta en Deno (necesaria para el siguiente paso)
function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  const CHUNK_SIZE = 0x8000;
  let binary = '';
  for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode.apply(null, uint8Array.subarray(i, i + CHUNK_SIZE) as unknown as number[]);
  }
  return btoa(binary);
}


// ============ SERVE ============ //

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // --- parse request
    const { productos, cliente } = await req.json();

    // ===== VALIDACIÓN (Omisión de código por brevedad) =====
    if (!cliente?.nombre_cliente || !cliente?.correo || !productos || productos.length === 0) {
      return new Response(
        JSON.stringify({ message: "Datos de cliente o productos insuficientes." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // ===== CREAR ORDEN (BBDD) (Omisión de código por brevedad) =====
    // Si tu código usa: cliente.telefono y cliente.correo
const { data: orden, error: ordenError } = await supabase
  .from("ordenes")
  .insert({
    nombre_cliente: cliente.nombre_cliente, // Coincide (se ve en imagen 1)
    cliente_telefono: cliente.telefono || null, // ¡CORREGIDO!
    cliente_correo: cliente.correo, // ¡CORREGIDO! (Si la BD solo tiene cliente_correo)
    comentarios: productos.map((p: any) => p.nombre).join(", "), // No se ve la descripción, pero asumimos que existe
  })
  .select()
  .single();

    if (ordenError) {
      console.error("Error insertando orden:", ordenError);
      return new Response(
        JSON.stringify({ message: "No se pudo registrar la orden.", detail: ordenError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orden_id = (orden as any).id;

    // ===== GUARDAR PRODUCTOS (BBDD) (Omisión de código por brevedad) =====
    const productosParaInsertar = productos.map((p: any) => ({
      orden_id,
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

    const { error: prodError } = await supabase
      .from("ordenes_productos")
      .insert(productosParaInsertar);

    if (prodError) {
      console.warn("Advertencia: Error insertando productos en ordenes_productos, pero la orden principal se guardó:", prodError);
      // No devolvemos 500, continuamos.
    }

    // ===== GENERAR PDF (pdf-lib) (Omisión de código por brevedad) =====
    const pdfDoc = await PDFDocument.create();
    // ... (código de generación de PDF)
    let page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = 760;

    const drawPageHeader = () => {
        page.drawText(`Pedido No. ${orden_id}`, { x: 50, y, size: 10, font });
        y -= 20;
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
        
        page.drawText(`• ${p.nombre} — ${p.cantidad_valor} ${p.cantidad_unidad}`, { x: 50, y, size: 12, font });
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
            page.drawText(`   - ${s}`, { x: 60, y, size: 10, font });
            y -= 12;
        }
        y -= 10;
    }

    const pdfBytes = await pdfDoc.save(); // Uint8Array
    const pdfBase64 = uint8ArrayToBase64(pdfBytes); // Conversión a Base64

    // ===== SUBIR PDF (STORAGE) (Omisión de código por brevedad) =====
    const fileName = `pedido_${orden_id}.pdf`;
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error subiendo PDF a Storage:", uploadError);
      return new Response(
        JSON.stringify({ message: "No se pudo subir el PDF", detail: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== OBTENER URL PÚBLICA =====
    const { data: urlData, error: urlError } = await supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);

    if (urlError || !urlData?.publicUrl) {
      console.error("Error: URL pública del PDF no disponible.", urlError);
      return new Response(
        JSON.stringify({ message: "Fallo al obtener URL pública del PDF." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // ===== RESPUESTA FINAL =====
    // Retornamos todos los datos necesarios para el siguiente paso (send-order-email)
    return new Response(
      JSON.stringify({
        message: "Pedido generado, PDF subido y URL obtenida correctamente.",
        orden_id,
        pdf_url: urlData.publicUrl,
        pdfBase64, // Incluir el Base64 para adjuntar en el siguiente paso
        nombre_cliente: cliente.nombre_cliente,
        correo: cliente.correo,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("ERROR GENERAL EN GENERAR-PEDIDO-PDF:", err);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor", error: err?.message ?? String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});