import { Resend } from "resend"

// Lazy initialization to prevent build-time errors
let resend: Resend | null = null

function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function sendMagicLinkEmail(email: string, magicLink: string, name?: string) {
  try {
    const resendClient = getResendClient()

    if (!resendClient || !process.env.RESEND_API_KEY) {
      console.log("⚠️ Resend API key not found, logging magic link instead")
      console.log(`🔗 Magic Link for ${email}: ${magicLink}`)
      return true
    }

    const { data, error } = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Visualize Dictionary <onboarding@resend.dev>",
      to: [email],
      subject: "🔗 Your Magic Link for Visualize Dictionary",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Magic Link - Visualize Dictionary</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; font-size: 2.5em; margin: 0;">🦉 Visualize Dictionary</h1>
            <p style="color: #6b7280; font-size: 1.1em;">Visual Dictionary for Kids</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
            <h2 style="color: #1e40af; margin-top: 0;">Hi ${name || "there"}! 👋</h2>
            <p style="font-size: 1.1em; margin-bottom: 25px;">
              Click the magic button below to sign in to your Visualize Dictionary account and start your learning adventure!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 1.1em; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                ✨ Sign In with Magic Link ✨
              </a>
            </div>
            
            <p style="font-size: 0.9em; color: #6b7280; text-align: center;">
              This link will expire in 15 minutes for security.
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>🔒 Security Note:</strong> If you didn't request this magic link, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 0.9em;">
              Happy Learning! 🌟<br>
              The Visualize Dictionary Team
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("❌ Resend email error:", error)
      return false
    }

    console.log("✅ Magic link email sent successfully:", data?.id)
    return true
  } catch (error) {
    console.error("💥 Email sending failed:", error)
    return false
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const resendClient = getResendClient()

    if (!resendClient || !process.env.RESEND_API_KEY) {
      console.log("⚠️ Resend API key not found, skipping welcome email")
      return true
    }

    const { data, error } = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Visualize Dictionary <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Welcome to Visualize Dictionary!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Visualize Dictionary</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; font-size: 2.5em; margin: 0;">🦉 Visualize Dictionary</h1>
            <p style="color: #6b7280; font-size: 1.1em;">Visual Dictionary for Kids</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #dbeafe 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
            <h2 style="color: #059669; margin-top: 0;">Welcome ${name}! 🎉</h2>
            <p style="font-size: 1.1em; margin-bottom: 25px;">
              Your Visualize Dictionary account is now active! You now have unlimited word searches and your learning history will be saved.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">🌟 What you can do now:</h3>
              <ul style="color: #374151; padding-left: 20px;">
                <li>🔍 Search unlimited words with AI-powered definitions</li>
                <li>🎨 Get beautiful, child-friendly images for every word</li>
                <li>📚 Save your search history for future reference</li>
                <li>⭐ Mark your favorite words</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}" 
                 style="background: linear-gradient(135deg, #059669 0%, #3b82f6 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 1.1em; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);">
                🚀 Start Learning Now!
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 0.9em;">
              Happy Learning! 🌟<br>
              The Visualize Dictionary Team
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("❌ Welcome email error:", error)
      return false
    }

    console.log("✅ Welcome email sent successfully:", data?.id)
    return true
  } catch (error) {
    console.error("💥 Welcome email sending failed:", error)
    return false
  }
}
