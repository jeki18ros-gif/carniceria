import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // CORS y método OPTIONS
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
    // 📩 Datos enviados desde el frontend (que vienen de generar-pedido-pdf)
    const { 
      orden_id, 
      pdf_url, 
      nombre_cliente, 
      correo, 
      pdfBase64, // ¡Este es el campo clave para el adjunto!
    } = await req.json();

    // ❌ Validación
    if (!orden_id || !pdf_url || !nombre_cliente || !correo || !pdfBase64) {
      return new Response(
        JSON.stringify({ message: "Faltan campos requeridos para enviar el email del pedido." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 📧 Email a enviar
    const emailPayload = {
      from: "onboarding@resend.dev",
      // to: ["jeki18ros@gmail.com", correo], // Admin + cliente
      to: ["jeki18ros@gmail.com"], // ✅ SOLO AL ADMIN PARA DEMOSTRACIÓN
      subject: `Pedido recibido - Orden ${orden_id} (DEMO)`, // Añadimos (DEMO) al sujeto
      html: `
        <h2>Nuevo Pedido Recibido</h2>
        <p style="color: red; font-weight: bold;">[MODO DEMOSTRACIÓN: Este correo se envió solo al administrador. El correo del cliente (${correo}) se incluirá al verificar un dominio.]</p>
        <p><strong>Cliente:</strong> ${nombre_cliente}</p>
        <p><strong>Email del Cliente:</strong> ${correo}</p>
        <p><strong>ID del Pedido:</strong> ${orden_id}</p>

        <p>Puedes descargar el PDF aquí:</p>
        <p><a href="${pdf_url}" target="_blank">${pdf_url}</a></p>

        <br/>
        <p>Gracias por su compra. El PDF del pedido está adjunto.</p>
      `,
      attachments: [ // Adjunto usando el Base64
        {
          filename: `pedido_${orden_id}.pdf`,
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    };

    // 📤 Enviar a Resend (Omisión de código por brevedad)
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
      console.error("Resend Error (Pedido):", err);

      return new Response(
        JSON.stringify({ message: "Error al enviar correo del pedido." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Correo de pedido enviado correctamente." }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("Error en send-order-email:", err);

    return new Response(
      JSON.stringify({ message: "Error interno del servidor." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});