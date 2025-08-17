"use client";

import { useState, useEffect } from "react";

const loadingMessages = [
  { icon: "🎨", text: "Mixing colors..." },
  { icon: "✏️", text: "Drawing your word..." },
  { icon: "✨", text: "Adding magic touches..." },
  { icon: "🪄", text: "Creating visual story..." },
  { icon: "📸", text: "Capturing the moment..." },
];

const funFacts = [
  "💡 Did you know? Our AI considers colors, shapes, and context to create the perfect visual representation!",
  "🎭 Fun fact: Each image is uniquely generated just for your word - no two are exactly alike!",
  "🌈 Amazing! The AI analyzes thousands of artistic styles to create your perfect learning visual!",
  "🎪 Cool! Our AI artist thinks about lighting, composition, and mood for each illustration!",
  "🎯 Neat! The AI ensures every image is educational, colorful, and perfectly child-friendly!",
];

export function ImageLoadingAnimation() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(factInterval);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      {/* Main Loading Icon */}
      <div className="relative mb-4 sm:mb-6">
        <div className="text-4xl sm:text-6xl animate-bounce">
          {loadingMessages[currentMessage].icon}
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-2 -left-2 w-2 sm:w-3 h-2 sm:h-3 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute -top-1 -right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400 rounded-full animate-ping animation-delay-300" />
        <div className="absolute -bottom-2 -left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400 rounded-full animate-ping animation-delay-700" />
        <div className="absolute -bottom-1 -right-2 w-2 sm:w-3 h-2 sm:h-3 bg-yellow-400 rounded-full animate-ping animation-delay-500" />
      </div>

      {/* Loading Message */}
      <div className="text-center mb-4 sm:mb-6 px-2">
        <h3 className="text-lg sm:text-xl font-bold font-playful text-orange-600 mb-1 sm:mb-2">
          {loadingMessages[currentMessage].text}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 font-playful">
          Our AI artist is working on your visual! 🎨
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2 mb-4 sm:mb-6">
        {[0, 1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all duration-500 ${
              dot === currentMessage % 4
                ? "bg-blue-500 scale-125"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Shimmer Progress Bar */}
      <div className="w-full max-w-[200px] sm:max-w-xs bg-gray-200 rounded-full h-2 mb-4 sm:mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
      </div>

      {/* Fun Fact */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-yellow-200 w-full max-w-[260px] sm:max-w-sm">
        <p className="text-xs sm:text-sm text-gray-700 font-playful text-center leading-relaxed">
          {funFacts[currentFact]}
        </p>
      </div>
    </div>
  );
}
