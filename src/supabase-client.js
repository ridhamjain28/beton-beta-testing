import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://kageeyipltwnsuuhkwfm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wz3DY0kXG8zhRRYsSfix6A_KcUFhAR8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function handleSupabaseError(error, context = 'Supabase Operation') {
    console.error(`[Supabase Error] ${context}:`, error);
    // You can expand this later to show UI toasts or alerts if desired
}

