import { type NextRequest, NextResponse } from "next/server"
import { generateWordImage } from "@/lib/getimg"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  console.log("🖼️ Generate Image API called")

  try {
    const body = await request.json()
    console.log("📦 Request body:", JSON.stringify(body, null, 2))

    const { imagePrompt, prompt, word } = body

    // Handle both possible parameter names
    const finalPrompt = imagePrompt || prompt
    console.log("🎨 Final prompt:", finalPrompt?.substring(0, 100) + "...")

    if (!finalPrompt || typeof finalPrompt !== "string") {
      console.error("❌ Invalid prompt parameter. Received:", { imagePrompt, prompt, word })
      return NextResponse.json(
        {
          error: "Image prompt is required and must be a string",
          received: { imagePrompt, prompt, word },
        },
        { status: 400 },
      )
    }

    console.log("🎨 Generating image...")
    const imageUrl = await generateWordImage(finalPrompt)

    if (imageUrl) {
      console.log("✅ Image generation successful")
      return NextResponse.json({ image_url: imageUrl })
    } else {
      console.error("❌ Image generation failed")
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Generate Image API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
