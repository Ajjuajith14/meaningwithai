import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { sendMagicLinkEmail } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // console.log("🔗 Generating magic link for:", email)

    const supabase = createServerClient()

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("user_profiles")
      .select("id, full_name")
      .eq("email", email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found. Please sign up first." }, { status: 404 })
    }

    // Generate magic link token
    const { data: token, error: tokenError } = await supabase.rpc("generate_magic_link_token", {
      user_email: email,
    })

    if (tokenError) {
      console.error("Magic link generation error:", tokenError)
      return NextResponse.json({ error: "Failed to generate magic link" }, { status: 400 })
    }

    // Create magic link URL
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/magic?token=${token}`

    // console.log("🔗 Magic Link generated:", magicLink)

    // Send email with magic link
    const emailSent = await sendMagicLinkEmail(email, magicLink, user.full_name)

    if (!emailSent) {
      console.warn("⚠️ Email sending failed, but magic link was generated")
    }

    return NextResponse.json({
      success: true,
      message: "Magic link sent to your email",
      // Remove this in production
      magicLink: process.env.NODE_ENV === "development" ? magicLink : undefined,
    })
  } catch (error) {
    console.error("Magic link API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
