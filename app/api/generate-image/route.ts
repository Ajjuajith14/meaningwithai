import { type NextRequest, NextResponse } from "next/server"
import { generateWordImage } from "@/lib/getimg"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  console.log("🖼️ Generate Image API called")

  try {
    const body = await request.json()
    console.log("📦 Request body:", JSON.stringify(body, null, 2))

    const { imagePrompt, prompt, word } = body

    // Handle both possible parameter names and convert object to string if needed
    let finalPrompt = imagePrompt || prompt

    console.log("🔍 Raw prompt type:", typeof finalPrompt)
    console.log("🔍 Raw prompt value:", finalPrompt)

    // If imagePrompt is an object, convert it to a string
    if (finalPrompt && typeof finalPrompt === "object") {
      console.log("🔄 Converting object prompt to string...")

      // Extract the key action/mood as the main prompt
      if (finalPrompt.keyActionsOrMood) {
        finalPrompt = finalPrompt.keyActionsOrMood
      } else {
        // Fallback: create a string from the object properties
        const characters = Array.isArray(finalPrompt.charactersOrObjects)
          ? finalPrompt.charactersOrObjects.join(", ")
          : "children"
        const environment = finalPrompt.environment || "a colorful scene"
        const colors = Array.isArray(finalPrompt.colorsStyleCues)
          ? finalPrompt.colorsStyleCues.join(", ")
          : "bright colors"

        finalPrompt = `A cartoon-style illustration showing ${characters} in ${environment} with ${colors}, child-friendly and educational`
      }

      console.log("✅ Converted to string prompt:", finalPrompt)
    }

    if (!finalPrompt || typeof finalPrompt !== "string" || finalPrompt.trim() === "") {
      console.error("❌ Invalid prompt parameter after processing. Received:", {
        imagePrompt,
        prompt,
        word,
        finalPrompt,
      })
      return NextResponse.json(
        {
          error: "Image prompt is required and must be a string",
          received: { imagePrompt, prompt, word, finalPrompt },
        },
        { status: 400 },
      )
    }

    console.log(`🎨 Final prompt: "${finalPrompt.substring(0, 100)}..."`)
    console.log("🎨 Generating image...")
    const imageUrl = await generateWordImage(finalPrompt.trim())

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
