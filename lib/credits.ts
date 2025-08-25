import { supabase, createServerClient } from "./supabase"

export interface CreditInfo {
  used: number
  dailyLimit: number
  plan: "GUEST" | "FREE" | "PRO"
  remaining: number
}

export const CREDIT_LIMITS = {
  GUEST: 5,
  FREE: 5, // Same as guest now
  PRO: 100,
} as const

export function generateAnonId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function getAnonId(): string {
  if (typeof window === "undefined") return generateAnonId()

  let anonId = localStorage.getItem("anon_id")
  if (!anonId) {
    anonId = generateAnonId()
    localStorage.setItem("anon_id", anonId)
  }
  return anonId
}

export async function getCreditInfo(userId?: string): Promise<CreditInfo> {
  try {
    const client = typeof window !== "undefined" ? supabase : createServerClient()

    const { data, error } = await client.rpc("get_or_create_daily_meter", {
      p_user_id: userId || null,
      p_anon_id: userId ? null : getAnonId(),
    })

    if (error) throw error

    const result = data[0]
    return {
      used: result.used,
      dailyLimit: result.daily_limit,
      plan: result.plan,
      remaining: Math.max(0, result.daily_limit - result.used),
    }
  } catch (error) {
    console.error("Error getting credit info:", error)
    return {
      used: 0,
      dailyLimit: CREDIT_LIMITS.FREE,
      plan: "FREE",
      remaining: CREDIT_LIMITS.FREE,
    }
  }
}

export async function consumeCredit(userId?: string): Promise<{
  success: boolean
  creditInfo: CreditInfo
  message: string
}> {
  try {
    const client = typeof window !== "undefined" ? supabase : createServerClient()

    const { data, error } = await client.rpc("consume_credit", {
      p_user_id: userId || null,
      p_anon_id: userId ? null : getAnonId(),
    })

    if (error) throw error

    const result = data[0]
    return {
      success: result.success,
      creditInfo: {
        used: result.used,
        dailyLimit: result.daily_limit,
        plan: result.plan,
        remaining: Math.max(0, result.daily_limit - result.used),
      },
      message: result.message,
    }
  } catch (error) {
    console.error("Error consuming credit:", error)
    return {
      success: false,
      creditInfo: {
        used: 0,
        dailyLimit: CREDIT_LIMITS.FREE,
        plan: "FREE",
        remaining: CREDIT_LIMITS.FREE,
      },
      message: "Failed to consume credit",
    }
  }
}
