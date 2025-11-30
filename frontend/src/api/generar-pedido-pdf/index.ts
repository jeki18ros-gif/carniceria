import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
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
    await page.setContent(html, {
      waitUntil: ["load", "networkidle0"],
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName || "pedido.pdf"}"`);

    return res.send(pdfBuffer);

  } catch (error: any) {
    console.error("Error generando PDF:", error);
    return res.status(500).json({ error: error.message });
  }
}
