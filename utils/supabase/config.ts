import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function setSession(uid: string) {
  const { error } = await supabase.rpc('set_session', {
    uid,
  })

  if (error) {
    console.error('error setting session:', error)
    throw new Error(error.message)
  }
}

export default supabase
