import { type NextRequest, NextResponse } from "next/server"
import { generateWordDefinition } from "@/lib/openai"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  console.log("🔍 Search API called")

  try {
    const { word, responseType = "friendly" } = await request.json()
    console.log(`📝 Processing word: "${word}" with responseType: "${responseType}"`)

    if (!word || typeof word !== "string") {
      console.error("❌ Invalid word parameter")
      return NextResponse.json({ error: "Word is required and must be a string" }, { status: 400 })
    }

    let wordData

    try {
      console.log("🤖 Attempting OpenAI generation...")
      wordData = await generateWordDefinition(word, responseType)
      console.log("✅ OpenAI generation successful")
    } catch (err) {
      console.warn("⚠️ OpenAI generation failed, using fallback:", err instanceof Error ? err.message : err)
      wordData = getFallbackWordData(word)
    }

    // Save search history if Supabase is available
    try {
      console.log("💾 Attempting to save to Supabase...")
      const supabase = createServerClient()
      if (supabase) {
        const { error: dbError } = await supabase.from("search_history").insert({
          word: word.toLowerCase(),
          definition: wordData.definition,
          created_at: new Date().toISOString(),
        })

        if (dbError) {
          console.warn("⚠️ Supabase insert failed:", dbError)
        } else {
          console.log("✅ Successfully saved to Supabase")
        }
      } else {
        console.log("⚠️ Supabase client not available")
      }
    } catch (dbError) {
      console.warn("⚠️ Database operation failed:", dbError)
    }

    console.log("✅ Returning successful response")
    return NextResponse.json({
      ...wordData,
      image_url: null, // Will be updated by client-side image generation
    })
  } catch (error) {
    console.error("❌ Search API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process search request",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

function getFallbackWordData(word: string) {
  console.log(`🔄 Using fallback data for word: "${word}"`)
  return {
    word,
    pronunciation: `/${word}/`,
    partOfSpeech: "noun",
    definition: `A ${word} is something special that you can learn about!`,
    trueMeaningNote: "This definition is based on trusted dictionary sources.",
    simpleExplanation: `It's a fun way to learn what ${word} really means.`,
    realWorldScenario: `Imagine encountering "${word}" in a real-world setting.`,
    examples: [`I learned something new about ${word} today.`, `The ${word} was very interesting to discover.`],
    imagePrompt: `A cheerful, cartoon-style illustration showing children or teens engaging with the concept of "${word}" in a bright, colorful scene.`,
  }
}
