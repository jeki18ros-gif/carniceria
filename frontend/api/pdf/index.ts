import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import pdf from "html-pdf-node";

export const config = {
  runtime: "edge"
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
  }

  try {
    const pedido = await req.json();

    // ===========================
    // 1) GENERAR PDF
    // ===========================
    const file = { content: pedido.html };
    const pdfBuffer = await pdf.generatePdf(file, { format: "A4" });

    // Convertir a base64 para email
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    // ===========================
    // 2) SUBIR A SUPABASE STORAGE
    // ===========================
    const nombrePDF = `pedido_${Date.now()}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("ordenes_pdf")
      .upload(nombrePDF, pdfBuffer, {
        contentType: "application/pdf"
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: "Error subiendo PDF a Supabase" }, { status: 500 });
    }

    const urlPDF = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ordenes_pdf/${nombrePDF}`;

    // ===========================
    // 3) GUARDAR EN TABLA ordenes_pdfs
    // ===========================
    await supabase.from("ordenes_pdfs").insert({
      orden_id: pedido.orden_id || null,
      url_pdf: urlPDF,
      enviado_al_cliente: false,
      enviado_al_admin: false
    });

    // ===========================
    // 4) ENVIAR EMAIL DESDE EDGE FUNCTION SUPABASE
    // ===========================
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-order-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          customerName: pedido.cliente.nombre,
          customerEmail: pedido.cliente.correo,
          pdfBase64,
          orderSummaryHtml: pedido.html
        })
      }
    );

    // ===========================
    // 5) DEVOLVER LA URL AL FRONTEND
    // ===========================
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombrePDF}"`
      }
    });

  } catch (error) {
    console.error("Error en /api/pdf:", error);
    return NextResponse.json({ error: "Error generando PDF" }, { status: 500 });
  }
}
