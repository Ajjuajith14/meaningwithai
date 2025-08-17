const GETIMG_KEY = process.env.GETIMG_API_KEY
const GETIMG_URL = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image"
const MODEL_ID = "real-cartoon-xl-v6"

console.log(`🔑 GetImg API Key configured: ${GETIMG_KEY ? "Yes" : "No"}`)

// Default negative prompts to avoid unwanted content
const NEGATIVE_PROMPT = ["dark", "scary", "violent", "inappropriate", "complex", "realistic", "adult content"].join(
  ", ",
)

/**
 * Generate a colorful, child-friendly cartoon image from a detailed prompt via getimg.ai.
 */
export async function generateWordImage(imagePrompt: string): Promise<string> {
  console.log(`🎨 Attempting to generate image with prompt: "${imagePrompt.substring(0, 100)}..."`)

  if (!GETIMG_KEY) {
    console.log("⚠️ GetImg API key not found, using placeholder")
    return placeholderURL(imagePrompt)
  }

  const payload = {
    model: MODEL_ID,
    prompt: imagePrompt,
    negative_prompt: NEGATIVE_PROMPT,
    width: 512,
    height: 512,
    steps: 25,
    guidance: 7.5,
    response_format: "b64",
    samples: 1,
  }

  try {
    console.log("📡 Making GetImg.ai API request...")

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
    console.log("📦 GetImg.ai response received, processing...")

    // Support all possible GetImg response formats
    let imageUrl = ""

    if (data.url) {
      imageUrl = data.url
    } else if (data.image) {
      imageUrl = data.image.startsWith("data:") ? data.image : `data:image/png;base64,${data.image}`
    } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      const firstImage = data.images[0]
      if (typeof firstImage === "string") {
        imageUrl = firstImage.startsWith("data:") ? firstImage : `data:image/png;base64,${firstImage}`
      } else if (firstImage.url) {
        imageUrl = firstImage.url
      }
    }

    if (!imageUrl) {
      console.error("❌ No image data received from GetImg.ai")
      return placeholderURL(imagePrompt)
    }

    console.log("✅ Image generated successfully with GetImg.ai")
    return imageUrl
  } catch (error) {
    console.error("❌ GetImg.ai Inference error:", error)
    return placeholderURL(imagePrompt)
  }
}

function placeholderURL(text: string) {
  return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(text.substring(0, 50))}`
}

export function isGetImgConfigured(): boolean {
  return !!GETIMG_KEY
}
