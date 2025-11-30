import { VercelRequest, VercelResponse } from '@vercel/node';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { html, cliente, productos, orden_id } = req.body;

    // ======================
    // 1) GENERAR PDF SIMPLE
    // ======================
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    page.drawText("Orden de Pedido", {
      x: 50,
      y: height - 80,
      size: 24,
      font
    });

    page.drawText(`Cliente: ${cliente.nombre}`, { x: 50, y: height - 120, size: 16 });
    page.drawText(`Correo: ${cliente.correo}`, { x: 50, y: height - 160, size: 16 });

    let offsetY = height - 220;
    productos.forEach((p: any) => {
      page.drawText(`• ${p.nombre} - ${p.cantidad}kg`, {
        x: 50,
        y: offsetY,
        size: 14,
      });
      offsetY -= 30;
    });

    const pdfBytes = await pdfDoc.save();

    // ======================
    // 2) SUBIR PDF A SUPABASE
    // ======================
    const fileName = `pedido_${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("ordenes_pdf")
      .upload(fileName, Buffer.from(pdfBytes), {
        contentType: "application/pdf",
      });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: "Error subiendo PDF" });
    }

    const publicUrl =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ordenes_pdf/${fileName}`;

    // 3) GUARDAR REGISTRO EN TABLA
    await supabase.from("ordenes_pdfs").insert({
      orden_id,
      url_pdf: publicUrl,
    });

    // 4) RESPONDER PDF AL FRONTEND
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.send(Buffer.from(pdfBytes));

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error generando PDF" });
  }
}
