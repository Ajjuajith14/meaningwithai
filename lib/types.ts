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
  image_url?: string | null
}

export interface User {
  id: string
  email?: string
  phone?: string
  created_at: string
  updated_at: string
  subscription_status?: string
  trial_searches_used?: number
  total_searches?: number
}

export interface SearchHistory {
  id: string
  word: string
  definition: string
  user_id?: string
  created_at: string
}

export interface Feedback {
  id: string
  rating: number
  comment?: string
  word?: string
  user_id?: string
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}
