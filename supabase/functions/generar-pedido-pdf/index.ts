import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PDFSHIFT_API_KEY = Deno.env.get("PDF_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://les-aliments-benito.vercel.app",
  "Access-Control-Allow-Headers": "apikey, content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const pedido = await req.json();

    const cliente = pedido.cliente;
    const productos = pedido.productos;

    if (!cliente?.correo || !cliente?.nombre) {
      return new Response(
        JSON.stringify({ error: "Faltan datos del cliente" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!productos || productos.length === 0) {
      return new Response(
        JSON.stringify({ error: "El pedido no tiene productos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productosHTML = productos
      .map((p) => `
        <li style="margin-bottom: 8px;">
          <strong>${p.nombre}</strong><br/>
          Cant: ${p.cantidad_valor} ${p.cantidad_unidad}<br/>
          ${p.tipo_corte ? `Tipo de corte: ${p.tipo_corte}<br/>` : ""}
          ${p.parte ? `Parte: ${p.parte}<br/>` : ""}
          ${p.estado ? `Estado: ${p.estado}<br/>` : ""}
          ${p.hueso ? `Hueso: ${p.hueso}<br/>` : ""}
          ${p.grasa ? `Grasa: ${p.grasa}<br/>` : ""}
          ${p.empaque ? `Empaque: ${p.empaque}<br/>` : ""}
          ${p.coccion ? `Cocción: ${p.coccion}<br/>` : ""}
          ${p.fecha_deseada ? `Fecha deseada: ${p.fecha_deseada}<br/>` : ""}
          ${p.observacion ? `Obs: ${p.observacion}<br/>` : ""}
        </li>
      `)
      .join("");

    const html = `
      <h1>Orden de Pedido</h1>
      <p><strong>Cliente:</strong> ${cliente.nombre}</p>
      <p><strong>Email:</strong> ${cliente.correo}</p>
      <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
      <p><strong>Dirección:</strong> ${cliente.direccion}</p>
      <p><strong>Método de entrega:</strong> ${cliente.entrega}</p>
      <p><strong>Comentarios:</strong> ${cliente.comentarios || "Ninguno"}</p>
      <h3>Productos solicitados:</h3>
      <ul>${productosHTML}</ul>
    `;

    // 🟦 GENERAR PDF
    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert/html", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(PDFSHIFT_API_KEY + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source: html }),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      console.error("PDFShift error:", errText);

      return new Response(
        JSON.stringify({ error: "Error generando PDF" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfArrayBuffer)));

    // 🟥 ENVIAR EMAIL
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
        html: "<p>Adjuntamos el PDF de su pedido.</p>",
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
      const errEmail = await emailResponse.text();
      console.error("Resend error:", errEmail);

      return new Response(
        JSON.stringify({ error: "Error enviando correo" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 🟢 TODO OK
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error general:", error);

    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
