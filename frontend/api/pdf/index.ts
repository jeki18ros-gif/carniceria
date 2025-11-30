// /api/pdf.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { createClient } from '@supabase/supabase-js';

// Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { cliente, productos, orden_id } = req.body;

    if (!cliente || !productos || !orden_id) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // ===== 1) Generar PDF =====
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();

    page.drawText('Orden de Pedido', { x: 50, y: height - 80, size: 24, font });
    page.drawText(`Cliente: ${cliente.nombre}`, { x: 50, y: height - 120, size: 16 });
    page.drawText(`Correo: ${cliente.correo}`, { x: 50, y: height - 160, size: 16 });

    let offsetY = height - 220;
    productos.forEach((p: any) => {
      page.drawText(`• ${p.nombre} - ${p.cantidad_valor} ${p.cantidad_unidad}`, { x: 50, y: offsetY, size: 14 });
      offsetY -= 30;
    });

    const pdfBytes = await pdfDoc.save();

    // ===== 2) Subir PDF a Supabase =====
    const fileName = `pedido_${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('ordenes_pdf')
      .upload(fileName, Buffer.from(pdfBytes), { contentType: 'application/pdf' });

    if (uploadError) {
      console.error('Error subiendo PDF:', uploadError);
      return res.status(500).json({ error: 'Error subiendo PDF a Supabase' });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ordenes_pdf/${fileName}`;

    // ===== 3) Guardar URL en tabla =====
    const { error: dbError } = await supabase
      .from('ordenes_pdfs')
      .insert({ orden_id, url_pdf: publicUrl });

    if (dbError) {
      console.error('Error guardando en DB:', dbError);
      return res.status(500).json({ error: 'Error guardando PDF en base de datos' });
    }

    // ===== 4) Responder PDF al frontend =====
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(Buffer.from(pdfBytes));
    
  } catch (e) {
    console.error('Error generando PDF:', e);
    return res.status(500).json({ error: 'Error generando PDF' });
  }
}
