const GETIMG_KEY = process.env.GETIMG_API_KEY
const GETIMG_URL = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image"
const MODEL_ID = "real-cartoon-xl-v6"

// Default negative prompts to avoid unwanted content
const NEGATIVE_PROMPT = ["dark", "scary", "violent", "inappropriate", "complex", "realistic", "adult content"].join(
  ", ",
)

/**
 * Generate a colorful, child-friendly cartoon image from a detailed prompt via getimg.ai.
 *
//  * imagePrompt - A richly detailed, cartoon-style prompt describing
 *                      characters, scene, colors, style cues, and action.
 * @returns A data URL string (base64 PNG) or a placeholder URL.
 */
export async function generateWordImage(imagePrompt: string): Promise<string> {
  if (!GETIMG_KEY) {
    console.log("⚠️ GetImg API key not found, using placeholder")
    return placeholderURL(imagePrompt)
  }

  const payload = {
    model: MODEL_ID,
    prompt: imagePrompt,
    negative_prompt: NEGATIVE_PROMPT,
    negative_prompt_2: NEGATIVE_PROMPT,
    width: 512,
    height: 512,
    steps: 25,
    guidance: 7.5,
    response_format: "b64",
    samples: 1,
  }

  try {
    console.log("🎨 Generating image with GetImg.ai for prompt:", imagePrompt.substring(0, 100) + "...")

    const response = await fetch(GETIMG_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GETIMG_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    console.log("📡 GetImg.ai API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ GetImg.ai API Error:", response.status, errorText)
      return placeholderURL(imagePrompt)
    }

    const data = await response.json()
    const base64 = Array.isArray(data.images) ? data.images[0] : data.image || ""

    if (!base64) {
      console.error("❌ No image data received from GetImg.ai")
      return placeholderURL(imagePrompt)
    }

    console.log("✅ Image generated successfully with GetImg.ai")
    return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`
  } catch (error) {
    console.error("❌ GetImg.ai Inference error:", error)
    return placeholderURL(imagePrompt)
  }
}

function placeholderURL(text: string) {
  return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(text.substring(0, 50))}`
}
