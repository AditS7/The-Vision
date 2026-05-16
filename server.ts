import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { HfInference } from "@huggingface/inference";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API Route for generating image
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, aspectRatio } = req.body;
      const apiKey = process.env.HF_API_TOKEN;

      if (!apiKey) {
        return res.status(401).json({ error: "API key is missing. Please set HF_API_TOKEN in your environment variables." });
      }

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ratioPromptSuffix = ` aspectRatio: ${aspectRatio}`;
      const finalPrompt = prompt + ratioPromptSuffix;

      const hf = new HfInference(apiKey);
      const blob = await hf.textToImage({
        model: "black-forest-labs/FLUX.1-schnell",
        inputs: finalPrompt,
      });

      const buffer = await blob.arrayBuffer();
      res.setHeader("Content-Type", blob.type || "image/jpeg");
      res.send(Buffer.from(buffer));
    } catch (error: any) {
      console.error("API /api/generate Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
