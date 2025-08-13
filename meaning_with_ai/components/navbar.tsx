"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mascot } from "@/components/ui/mascot"
import { useAuth } from "@/lib/auth-context"
import { FeedbackModal } from "@/components/feedback-modal"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, CreditCard, History, Heart, LogOut, Settings } from 'lucide-react'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Mascot className="text-4xl" />
              <div>
                <h1 className="text-2xl font-bold font-playful bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Visualize Dictionary
                </h1>
                <p className="text-xs text-gray-500 font-playful">Visual Dictionary for Kids</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 font-playful">
                AI Powered
              </Badge>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-playful">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors font-playful">
                Contact
              </Link>

              {user && profile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {profile.full_name?.charAt(0) || profile.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{profile.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {profile.credits} credits
                        </Badge>
                        {profile.phone_verified && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            📱 Verified
                          </Badge>
                        )}
                        {profile.email_verified && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            📧 Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/history" className="cursor-pointer">
                        <History className="mr-2 h-4 w-4" />
                        Search History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/subscription" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Subscription
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 font-playful"
                >
                  💭 Share Feedback
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <FeedbackModal 
        open={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </>
  )
}
