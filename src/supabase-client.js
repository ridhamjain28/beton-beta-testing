const SUPABASE_URL = 'https://vxlbsmghixjvhxugmrhb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bGJzbWdoaXhqdmh4dWdtcmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDM0MDQsImV4cCI6MjA2MzYxOTQwNH0.z2g8zSjM0cQxNl847z7hT9XjLz2-W2n9T10L82z0kX0';

// We rely on the Supabase CDN script being loaded in the HTML before this script:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Store the shared client as _betonDb so window.supabase (the library) is NOT overwritten.
// adminadmin.html calls supabase.createClient() directly and must keep window.supabase = library.
window._betonDb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


