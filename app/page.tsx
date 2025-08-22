"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mascot } from "@/components/ui/mascot"
import { SearchBar } from "@/components/search-bar"
import { WordResult } from "@/components/word-result"
import { DailyWord } from "@/components/daily-word"
import { TrialCounter } from "@/components/trial-counter"
import { UpgradeModal } from "@/components/upgrade-modal"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { Brain, Palette, Zap, ArrowRight, BookOpen, Star, GraduationCap, Award, Heart, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import type { WordResponse } from "@/lib/types"
import { FeedbackModal } from "@/components/feedback-modal"
import { StudentTestimonialsCarousel } from "@/components/student-testimonials-carousel"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchResult, setSearchResult] = useState<WordResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { user, profile, refreshProfile, error: authError } = useAuth()
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = async (word: string, responseType = "friendly") => {
    // At this point, validation has already been done in SearchBar component
    setLoading(true)
    setImageLoading(true)
    setSearchResult(null)

    try {
      // Start the search API call
      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, responseType }),
      })

      const data = await searchResponse.json()

      // Handle any remaining server-side errors (like word not found in dictionary)
      if (!searchResponse.ok) {
        let toastMessage = "An error occurred"
        let toastDescription = "Please try again"

        switch (data.type) {
          case "WORD_NOT_FOUND":
            toastMessage = "Word Not Found! 🔍"
            toastDescription = "This word wasn't found in our dictionary. Check the spelling?"
            break
          case "INVALID_WORD":
            toastMessage = "Invalid Word! ⚠️"
            toastDescription = "This doesn't appear to be a real word. Try a different one?"
            break
          case "API_ERROR":
            toastMessage = "Service Temporarily Unavailable! 🔧"
            toastDescription = "Please try again in a moment"
            break
          default:
            toastMessage = data.error || "Something went wrong"
            toastDescription = "Please try again with a different word"
        }

        // Show toast for server-side errors
        toast.error(toastMessage, {
          description: toastDescription,
          duration: 3000,
        })

        // Reset the search state
        setLoading(false)
        setImageLoading(false)
        setSearchResult(null)
        return
      }

      if (data.error) {
        throw new Error(data.error)
      }

      // Show the word definition immediately
      setSearchResult(data)
      setLoading(false)

      toast.success(`Found definition for "${word}"! 🎉`, {
        description: "Creating your visual... 🎨",
        duration: 2000,
      })

      // Now generate the image asynchronously
      if (data.imagePrompt) {
        try {
          const imageResponse = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imagePrompt: data.imagePrompt,
              word: word,
            }),
          })
          if (imageResponse.ok) {
            const imageData = await imageResponse.json()
            // Update the result with the generated image
            setSearchResult((prev) => (prev ? { ...prev, image_url: imageData.image_url } : null))
            toast.success("Visual masterpiece ready! 🎨✨", {
              duration: 2000,
            })
          } else {
            toast.info("Definition ready! Visual couldn't be generated this time. 🖼️", {
              duration: 2000,
            })
          }
        } catch (imageError) {
          // Image generation failed, but we still have the definition
          toast.info("Definition ready! Visual couldn't be generated this time. 🖼️", {
            duration: 2000,
          })
        } finally {
          setImageLoading(false)
        }
      } else {
        setImageLoading(false)
      }
    } catch (error: any) {
      console.error("Search error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred"

      toast.error("Search Failed! 💥", {
        description: errorMessage,
        duration: 3000,
      })

      setSearchResult(null)
      setLoading(false)
      setImageLoading(false)
    }
  }

  const handleUpgrade = async (plan: "monthly" | "yearly") => {
    try {
      const response = await fetch("/api/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile?.id,
          plan,
        }),
      })

      if (response.ok) {
        toast.success("Upgrade successful! 🎉", {
          description: `Welcome to the ${plan} plan!`,
          duration: 2000,
        })
        setShowUpgradeModal(false)
        if (user) {
          await refreshProfile()
        }
      }
    } catch (error) {
      toast.error("Upgrade failed 😞", {
        description: "Please try again later",
        duration: 2000,
      })
    }
  }

  const showConfigError = authError && authError.includes("Supabase")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      {showConfigError && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Database not configured - some features may be limited.{" "}
                <Link href="/debug" className="underline hover:no-underline">
                  Check configuration
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}

      <main className={`transition-all duration-1000 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8 max-w-6xl mx-auto">
            {/* Hero Content */}
            <div className="space-y-6">
              <div className="flex justify-center items-center gap-4">
                <div className="text-6xl animate-pulse-slow">📚</div>
                <div className="text-6xl animate-bounce-gentle">🤖</div>
                <div className="text-6xl animate-pulse-slow">🎨</div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold font-playful leading-tight">
                Learn Words with{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Magic
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 font-playful max-w-4xl mx-auto leading-relaxed">
                🌟 Turn every word into a visual adventure! Our AI creates beautiful visuales and detailed explanations
                that make learning fun and comprehensive for children.
              </p>

              <div className="flex justify-center items-center gap-6 text-sm text-gray-500 font-playful">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span>Expert-Verified Content</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-green-500" />
                  <span>Dictionary-Accurate</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Child-Friendly Learning</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <SearchBar onSearch={handleSearch} loading={loading} />
              <div className="flex justify-center">
                <TrialCounter />
              </div>
            </div>

            {(loading || searchResult) && (
              <div className="mt-12">
                <WordResult result={searchResult} loading={loading} imageLoading={imageLoading} />
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <DailyWord />
            </div>
          </div>
        </div>

        {/* Enhanced Feature Cards Section */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-playful text-gray-800 mb-4">
                  Why Choose Visualize Dictionary? 🚀
                </h2>
                <p className="text-lg text-gray-600 font-playful">
                  Advanced AI technology meets expert educational content
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="shadow-xl rounded-3xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center p-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <CardTitle className="text-xl font-playful text-blue-700">Smart AI Brain</CardTitle>
                    <CardDescription className="font-playful text-blue-600">
                      Our AI creates comprehensive learning cards with pronunciations, definitions, examples, and
                      real-world scenarios - just like having a personal tutor!
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="shadow-xl rounded-3xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center p-8">
                    <Palette className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                    <CardTitle className="text-xl font-playful text-purple-700">Beautiful Illustrations</CardTitle>
                    <CardDescription className="font-playful text-purple-600">
                      Every word comes with a custom-generated, colorful cartoon illustration that helps visualize and
                      remember the meaning better!
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="shadow-xl rounded-3xl border-2 border-pink-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center p-8">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-pink-500" />
                    <CardTitle className="text-xl font-playful text-pink-700">Instant Learning</CardTitle>
                    <CardDescription className="font-playful text-pink-600">
                      Get comprehensive word explanations, pronunciations, and visual aids in seconds! No waiting, just
                      instant educational magic! ⚡
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold font-playful text-gray-800">Ready to Start Learning? 🎓</h2>
              <p className="text-lg text-gray-600 font-playful">
                Join thousands of students already expanding their vocabulary with AI-powered learning cards!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowFeedbackModal(true)}
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-2xl font-playful shadow-lg"
                >
                  💭 Share Your Experience
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 rounded-2xl font-playful bg-transparent"
                >
                  <Link href="/pricing">View Pricing 💎</Link>
                </Button>
              </div>

              <div className="flex justify-center items-center gap-4 text-sm text-gray-500 font-playful">
                <span>✅ Comprehensive definitions</span>
                <span>✅ Visual learning aids</span>
                <span>✅ Expert-verified content</span>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Trust & Quality Section */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-playful text-gray-800 mb-4">Trusted Educational Content 📖</h2>
                <p className="text-lg text-gray-600 font-playful">
                  Quality learning materials designed by education experts
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-6 rounded-2xl border-2 border-green-200 bg-green-50">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-bold font-playful text-green-700 mb-2">Expert-Verified Definitions</h3>
                  <p className="text-green-600 font-playful">
                    All definitions are cross-referenced with trusted dictionaries like Oxford and Merriam-Webster
                  </p>
                </Card>

                <Card className="text-center p-6 rounded-2xl border-2 border-blue-200 bg-blue-50">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-bold font-playful text-blue-700 mb-2">Age-Appropriate Content</h3>
                  <p className="text-blue-600 font-playful">
                    Carefully crafted explanations suitable for learners aged 6-18, with proper educational context
                  </p>
                </Card>

                <Card className="text-center p-6 rounded-2xl border-2 border-purple-200 bg-purple-50">
                  <Star className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-lg font-bold font-playful text-purple-700 mb-2">Comprehensive Learning</h3>
                  <p className="text-purple-600 font-playful">
                    Each word includes pronunciation, part of speech, examples, and real-world applications
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why Kids Love Section */}
        <section className="py-16">
          <StudentTestimonialsCarousel />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mascot className="text-3xl" />
                  <span className="text-xl font-bold font-playful text-gray-800">Visualize Dictionary</span>
                </div>
                <p className="text-gray-600 font-playful">
                  Making vocabulary learning magical with AI technology for students worldwide.
                </p>
              </div>

              <div>
                <h4 className="font-bold font-playful text-gray-800 mb-4">Product</h4>
                <div className="space-y-2">
                  <Link href="/pricing" className="block text-gray-600 hover:text-blue-600 font-playful">
                    Pricing
                  </Link>
                  <Link href="/features" className="block text-gray-600 hover:text-blue-600 font-playful">
                    Features
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-bold font-playful text-gray-800 mb-4">Support</h4>
                <div className="space-y-2">
                  <Link href="/contact" className="block text-gray-600 hover:text-blue-600 font-playful">
                    Contact Us
                  </Link>
                  <Link href="/help" className="block text-gray-600 hover:text-blue-600 font-playful">
                    Help Center
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-bold font-playful text-gray-800 mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-gray-600 hover:text-blue-600 font-playful">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block text-gray-600 hover:text-blue-600 font-playful">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center">
              <p className="text-gray-500 font-playful">
                © {year} Visualize Dictionary. Made with ❤️ for curious young minds.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onUpgrade={handleUpgrade} />
      <FeedbackModal open={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </div>
  )
}
