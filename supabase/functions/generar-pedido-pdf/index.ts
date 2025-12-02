import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { PDFDocument, StandardFonts } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============ CONFIG ============ //

// NOTA: RESEND_API_KEY ya no se necesita en esta función, ya que el email lo gestiona 'send-contact-email'
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============ CORS ============ //

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Función para convertir Uint8Array a Base64 de forma robusta en Deno
function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  // En Deno, la forma más segura de manejar grandes buffers es usando Blob y FileReader (asíncrono) o TextDecoder/TextEncoder
  // Para Base64 usamos btoa(String.fromCharCode(...)) pero limitamos el tamaño de chunking
  const CHUNK_SIZE = 0x8000; // 32KB
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

    // ===== VALIDACIÓN =====
    if (!cliente?.nombre_cliente || !cliente?.correo) {
      return new Response(
        JSON.stringify({ message: "Datos insuficientes del cliente." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!productos || productos.length === 0) {
      return new Response(
        JSON.stringify({ message: "No hay productos en el pedido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== CREAR ORDEN (BBDD) =====
    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .insert({
        nombre_cliente: cliente.nombre_cliente,
        telefono: cliente.telefono || null,
        correo: cliente.correo,
        descripcion: productos.map((p: any) => p.nombre).join(", "),
      })
      .select()
      .single();

    if (ordenError) {
      console.error("Error insertando orden:", ordenError);
      // Esto lanza el 500. Si esto ocurre, revisar las políticas de RLS en la tabla 'ordenes'.
      return new Response(
        JSON.stringify({ message: "No se pudo registrar la orden.", detail: ordenError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orden_id = (orden as any).id;

    // ===== GUARDAR PRODUCTOS (BBDD) =====
    // Crear el array de inserciones de forma más eficiente
    const productosParaInsertar = productos.map((p: any) => ({
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
    }));

    const { error: prodError } = await supabase
      .from("ordenes_productos")
      .insert(productosParaInsertar);

    if (prodError) {
      console.error("Error insertando productos en ordenes_productos:", prodError);
      // No devolvemos 500, pero logueamos el error y continuamos, ya que la orden principal ya se insertó.
    }


    // ===== GENERAR PDF (pdf-lib) =====
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 760;

    const drawPageHeader = () => {
      // Dibuja el encabezado (omito el código por brevedad, asumiendo que funciona)
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
      
      // Dibujado de productos y specs (omito código por brevedad)
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
    const pdfBase64 = uint8ArrayToBase64(pdfBytes); // Conversión robusta

    // ===== SUBIR PDF (STORAGE) =====
    const fileName = `pedido_${orden_id}.pdf`;

    // create a Blob (compatible upload body)
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    const { error: uploadError } = await supabase.storage
      .from("pdfs") // <- ¡Verificar que el bucket 'pdfs' exista!
      .upload(fileName, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error subiendo PDF a Storage:", uploadError);
      // Esto podría ser la causa del 500.
      return new Response(
        JSON.stringify({ message: "No se pudo subir el PDF", detail: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== OBTENER URL PÚBLICA =====
    const { data: urlData, error: urlError } = await supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);

    if (urlError) {
      console.error("Error obteniendo publicUrl:", urlError);
    }

    const pdf_url = urlData?.publicUrl || null;
    
    // Si la URL es null, es un fallo crítico, devolvemos un 500
    if (!pdf_url) {
      console.error("Error: URL pública del PDF no disponible.");
      return new Response(
        JSON.stringify({ message: "Fallo al obtener URL pública del PDF." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // NOTA: Se ELIMINÓ la lógica de envío de email con Resend de esta función. 
    // Ahora, el frontend usará 'send-contact-email' con orden_id y pdf_url.

    // ===== RESPUESTA FINAL =====
    return new Response(
      JSON.stringify({
        message: "Pedido generado y URL obtenida correctamente.",
        orden_id,
        pdf_url,
        pdfBase64, // Enviamos el Base64 de vuelta para que el frontend lo pueda pasar a otra función si es necesario
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