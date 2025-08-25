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
import { ArrowLeft, AlertCircle } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // If wrong password, automatically send reset email
        if (error.message.includes("Invalid login credentials")) {
          await handlePasswordReset(true)
          return
        }
        throw error
      }

      toast.success("Welcome back! 🎉")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Sign in failed", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (isAutomatic = false) => {
    if (!email) {
      toast.error("Please enter your email address first")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      })

      if (error) throw error

      setResetSent(true)
      if (isAutomatic) {
        toast.error("Wrong password", {
          description: "We've sent you a password reset link to help you sign in",
          duration: 6000,
        })
      } else {
        toast.success("Reset link sent! 📧", {
          description: "Check your email for the password reset link",
        })
      }
    } catch (error: any) {
      toast.error("Failed to send reset email", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  if (resetSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <Mascot />
            <CardTitle className="text-3xl font-playful bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Check Your Email! 📧
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl">📧</div>
            <div className="space-y-2">
              <h3 className="text-xl font-playful text-orange-600">Reset link sent!</h3>
              <p className="text-gray-600 font-playful">
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 font-playful">Click the link in your email to reset your password</p>
            </div>
            <Button onClick={() => setResetSent(false)} variant="outline" className="w-full rounded-xl font-playful">
              Try signing in again
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
            <Link href="/" className="flex items-center gap-2 font-playful">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex items-center justify-center p-4 py-16">
        <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-blue-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <Mascot />
            <CardTitle className="text-3xl font-playful bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back! 🎉
            </CardTitle>
            <p className="text-gray-600 font-playful">Continue your AI learning journey</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address 📧"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-2 border-blue-200 font-playful focus:border-blue-400"
                required
              />

              <Input
                type="password"
                placeholder="Your password 🔒"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-2 border-blue-200 font-playful focus:border-blue-400"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-playful text-lg py-6"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In 🚀"
                )}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 font-playful">
                  <strong>Forgot your password?</strong> Just try to sign in - if your password is wrong, we'll
                  automatically send you a reset link!
                </p>
              </div>
            </div>

            <div className="text-center mt-6">
              <Button
                onClick={() => handlePasswordReset()}
                variant="ghost"
                className="font-playful text-blue-600 hover:text-blue-700"
              >
                Send reset link manually
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-gray-600 font-playful">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
                  Sign up here! 🎯
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
