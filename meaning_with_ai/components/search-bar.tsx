"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClarityAnalytics } from "@/lib/analytics"

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>
  loading?: boolean
  placeholder?: string
}

export function SearchBar({ onSearch, loading = false, placeholder = "Enter a word to learn..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!query.trim() || loading) return

      try {
        // Track the search attempt
        ClarityAnalytics.trackWordSearch(query.trim(), true)
        await onSearch(query.trim())
      } catch (error) {
        // Track search failure
        ClarityAnalytics.trackWordSearch(query.trim(), false)
        ClarityAnalytics.trackError("Search failed", `Query: ${query}`)
        throw error
      }
    },
    [query, onSearch, loading],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-4 py-3 text-lg"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={!query.trim() || loading} className="px-8 py-3 text-lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          "Search"
        )}
      </Button>
    </form>
  )
}
