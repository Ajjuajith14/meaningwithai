const GETIMG_KEY = process.env.GETIMG_API_KEY
const GETIMG_URL = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image"
const MODEL_ID = "real-cartoon-xl-v6"

// Enhanced logging
console.log(`🔑 GetImg API Key configured: ${GETIMG_KEY ? "Yes" : "No"}`)
console.log(`🔑 GetImg API Key length: ${GETIMG_KEY ? GETIMG_KEY.length : 0}`)
console.log(`🔑 GetImg API Key starts with: ${GETIMG_KEY ? GETIMG_KEY.substring(0, 10) + "..." : "N/A"}`)

// Default negative prompts to avoid unwanted content
const NEGATIVE_PROMPT = [
  "dark", "scary", "violent", "inappropriate", "complex", "realistic", "adult content"
].join(", ")

/**
 * Generate a colorful, child-friendly cartoon image from a detailed prompt via getimg.ai.
 */
export async function generateWordImage(imagePrompt: string): Promise<string> {
  console.log(`🎨 Attempting to generate image with prompt: "${imagePrompt.substring(0, 100)}..."`)
  console.log(`🔍 Environment check - GETIMG_API_KEY exists: ${!!GETIMG_KEY}`)
  console.log(`🔍 Environment check - GETIMG_API_KEY length: ${GETIMG_KEY?.length || 0}`)

  if (!GETIMG_KEY) {
    console.error("❌ GetImg API key not found, using placeholder")
    console.error("❌ Available environment variables:", Object.keys(process.env).filter(key => key.includes('GETIMG')))
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
    console.log("📦 Payload:", JSON.stringify({ ...payload, prompt: payload.prompt.substring(0, 50) + "..." }, null, 2))

    const response = await fetch(GETIMG_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GETIMG_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    console.log("📡 GetImg.ai API Response Status:", response.status)
    console.log("📡 GetImg.ai API Response Headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ GetImg.ai API Error:", response.status, errorText)
      
      // Check for specific error types
      if (response.status === 401) {
        console.error("❌ AUTHENTICATION ERROR - Check your GetImg API key")
      } else if (response.status === 429) {
        console.error("❌ RATE LIMIT ERROR - Too many requests")
      } else if (response.status === 400) {
        console.error("❌ BAD REQUEST ERROR - Check your payload")
      }
      
      return placeholderURL(imagePrompt)
    }

    const data = await response.json()
    console.log("📦 GetImg.ai response received, processing...")
    console.log("📦 Response keys:", Object.keys(data))

    // Support all possible GetImg response formats
    let imageUrl = ""

    if (data.url) {
      imageUrl = data.url
      console.log("✅ Found image URL in data.url")
    } else if (data.image) {
      imageUrl = data.image.startsWith("data:") ? data.image : `data:image/png;base64,${data.image}`
      console.log("✅ Found image data in data.image")
    } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      const firstImage = data.images[0]
      if (typeof firstImage === "string") {
        imageUrl = firstImage.startsWith("data:") ? firstImage : `data:image/png;base64,${firstImage}`
        console.log("✅ Found image data in data.images[0] as string")
      } else if (firstImage.url) {
        imageUrl = firstImage.url
        console.log("✅ Found image URL in data.images[0].url")
      }
    }

    if (!imageUrl) {
      console.error("❌ No image data received from GetImg.ai")
      console.error("❌ Full response:", JSON.stringify(data, null, 2))
      return placeholderURL(imagePrompt)
    }

    console.log("✅ Image generated successfully with GetImg.ai")
    console.log(`✅ Image URL type: ${imageUrl.startsWith('data:') ? 'base64' : 'url'}`)
    console.log(`✅ Image URL length: ${imageUrl.length}`)
    
    return imageUrl
  } catch (error) {
    console.error("❌ GetImg.ai Inference error:", error)
    
    if (error instanceof Error) {
      console.error("❌ Error name:", error.name)
      console.error("❌ Error message:", error.message)
      console.error("❌ Error stack:", error.stack)
    }
    
    return placeholderURL(imagePrompt)
  }
}

function placeholderURL(text: string) {
  const url = `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(text.substring(0, 50))}`
  console.log("🔄 Using placeholder URL:", url)
  return url
}

export function isGetImgConfigured(): boolean {
  const configured = !!GETIMG_KEY
  console.log(`🔍 isGetImgConfigured check: ${configured}`)
  return configured
}