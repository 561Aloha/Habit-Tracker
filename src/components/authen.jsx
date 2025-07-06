import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://your-project-url.supabase.co', 'your-anon-key')

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  if (error) console.error('OAuth error:', error)
}
