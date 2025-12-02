import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const A2P_API_KEY = Deno.env.get("A2P_API_KEY");   // <---- API2PDF
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

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    console.log("📌 A2P_API_KEY:", A2P_API_KEY);
    console.log("📌 RESEND_API_KEY:", RESEND_API_KEY);

    if (!A2P_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API2PDF KEY no configurada" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const pedido = await req.json();
    const { cliente } = pedido;

    if (!cliente?.correo || !cliente?.nombre) {
      return new Response(
        JSON.stringify({ error: "Faltan datos del cliente" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // =====================================================
    // 1️⃣ GENERAR HTML PARA EL PDF
    // =====================================================
    const html = `
      <h1>Orden de Pedido</h1>
      <p><strong>Cliente:</strong> ${cliente.nombre}</p>
      <p><strong>Email:</strong> ${cliente.correo}</p>
      <h3>Productos:</h3>
      <pre>${JSON.stringify(pedido.productos, null, 2)}</pre>
    `;

    // =====================================================
    // 2️⃣ GENERAR PDF con API2PDF
    // =====================================================

    console.log("📨 Enviando HTML a API2PDF...");

    const pdfResponse = await fetch("https://v2.api2pdf.com/api/pdf/html", {
      method: "POST",
      headers: {
        "Authorization": A2P_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: html,
        inlinePdf: false,   // que genere un link
        fileName: "pedido.pdf"
      }),
    });

    if (!pdfResponse.ok) {
      console.log("❌ Respuesta API2PDF:", await pdfResponse.text());
      throw new Error("Error generando PDF en API2PDF");
    }

    const pdfData = await pdfResponse.json();

    console.log("PDF2API RESULT:", pdfData);

    if (!pdfData?.pdf) {
      throw new Error("API2PDF no devolvió PDF");
    }

    // descargar archivo leído como base64
    const fileResp = await fetch(pdfData.pdf);
    const arrayBuff = await fileResp.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuff)));

    console.log("✅ PDF generado con API2PDF");

    // =====================================================
    // 3️⃣ ENVIAR EMAIL CON RESEND
    // =====================================================
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
      console.log("❌ Resend:", await emailResponse.text());
      throw new Error("Error enviando correo");
    }

    console.log("📧 Correo enviado correctamente");

    return new Response(
      JSON.stringify({ message: "PDF generado y enviado" }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.log("🔥 ERROR:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
