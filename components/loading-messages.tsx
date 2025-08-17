"use client";

import { useState, useEffect } from "react";

const loadingMessages = [
  { text: "Creating magic for you", emoji: "✨", color: "text-blue-600" },
  { text: "Gathering word wisdom", emoji: "📚", color: "text-purple-600" },
  { text: "Painting your picture", emoji: "🎨", color: "text-pink-600" },
  { text: "Crafting perfect examples", emoji: "💡", color: "text-yellow-600" },
  { text: "Adding pronunciation magic", emoji: "🔊", color: "text-green-600" },
  {
    text: "Polishing your learning card",
    emoji: "⭐",
    color: "text-orange-600",
  },
  { text: "Almost ready to learn", emoji: "🚀", color: "text-red-600" },
  {
    text: "Final touches of brilliance",
    emoji: "🌟",
    color: "text-indigo-600",
  },
];

export function LoadingMessages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
        setIsVisible(true);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = loadingMessages[currentIndex];

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

      <div
        className={`transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p
          className={`text-2xl font-playful ${currentMessage.color} flex items-center justify-center gap-3`}
        >
          <span className="text-3xl animate-bounce">
            {currentMessage.emoji}
          </span>
          {currentMessage.text}
        </p>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {loadingMessages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
