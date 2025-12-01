import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PDFSHIFT_API_KEY = Deno.env.get("PDFSHIFT_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const pedido = await req.json();

    const { cliente } = pedido;
    const customerEmail = cliente?.correo;
    const customerName = cliente?.nombre;

    if (!customerEmail || !customerName) {
      return new Response(
        JSON.stringify({ message: "Faltan datos del cliente." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // HTML del pedido
    const html = `
      <h1>Orden de Pedido</h1>
      <p><strong>Cliente:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <h2>Productos</h2>
      <ul>
        ${pedido.productos
          .map(
            (p) => `
            <li>
              ${p.nombre} -  
              ${p.cantidad_valor} ${p.cantidad_unidad}
            </li>
          `
          )
          .join("")}
      </ul>
    `;

    // 1️⃣ Generar PDF con PDFShift
    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert/html", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(PDFSHIFT_API_KEY + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: html,
      }),
    });

    if (!pdfResponse.ok) {
      const error = await pdfResponse.text();
      console.error("Error PDFShift:", error);
      return new Response(JSON.stringify({ error: "Error al generar PDF." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(
      String.fromCharCode(...new Uint8Array(pdfArrayBuffer))
    );

    // 2️⃣ Enviar correo con Resend
    const emailPayload = {
      from: "onboarding@resend.dev",
      to: ["jeki18ros@gmail.com", customerEmail],
      subject: `Nuevo Pedido de ${customerName}`,
      html: `
        <h2>Nuevo Pedido</h2>
        <p><strong>Cliente:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p>Adjuntamos el PDF generado con los detalles del pedido.</p>
      `,
      attachments: [
        {
          filename: "pedido.pdf",
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.json();
      console.error("Error Resend:", resendError);

      return new Response(
        JSON.stringify({ error: "No se pudo enviar el correo." }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        message: "PDF generado y correos enviados con éxito",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error general:", error);
    return new Response(JSON.stringify({ error: "Error interno." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
