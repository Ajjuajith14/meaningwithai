"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart, MessageCircle, Bug, Lightbulb } from 'lucide-react'
import { toast } from "sonner"

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    feedbackType: "general",
    message: "",
    rating: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.message.trim()) {
      toast.error("Please share your feedback!")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name || "Anonymous",
          email: formData.email,
          age: formData.age ? parseInt(formData.age) : null,
          feedbackType: formData.feedbackType,
          message: formData.message,
          rating: formData.rating || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      toast.success("Thank you for your feedback! 🎉", {
        description: "Your input helps us make Visualize Dictionary better!",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        age: "",
        feedbackType: "general",
        message: "",
        rating: 0,
      })

      onClose()
    } catch (error) {
      toast.error("Failed to submit feedback", {
        description: "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  const feedbackTypes = [
    { value: "general", label: "General Feedback", icon: MessageCircle },
    { value: "compliment", label: "Compliment", icon: Heart },
    { value: "feature", label: "Feature Request", icon: Lightbulb },
    { value: "bug", label: "Bug Report", icon: Bug },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playful text-center flex items-center justify-center gap-2">
            💭 Share Your Experience!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          <div className="text-center">
            <p className="text-lg text-gray-600 font-playful">
              Help us make Visualize Dictionary even better! Your feedback is super valuable to us. 🌟
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info (Optional) */}
            <Card className="border-2 border-blue-200">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-bold font-playful text-blue-700">About You (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name (optional) 👤"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 font-playful"
                  />
                  <Input
                    type="email"
                    placeholder="Your email (optional) 📧"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 font-playful"
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Your age (optional) 🎂"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="rounded-xl border-2 border-blue-200 font-playful"
                  min="3"
                  max="100"
                />
              </CardContent>
            </Card>

            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium mb-2 font-playful">What type of feedback is this?</label>
              <Select value={formData.feedbackType} onValueChange={(value) => setFormData({ ...formData, feedbackType: value })}>
                <SelectTrigger className="rounded-xl border-2 border-green-200 font-playful">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2 font-playful">How would you rate your experience?</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`p-2 rounded-full transition-colors ${
                      star <= formData.rating
                        ? "text-yellow-500 bg-yellow-100"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2 font-playful">Your feedback *</label>
              <Textarea
                placeholder="Tell us what you think! What did you like? What could be better? Any suggestions? 💭"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="rounded-xl border-2 border-purple-200 font-playful min-h-32"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl font-playful"
              >
                Maybe Later
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.message.trim()}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-playful"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send Feedback 🚀"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
