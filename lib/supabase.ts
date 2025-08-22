import { createClient } from "@supabase/supabase-js"

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate Supabase URL format
function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.includes("supabase.co") || parsedUrl.hostname.includes("localhost")
  } catch {
    return false
  }
}

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && isValidSupabaseUrl(supabaseUrl))

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: { message: "Supabase not configured" } }),
    update: () => ({ data: null, error: { message: "Supabase not configured" } }),
    delete: () => ({ data: null, error: { message: "Supabase not configured" } }),
  }),
})

// Client-side Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (createMockClient() as any)

// Server-side Supabase client (simplified without @supabase/ssr)
export function createServerClient() {
  if (!isSupabaseConfigured || !supabaseServiceKey) {
    console.warn("⚠️ Supabase server not configured - using mock client")
    return createMockClient() as any
  }

  try {
    return createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Failed to create Supabase server client:", error)
    return createMockClient() as any
  }
}

// Service role client for admin operations
export function createServiceClient() {
  if (!isSupabaseConfigured || !supabaseServiceKey) {
    console.warn("⚠️ Supabase service role not configured - using mock client")
    return createMockClient() as any
  }

  try {
    return createClient(supabaseUrl!, supabaseServiceKey)
  } catch (error) {
    console.error("Failed to create Supabase service client:", error)
    return createMockClient() as any
  }
}

// Export configuration status
export { supabaseUrl, supabaseAnonKey, supabaseServiceKey }
