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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [school, setSchool] = useState("")
  const [age, setAge] = useState("")
  const [parentEmail, setParentEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split("@")[0],
            school,
            age: age ? Number.parseInt(age) : null,
            parent_email: parentEmail,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user && !data.user.email_confirmed_at) {
        setConfirmationSent(true)
        toast.success("Welcome to Visualize Dictionary! 🎉", {
          description: "Please check your email to confirm your account. Check spam folder if needed!",
          duration: 10000,
        })
      } else if (data.user && data.user.email_confirmed_at) {
        toast.success("Account created successfully! 🎉", {
          description: "You now have unlimited searches and history tracking!",
        })
        // Wait a moment for profile creation then redirect
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        toast.success("Account created! 🎉", {
          description: "You can now start using Visualize Dictionary!",
        })
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast.error("Sign up failed", {
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
        <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-green-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <Mascot />
            <CardTitle className="text-3xl font-playful bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Join Visualize Dictionary! 🌟
            </CardTitle>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4">
              <p className="text-green-700 font-playful font-semibold">
                Unlock unlimited searches and save your learning history!
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {confirmationSent ? (
              <div className="text-center space-y-4">
                <div className="text-6xl">📧</div>
                <h3 className="text-xl font-playful text-green-600">Almost there!</h3>
                <p className="text-gray-600 font-playful">
                  We sent you a confirmation email. Click the link in your email to activate your account and start your
                  unlimited learning journey!
                </p>
                <Button onClick={() => router.push("/login")} className="font-playful">
                  Go to Sign In
                </Button>
              </div>
            ) : (
              <>
                {/* Google Sign Up */}
                <GoogleAuthButton />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 font-playful">or sign up with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your full name 👤"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-xl border-2 border-green-200 font-playful focus:border-green-400"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Your email address 📧"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-2 border-green-200 font-playful focus:border-green-400"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="password"
                      placeholder="Create a password 🔒"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-2 border-green-200 font-playful focus:border-green-400"
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="text"
                      placeholder="School (optional) 🏫"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="rounded-xl border-2 border-green-200 font-playful focus:border-green-400"
                    />
                    <Input
                      type="number"
                      placeholder="Age 🎂"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="rounded-xl border-2 border-green-200 font-playful focus:border-green-400"
                      min="3"
                      max="18"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Parent's email (optional) 👨‍👩‍👧‍👦"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="rounded-xl border-2 border-green-200 font-playful focus:border-green-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 font-playful text-lg py-6 shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      "Sign Up & Start Learning 🚀"
                    )}
                  </Button>
                </form>
              </>
            )}

            <div className="text-center">
              <p className="text-gray-600 font-playful">
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 hover:underline font-semibold">
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
