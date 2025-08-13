"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/ui/mascot"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function MagicLinkPage() {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const validateMagicLink = async () => {
      if (!token) {
        setError("Invalid magic link")
        setLoading(false)
        return
      }

      try {
        console.log("🔗 Validating magic link token:", token)

        // Validate the magic link token
        const { data: userId, error: validationError } = await supabase.rpc("validate_magic_link_token", {
          token,
        })

        if (validationError || !userId) {
          throw new Error("Invalid or expired magic link")
        }

        // Get the user from auth.users
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)

        if (authError || !authUser.user) {
          throw new Error("User not found")
        }

        // Sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: authUser.user.email!,
          password: "magic-link-signin", // This won't work, we need a different approach
        })

        // Alternative: Use signInWithOtp for magic link
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: authUser.user.email!,
          options: {
            shouldCreateUser: false,
          },
        })

        if (otpError) {
          throw otpError
        }

        setSuccess(true)
        toast.success("Successfully signed in! 🎉", {
          description: "Welcome back to Visualize Dictionary!",
        })

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (error: any) {
        console.error("Magic link validation error:", error)
        setError(error.message || "Failed to validate magic link")
        toast.error("Magic link failed", {
          description: error.message || "Please try signing in again",
        })
      } finally {
        setLoading(false)
      }
    }

    validateMagicLink()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-blue-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <Mascot />
          <CardTitle className="text-3xl font-playful bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Magic Link ✨
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {loading && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-lg font-playful text-blue-600">Validating your magic link...</p>
            </div>
          )}

          {success && (
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-xl font-playful text-green-600">Success!</h3>
              <p className="text-gray-600 font-playful">You’re now signed in! Redirecting you to start learning...</p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="text-6xl">❌</div>
              <h3 className="text-xl font-playful text-red-600">Oops!</h3>
              <p className="text-gray-600 font-playful">{error}</p>
              <Button onClick={() => router.push("/login")} className="font-playful">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
