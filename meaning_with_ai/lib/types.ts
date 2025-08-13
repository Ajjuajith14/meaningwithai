export interface UserProfile {
  id: string
  email: string
  phone_number?: string
  phone_verified: boolean
  email_verified: boolean
  full_name?: string
  school?: string
  age?: number
  parent_email?: string
  credits: number
  subscription_type: "free" | "monthly" | "yearly"
  subscription_expires_at?: string
  last_login_at?: string
  login_count: number
  password_hash?: string
  two_factor_enabled: boolean
  backup_codes?: string[]
  avatar_url?: string
  preferred_language: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Search {
  id: string
  user_id: string
  word: string
  definition: string
  examples: string[]
  image_url: string
  response_type: string
  created_at: string
}

export interface WordResponse {
  word: string
  pronunciation: string
  partOfSpeech: string
  definition: string
  trueMeaningNote: string
  simpleExplanation: string
  realWorldScenario: string
  examples: string[]
  imagePrompt: string
  image_url: string
}

export interface SearchHistory {
  id: string
  user_id: string
  word: string
  pronunciation: string
  partOfSpeech: string
  definition: string
  trueMeaningNote: string
  simpleExplanation: string
  realWorldScenario: string
  examples: string[]
  image_url: string
  response_type: string
  search_date: string
  created_at: string
}
