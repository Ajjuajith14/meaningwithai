"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Volume2, BookOpen, Lightbulb, Globe } from 'lucide-react'
import type { WordResponse } from "@/lib/types"

interface WordResultProps {
  result: WordResponse
  loading?: boolean
}

export function WordResult({ result, loading }: WordResultProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const playPronunciation = () => {
    if ("speechSynthesis" in window && result.pronunciation) {
      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance(result.word)
      utterance.rate = 0.8
      utterance.pitch = 1.1
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-xl rounded-3xl border-2 border-blue-200">
        <CardContent className="p-10">
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-2xl font-playful text-blue-600">Creating your learning card... ✨</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-xl rounded-3xl border-2 border-blue-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Word and Pronunciation */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-5xl font-bold font-playful capitalize">{result.word}</h2>
            {result.pronunciation && (
              <Button
                onClick={playPronunciation}
                disabled={isPlaying}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Volume2 className={`w-6 h-6 ${isPlaying ? "animate-pulse" : ""}`} />
              </Button>
            )}
          </div>
          <div className="text-center mt-2 space-y-2">
            {result.pronunciation && (
              <p className="text-xl font-playful opacity-90">{result.pronunciation}</p>
            )}
            {result.partOfSpeech && (
              <Badge className="bg-white/20 text-white font-playful text-sm">
                {result.partOfSpeech}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Image Section */}
            <div className="space-y-6 md:m-12">
              <div className="relative aspect-1 rounded-2xl overflow-hidden shadow-lg border-4 border-yellow-200 min-h-[400px]">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                )}
                <Image
                  src={result.image_url || "/placeholder.svg?height=400&width=600"}
                  alt={`Visual representation of ${result.word}`}
                  fill
                  className="object-cover"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              {/* Core Definition */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold font-playful text-blue-700 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Definition
                </h3>
                <p className="text-lg text-blue-800 leading-relaxed mb-3">{result.definition}</p>
                {result.trueMeaningNote && (
                  <p className="text-sm text-blue-600 italic">{result.trueMeaningNote}</p>
                )}
              </div>

              {/* Simple Explanation */}
              {result.simpleExplanation && (
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold font-playful text-green-700 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Simple Explanation
                  </h3>
                  <p className="text-lg text-green-800 leading-relaxed">{result.simpleExplanation}</p>
                </div>
              )}

              {/* Real World Scenario */}
              {result.realWorldScenario && (
                <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold font-playful text-purple-700 mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Real World Example
                  </h3>
                  <p className="text-lg text-purple-800 leading-relaxed">{result.realWorldScenario}</p>
                </div>
              )}
            </div>
          </div>

          {/* Examples Section */}
          {result.examples && result.examples.length > 0 && (
            <div className="bg-yellow-50 rounded-2xl p-8 border-2 border-yellow-200">
              <h3 className="text-2xl font-bold font-playful text-yellow-700 mb-6 flex text-center justify-center items-center gap-2">
                📝 Example sentences
              </h3>
              <div className="space-y-4">
                {result.examples.map((example, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Badge variant="outline" className="bg-yellow-200 text-yellow-800 font-playful text-sm px-3 py-1">
                      {index + 1}
                    </Badge>
                    <p className="text-xl text-yellow-800 leading-relaxed flex-1">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
