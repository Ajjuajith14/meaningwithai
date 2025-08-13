"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    school: "",
    age: "",
    parentEmail: "",
    preferredLanguage: "en",
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        school: profile.school || "",
        age: profile.age?.toString() || "",
        parentEmail: profile.parent_email || "",
        preferredLanguage: profile.preferred_language || "en",
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          fullName: formData.fullName,
          school: formData.school,
          age: formData.age ? Number.parseInt(formData.age) : null,
          parentEmail: formData.parentEmail,
          preferredLanguage: formData.preferredLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      await refreshProfile()
      toast.success("Profile updated successfully! 🎉")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (!user || !profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-playful text-center">Profile Settings 👤</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">School (Optional)</label>
                <Input
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  placeholder="Your school name"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Age (Optional)</label>
                <Input
                  type="number"
                  min="3"
                  max="18"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Your age"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parent Email (Optional)</label>
                <Input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  placeholder="Parent's email for notifications"
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-playful"
              >
                {loading ? "Updating..." : "Update Profile 🚀"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
