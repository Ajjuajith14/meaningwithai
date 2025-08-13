"use client"

import { useCallback } from "react"

export function useClarity() {
  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("event", eventName, data)
    }
  }, [])

  const identifyUser = useCallback((userId: string, sessionData?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("identify", userId, sessionData)
    }
  }, [])

  const setCustomTag = useCallback((key: string, value: string) => {
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("set", key, value)
    }
  }, [])

  return {
    trackEvent,
    identifyUser,
    setCustomTag,
  }
}
