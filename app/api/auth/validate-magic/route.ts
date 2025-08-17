import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // if (!isSupabaseConfigured) {
    //   return NextResponse.json({ error: "Authentication service not available" }, { status: 503 })
    // }

    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Validate magic link token
    const { data: userId, error } = await supabase.rpc("validate_magic_link", {
      token,
    })

    if (error) {
      console.error("Magic link validation error:", error)
      return NextResponse.json({ error: "Invalid or expired magic link" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      userId,
      message: "Account activated successfully",
    })
  } catch (error) {
    console.error("Magic link validation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
