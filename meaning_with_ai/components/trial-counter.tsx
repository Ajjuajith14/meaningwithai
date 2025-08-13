"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type TrialCounterProps = {}

export function TrialCounter({}: TrialCounterProps) {
  const { user } = useAuth()

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg rounded-2xl border-2 border-orange-200">
      <CardContent className="p-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-playful">
              Unlimited Searches! 🎉
            </Badge>
          </div>
          <p className="text-sm text-orange-600 font-playful">
            {user ? "Enjoy endless learning!" : "Learn with unlimited Image Generation fun!"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
