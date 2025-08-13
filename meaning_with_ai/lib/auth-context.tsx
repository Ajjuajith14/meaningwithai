"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"
import type { UserProfile } from "./types"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Added retry logic for fetching profile to handle race conditions during signup
  const fetchProfile = async (userId: string, retries = 5, delay = 1000): Promise<UserProfile | null> => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔍 Fetching profile for user ${userId} (attempt ${i + 1}/${retries})`)

        const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

        if (error && error.code === "PGRST116" && i < retries - 1) {
          // No rows returned, retry
          console.warn(`Profile not found for ${userId}, retrying... (${i + 1}/${retries})`)
          await new Promise((res) => setTimeout(res, delay))
          continue
        }
        if (error) {
          console.error("Error fetching profile:", error)
          return null
        }

        console.log("✅ Profile fetched successfully:", data.email)
        return data as UserProfile
      } catch (error) {
        console.error("Profile fetch error (catch block):", error)
        if (i < retries - 1) {
          await new Promise((res) => setTimeout(res, delay))
          continue
        }
        return null
      }
    }
    return null // All retries failed
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (session?.user) {
        setUser(session.user)
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
