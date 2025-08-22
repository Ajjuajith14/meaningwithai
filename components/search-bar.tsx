"use client"

import type React from "react"
import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface SearchBarProps {
  onSearch: (query: string, responseType?: string) => Promise<void>
  loading?: boolean
}

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [responseType, setResponseType] = useState("friendly")

  const validateWord = (word: string): { isValid: boolean; error?: string; description?: string } => {
    // Validation 1: Check if word exists and is a string
    if (!word || typeof word !== "string") {
      return {
        isValid: false,
        error: "Please Enter a Word! 📝",
        description: "Type a word to learn about",
      }
    }

    // Validation 2: Check for spaces in the word
    if (word.includes(" ") || word.trim() !== word) {
      return {
        isValid: false,
        error: "No Spaces Allowed! 🚫",
        description: "Please enter a single word without spaces",
      }
    }

    // Validation 3: Check word length (max 30 characters)
    if (word.length > 30) {
      return {
        isValid: false,
        error: "Word Too Long! 📏",
        description: `Please enter a word with less than 30 characters (current: ${word.length})`,
      }
    }

    // Validation 4: Check for minimum length
    if (word.length < 1) {
      return {
        isValid: false,
        error: "Please Enter a Word! 📝",
        description: "Type a word to learn about",
      }
    }

    // Validation 5: Check for special characters (only allow letters, hyphens, and apostrophes)
    const validWordPattern = /^[a-zA-Z'-]+$/
    if (!validWordPattern.test(word)) {
      return {
        isValid: false,
        error: "Invalid Characters! ❌",
        description: "Only letters, hyphens (-), and apostrophes (') are allowed",
      }
    }

    // Validation 6: Check for repeated characters (like "aaaaaaa")
    const repeatedCharPattern = /(.)\1{4,}/
    if (repeatedCharPattern.test(word)) {
      return {
        isValid: false,
        error: "Not a Real Word! 🤔",
        description: "Please enter a real word without too many repeated characters",
      }
    }

    // Validation 7: Check for common non-words
    const commonNonWords = ["asdf", "qwerty", "zxcv", "hjkl", "test", "abc", "xyz", "aaa", "bbb", "ccc"]
    if (commonNonWords.includes(word.toLowerCase())) {
      return {
        isValid: false,
        error: "Please Enter a Real Word! 📚",
        description: "Try searching for a common English word",
      }
    }

    return { isValid: true }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    const trimmedQuery = query.trim()

    // Client-side validation
    const validation = validateWord(trimmedQuery)

    if (!validation.isValid) {
      // Show toast immediately for validation errors
      toast.error(validation.error!, {
        description: validation.description,
        duration: 4000,
      })

      // Also show a visual feedback in the input
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
      if (inputElement) {
        inputElement.style.borderColor = "#ef4444"
        inputElement.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)"
        setTimeout(() => {
          inputElement.style.borderColor = ""
          inputElement.style.boxShadow = ""
        }, 2000)
      }

      return
    }

    // If validation passes, proceed with search
    try {
      await onSearch(trimmedQuery, responseType)
    } catch (error) {
      // Handle any other errors from the search function
      console.error("Search error:", error)
      toast.error("Search Failed! 💥", {
        description: "Something went wrong. Please try again.",
        duration: 4000,
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Real-time validation feedback (optional - show subtle hints)
    if (value.length > 25) {
      // Show warning when approaching limit
      toast.warning("Getting close to character limit! ⚠️", {
        description: `${30 - value.length} characters remaining`,
        duration: 2000,
      })
    }

    // Check for spaces in real-time
    if (value.includes(" ")) {
      toast.error("No Spaces Allowed! 🚫", {
        description: "Please enter a single word without spaces",
        duration: 3000,
      })
    }

    // Check for special characters in real-time
    const validWordPattern = /^[a-zA-Z'-]*$/
    if (value && !validWordPattern.test(value)) {
      toast.error("Invalid Characters! ❌", {
        description: "Only letters, hyphens (-), and apostrophes (') are allowed",
        duration: 3000,
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter a word to visualize..."
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="text-lg py-3 px-4 transition-all duration-200"
            maxLength={35} // Allow a bit more for user experience, but validate at 30
          />
        </div>
        <Button type="submit" disabled={loading || !query.trim()} className="px-6 py-3">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
        </Button>
      </form>

      <div className="flex justify-center">
        <Select value={responseType} onValueChange={setResponseType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Choose explanation style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="friendly">Kid-Friendly</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
