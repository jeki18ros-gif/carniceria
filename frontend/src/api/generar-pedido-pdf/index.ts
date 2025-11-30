import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // AÑADIDO: Validación explícita del método
    if (req.method !== "POST") {
      // Devolver un 405 si no es POST. Esto confirma que el endpoint está siendo accedido.
      res.setHeader('Allow', 'POST'); 
      return res.status(405).json({ error: "Method Not Allowed. Solo se acepta POST." });
    }

    const { html, fileName } = req.body;

    if (!html) {
      return res.status(400).json({ error: "Falta el HTML" });
    }

    // Configuración especial para Vercel (usa Chromium optimizado)
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    // Recomiendo usar solo 'networkidle0' para que no tarde tanto
    await page.setContent(html, {
      waitUntil: ["networkidle0"], 
    });
    
    // Espera un poco más si el HTML tiene estilos que tardan en cargar (opcional)
    // await new Promise(r => setTimeout(r, 500)); 

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName || "pedido.pdf"}"`);

    // El 405 indica que el request NO está llegando a esta línea, sino que Vercel lo bloquea antes.
    return res.send(pdfBuffer);

  } catch (error: any) {
    console.error("Error generando PDF:", error);
    // Si el error es de Puppeteer (ej: memoria), saldrá este 500
    return res.status(500).json({ error: error.message });
  }
}