"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mascot } from "@/components/ui/mascot"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          toast.error("Authentication failed", {
            description: error.message,
          })
          router.push("/signin")
          return
        }

        if (data.session) {
          toast.success("Welcome to MeaningwithAI! 🎉", {
            description: "Your account has been verified successfully",
          })
          router.push("/dashboard")
        } else {
          router.push("/signin")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/signin")
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-blue-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <Mascot />
          <CardTitle className="text-3xl font-playful bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verifying Account ✨
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {loading && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-lg font-playful text-blue-600">Setting up your account...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
