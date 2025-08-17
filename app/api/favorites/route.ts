import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // if (!isSupabaseConfigured) {
    //   return NextResponse.json({ error: "Database service not available" }, { status: 503 })
    // }

    const { userId, searchHistoryId } = await request.json()

    if (!userId || !searchHistoryId) {
      return NextResponse.json({ error: "User ID and search history ID are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Toggle favorite
    const { data: existing } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("search_history_id", searchHistoryId)
      .single()

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("search_history_id", searchHistoryId)

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, action: "removed" })
    } else {
      // Add to favorites
      const { error } = await supabase.from("user_favorites").insert({
        user_id: userId,
        search_history_id: searchHistoryId,
      })

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, action: "added" })
    }
  } catch (error) {
    console.error("Favorites API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
