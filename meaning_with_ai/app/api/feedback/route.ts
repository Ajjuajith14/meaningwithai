import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { name, email, age, feedbackType, message, rating } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const supabase = createServerClient()
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    console.log(`💭 New feedback received: ${feedbackType} (${rating}/5 stars)`)

    const { data, error } = await supabase
      .from("user_feedback")
      .insert({
        name: name || "Anonymous",
        email: email || null,
        age: age || null,
        feedback_type: feedbackType || "general",
        message: message.trim(),
        rating: rating || null,
        user_agent: userAgent,
        ip_address: clientIP,
      })
      .select()
      .single()

    if (error) {
      console.error("Feedback submission error:", error)
      return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
    }

    console.log(`✅ Feedback saved successfully: ${data.id}`)

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      id: data.id,
    })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
