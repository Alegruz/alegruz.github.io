import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let cachedUser = null;

export async function ensureAuth() {
  if (cachedUser) return cachedUser;
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('session error', sessionError);
    }
    if (session && session.user) {
      cachedUser = session.user;
      return cachedUser;
    }
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('anonymous sign-in failed', error);
      throw error;
    }
    cachedUser = data.user;
    return cachedUser;
  } catch (err) {
    console.error('ensureAuth exception', err);
    throw err;
  }
}

export function getCurrentUserId() {
  return cachedUser ? cachedUser.id : null;
}
