import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        data: [],
        message: "Database not configured",
      })
    }

    const { searchParams } = request.nextUrl
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Search history error:", error)
      return NextResponse.json({ error: "Failed to fetch search history" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Search history API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        data: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        message: "Database not configured",
      })
    }

    const body = await request.json()
    const { userId, word, definition, imageUrl, responseType } = body

    if (!userId || !word) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("search_history")
      .insert({
        user_id: userId,
        word,
        definition,
        image_url: imageUrl,
        response_type: responseType || "friendly",
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Insert search history error:", error)
      return NextResponse.json({ error: "Failed to save search history" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Search history POST error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 },
    )
  }
}
