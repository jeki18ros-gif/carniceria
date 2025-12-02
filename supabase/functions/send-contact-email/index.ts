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
    // 📩 Datos del formulario de contacto
    const { name, email, message } = await req.json();

    // ❌ Validación
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Faltan campos requeridos: nombre, email o mensaje." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 📧 Email a enviar
    const emailPayload = {
      from: "onboarding@resend.dev", // O tu email de envío
      to: ["jeki18ros@gmail.com"], // Solo al administrador
      subject: `Mensaje de Contacto de: ${name}`,
      html: `
        <h2>Nuevo Mensaje de Contacto</h2>

        <p><strong>De:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <hr/>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
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
      console.error("Resend Error (Contacto):", err);

      return new Response(
        JSON.stringify({ message: "Error al enviar correo de contacto." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Correo de contacto enviado correctamente." }),
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