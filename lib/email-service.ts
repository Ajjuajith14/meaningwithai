// Conditional import to prevent build errors
let Resend: any = null

try {
  if (process.env.RESEND_API_KEY) {
    const resendModule = require("resend")
    Resend = resendModule.Resend
  }
} catch (error) {
  console.log("⚠️ Resend not available")
}

export class EmailService {
  private resend: any = null

  constructor() {
    if (Resend && process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY)
    }
  }

  async sendOTPEmail(
    email: string,
    otp: string,
    purpose: "signup" | "signin" | "password_reset",
    name?: string,
  ): Promise<boolean> {
    try {
      if (!this.resend || !process.env.RESEND_API_KEY) {
        console.log("⚠️ Resend API key not found, logging OTP instead")
        console.log(`🔗 OTP for ${email}: ${otp}`)
        return true
      }

      const subjects = {
        signup: "🎉 Welcome to MeaningwithAI - Verify Your Email",
        signin: "🔐 Your MeaningwithAI Sign-in Code",
        password_reset: "🔑 Reset Your MeaningwithAI Password",
      }

      const { data, error } = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "MeaningwithAI <onboarding@resend.dev>",
        to: [email],
        subject: subjects[purpose],
        html: this.getOTPEmailTemplate(otp, purpose, name || email.split("@")[0]),
      })

      if (error) {
        console.error("❌ Resend email error:", error)
        return false
      }

      console.log("✅ OTP email sent successfully:", data?.id)
      return true
    } catch (error) {
      console.error("💥 Email sending failed:", error)
      return false
    }
  }

  async sendContactConfirmation(email: string, name: string, message: string): Promise<boolean> {
    try {
      if (!this.resend || !process.env.RESEND_API_KEY) {
        console.log("⚠️ Resend API key not found, skipping contact confirmation email")
        return true
      }

      const { data, error } = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "MeaningwithAI <support@resend.dev>",
        to: [email],
        subject: "📧 We received your message - MeaningwithAI",
        html: this.getContactConfirmationTemplate(name, message),
      })

      if (error) {
        console.error("❌ Contact confirmation email error:", error)
        return false
      }

      console.log("✅ Contact confirmation email sent successfully:", data?.id)
      return true
    } catch (error) {
      console.error("💥 Contact confirmation email failed:", error)
      return false
    }
  }

  private getContactConfirmationTemplate(name: string, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received - MeaningwithAI</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; font-size: 2.5em; margin: 0;">🦉 MeaningwithAI</h1>
          <p style="color: #6b7280; font-size: 1.1em;">Visual Dictionary for Kids</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #dbeafe 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
          <h2 style="color: #059669; margin-top: 0;">Thanks for reaching out, ${name}! 📧</h2>
          <p style="font-size: 1.1em; margin-bottom: 25px;">
            We've received your message and our team will get back to you within 24 hours.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="color: #1f2937; margin-top: 0;">Your Message:</h3>
            <p style="color: #374151; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? "..." : ""}"</p>
          </div>
          
          <p style="font-size: 0.9em; color: #059669; text-align: center;">
            <strong>📞 Need immediate help?</strong> Reply to this email and we'll prioritize your request!
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;">
            <strong>💡 While you wait:</strong> Feel free to explore more words on MeaningwithAI and continue your learning journey!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 0.9em;">
            Happy Learning! 🌟<br>
            The MeaningwithAI Support Team
          </p>
          <div style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}" 
               style="background: linear-gradient(135deg, #059669 0%, #3b82f6 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 12px 24px; 
                      border-radius: 20px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);">
              🚀 Continue Learning
            </a>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getOTPEmailTemplate(otp: string, purpose: string, name: string): string {
    const purposeConfig = {
      signup: {
        title: "Welcome to MeaningwithAI! 🎉",
        message: "Thanks for joining our AI-powered learning adventure! Enter this code to verify your email:",
        color: "#059669",
      },
      signin: {
        title: "Sign in to MeaningwithAI 🔐",
        message: "Use this code to sign in to your account:",
        color: "#3b82f6",
      },
      password_reset: {
        title: "Reset Your Password 🔑",
        message: "Use this code to reset your password:",
        color: "#dc2626",
      },
    }

    const config = purposeConfig[purpose as keyof typeof purposeConfig]

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.title}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; font-size: 2.5em; margin: 0;">🦉 MeaningwithAI</h1>
          <p style="color: #6b7280; font-size: 1.1em;">Visual Dictionary for Kids</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
          <h2 style="color: ${config.color}; margin-top: 0;">${config.title}</h2>
          <p style="font-size: 1.1em; margin-bottom: 25px;">
            Hi ${name}! ${config.message}
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; border: 2px dashed ${config.color};">
            <h1 style="color: ${config.color}; font-size: 3em; margin: 0; letter-spacing: 0.2em;">${otp}</h1>
          </div>
          
          <p style="font-size: 0.9em; color: #6b7280; text-align: center;">
            This code expires in <strong>10 minutes</strong> for security.
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;">
            <strong>🔒 Security Note:</strong> Never share this code with anyone. MeaningwithAI will never ask for your verification code.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 0.9em;">
            Happy Learning! 🌟<br>
            The MeaningwithAI Team
          </p>
        </div>
      </body>
      </html>
    `
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      if (!this.resend || !process.env.RESEND_API_KEY) {
        console.log("⚠️ Resend API key not found, skipping welcome email")
        return true
      }

      const { data, error } = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "MeaningwithAI <onboarding@resend.dev>",
        to: [email],
        subject: "🎉 Welcome to MeaningwithAI!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to MeaningwithAI</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; font-size: 2.5em; margin: 0;">🦉 MeaningwithAI</h1>
              <p style="color: #6b7280; font-size: 1.1em;">Visual Dictionary for Kids</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #dcfce7 0%, #dbeafe 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
              <h2 style="color: #059669; margin-top: 0;">Welcome ${name}! 🎉</h2>
              <p style="font-size: 1.1em; margin-bottom: 25px;">
                Your MeaningwithAI account is now active! You now have unlimited word searches and your learning history will be saved.
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
                The MeaningwithAI Team
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
}

export const emailService = new EmailService()
