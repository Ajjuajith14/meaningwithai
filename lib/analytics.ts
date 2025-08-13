// Analytics utility for Microsoft Clarity
export class ClarityAnalytics {
  private static isEnabled(): boolean {
    return typeof window !== "undefined" && process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID !== undefined
  }

  // Track word searches
  static trackWordSearch(word: string, resultFound: boolean) {
    if (!this.isEnabled()) return

    window.clarity("event", "word_search", {
      word: word.toLowerCase(),
      result_found: resultFound,
      timestamp: new Date().toISOString(),
    })
  }

  // Track user authentication
  static trackUserAuth(action: "login" | "signup" | "logout", method?: string) {
    if (!this.isEnabled()) return

    window.clarity("event", "user_auth", {
      action,
      method: method || "unknown",
      timestamp: new Date().toISOString(),
    })
  }

  // Track subscription events
  static trackSubscription(action: "upgrade_modal_open" | "upgrade_attempt" | "upgrade_success") {
    if (!this.isEnabled()) return

    window.clarity("event", "subscription", {
      action,
      timestamp: new Date().toISOString(),
    })
  }

  // Track feature usage
  static trackFeatureUsage(feature: "favorites" | "history" | "feedback" | "contact") {
    if (!this.isEnabled()) return

    window.clarity("event", "feature_usage", {
      feature,
      timestamp: new Date().toISOString(),
    })
  }

  // Track errors
  static trackError(error: string, context?: string) {
    if (!this.isEnabled()) return

    window.clarity("event", "error", {
      error_message: error,
      context: context || "unknown",
      timestamp: new Date().toISOString(),
    })
  }

  // Identify user for better tracking
  static identifyUser(userId: string, userProperties?: Record<string, any>) {
    if (!this.isEnabled()) return

    window.clarity("identify", userId, {
      ...userProperties,
      identified_at: new Date().toISOString(),
    })
  }

  // Set custom tags for segmentation
  static setUserSegment(segment: "free" | "premium" | "trial") {
    if (!this.isEnabled()) return

    window.clarity("set", "user_segment", segment)
  }
}
