import OpenAI from "openai";

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log("⚠️ OpenAI client not available, using fallback");
      return null;
    }

    try {
      openaiClient = new OpenAI({ apiKey });
    } catch (error) {
      console.error("❌ Failed to initialize OpenAI client:", error);
      return null;
    }
  }
  return openaiClient;
}

export function isOpenAIConfigured(): boolean {
  const configured = !!process.env.OPENAI_API_KEY;
  return configured;
}

export async function generateWordDefinition(
  word: string,
  definition: string,
  responseType = "friendly"
) {
  const openai = getOpenAIClient();
  if (!openai) {
    const error = new Error(
      "OpenAI not configured - API key missing or invalid"
    );
    console.error("❌ OpenAI configuration error:", error.message);
    throw error;
  }

  try {
    console.log("📡 Making OpenAI API request...");

    const prompt = `You are an expert educational AI assistant with 20+ years of teaching experience, specializing in helping children and teens (ages 6–18) learn English vocabulary through rich, engaging, and age-appropriate learning cards. For the word "${word}", generate a highly detailed JSON response following this structure :

1. **Word & Pronunciation**: Provide the exact word and its phonetic pronunciation (IPA-style, simple and child-friendly, e.g. /həˈpiː/). Add a short hint on how to say it (e.g. “rhymes with…”).
2. **Part of Speech**: Clearly state the grammatical role (noun, verb, adjective, etc.) with a brief explanation of what that part of speech means in simple terms.
3. **Core Definition**: A precise, dictionary-accurate definition (1 sentence if needed).
4. **True Meaning Note**: A confirmation sentence explaining that this meaning aligns with major dictionary sources.
5. **Child-Friendly Explanation**: A playful, engaging version of the definition tailored for ages 6–18, written as if teaching a curious student.
6. **Real-World Scenario**: A detailed and relatable mini-story (1 sentence) that shows where someone might encounter this word in school, at home, in sports, friendships, or daily life.
7. **Usage Examples**: Two distinct, creative sentences that show correct usage in very different contexts (make one casual/fun, the other academic/formal).
8. **Image Prompt**: A single, richly detailed cartoon-style illustration description. Include: characters (kids(1 to 3), animals, or objects), setting (playground, school, park, fantasy world), actions, and emotions — all designed to clearly show the word’s meaning in a fun and memorable way.

⚠️ Important formatting rules:
- Output MUST be valid JSON (no markdown, no code blocks).
- The "imagePrompt" field must always be one descriptive string, not an object.
- Explanations and examples should be long enough to be vivid but still easy to understand.

Example format:
{
  "word": "brave",
  "pronunciation": "/breɪv/ (rhymes with 'wave')",
  "partOfSpeech": "adjective — a word that describes someone or something",
  "definition": "Having or showing mental or moral strength to face danger, fear, or difficulty. A brave person does not let fear stop them from doing what is right or necessary.",
  "trueMeaningNote": "",
  "simpleExplanation": "Being brave means you do something even when you feel scared, like standing up for a friend or trying something new.",
  "realWorldScenario": "Imagine a child who is nervous about swimming in deep water but jumps in and tries anyway, or a student who speaks in front of the class even though their heart is racing. These are everyday moments of bravery.",
  "examples": [
    "The brave firefighter rushed into the burning house to save the puppy.",
    "She was brave enough to ask a difficult question in front of the entire school assembly."
  ],
  "imagePrompt": "A colorful cartoon scene of a young child standing tall with a slightly nervous but determined smile as they face a big, friendly-looking dragon in a park, while friends cheer from the background — the scene shows courage, determination, and bravery."
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful educational assistant that creates child- and teen-friendly word definitions. You MUST respond with valid JSON only — no markdown, no code blocks, no backticks. The imagePrompt must be a single string, not an object
      IMPORTANT: Every text field (definition, simpleExplanation, realWorldScenario, examples) should be **no longer than 1 sentence**. Keep answers short, clear, and easy to read.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI API");
    }

    // Clean up the response
    const cleanedResponse = response
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .replace(/^`+|`+$/g, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    // Ensure imagePrompt is a string
    if (parsed.imagePrompt && typeof parsed.imagePrompt === "object") {
      if (parsed.imagePrompt.keyActionsOrMood) {
        parsed.imagePrompt = parsed.imagePrompt.keyActionsOrMood;
      } else {
        parsed.imagePrompt = `A colorful cartoon illustration showing children learning about ${definition} in a bright, educational setting`;
      }
    }
    return {
      word: parsed.word || word,
      pronunciation: parsed.pronunciation || `/${word}/`,
      partOfSpeech: parsed.partOfSpeech || "noun",
      definition:
        parsed.definition ||
        `A ${word} is something special that you can learn about!`,
      trueMeaningNote:
        parsed.trueMeaningNote ||
        "This definition is based on trusted dictionary sources.",
      simpleExplanation:
        parsed.simpleExplanation ||
        `It's a fun way to learn what ${word} really means.`,
      realWorldScenario:
        parsed.realWorldScenario ||
        `Imagine encountering "${word}" in a real-world setting.`,
      examples: parsed.examples || [
        `I learned something new about ${word} today.`,
        `The ${word} was very interesting to discover.`,
      ],
      imagePrompt:
        parsed.imagePrompt ||
        `A cheerful, cartoon-style illustration showing children or teens engaging with the concept of "${word}" in a bright, colorful scene.`,
    };
  } catch (error) {
    console.error("❌ OpenAI API error details:", error);

    // More specific error logging
    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
    }

    // Check if it's an API key issue
    if (error instanceof Error && error.message.includes("401")) {
      console.error("❌ AUTHENTICATION ERROR - Check your OpenAI API key");
    }

    throw error; // Don't catch here, let the API route handle it
  }
}
