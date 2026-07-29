// supabase-client.js
// Initialize Supabase Client

const SUPABASE_URL = 'https://kageeyipltwnsuuhkwfm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZ2VleWlwbHR3bnN1dWhrd2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTkyNDgsImV4cCI6MjEwMDgzNTI0OH0.U93etZwUGIP5EYs9zV7bj5b7SU82VXQ4naqIHu8LTck';

// We rely on the Supabase CDN script being loaded in the HTML before this script:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;

