import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // If Supabase is not configured, redirect to home with a message
    if (!isSupabaseConfigured) {
      console.warn("Auth callback called but Supabase is not configured")
      const redirectUrl = new URL("/", request.url)
      redirectUrl.searchParams.set("message", "Authentication not available")
      return NextResponse.redirect(redirectUrl)
    }

    const supabase = createServerClient()
    const { searchParams } = request.nextUrl
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host")
        const isLocalEnv = process.env.NODE_ENV === "development"

        if (isLocalEnv) {
          return NextResponse.redirect(`http://localhost:3000${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL || "https://visualizedictionary.com"}${next}`,
          )
        }
      }
    }

    // Return the user to an error page with instructions
    const redirectUrl = new URL("/", request.url)
    redirectUrl.searchParams.set("error", "auth_callback_failed")
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Auth callback error:", error)
    // Redirect to home page if there's any error
    const redirectUrl = new URL("/", request.url)
    redirectUrl.searchParams.set("error", "auth_callback_failed")
    return NextResponse.redirect(redirectUrl)
  }
}
