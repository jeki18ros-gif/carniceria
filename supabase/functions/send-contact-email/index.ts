import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // OPTIONS (CORS)
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
    // 📩 Datos enviados desde el frontend
    const { orden_id, pdf_url, nombre_cliente, correo } = await req.json();

    // ❌ Validación real
    if (!orden_id || !pdf_url || !nombre_cliente || !correo) {
      return new Response(
        JSON.stringify({ message: "Faltan campos requeridos." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 📧 Email a enviar
    const emailPayload = {
      from: "onboarding@resend.dev",
      to: ["jeki18ros@gmail.com", correo], // Admin + cliente
      subject: `Pedido recibido - Orden ${orden_id}`,
      html: `
        <h2>Nuevo Pedido Recibido</h2>

        <p><strong>Cliente:</strong> ${nombre_cliente}</p>
        <p><strong>Email:</strong> ${correo}</p>
        <p><strong>ID del Pedido:</strong> ${orden_id}</p>

        <p>Puedes descargar el PDF aquí:</p>
        <p><a href="${pdf_url}" target="_blank">${pdf_url}</a></p>

        <br/>
        <p>Gracias por su compra.</p>
      `
    };

    // 📤 Enviar a Resend
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const err = await resendResponse.clone().json();
      console.error("Resend Error:", err);

      return new Response(
        JSON.stringify({ message: "Error al enviar correo." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Correo enviado correctamente." }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("Error en send-contact-email:", err);

    return new Response(
      JSON.stringify({ message: "Error interno del servidor." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
