import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Define la configuración para que la función de Vercel use más recursos.
// Esto es VITAL para Puppeteer. Vercel por defecto tiene 1024MB y 10s.
export const config = {
  // Aumentar memoria a 2048MB (o 3008MB si el plan lo permite)
  // Maximizamos el tiempo de espera (30s es el máximo en Vercel Pro/Hobby)
  maxDuration: 30, 
  // Esto puede requerir un archivo vercel.json en la raíz
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 🛑 SOLUCIÓN AL 405: Validamos el método de forma estricta.
    // Si la función está en /api/pdf.ts, esto debe funcionar.
    if (req.method !== "POST") {
      res.setHeader('Allow', 'POST'); 
      return res.status(405).json({ error: "Method Not Allowed. Solo se acepta POST." });
    }

    const { html, fileName } = req.body;

    if (!html) {
      return res.status(400).json({ error: "Falta el HTML en el body." });
    }
    
    // Configuración para usar la versión optimizada de Chromium para Vercel
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless, // Debe ser 'chromium.headless' que es booleano o 'new'
    });

    const page = await browser.newPage();
    
    // Definir un Viewport responsive
    await page.setViewport({ width: 1080, height: 1024 });

    // Esperar hasta que la red esté inactiva para asegurar que el CSS/HTML esté renderizado
    await page.setContent(html, {
      waitUntil: ["networkidle0"],
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    await browser.close();

    // 🏆 Respuesta exitosa (devuelve el buffer al Supabase Edge Function)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName || "pedido.pdf"}"`);

    return res.send(pdfBuffer);

  } catch (error: any) {
    // 🛑 SOLUCIÓN AL 500: Esto capturará fallos de Puppeteer/Memoria/Timeout.
    console.error("❌ CRITICAL VERCEL PDF ERROR:", error.message, error.stack);
    
    // Devolvemos 500 con un mensaje útil
    return res.status(500).json({ 
      error: "Fallo interno al generar el PDF. Revisa los logs de Vercel (Timeout/Memoria).", 
      details: error.message 
    });
  }
}