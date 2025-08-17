import { OpenAI } from "openai"

let openaiClient: OpenAI | null = null
let isConfigured: boolean | null = null

function getOpenAIClient(): OpenAI | null {
  if (isConfigured === null) {
    isConfigured = !!process.env.OPENAI_API_KEY
    console.log("🔑 OpenAI API Key configured:", isConfigured ? "Yes" : "No")
  }

  if (!isConfigured) {
    return null
  }

  if (!openaiClient) {
    try {
      openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
      })
      console.log("✅ OpenAI client initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize OpenAI client:", error)
      return null
    }
  }

  return openaiClient
}

export async function generateWordDefinition(
  word: string,
  responseType = "friendly",
): Promise<{
  word: string
  pronunciation: string
  partOfSpeech: string
  definition: string
  trueMeaningNote: string
  simpleExplanation: string
  realWorldScenario: string
  examples: string[]
  imagePrompt: string
}> {
  console.log(`🤖 Generating definition for word: "${word}"`)

  const client = getOpenAIClient()
  if (!client) {
    console.warn("⚠️ OpenAI client not available, using fallback")
    throw new Error("OpenAI not configured")
  }

  try {
    const prompt = `You are an expert educational AI assistant creating richly detailed learning cards for children and teens ages 6–18. For the word "${word}," follow these instructions precisely to ensure maximum clarity, factual accuracy, and pedagogical value:

1. **Word & Pronunciation**
   - Provide the exact "word": the target term.
   - Provide "pronunciation": a phonetic spelling using simple symbols (e.g. /həˈpiː/), so learners can say it correctly.

2. **Part of Speech**
   - State whether it is a noun, verb, adjective, adverb, etc., to give proper grammatical context.

3. **Core Definition** (1 sentence)
   - Craft a concise, dictionary-accurate definition that captures the precise meaning without added commentary.

4. **True Meaning Note** (1 sentence)
   - Include a brief note confirming that the definition aligns with reputable sources (e.g., Oxford, Merriam-Webster), ensuring "trueness" to standard usage.

5. **Child-Friendly Explanation** (1 sentence)
   - Rephrase the core definition in clear, engaging language that any 6–18-year-old can understand—without altering nuance or omitting key details.

6. **Real-World Scenario** (1 sentence)
   - Describe a relatable situation where someone might encounter or use this word, grounding abstract meaning in everyday life.

7. **Usage Examples** (2 sentences)
   - Provide two distinct, realistic sentences demonstrating correct use of the word in context.

8. **Image Prompt** (2–3 sentences)
   - Create a richly detailed, cartoon-style description for an image-generation API. Include:
   - Characters or objects ("a curious teen holding…")
   - The environment ("in a bright science lab with…" or "on a sunny playground with…")
   - Color/style cues ("soft pastels, bold outlines, playful expressions")
   - Key actions or mood ("excited discovery, dynamic interaction")
   - Any symbolic elements that clearly convey the word's concept

IMPORTANT: Respond with ONLY valid JSON. Do not include markdown code blocks, backticks, or any other formatting. Just return the raw JSON object:

{
  "word": "${word}",
  "pronunciation": "…",
  "partOfSpeech": "…",
  "definition": "Core definition here.",
  "trueMeaningNote": "This definition matches standard dictionary sources.",
  "simpleExplanation": "Child-friendly rephrase here.",
  "realWorldScenario": "One-sentence scenario here.",
  "examples": [
    "First example sentence using the word.",
    "Second example sentence using the word."
  ],
  "imagePrompt": "Detailed cartoon-style scene description here."
}

Ensure every field is precise, maintains the word's full nuance, and is engaging for ages 6–18. Trim any fluff—focus on clarity, accuracy, and usability for both learning and illustration.`

    console.log("📡 Making OpenAI API request...")

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful educational assistant that creates precise, child- and teen-friendly word definitions, usage examples, and rich cartoon-style image prompts. You MUST respond with valid JSON only - no markdown formatting, no code blocks, no backticks. Just return the raw JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from OpenAI")
    }

    console.log("✅ OpenAI response received, parsing...")

    let cleanedResponse = response.trim()

    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    cleanedResponse = cleanedResponse.replace(/^`+|`+$/g, "").trim()

    let parsed
    try {
      parsed = JSON.parse(cleanedResponse)
      console.log("✅ Successfully parsed OpenAI response")
    } catch (parseError) {
      console.error("❌ Failed to parse OpenAI response:", parseError)
      console.error("Raw response:", response.substring(0, 500))
      throw new Error(`Failed to parse OpenAI response: ${parseError}`)
    }

    return {
      word: parsed.word,
      pronunciation: parsed.pronunciation,
      partOfSpeech: parsed.partOfSpeech,
      definition: parsed.definition,
      trueMeaningNote: parsed.trueMeaningNote,
      simpleExplanation: parsed.simpleExplanation,
      realWorldScenario: parsed.realWorldScenario,
      examples: parsed.examples || [],
      imagePrompt: parsed.imagePrompt,
    }
  } catch (error) {
    console.error("❌ OpenAI API error:", error)
    throw error // Let the calling function handle the fallback
  }
}
