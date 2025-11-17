import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let cachedUserId = null;

function decorateAnonError(error) {
  if (!error) return null;
  const message = String(error.message || '').toLowerCase();
  if (message.includes('anonymous sign-ins are disabled')) {
    const friendly = new Error(
      'Supabase Authentication > Providers에서 Anonymous Sign-ins를 활성화해야 합니다.'
    );
    friendly.code = 'anon-disabled';
    friendly.original = error;
    return friendly;
  }
  return error;
}

export async function ensureAuth() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Failed to get session', error);
  }
  if (data?.session?.user) {
    cachedUserId = data.session.user.id;
    return cachedUserId;
  }
  const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
  if (signInError) {
    const friendly = decorateAnonError(signInError);
    console.error('Anonymous sign-in failed', friendly);
    throw friendly;
  }
  cachedUserId = signInData?.user?.id || null;
  return cachedUserId;
}

supabase.auth.onAuthStateChange((_event, session) => {
  cachedUserId = session?.user?.id || cachedUserId;
});

export function getCurrentUserId() {
  return cachedUserId;
}
