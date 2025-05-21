// utils/saveToSupabase.js

import { supabase } from "./supabase"; // ✅ import singleton

async function saveToSupabase(table, dataToSave) {
  return await supabase.from(table).upsert(dataToSave).select();
}

export { saveToSupabase };
