import OpenAI from "openai"

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    console.log(`🔑 OpenAI API Key configured: ${apiKey ? "Yes" : "No"}`)

    if (!apiKey) {
      console.log("⚠️ OpenAI client not available, using fallback")
      return null
    }

    try {
      openaiClient = new OpenAI({ apiKey })
      console.log("✅ OpenAI client initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize OpenAI client:", error)
      return null
    }
  }
  return openaiClient
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

export async function generateWordDefinition(word: string, responseType = "friendly") {
  console.log(`🤖 Generating definition for word: "${word}"`)

  const openai = getOpenAIClient()
  if (!openai) {
    throw new Error("OpenAI not configured")
  }

  try {
    console.log("📡 Making OpenAI API request...")

    const prompt = `You are an expert educational AI assistant creating richly detailed learning cards for children and teens ages 6–18. For the word "${word}," provide a comprehensive response with the following structure:

1. **Word & Pronunciation**: Provide the exact word and phonetic pronunciation using simple symbols (e.g. /həˈpiː/)
2. **Part of Speech**: State whether it is a noun, verb, adjective, adverb, etc.
3. **Core Definition**: A concise, dictionary-accurate definition (1 sentence)
4. **True Meaning Note**: Brief note confirming alignment with reputable sources (1 sentence)
5. **Child-Friendly Explanation**: Clear, engaging language for ages 6–18 (1 sentence)
6. **Real-World Scenario**: Relatable situation where someone might encounter this word (1 sentence)
7. **Usage Examples**: Two distinct, realistic sentences demonstrating correct usage
8. **Image Prompt**: A detailed, cartoon-style scene description that clearly illustrates the word's meaning for children

IMPORTANT: Respond with ONLY valid JSON. No markdown, no code blocks, no backticks. The imagePrompt field must be a single descriptive string, not an object.

Example format:
{
  "word": "${word}",
  "pronunciation": "/pronunciation/",
  "partOfSpeech": "noun",
  "definition": "Clear definition here",
  "trueMeaningNote": "This definition aligns with standard dictionaries.",
  "simpleExplanation": "Simple explanation here",
  "realWorldScenario": "Real world example here",
  "examples": ["Example 1", "Example 2"],
  "imagePrompt": "A colorful cartoon illustration showing [detailed scene description]"
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful educational assistant that creates child- and teen-friendly word definitions. You MUST respond with valid JSON only — no markdown, no code blocks, no backticks. The imagePrompt must be a single string, not an object.",
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

    // Clean up the response
    const cleanedResponse = response
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .replace(/^`+|`+$/g, "")
      .trim()

    console.log("🤖 OpenAI raw response:", response.substring(0, 200) + "...")
    console.log("🧹 Cleaned response:", cleanedResponse.substring(0, 200) + "...")

    const parsed = JSON.parse(cleanedResponse)

    // Ensure imagePrompt is a string
    if (parsed.imagePrompt && typeof parsed.imagePrompt === "object") {
      console.log("🔄 Converting object imagePrompt to string...")
      if (parsed.imagePrompt.keyActionsOrMood) {
        parsed.imagePrompt = parsed.imagePrompt.keyActionsOrMood
      } else {
        parsed.imagePrompt = `A colorful cartoon illustration showing children learning about ${word} in a bright, educational setting`
      }
    }

    console.log("✅ Successfully parsed OpenAI response")
    return {
      word: parsed.word || word,
      pronunciation: parsed.pronunciation || `/${word}/`,
      partOfSpeech: parsed.partOfSpeech || "noun",
      definition: parsed.definition || `A ${word} is something special that you can learn about!`,
      trueMeaningNote: parsed.trueMeaningNote || "This definition is based on trusted dictionary sources.",
      simpleExplanation: parsed.simpleExplanation || `It's a fun way to learn what ${word} really means.`,
      realWorldScenario: parsed.realWorldScenario || `Imagine encountering "${word}" in a real-world setting.`,
      examples: parsed.examples || [
        `I learned something new about ${word} today.`,
        `The ${word} was very interesting to discover.`,
      ],
      imagePrompt:
        parsed.imagePrompt ||
        `A cheerful, cartoon-style illustration showing children or teens engaging with the concept of "${word}" in a bright, colorful scene.`,
    }
  } catch (error) {
    console.error("❌ OpenAI API error:", error)
    throw error
  }
}
