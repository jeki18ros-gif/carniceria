// supabase/functions/send-contact-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_ENDPOINT = "https://api.resend.com/emails";

// 🎯 Definir encabezados CORS
const corsHeaders = {
  // Permite acceso desde tu dominio de Netlify. Es más seguro que usar '*'
  'Access-Control-Allow-Origin': 'https://les-aliments-benito.netlify.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  
  // 1. Manejar la solicitud Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 2. Manejar la solicitud POST real (lógica principal)
  if (req.method !== "POST") {
    // Si no es OPTIONS ni POST, devuelve 405
    return new Response(JSON.stringify({ message: "Método no permitido." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }, // Añadir CORS aquí también
    });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ message: "Faltan campos requeridos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }, // Añadir CORS
      });
    }

    // ... (Tu lógica de Resend aquí, que está bien) ...
    const resendPayload = { 
        // ... (Contenido de Resend) ...
    };

    const resendResponse = await fetch(RESEND_ENDPOINT, {
        // ... (Configuración de fetch) ...
    });

    if (!resendResponse.ok) {
        const resendError = await resendResponse.json();
        console.error("Error de Resend:", resendError);
        
        return new Response(JSON.stringify({ message: "Error al enviar el correo con el servicio externo." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }, // Añadir CORS
        });
    }

    // Éxito
    return new Response(JSON.stringify({ message: "Correo enviado con éxito." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }, // Añadir CORS
    });

  } catch (error) {
    // Error interno del servidor
    console.error("Error en la Edge Function:", error);
    return new Response(JSON.stringify({ message: "Error interno del servidor." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }, // Añadir CORS
    });
  }
});