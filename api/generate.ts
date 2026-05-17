import { HfInference } from "@huggingface/inference";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, aspectRatio, seed } = req.body || {};
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const enhancedPrompt = `${prompt.trim()}, highly detailed, masterpiece, 8k resolution, ultra-detailed, photorealistic`;

    // Default seed
    const randomSeed = seed || Math.floor(Math.random() * 1000000000);

    let resultBuffer: ArrayBuffer | null = null;
    let fallbackUsed = false;

    // Try Hugging Face first
    const apiKey = process.env.HF_API_TOKEN;
    if (apiKey) {
      try {
        const hf = new HfInference(apiKey);
        
        const blob = await hf.textToImage({
          model: "black-forest-labs/FLUX.1-schnell",
          inputs: enhancedPrompt,
          provider: "hf-inference", // Force free inference API
          parameters: {
            seed: randomSeed,
            use_cache: false
          } as any
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

      let width = 1024;
      let height = 1024;
      if (aspectRatio === '16:9') { width = 1024; height = 576; }
      else if (aspectRatio === '9:16') { width = 576; height = 1024; }
      else if (aspectRatio === '4:3') { width = 1024; height = 768; }
      else if (aspectRatio === '3:4') { width = 768; height = 1024; }

      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${randomSeed}&nologo=true&enhance=true`;

    if (resultBuffer && !fallbackUsed) {
      const buffer = Buffer.from(resultBuffer);
      const base64Image = buffer.toString('base64');
      res.status(200).json({ image: `data:image/jpeg;base64,${base64Image}` });
    } else {
      // Send fallback URL to the frontend to avoid Vercel 10s Serverless timeout
      res.status(200).json({ fallbackUrl });
    }

  } catch (error: any) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}
