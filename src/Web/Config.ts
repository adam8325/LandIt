import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

/** OpenAI config */
const openaiKey = import.meta.env.VITE_OPENAI_API_KEY
if (!openaiKey) throw new Error('OpenAI API key is missing or invalid.')

export const openai = new OpenAI({
  apiKey: openaiKey,
  dangerouslyAllowBrowser: true
})

/** Supabase config */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase env variables are missing')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
