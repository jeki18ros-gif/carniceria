// supabase/functions/send-contact-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_ENDPOINT = "https://api.resend.com/emails";

serve(async (req) => {
  // Asegurarse de que el método sea POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Método no permitido." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Obtener los datos del formulario de la solicitud (frontend)
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ message: "Faltan campos requeridos." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Configurar el correo electrónico
    const resendPayload = {
      from: "onboarding@resend.dev", // Reemplaza con un dominio verificado si usas Resend en producción
      to: "jeki18ros@gmail.com", // <--- 🎯 TU CORREO DE DESTINO
      subject: `Nuevo mensaje de contacto de: ${name}`,
      html: `
        <h1>Mensaje de Contacto del Sitio Web</h1>
        <p><strong>De:</strong> ${name}</p>
        <p><strong>Correo Electrónico:</strong> ${email}</p>
        <hr/>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // 2. Enviar el correo a través de Resend
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(resendPayload),
    });

    if (!resendResponse.ok) {
      // Registrar el error de Resend (visible en logs de Supabase)
      const resendError = await resendResponse.json();
      console.error("Error de Resend:", resendError);
      
      return new Response(JSON.stringify({ message: "Error al enviar el correo con el servicio externo." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Éxito
    return new Response(JSON.stringify({ message: "Correo enviado con éxito." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    // Error interno del servidor
    console.error("Error en la Edge Function:", error);
    return new Response(JSON.stringify({ message: "Error interno del servidor." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});