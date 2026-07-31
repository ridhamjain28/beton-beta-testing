import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://vxlbsmghixjvhxugmrhb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bGJzbWdoaXhqdmh4dWdtcmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDM0MDQsImV4cCI6MjA2MzYxOTQwNH0.z2g8zSjM0cQxNl847z7hT9XjLz2-W2n9T10L82z0kX0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function handleSupabaseError(error, context = 'Supabase Operation') {
    console.error(`[Supabase Error] ${context}:`, error);
    // You can expand this later to show UI toasts or alerts if desired
}

