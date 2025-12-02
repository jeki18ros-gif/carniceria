import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PDFSHIFT_API_KEY = Deno.env.get("PDFSHIFT_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers":
    "apikey, content-type, authorization, x-client-info, x-supabase-api-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {

  // 🔥 PRE-FLIGHT OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  // ❌ Métodos no permitidos
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const pedido = await req.json();
    const { cliente } = pedido;

    if (!cliente?.correo || !cliente?.nombre) {
      return new Response(
        JSON.stringify({ error: "Faltan datos del cliente" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // HTML SIMPLE PARA PDF
    const html = `
      <h1>Orden de Pedido</h1>
      <p><strong>Cliente:</strong> ${cliente.nombre}</p>
      <p><strong>Email:</strong> ${cliente.correo}</p>
    `;

    // 🧾 GENERAR PDF
    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert/html", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(PDFSHIFT_API_KEY + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source: html }),
    });

    if (!pdfResponse.ok) {
      throw new Error("Error generando PDF");
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(
      String.fromCharCode(...new Uint8Array(pdfBuffer))
    );

    // 📩 ENVIAR CORREO
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
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
      throw new Error("Error enviando correo");
    }

    return new Response(
      JSON.stringify({ message: "PDF generado y correos enviados" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error interno:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
