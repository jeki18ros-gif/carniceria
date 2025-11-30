import type { VercelRequest, VercelResponse } from "@vercel/node";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const config = {
  maxDuration: 30,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed. Solo se acepta POST." });
  }

  try {
    const { html, fileName } = req.body;

    if (!html) {
      return res.status(400).json({ error: "Falta el HTML en el body." });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 });

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName || "pedido.pdf"}"`
    );

    return res.send(pdfBuffer);
  } catch (error: any) {
    console.error("❌ Error generando PDF:", error);
    return res.status(500).json({
      error: "Fallo interno al generar el PDF.",
      details: error.message,
    });
  }
}
