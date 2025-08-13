export async function generateWordImage(word: string): Promise<string> {
  try {
    // Check if API key exists
    if (!process.env.HUGGING_FACE_API_KEY) {
      console.log("⚠️ Hugging Face API key not found, using placeholder")
      return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(word)}`
    }

    // Try a different, more reliable model
    const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
    const prompt = `A simple, colorful, child-friendly illustration of ${word}, cartoon style, bright colors, educational, suitable for children, clean background`

    console.log("🎨 Generating image for:", word)

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "dark, scary, violent, inappropriate, complex, realistic, adult content",
        },
      }),
    })

    console.log("📡 Hugging Face API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Hugging Face API Error:", response.status, errorText)

      // Check if it's a model loading error (503)
      if (response.status === 503) {
        console.log("⏳ Model is loading, this is normal for the first request")
      }

      return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(word)}`
    }

    const imageBlob = await response.blob()
    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    console.log("✅ Image generated successfully for:", word)
    return `data:image/png;base64,${base64}`
  } catch (error) {
    console.error("💥 Hugging Face API error:", error)
    return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(word)}`
  }
}
