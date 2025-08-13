import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createServerClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("❌ Email confirmation error:", error)
      } else {
        // console.log("✅ Email confirmed successfully for:", data.user?.email)
      }
    } catch (error) {
      console.error("❌ Email confirmation error:", error)
    }
  }

  // Redirect to home page
  return NextResponse.redirect(new URL("/", request.url))
}
