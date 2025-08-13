"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mascot } from "@/components/ui/mascot"
import { ArrowLeft, Mail, MessageCircle, Heart, CheckCircle } from 'lucide-react'
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      setSubmitted(true)
      toast.success("Message sent successfully! 🎉", {
        description: "We've received your message and will respond soon!",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error: any) {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
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

        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-green-200 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl">✅</div>
              <h2 className="text-2xl font-bold font-playful text-green-600">Message Sent!</h2>
              <p className="text-gray-600 font-playful">
                Thank you for reaching out! We’ve received your message and will get back to you soon.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 font-playful">
                  <Link href="/">Continue Learning 🚀</Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSubmitted(false)}
                  className="w-full rounded-xl font-playful"
                >
                  Send Another Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
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

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Mascot />
          <h1 className="text-4xl md:text-6xl font-bold font-playful bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Get in Touch! 💌
          </h1>
          <p className="text-xl text-gray-600 font-playful max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hi? We’d love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-xl rounded-3xl border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl font-playful text-blue-700 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Send us a message
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Your name 👋"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 font-playful"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Your email address 📧"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 font-playful"
                    required
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Tell us what's on your mind... 💭"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 font-playful min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-playful"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Send Message 🚀"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="shadow-lg rounded-2xl border-2 border-green-200">
              <CardContent className="p-6 text-center space-y-4">
                <Mail className="w-8 h-8 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold font-playful text-green-700">Email Us</h3>
                <p className="text-green-600 font-playful">hello@Visualize Dictionary.com</p>
                <p className="text-sm text-green-500 font-playful">We typically respond within 24 hours!</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-2xl border-2 border-yellow-200">
              <CardContent className="p-6 text-center space-y-4">
                <Heart className="w-8 h-8 text-yellow-500 mx-auto" />
                <h3 className="text-xl font-bold font-playful text-yellow-700">We Love Feedback!</h3>
                <p className="text-yellow-600 font-playful">
                  Your suggestions help us make Visualize Dictionary better for all learners. Every idea matters! 🌟
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-2xl border-2 border-purple-200">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">🎯</div>
                <h3 className="text-xl font-bold font-playful text-purple-700">Our Mission</h3>
                <p className="text-purple-600 font-playful">
                  Making learning fun and visual for children everywhere. Together, we’re building a world where every word comes to life!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
