"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mascot } from "@/components/ui/mascot"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      })

      if (error) throw error

      setSent(true)
      toast.success("Reset link sent! 📧", {
        description: "Check your email for the password reset link",
      })
    } catch (error: any) {
      toast.error("Failed to send reset email", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-green-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <Mascot />
            <CardTitle className="text-3xl font-playful bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Check Your Email! 📧
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl">📧</div>
            <div className="space-y-2">
              <h3 className="text-xl font-playful text-green-600">Reset link sent!</h3>
              <p className="text-gray-600 font-playful">
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 font-playful">Click the link in your email to reset your password</p>
            </div>
            <Button
              onClick={() => router.push("/signin")}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 font-playful"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/signin" className="flex items-center gap-2 font-playful">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex items-center justify-center p-4 py-16">
        <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <Mascot />
            <CardTitle className="text-3xl font-playful bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Reset Password 🔑
            </CardTitle>
            <p className="text-gray-600 font-playful">Enter your email to receive a password reset link</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address 📧"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-2 border-orange-200 font-playful focus:border-orange-400"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-playful text-lg py-6"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending reset link...
                  </div>
                ) : (
                  "Send Reset Link 🔑"
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600 font-playful">
                Remember your password?{" "}
                <Link href="/signin" className="text-orange-600 hover:underline font-semibold">
                  Sign in here! 🎯
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
