import { type NextRequest, NextResponse } from "next/server"
import { generateWordDefinition } from "@/lib/openai"
import { generateWordImage } from "@/lib/getimg"

export async function POST(request: NextRequest) {
  try {
    const { word, responseType } = await request.json()

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    console.log(`🔍 Searching for word: "${word}"`)

    // Generate comprehensive definition using OpenAI
    const wordData = await generateWordDefinition(word, responseType || "friendly")

    // Generate image using GetImg.ai with the detailed prompt
    const imageUrl = await generateWordImage(wordData.imagePrompt)

    const searchResult = {
      word: wordData.word,
      pronunciation: wordData.pronunciation,
      partOfSpeech: wordData.partOfSpeech,
      definition: wordData.definition,
      trueMeaningNote: wordData.trueMeaningNote,
      simpleExplanation: wordData.simpleExplanation,
      realWorldScenario: wordData.realWorldScenario,
      examples: wordData.examples,
      imagePrompt: wordData.imagePrompt,
      image_url: imageUrl,
    }

    console.log("✅ Search completed successfully for:", searchResult.word)

    // Return the search result immediately - no database operations
    return NextResponse.json(searchResult)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
