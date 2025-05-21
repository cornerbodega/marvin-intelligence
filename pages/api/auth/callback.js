// pages/api/auth/callback.js

import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

/**
 * This API route handles the OAuth callback from Supabase,
 * sets the session cookies, and redirects to your app.
 */
export default async function handler(req, res) {
  // Create a Supabase server client using the request and response
  const supabase = createPagesServerClient({ req, res });

  // This fetches the session and sets the cookies required for SSR
  await supabase.auth.getSession();

  // Redirect to your actual destination after login
  res.redirect("/reports/folders/view-folders");
}
