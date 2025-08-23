"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    title: "Easy to Understand",
    subtitle: "Learning Made Simple",
    description: "Complex words broken down into simple, clear explanations that make sense",
    emoji: "📚",
    color: "yellow",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    subtitleColor: "text-yellow-600",
  },
  {
    id: 2,
    title: "Visual Learning",
    subtitle: "Pictures That Teach",
    description: "Custom illustrations help students remember and understand word meanings better",
    emoji: "🎨",
    color: "green",
    borderColor: "border-green-400",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    subtitleColor: "text-green-600",
  },
  {
    id: 3,
    title: "Always Expanding",
    subtitle: "Never Stop Learning",
    description: "Unlimited vocabulary exploration with new words and concepts to discover daily",
    emoji: "🚀",
    color: "orange",
    borderColor: "border-orange-400",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    subtitleColor: "text-orange-600",
  },
  {
    id: 4,
    title: "Interactive Fun",
    subtitle: "Learning Through Play",
    description: "Gamified learning experience that keeps students engaged and motivated",
    emoji: "🎮",
    color: "purple",
    borderColor: "border-purple-400",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    subtitleColor: "text-purple-600",
  },
  {
    id: 5,
    title: "Progress Tracking",
    subtitle: "See Your Growth",
    description: "Track your vocabulary progress and celebrate learning milestones",
    emoji: "📈",
    color: "blue",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    subtitleColor: "text-blue-600",
  },
]

export function StudentTestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playful text-gray-800 mb-4">Why Students Love Learning Here 😊</h2>
            <p className="text-lg text-gray-600 font-playful">Making vocabulary building fun and effective!</p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Main Carousel */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-100 via-green-100 to-orange-100 p-4 md:p-8 cursor-pointer">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-2 md:px-4">
                    <div
                      className={`bg-white rounded-xl p-6 md:p-8 shadow-lg border-l-4 ${testimonial.borderColor} mx-auto max-w-2xl`}
                    >
                      <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 ${testimonial.bgColor} rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6`}
                        >
                          <span className="text-3xl md:text-4xl">{testimonial.emoji}</span>
                        </div>
                        <div className="text-center md:text-left">
                          <h4 className={`text-xl md:text-2xl font-bold ${testimonial.textColor} mb-2`}>
                            {testimonial.title}
                          </h4>
                          <p className={`text-sm md:text-base ${testimonial.subtitleColor} font-medium`}>
                            {testimonial.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-base md:text-lg italic text-center md:text-left leading-relaxed">
                        "{testimonial.description}"
                      </p>

                      <div className="flex justify-center md:justify-start mt-6">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-lg">
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex ? "bg-blue-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
