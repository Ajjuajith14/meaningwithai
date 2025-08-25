"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getCreditInfo, type CreditInfo } from "@/lib/credits"
import { useAuth } from "@/lib/auth-context"
import { Zap, Crown, User } from "lucide-react"
import Link from "next/link"

interface CreditsDisplayProps {
  compact?: boolean
  onUpdate?: (creditInfo: CreditInfo) => void
}

export function CreditsDisplay({ compact = false, onUpdate }: CreditsDisplayProps) {
  const { user } = useAuth()
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    used: 0,
    dailyLimit: 5,
    plan: "FREE",
    remaining: 5,
  })
  const [loading, setLoading] = useState(true)

  const fetchCreditInfo = async () => {
    try {
      const info = await getCreditInfo(user?.id)
      setCreditInfo(info)
      onUpdate?.(info)
    } catch (error) {
      console.error("Error fetching credit info:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreditInfo()

    // Refresh every minute to check for daily reset
    const interval = setInterval(fetchCreditInfo, 60000)
    return () => clearInterval(interval)
  }, [user?.id])

  const progressPercentage = (creditInfo.used / creditInfo.dailyLimit) * 100
  const isLowCredits = creditInfo.remaining <= 1
  const isOutOfCredits = creditInfo.remaining === 0

  const getPlanIcon = () => {
    switch (creditInfo.plan) {
      case "PRO":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "FREE":
        return <User className="w-4 h-4 text-blue-500" />
      case "GUEST":
        return <Zap className="w-4 h-4 text-gray-500" />
      default:
        return <Zap className="w-4 h-4 text-gray-500" />
    }
  }

  const getPlanColor = () => {
    switch (creditInfo.plan) {
      case "PRO":
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case "FREE":
        return "bg-gradient-to-r from-blue-400 to-blue-600"
      case "GUEST":
        return "bg-gradient-to-r from-gray-400 to-gray-600"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600"
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          {getPlanIcon()}
          {creditInfo.remaining}/{creditInfo.dailyLimit} credits
        </Badge>
        {isLowCredits && creditInfo.plan !== "PRO" && (
          <Button asChild size="sm" variant="outline" className="text-xs bg-transparent">
            <Link href="/pricing">Upgrade</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card
      className={`w-full max-w-sm ${isOutOfCredits ? "border-red-200 bg-red-50" : isLowCredits ? "border-yellow-200 bg-yellow-50" : ""}`}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPlanIcon()}
              <span className="font-semibold text-gray-700">
                {creditInfo.plan === "GUEST" ? "Guest" : creditInfo.plan} Plan
              </span>
            </div>
            <Badge className={`text-white ${getPlanColor()}`}>{creditInfo.remaining} left</Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Daily Credits</span>
              <span>
                {creditInfo.used}/{creditInfo.dailyLimit}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className={`h-2 ${isOutOfCredits ? "bg-red-100" : isLowCredits ? "bg-yellow-100" : "bg-green-100"}`}
            />
          </div>

          {/* Status Message */}
          <div className="text-center">
            {isOutOfCredits ? (
              <div className="space-y-2">
                <p className="text-sm text-red-600 font-medium">🚫 No credits remaining today</p>
                <p className="text-xs text-gray-500">Credits reset daily at midnight UTC</p>
                {creditInfo.plan !== "PRO" && (
                  <Button asChild size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <Link href="/pricing">{creditInfo.plan === "GUEST" ? "Sign Up for More" : "Upgrade to Pro"}</Link>
                  </Button>
                )}
              </div>
            ) : isLowCredits ? (
              <div className="space-y-2">
                <p className="text-sm text-yellow-600 font-medium">⚠️ Running low on credits</p>
                {creditInfo.plan !== "PRO" && (
                  <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                    <Link href="/pricing">{creditInfo.plan === "GUEST" ? "Sign Up for More" : "Upgrade to Pro"}</Link>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-green-600">✅ {creditInfo.remaining} searches remaining today</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
