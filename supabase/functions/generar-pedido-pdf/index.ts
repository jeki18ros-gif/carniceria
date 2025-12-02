import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "https://deno.land/x/pdf_lib@1.17.1/mod.ts";

// SOLO RESEND  
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND API KEY no configurada" }),
        { status: 500, headers: corsHeaders },
      );
    }

    const pedido = await req.json();
    const { cliente, productos } = pedido;

    if (!cliente?.nombre || !cliente?.correo) {
      return new Response(
        JSON.stringify({ error: "Faltan datos del cliente" }),
        { status: 400, headers: corsHeaders },
      );
    }

    //------------------------------------------------------------------
    // 1️⃣ GENERAR PDF BONITO (FACTURA PROFESIONAL)
    //------------------------------------------------------------------

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 820]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 780;
    const lineHeight = 20;

    // TÍTULO
    page.drawText("ORDEN DE PEDIDO", {
      font: fontBold,
      size: 24,
      x: 180,
      y,
      color: rgb(0, 0, 0),
    });

    y -= 40;

    // DATOS DEL CLIENTE
    page.drawText(`Cliente: ${cliente.nombre}`, {
      font,
      size: 14,
      x: 40,
      y,
    });

    y -= lineHeight;

    page.drawText(`Correo: ${cliente.correo}`, { font, size: 14, x: 40, y });
    y -= lineHeight;
    page.drawText(`Teléfono: ${cliente.telefono || "N/A"}`, {
      font,
      size: 14,
      x: 40,
      y,
    });
    y -= lineHeight;

    page.drawText(`Dirección: ${cliente.direccion || "N/A"}`, {
      font,
      size: 14,
      x: 40,
      y,
    });

    y -= 40;

    // SUBTÍTULO PRODUCTOS
    page.drawText("Productos Solicitados", {
      font: fontBold,
      size: 18,
      x: 40,
      y,
    });

    y -= 30;

    // TABLA DE PRODUCTOS
    productos.forEach((p, index) => {
      if (y < 80) {
        // nueva página si se llena
        page = pdfDoc.addPage([600, 820]);
        y = 780;
      }

      page.drawText(`${index + 1}. ${p.nombre}`, {
        font: fontBold,
        size: 14,
        x: 40,
        y,
      });

      y -= lineHeight;

      page.drawText(
        `Cantidad: ${p.cantidad_valor} ${p.cantidad_unidad}`,
        { font, size: 12, x: 60, y },
      );
      y -= lineHeight;

      const specs = [
        ["Tipo de corte", p.tipo_corte],
        ["Parte", p.parte],
        ["Estado", p.estado],
        ["Hueso", p.hueso],
        ["Grasa", p.grasa],
        ["Empaque", p.empaque],
        ["Cocción", p.coccion],
        ["Fecha deseada", p.fecha_deseada],
        ["Observación", p.observacion],
      ];

      specs.forEach(([label, value]) => {
        if (value) {
          page.drawText(`${label}: ${value}`, {
            font,
            size: 11,
            x: 70,
            y,
          });
          y -= 16;
        }
      });

      y -= 10;
    });

    // Convertir a base64
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    //------------------------------------------------------------------
    // 2️⃣ ENVIAR PDF POR EMAIL CON RESEND
    //------------------------------------------------------------------

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [cliente.correo, "jeki18ros@gmail.com"],
        subject: `Nuevo Pedido de ${cliente.nombre}`,
        html:
          `<p>Hola <strong>${cliente.nombre}</strong>,<br/>Adjuntamos tu comprobante en PDF.</p>`,
        attachments: [
          {
            filename: "pedido.pdf",
            content: pdfBase64,
            encoding: "base64",
          },
        ],
      }),
    });

    if (!emailRes.ok) {
      return new Response(
        JSON.stringify({
          error: "El email no pudo enviarse",
          details: await emailRes.text(),
        }),
        { status: 500, headers: corsHeaders },
      );
    }

    //------------------------------------------------------------------
    // 3️⃣ RESPUESTA AL FRONTEND
    //------------------------------------------------------------------

    return new Response(
      JSON.stringify({
        message: "Pedido generado y enviado correctamente",
        pdf_url: null, // YA NO USAMOS API2PDF, SOLO EMAIL
      }),
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders },
    );
  }
});
