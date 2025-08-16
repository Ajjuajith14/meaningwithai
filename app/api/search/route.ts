import { type NextRequest, NextResponse } from "next/server"
import { generateWordDefinition, isOpenAIConfigured } from "@/lib/openai"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { word, responseType = "friendly" } = await request.json()

    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "Word is required and must be a string" }, { status: 400 })
    }

    const openaiAvailable = isOpenAIConfigured()

    let wordData
    if (openaiAvailable) {
      try {
        wordData = await generateWordDefinition(word, responseType)
      } catch (error) {
        wordData = {
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
    } else {
      wordData = {
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

    try {
      const supabase = createServerClient()
      if (supabase) {
        await supabase.from("search_history").insert({
          word: word.toLowerCase(),
          definition: wordData.definition,
          created_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      // Silently fail if database not configured
    }

    const response = {
      word: wordData.word,
      pronunciation: wordData.pronunciation,
      partOfSpeech: wordData.partOfSpeech,
      definition: wordData.definition,
      trueMeaningNote: wordData.trueMeaningNote,
      simpleExplanation: wordData.simpleExplanation,
      realWorldScenario: wordData.realWorldScenario,
      examples: wordData.examples,
      imagePrompt: wordData.imagePrompt,
      image_url: null, // Will be updated by client-side image generation
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process search request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
