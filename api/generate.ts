import { HfInference } from "@huggingface/inference";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, aspectRatio } = req.body || {};
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let resultBuffer: ArrayBuffer | null = null;
    let fallbackUsed = false;

    // Try Hugging Face first
    const apiKey = process.env.HF_API_TOKEN;
    if (apiKey) {
      try {
        const hf = new HfInference(apiKey);
        
        const blob = await hf.textToImage({
          model: "black-forest-labs/FLUX.1-schnell",
          inputs: prompt,
          provider: "hf-inference" // Force free inference API
        });
        resultBuffer = await blob.arrayBuffer();
      } catch (hfError: any) {
        console.error("Hugging Face API failed, falling back to Pollinations.ai:", hfError.message || hfError);
        fallbackUsed = true;
      }
    } else {
      console.log("No HF_API_TOKEN found, falling back to Pollinations.ai");
      fallbackUsed = true;
    }

    // Fallback to Pollinations.ai
    if (!resultBuffer || fallbackUsed) {
      let width = 1024;
      let height = 1024;
      if (aspectRatio === '16:9') { width = 1024; height = 576; }
      else if (aspectRatio === '9:16') { width = 576; height = 1024; }
      else if (aspectRatio === '4:3') { width = 1024; height = 768; }
      else if (aspectRatio === '3:4') { width = 768; height = 1024; }

      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to generate image from fallback service.");
      }
      const blob = await response.blob();
      resultBuffer = await blob.arrayBuffer();
    }

    if (resultBuffer) {
      const buffer = Buffer.from(resultBuffer);
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(buffer);
    } else {
      throw new Error("No image generated");
    }

  } catch (error: any) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}
