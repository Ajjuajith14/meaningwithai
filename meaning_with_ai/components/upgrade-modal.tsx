"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Check } from "lucide-react"

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  onUpgrade: (plan: "monthly" | "yearly") => void
}

export function UpgradeModal({ open, onClose, onUpgrade }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playful text-center">🚀 You’re out of free searches!</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          <p className="text-center text-lg text-gray-600 font-playful">
            Upgrade to continue learning amazing words! 📚✨
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Monthly Plan */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="space-y-2">
                  <Zap className="w-8 h-8 text-blue-500 mx-auto" />
                  <h3 className="text-xl font-bold font-playful text-blue-700">Monthly Plan</h3>
                  <div className="text-3xl font-bold text-blue-600">
                    $5<span className="text-lg text-gray-500">/month</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>20 word searches</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>High-quality images</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Search history</span>
                  </div>
                </div>

                <Button
                  onClick={() => onUpgrade("monthly")}
                  className="w-full bg-blue-500 hover:bg-blue-600 font-playful"
                >
                  Choose Monthly
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="border-2 border-yellow-300 hover:border-yellow-400 transition-colors relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 font-playful">
                Best Value! 🌟
              </Badge>
              <CardContent className="p-6 text-center space-y-4">
                <div className="space-y-2">
                  <Crown className="w-8 h-8 text-yellow-500 mx-auto" />
                  <h3 className="text-xl font-bold font-playful text-yellow-700">Yearly Plan</h3>
                  <div className="text-3xl font-bold text-yellow-600">
                    $30<span className="text-lg text-gray-500">/year</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">Unlimited searches</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>High-quality images</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Search history</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Priority support</span>
                  </div>
                </div>

                <Button
                  onClick={() => onUpgrade("yearly")}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-playful"
                >
                  Choose Yearly
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="font-playful">
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
