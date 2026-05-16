import { HfInference } from "@huggingface/inference";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, aspectRatio } = req.body;
    const apiKey = process.env.HF_API_TOKEN || process.env.VITE_HF_API_TOKEN;

    if (!apiKey) {
      return res.status(401).json({ error: "API key is missing. Please set HF_API_TOKEN in your Vercel environment variables." });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ratioPromptSuffix = ` aspectRatio: ${aspectRatio}`;
    const finalPrompt = prompt + ratioPromptSuffix;

    const hf = new HfInference(apiKey as string);
    const blob = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: finalPrompt,
      provider: "hf-inference" // Force free inference API, avoid third party provider credit limits
    });

    const buffer = await blob.arrayBuffer();
    res.setHeader("Content-Type", blob.type || "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    console.error("API /api/generate Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
