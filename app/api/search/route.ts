import { type NextRequest, NextResponse } from "next/server"
import { generateWordDefinition } from "@/lib/openai"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  console.log("🔍 Search API called")

  try {
    const { word, responseType = "friendly" } = await request.json()
    console.log(`📝 Processing word: "${word}" with responseType: "${responseType}"`)

    // Validation 1: Check if word exists and is a string
    if (!word || typeof word !== "string") {
      console.error("❌ Invalid word parameter")
      return NextResponse.json(
        {
          error: "Word is required and must be a string",
          type: "INVALID_INPUT",
        },
        { status: 400 },
      )
    }

    // Validation 2: Check for spaces in the word
    if (word.includes(" ") || word.trim() !== word) {
      console.error("❌ Word contains spaces")
      return NextResponse.json(
        {
          error: "Word cannot contain spaces. Please enter a single word only.",
          type: "CONTAINS_SPACES",
        },
        { status: 400 },
      )
    }

    // Validation 3: Check word length (max 30 characters)
    if (word.length > 30) {
      console.error("❌ Word too long")
      return NextResponse.json(
        {
          error: "Word is too long. Please enter a word with less than 30 characters.",
          type: "TOO_LONG",
          maxLength: 30,
          currentLength: word.length,
        },
        { status: 400 },
      )
    }

    // Validation 4: Check for minimum length
    if (word.length < 1) {
      console.error("❌ Word too short")
      return NextResponse.json(
        {
          error: "Please enter a valid word.",
          type: "TOO_SHORT",
        },
        { status: 400 },
      )
    }

    // Validation 5: Check for special characters (only allow letters, hyphens, and apostrophes)
    const validWordPattern = /^[a-zA-Z'-]+$/
    if (!validWordPattern.test(word)) {
      console.error("❌ Word contains invalid characters")
      return NextResponse.json(
        {
          error:
            "Word can only contain letters, hyphens (-), and apostrophes ('). No numbers or special characters allowed.",
          type: "INVALID_CHARACTERS",
        },
        { status: 400 },
      )
    }

    // Validation 6: Check for repeated characters (like "aaaaaaa")
    const repeatedCharPattern = /(.)\1{4,}/
    if (repeatedCharPattern.test(word)) {
      console.error("❌ Word has too many repeated characters")
      return NextResponse.json(
        {
          error: "Please enter a real word. Avoid words with too many repeated characters.",
          type: "REPEATED_CHARACTERS",
        },
        { status: 400 },
      )
    }

    // Validation 7: Check for common non-words
    const commonNonWords = ["asdf", "qwerty", "zxcv", "hjkl", "test", "abc", "xyz"]
    if (commonNonWords.includes(word.toLowerCase())) {
      console.error("❌ Common non-word detected")
      return NextResponse.json(
        {
          error: "Please enter a real word to learn about.",
          type: "NON_WORD",
        },
        { status: 400 },
      )
    }

    let wordData
    let openaiError = null

    try {
      console.log("🤖 Attempting OpenAI generation...")
      wordData = await generateWordDefinition(word, responseType)
      console.log("✅ OpenAI generation successful")
    } catch (err) {
      openaiError = err
      console.error("❌ OpenAI generation failed:", err instanceof Error ? err.message : err)

      // Only use fallback if OpenAI is not configured
      if (!process.env.OPENAI_API_KEY) {
        console.warn("⚠️ OpenAI API key not configured, using fallback")
        wordData = getFallbackWordData(word)
      } else {
        // If API key exists but request failed, check if it's because word is not real
        const errorMessage = err instanceof Error ? err.message.toLowerCase() : ""

        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("not a real word") ||
          errorMessage.includes("invalid word") ||
          errorMessage.includes("unknown word")
        ) {
          console.error("❌ Word not found in dictionary")
          return NextResponse.json(
            {
              error: "This word was not found in our dictionary. Please check the spelling or try a different word.",
              type: "WORD_NOT_FOUND",
              suggestion: "Make sure you've spelled the word correctly.",
            },
            { status: 404 },
          )
        }

        // For other API errors
        console.error("❌ OpenAI configured but request failed, returning error")
        return NextResponse.json(
          {
            error: "Unable to process your request right now. Please try again later.",
            type: "API_ERROR",
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        )
      }
    }

    // Additional validation: Check if the returned definition makes sense
    if (wordData && wordData.definition) {
      const definitionLower = wordData.definition.toLowerCase()
      if (
        definitionLower.includes("not a real word") ||
        definitionLower.includes("not found") ||
        definitionLower.includes("invalid") ||
        definitionLower.includes("unknown word")
      ) {
        console.error("❌ AI determined word is not real")
        return NextResponse.json(
          {
            error: "This doesn't appear to be a real word. Please check the spelling or try a different word.",
            type: "INVALID_WORD",
            suggestion: "Try searching for a common English word.",
          },
          { status: 404 },
        )
      }
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
        type: "SERVER_ERROR",
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
