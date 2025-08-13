// lib/huggingface.ts
import { InferenceClient } from "@huggingface/inference";

const HF_KEY = process.env.HUGGING_FACE_API_KEY;
const hf = HF_KEY ? new InferenceClient(HF_KEY) : null;

function placeholderURL(word: string) {
  return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(word)}`;
}

// A type‐guard to detect Blob-like objects
function isBlobLike(x: unknown): x is { arrayBuffer: () => Promise<ArrayBuffer>; type?: string } {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as any).arrayBuffer === "function"
  );
}

export async function generateWordImage(definition: string): Promise<string> {
  if (!hf) {
    return placeholderURL(definition);
  }

  const prompt = `A simple, colorful, child-friendly illustration of ${definition}, cartoon style, bright colors, educational, suitable for children, clean background`;
  console.log("🎨 Generating image for:", definition);

  try {
    // result may be string | string[] | Blob-like
    const result: unknown = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      provider: "together",
      inputs: prompt,
      parameters: {
        negative_prompt:
          "dark, scary, violent, inappropriate, complex, realistic, adult content",
        num_inference_steps: 20,
        guidance_scale: 7.5,
        width: 512,
        height: 512,
      },
    });

    console.log("📡 Hugging Face response type:", typeof result);

    let base64data: string;

    // Case 1: single base64 string

    if (typeof result === "string") {
      base64data = result;
    }
    // Case 2: array of base64 strings
    else if (Array.isArray(result) && typeof result[0] === "string") {
      base64data = result[0];
    }
    // Case 3: Blob-like object with arrayBuffer()
    else if (isBlobLike(result)) {
      const buffer = await result.arrayBuffer();
      base64data = Buffer.from(buffer).toString("base64");
      const mime = result.type ?? "image/png";
      return `data:${mime};base64,${base64data}`;
    } else {
      throw new Error("Unexpected response shape from textToImage");
    }

    // Normalize to data URL
    return base64data.startsWith("data:")
      ? base64data
      : `data:image/png;base64,${base64data}`;
  } catch (err) {
    console.error("❌ Hugging Face Inference error:", err);
    return placeholderURL(definition);
  }
}
