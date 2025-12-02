import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PDFSHIFT_API_KEY = Deno.env.get("PDF_API_KEY");    // <--- TU VARIABLE REAL
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Preflight (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    console.log("📌 PDFSHIFT_API_KEY:", PDFSHIFT_API_KEY);
    console.log("📌 RESEND_API_KEY:", RESEND_API_KEY);

    if (!PDFSHIFT_API_KEY) {
      console.log("❌ ERROR: PDFSHIFT_API_KEY está vacío o no existe");
      return new Response(
        JSON.stringify({ error: "PDF API KEY no configurada" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const pedido = await req.json();
    const { cliente } = pedido;

    console.log("📦 Pedido recibido:", pedido);

    if (!cliente?.correo || !cliente?.nombre) {
      return new Response(
        JSON.stringify({ error: "Faltan datos del cliente" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ============================
    // 1️⃣ GENERAR HTML DEL PDF
    // ============================
    const html = `
      <h1>Orden de Pedido</h1>
      <p><strong>Cliente:</strong> ${cliente.nombre}</p>
      <p><strong>Email:</strong> ${cliente.correo}</p>
      <h3>Productos:</h3>
      <pre>${JSON.stringify(pedido.productos, null, 2)}</pre>
    `;

    // ============================
    // 2️⃣ GENERAR PDF EN PDFSHIFT
    // ============================
    console.log("📨 Enviando HTML a PDFShift...");

    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert/html", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(PDFSHIFT_API_KEY + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source: html }),
    });

    if (!pdfResponse.ok) {
      console.log("❌ Respuesta PDFShift:", await pdfResponse.text());
      throw new Error("Error generando PDF en PDFShift");
    }

    console.log("✅ PDF generado correctamente");

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

    // ============================
    // 3️⃣ ENVIAR CORREO CON RESEND
    // ============================
    console.log("📨 Enviando correo con Resend...");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["jeki18ros@gmail.com", cliente.correo],
        subject: `Nuevo Pedido de ${cliente.nombre}`,
        html: "<p>Adjuntamos el PDF del pedido.</p>",
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
      console.log("❌ Respuesta Resend:", await emailResponse.text());
      throw new Error("Error enviando correo con Resend");
    }

    console.log("📧 Correo enviado correctamente");

    return new Response(
      JSON.stringify({
        message: "PDF generado y correos enviados exitosamente",
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.log("🔥 Error interno:", error.message);
    return new Response(
      JSON.stringify({ error: `Error interno del servidor: ${error.message}` }),
      { status: 500, headers: corsHeaders }
    );
  }
});
