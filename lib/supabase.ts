import { createClient } from "@supabase/supabase-js"

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate Supabase configuration
function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase configuration missing. Some features may not work.")
    return false
  }

  try {
    new URL(supabaseUrl)
  } catch {
    console.error("❌ Invalid Supabase URL format")
    return false
  }

  return true
}

// Create Supabase client with error handling
export const supabase = (() => {
  if (!validateSupabaseConfig()) {
    // Return a mock client that won't break the app
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: "Database not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Database not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Database not configured" } }),
      }),
    } as any
  }

  return createClient(supabaseUrl!, supabaseAnonKey!)
})()

// Server-side client factory function
export const createServerClient = () => {
  if (!validateSupabaseConfig()) {
    // Return a mock client that won't break the app
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: "Database not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Database not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Database not configured" } }),
        rpc: () => Promise.resolve({ data: null, error: { message: "Database not configured" } }),
      }),
    } as any
  }

  const serverKey = supabaseServiceKey || supabaseAnonKey
  return createClient(supabaseUrl!, serverKey!)
}

// Service role client for server-side operations
export const supabaseAdmin = (() => {
  if (!validateSupabaseConfig() || !supabaseServiceKey) {
    return null
  }
  return createClient(supabaseUrl!, supabaseServiceKey!)
})()

// Configuration status
export const isSupabaseConfigured = validateSupabaseConfig()
