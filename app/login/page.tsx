"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mascot } from "@/components/ui/mascot"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast.success("Welcome back! 🎉", {
        description: "You're now signed in to Visualize Dictionary!",
      })

      router.push("/")
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast.error("Sign in failed", {
        description: error.message || "Please check your credentials",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email address first",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (error) {
        throw error
      }

      setMagicLinkSent(true)
      toast.success("Magic link sent! ✨", {
        description: "Check your email for the sign-in link",
      })
    } catch (error: any) {
      console.error("Magic link error:", error)
      toast.error("Failed to send magic link", {
        description: error.message || "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
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

          <CardContent className="space-y-6">
            {magicLinkSent ? (
              <div className="text-center space-y-4">
                <div className="text-6xl">📧</div>
                <h3 className="text-xl font-playful text-green-600">Check your email!</h3>
                <p className="text-gray-600 font-playful">
                  We sent you a magic link to sign in. Click the link in your email to continue.
                </p>
                <Button variant="outline" onClick={() => setMagicLinkSent(false)} className="font-playful">
                  Try a different way
                </Button>
              </div>
            ) : (
              <>
                {/* Google Sign In */}
                <GoogleAuthButton />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 font-playful">or sign in with email</span>
                  </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Your email address 📧"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-2 border-blue-200 font-playful focus:border-blue-400"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="password"
                      placeholder="Your password 🔒"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-2 border-blue-200 font-playful focus:border-blue-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-playful text-lg py-6 shadow-lg"
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

                <Button
                  onClick={handleMagicLink}
                  disabled={loading}
                  variant="outline"
                  className="w-full rounded-xl border-2 border-green-200 font-playful bg-transparent hover:bg-green-50 py-6"
                >
                  Send Magic Link ✨
                </Button>
              </>
            )}

            <div className="text-center">
              <p className="text-gray-600 font-playful">
                Don’t have an account?{' '}
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
