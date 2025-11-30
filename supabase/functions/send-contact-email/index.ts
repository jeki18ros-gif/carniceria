import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Método no permitido." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { customerName, customerEmail, pdfBase64, orderSummaryHtml } =
      await req.json();

    if (!customerName || !customerEmail || !pdfBase64) {
      return new Response(
        JSON.stringify({ message: "Faltan campos requeridos." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailToSend = {
      from: "onboarding@resend.dev",
      to: ["jeki18ros@gmail.com", customerEmail], // admin + cliente
      subject: `Nuevo Pedido de ${customerName}`,
      html: `
        <h2>Nuevo Pedido</h2>
        <p><strong>Cliente:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <hr/>
        ${orderSummaryHtml || "<p>Pedido adjunto en PDF.</p>"}
      `,
      attachments: [
        {
          filename: "pedido.pdf",
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    };

    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailToSend),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.clone().json();
      console.error("Error Resend:", resendError);

      return new Response(
        JSON.stringify({
          message: "Error al enviar el correo con Resend.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Pedido enviado con éxito." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en Edge Function:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
