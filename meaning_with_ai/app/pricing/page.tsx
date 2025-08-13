"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mascot } from "@/components/ui/mascot"
import { Check, Crown, Zap, ArrowLeft } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen">
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
            Choose Your AI Plan 🤖
          </h1>
          <p className="text-xl text-gray-600 font-playful max-w-2xl mx-auto">
            Start learning with AI for free, then upgrade for unlimited word discoveries!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 rounded-3xl shadow-lg">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="text-4xl">🆓</div>
              <CardTitle className="text-2xl font-playful text-gray-700">Free Trial</CardTitle>
              <div className="text-4xl font-bold text-gray-600">
                $0<span className="text-lg text-gray-400">/forever</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">3 free AI word searches</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">AI-powered definitions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">Smart example sentences</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">AI-generated images</span>
                </div>
              </div>

              <Button asChild className="w-full rounded-xl font-playful">
                <Link href="/signup">Get Started Free 🚀</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className="border-2 border-blue-300 rounded-3xl shadow-lg">
            <CardHeader className="text-center space-y-4 pb-8">
              <Zap className="w-12 h-12 text-blue-500 mx-auto" />
              <CardTitle className="text-2xl font-playful text-blue-700">Monthly AI Plan</CardTitle>
              <div className="text-4xl font-bold text-blue-600">
                $5<span className="text-lg text-blue-400">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful font-semibold">20 AI searches/month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">Premium AI responses</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">High-quality AI images</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">Search history</span>
                </div>
              </div>

              <Button className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 font-playful">
                Choose Monthly 💫
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="border-2 border-yellow-300 rounded-3xl shadow-lg relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 font-playful px-4 py-1">
              Best Value! 🌟
            </Badge>

            <CardHeader className="text-center space-y-4 pb-8 pt-8">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto" />
              <CardTitle className="text-2xl font-playful text-yellow-700">Yearly AI Pro</CardTitle>
              <div className="text-4xl font-bold text-yellow-600">
                $30<span className="text-lg text-yellow-400">/year</span>
              </div>
              <p className="text-sm text-yellow-600 font-playful">Save $30 compared to monthly!</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful font-semibold">Unlimited AI searches</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">Advanced AI responses</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">Premium AI images</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">Full search history</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-playful">Priority AI processing</span>
                </div>
              </div>

              <Button className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-playful">
                Choose Yearly 👑
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
