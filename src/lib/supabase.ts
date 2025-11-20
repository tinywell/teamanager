import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nvufhfukfupnrutyirmc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dWZoZnVrZnVwbnJ1dHlpcm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDUwMjgsImV4cCI6MjA3OTE4MTAyOH0.FzcFM2XmrhbrmbXpdm2biRvT0TmLpbF8-QNfkc5iflI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
