import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { sendWelcomeEmail } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, school, age, parentEmail } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("🔐 Creating user account for:", email)

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split("@")[0],
          school: school || "",
          age: age ? Number.parseInt(age) : null,
          parent_email: parentEmail || "",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      console.error("❌ Signup error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("✅ User created successfully:", data.user?.email)

    // Send welcome email if user is immediately confirmed
    if (data.user?.email_confirmed_at) {
      await sendWelcomeEmail(email, fullName || email.split("@")[0])
    }

    // Wait a moment for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      user: data.user,
      needsConfirmation: !data.user?.email_confirmed_at,
      message: data.user?.email_confirmed_at
        ? "Account created successfully!"
        : "Please check your email to confirm your account",
    })
  } catch (error) {
    console.error("💥 Signup API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
