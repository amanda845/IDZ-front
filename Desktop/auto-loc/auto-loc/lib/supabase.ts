import { createServerClient, createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createBrowserClient } from '@supabase/ssr'

export const createClientComponentClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const createServerComponentClient = () => createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { cookies: () => cookies() }
)
