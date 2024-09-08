import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hzgjuagwofztyqtsvrgt.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Z2p1YWd3b2Z6dHlxdHN2cmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NzkwMTYsImV4cCI6MjA0MTM1NTAxNn0.KVxX3T4rJ17R0plHbjtajEsh3GPDAS2eI5AscNlQHds';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;