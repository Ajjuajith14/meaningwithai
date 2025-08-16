"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "./supabase"

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_status?: string
  trial_searches_used?: number
  trial_searches_limit?: number
  created_at?: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProfile = async () => {
    if (!user || !isSupabaseConfigured) return

    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      setProfile(data)
    } catch (err: any) {
      console.error("Error fetching profile:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Supabase not configured - authentication features disabled")
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          await refreshProfile()
        }
      } catch (error: any) {
        console.error("Error getting initial session:", error)
        setUser(null)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await refreshProfile()
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: "Authentication not configured" } }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: "Authentication not configured" } }
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    isConfigured: isSupabaseConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
