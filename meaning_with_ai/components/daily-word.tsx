"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

const dailyWords = [
  { word: "Adventure", emoji: "🗺️", hint: "An exciting journey or experience" },
  { word: "Friendship", emoji: "👫", hint: "A special bond between people" },
  { word: "Curiosity", emoji: "🔍", hint: "Being eager to learn new things" },
  { word: "Imagination", emoji: "🌈", hint: "Creating pictures in your mind" },
  { word: "Kindness", emoji: "💝", hint: "Being nice and caring to others" },
  { word: "Wonder", emoji: "✨", hint: "Feeling amazed by something beautiful" },
  { word: "Courage", emoji: "🦁", hint: "Being brave when things are scary" },
]

export function DailyWord() {
  const [todayWord, setTodayWord] = useState(dailyWords[0])

  useEffect(() => {
    // Get word based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const wordIndex = dayOfYear % dailyWords.length
    setTodayWord(dailyWords[wordIndex])
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <Badge className="bg-purple-100 text-purple-700 font-playful">Daily Word</Badge>
        </div>

        <div className="space-y-2">
          <div className="text-4xl">{todayWord.emoji}</div>
          <h3 className="text-2xl font-bold font-playful text-purple-700">{todayWord.word}</h3>
          <p className="text-purple-600 font-playful">{todayWord.hint}</p>
        </div>

        <div className="text-xs text-purple-500 font-playful">Try searching for this word! 🔍</div>
      </CardContent>
    </Card>
  )
}
