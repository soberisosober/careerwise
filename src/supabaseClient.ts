import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvoscyozlqyhzgwkvcmm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2b3NjeW96bHF5aHpnd2t2Y21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDcyMzMsImV4cCI6MjA2NTAyMzIzM30.RlFtHrRX23T9QTPHkVUCTSoeJOWaf0TFR2yyI4OvltI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 