// /api/pdf.ts
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge', // Esto indica que es una Edge Function
};

// Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { cliente, productos, orden_id } = body || {};

    if (!cliente || !productos || !orden_id) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 });
    }

    // ======================
    // 1) GENERAR PDF
    // ======================
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();

    page.drawText('Orden de Pedido', { x: 50, y: height - 80, size: 24, font });
    page.drawText(`Cliente: ${cliente.nombre}`, { x: 50, y: height - 120, size: 16, font });
    page.drawText(`Correo: ${cliente.correo}`, { x: 50, y: height - 160, size: 16, font });

    let offsetY = height - 220;
    productos.forEach((p: any) => {
      page.drawText(`• ${p.nombre} - ${p.cantidad_valor} ${p.cantidad_unidad}`, {
        x: 50,
        y: offsetY,
        size: 14,
        font,
      });
      offsetY -= 30;
    });

    const pdfBytes = await pdfDoc.save();

    // ======================
    // 2) SUBIR A SUPABASE
    // ======================
    const fileName = `pedido_${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('ordenes_pdf')
      .upload(fileName, new Uint8Array(pdfBytes), {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return new Response(JSON.stringify({ error: 'Error subiendo PDF a Supabase' }), { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ordenes_pdf/${fileName}`;

    // ======================
    // 3) GUARDAR URL EN DB
    // ======================
    const { error: dbError } = await supabase
      .from('ordenes_pdfs')
      .insert({ orden_id, url_pdf: publicUrl });

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: 'Error guardando en base de datos' }), { status: 500 });
    }

    // ======================
    // 4) RESPONDER PDF
    // ======================
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (e) {
    console.error('Error generando PDF:', e);
    return new Response(JSON.stringify({ error: 'Error generando PDF' }), { status: 500 });
  }
}
