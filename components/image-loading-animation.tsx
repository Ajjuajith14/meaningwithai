"use client"

import { useState, useEffect } from "react"
import { Palette, Sparkles, Wand2, Brush, Camera } from "lucide-react"

const loadingMessages = [
  { icon: Palette, text: "Mixing colors...", color: "text-purple-500" },
  { icon: Brush, text: "Drawing your word...", color: "text-blue-500" },
  { icon: Sparkles, text: "Adding magic touches...", color: "text-pink-500" },
  { icon: Wand2, text: "Creating visual story...", color: "text-green-500" },
  { icon: Camera, text: "Capturing the moment...", color: "text-orange-500" },
]

export function ImageLoadingAnimation() {
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = loadingMessages[currentMessage].icon

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {/* Animated Icon */}
        <div className="relative mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center animate-bounce">
            <CurrentIcon className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${loadingMessages[currentMessage].color}`} />
          </div>

          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute -bottom-1 -left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse" />
          <div
            className="absolute top-1/2 -right-3 sm:-right-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Loading Message */}
        <div className="space-y-1 sm:space-y-2">
          <p
            className={`text-base sm:text-lg md:text-xl font-playful font-semibold ${loadingMessages[currentMessage].color} transition-all duration-500`}
          >
            {loadingMessages[currentMessage].text}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-playful">
            Our AI artist is working on your visual! 🎨
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1.5 sm:space-x-2">
          {loadingMessages.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentMessage
                  ? `${loadingMessages[currentMessage].color.replace("text-", "bg-")} scale-125`
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Animated Progress Bar */}
        <div className="w-32 sm:w-40 md:w-48 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              width: "70%",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Fun Facts */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/70 rounded-2xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 font-playful">
            💡 <strong>Did you know?</strong> Our AI considers colors, shapes, and context to create the perfect visual
            representation!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  )
}
