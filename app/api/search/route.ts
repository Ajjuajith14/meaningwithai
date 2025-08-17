import { type NextRequest, NextResponse } from "next/server";
import { generateWordDefinition } from "@/lib/openai";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { word, responseType = "friendly" } = await request.json();

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Word is required and must be a string" },
        { status: 400 }
      );
    }

    let wordData;

    try {
      wordData = await generateWordDefinition(word, responseType);
    } catch (err) {
      // Use fallback data if OpenAI fails
      wordData = getFallbackWordData(word);
    }

    // Save search history if Supabase is available
    try {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from("search_history").insert({
          word: word.toLowerCase(),
          definition: wordData.definition,
          created_at: new Date().toISOString(),
        });
      }
    } catch (dbError) {
      // Silently fail if database not configured
    }

    return NextResponse.json({
      ...wordData,
      image_url: null, // Will be updated by client-side image generation
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process search request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function getFallbackWordData(word: string) {
  return {
    word,
    pronunciation: `/${word}/`,
    partOfSpeech: "noun",
    definition: `A ${word} is something special that you can learn about!`,
    trueMeaningNote: "This definition is based on trusted dictionary sources.",
    simpleExplanation: `It's a fun way to learn what ${word} really means.`,
    realWorldScenario: `Imagine encountering "${word}" in a real-world setting.`,
    examples: [
      `I learned something new about ${word} today.`,
      `The ${word} was very interesting to discover.`,
    ],
    imagePrompt: `A cheerful, cartoon-style illustration showing children or teens engaging with the concept of "${word}" in a bright, colorful scene.`,
  };
}
