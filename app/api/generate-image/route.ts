import { type NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/getimg";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { prompt, word } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    const imageUrl = await generateImage(prompt);

    return NextResponse.json({
      image_url: imageUrl,
      word: word || "unknown",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
