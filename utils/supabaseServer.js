// utils/supabaseServer.js
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export function getServerSupabaseClient(context) {
  return createPagesServerClient(context);
}
