"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, BookOpen, Lightbulb, Globe, CheckCircle } from "lucide-react";
import { LoadingMessages } from "./loading-messages";
import { ImageLoadingAnimation } from "./image-loading-animation";
import type { WordResponse } from "@/lib/types";

interface WordResultProps {
  result: WordResponse | null;
  loading?: boolean;
  imageLoading?: boolean;
  onImageLoad?: (imageUrl: string) => void;
}

export function WordResult({
  result,
  loading,
  imageLoading,
  onImageLoad,
}: WordResultProps) {
  const [imageLoadingState, setImageLoadingState] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (result?.image_url && onImageLoad) {
      onImageLoad(result.image_url);
    }
  }, [result?.image_url, onImageLoad]);

  const playPronunciation = () => {
    if ("speechSynthesis" in window && result?.pronunciation) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(result.word);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleImageLoad = () => {
    setImageLoadingState(false);
    setImageError(false);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoadingState(false);
    setImageError(true);
    setImageLoaded(false);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-xl rounded-3xl border-2 border-blue-200">
        <CardContent className="p-6 sm:p-10">
          <div className="flex items-center justify-center py-12 sm:py-16">
            <LoadingMessages />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  // Loader should show while image_url is NOT yet available
  const waitingForImage = !result.image_url && !imageError;

  // Show shimmer while actual <Image> is loading
  const stillLoadingImage =
    result.image_url && imageLoadingState && !imageError;

  const showImageLoading = waitingForImage || stillLoadingImage;

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-xl rounded-3xl border-2 border-blue-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Word and Pronunciation */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 sm:p-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <h2 className="font-bold font-playful capitalize text-[clamp(2rem,6vw,3.5rem)]">
              {result.word}
            </h2>
            {result.pronunciation && (
              <Button
                onClick={playPronunciation}
                disabled={isPlaying}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Volume2
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            )}
          </div>
          <div className="text-center mt-2 space-y-2">
            {result.pronunciation && (
              <p className="text-base sm:text-lg md:text-xl font-playful opacity-90">
                {result.pronunciation}
              </p>
            )}
            {result.partOfSpeech && (
              <Badge className="bg-white/20 text-white font-playful text-xs sm:text-sm">
                {result.partOfSpeech}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-6 md:p-12 space-y-6 sm:space-y-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-start">
            {/* Image Section */}
            <div className="space-y-4 sm:space-y-6 md:m-8">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-yellow-200 min-h-[300px] sm:min-h-[400px]">
                {showImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                      <ImageLoadingAnimation />
                    </div>
                  </div>
                )}
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center p-4 sm:p-6">
                      <div className="text-4xl sm:text-6xl mb-4">🖼️</div>
                      <p className="text-base sm:text-lg text-gray-600 font-playful mb-2">
                        Visual not available
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 font-playful">
                        Don't worry, the definition is still here!
                      </p>
                    </div>
                  </div>
                )}

                {result.image_url && (
                  <Image
                    src={result.image_url}
                    alt={`Visual representation of ${result.word}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      imageLoadingState ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority
                  />
                )}
              </div>

              {/* Image Status Indicator */}
              {showImageLoading && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-full border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs sm:text-sm font-playful text-blue-700">
                      Creating your visual masterpiece...
                    </span>
                  </div>
                </div>
              )}

              {imageLoaded && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 rounded-full border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs sm:text-sm font-playful text-green-700">
                      Visual ready!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="space-y-4 sm:space-y-6">
              {/* Core Definition */}
              <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-playful text-blue-700 mb-2 sm:mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  Definition
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-blue-800 leading-relaxed mb-2 sm:mb-3">
                  {result.definition}
                </p>
                {result.trueMeaningNote && (
                  <p className="text-sm text-blue-600 italic">
                    {result.trueMeaningNote}
                  </p>
                )}
              </div>

              {/* Simple Explanation */}
              {result.simpleExplanation && (
                <div className="bg-green-50 rounded-2xl p-4 sm:p-6 border-2 border-green-200">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-playful text-green-700 mb-2 sm:mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                    Simple Explanation
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-green-800 leading-relaxed">
                    {result.simpleExplanation}
                  </p>
                </div>
              )}

              {/* Real World Scenario */}
              {result.realWorldScenario && (
                <div className="bg-purple-50 rounded-2xl p-4 sm:p-6 border-2 border-purple-200">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-playful text-purple-700 mb-2 sm:mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    Real World Example
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-purple-800 leading-relaxed">
                    {result.realWorldScenario}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Examples Section */}
          {result.examples && result.examples.length > 0 && (
            <div className="bg-yellow-50 rounded-2xl p-6 sm:p-8 border-2 border-yellow-200">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-playful text-yellow-700 mb-4 sm:mb-6 flex text-center justify-center items-center gap-2">
                📝 Example sentences
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {result.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-yellow-200"
                  >
                    {/* <Badge
                      variant="outline"
                      className="bg-yellow-200 text-yellow-800 font-playful text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 flex-shrink-0"
                    >
                      {index + 1}
                    </Badge> */}
                    <p className="text-base sm:text-lg md:text-xl text-yellow-800 leading-relaxed flex-1">
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}