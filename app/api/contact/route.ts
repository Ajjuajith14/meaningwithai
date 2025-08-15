import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    console.log(`📧 New contact message from: ${email}`)

    if (!isSupabaseConfigured) {
      console.warn("Contact form submitted but database not configured")
      return NextResponse.json({
        success: true,
        message: "Message received! We'll get back to you soon.",
      })
    }

    const supabase = createServerClient()
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    // Prepare the data to insert
    const insertData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      user_agent: userAgent,
      ip_address: clientIP,
    }

    console.log("💾 Attempting to save contact message to database")

    // Save to database
    const { data, error } = await supabase.from("contact_messages").insert(insertData).select().single()

    if (error) {
      console.error("❌ Contact message submission error:", error)
      // Still return success to user, but log the error
      return NextResponse.json({
        success: true,
        message: "Message received! We'll get back to you soon.",
      })
    }

    console.log(`✅ Contact message saved successfully: ${data?.id}`)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      id: data?.id,
    })
  } catch (error) {
    console.error("💥 Contact API error:", error)

    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you soon.",
    })
  }
}
