const MOTO_SUPABASE_URL = "https://mshgtmpnesceletxvpts.supabase.co";
const MOTO_SUPABASE_KEY = "sb_publishable_F6bkwnYFRtsZNz3tuPJ8nA_XVrJaX7E";

// This is a public publishable key. Never place service-role keys in frontend code.
window.motoSupabase = window.supabase
  ? window.supabase.createClient(MOTO_SUPABASE_URL, MOTO_SUPABASE_KEY)
  : null;
