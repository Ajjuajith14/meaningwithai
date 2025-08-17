import { type NextRequest, NextResponse } from "next/server"
import { generateWordImage } from "@/lib/getimg"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { prompt, word } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 })
    }

    // Default placeholder
    let imageUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(word || "Visual Learning")}`

    try {
      // Try generating with GetImg
      imageUrl = await generateWordImage(prompt)
    } catch (err) {
      console.warn("⚠️ Falling back to placeholder:", err)
    }

    return NextResponse.json({ image_url: imageUrl })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
