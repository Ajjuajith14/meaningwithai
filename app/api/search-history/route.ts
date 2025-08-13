import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: history, error } = await supabase
      .from("search_history")
      .select("*")
      .eq("user_id", userId)
      .order("search_date", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Search history fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch search history" }, { status: 400 })
    }

    return NextResponse.json(history)
  } catch (error) {
    console.error("Search history API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
