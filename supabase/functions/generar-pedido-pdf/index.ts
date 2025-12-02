import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.esm.min.js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const pedido = await req.json();
    const { cliente, productos, fecha_entrega } = pedido;

    if (!cliente?.nombre || !cliente?.correo) {
      return new Response(
        JSON.stringify({ error: "Faltan datos del cliente" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ============================
    // 1️⃣ CREAR PDF (PDF-LIB via CDN)
    // ============================
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

    // Título
    page.drawText("Orden de Pedido", {
      x: 200,
      y,
      size: 22,
      font: bold,
    });
    y -= 40;

    // DATOS DEL CLIENTE
    line("Datos del Cliente", 16, true);
    line(`Nombre: ${cliente.nombre}`);
    line(`Correo: ${cliente.correo}`);
    line(`Teléfono: ${cliente.telefono || "No indicado"}`);
    line(`Dirección: ${cliente.direccion || "No indicada"}`);
    line(`Tipo de entrega: ${cliente.entrega || "No indicado"}`);
    line(`Fecha de entrega: ${fecha_entrega || "No indicada"}`);
    line(`Comentarios: ${cliente.comentarios || "Ninguno"}`);

    y -= 10;

    // PRODUCTOS
    line("Productos Solicitados", 16, true);

    productos.forEach((p: any, index: number) => {
      line(`Producto ${index + 1}: ${p.nombre}`, 14, true);

      Object.entries(p).forEach(([key, value]: [string, any]) => {
        if (key !== "nombre") {
          line(`- ${key}: ${value || "N/A"}`);
        }
      });

      y -= 10;
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    // ============================
    // 2️⃣ ENVIAR CORREO
    // ============================
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [cliente.correo],
        subject: `Pedido de ${cliente.nombre}`,
        html: "<p>Adjuntamos el PDF de su pedido.</p>",
        attachments: [
          {
            filename: "pedido.pdf",
            content: pdfBase64,
            encoding: "base64",
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      console.log("❌ Error Resend:", await emailResponse.text());
      throw new Error("No se pudo enviar el correo");
    }

    return new Response(
      JSON.stringify({ message: "PDF enviado correctamente" }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
