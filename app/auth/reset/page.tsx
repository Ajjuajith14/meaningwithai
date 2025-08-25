"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mascot } from "@/components/ui/mascot"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Lock } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        toast.error("Invalid reset link", {
          description: "Please request a new password reset link",
        })
        router.push("/forgot")
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      toast.success("Password updated successfully! 🎉", {
        description: "You can now sign in with your new password",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      toast.error("Failed to update password", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-green-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <Mascot />
            <CardTitle className="text-3xl font-playful bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Password Updated! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <div className="space-y-2">
              <h3 className="text-xl font-playful text-green-600">Success!</h3>
              <p className="text-gray-600 font-playful">
                Your password has been updated successfully. Redirecting you to your dashboard...
              </p>
            </div>
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <Mascot />
          <CardTitle className="text-3xl font-playful bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Set New Password 🔒
          </CardTitle>
          <p className="text-gray-600 font-playful">Choose a strong password for your account</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 mx-auto text-orange-500 mb-2" />
            </div>

            <Input
              type="password"
              placeholder="New password (min 6 characters) 🔒"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-2 border-orange-200 font-playful focus:border-orange-400"
              minLength={6}
              required
            />

            <Input
              type="password"
              placeholder="Confirm new password 🔒"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl border-2 border-orange-200 font-playful focus:border-orange-400"
              minLength={6}
              required
            />

            <Button
              type="submit"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-playful text-lg py-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating password...
                </div>
              ) : (
                "Update Password 🎉"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
