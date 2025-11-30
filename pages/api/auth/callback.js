// pages/api/auth/callback.js

import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

/**
 * This API route handles the OAuth callback from Supabase,
 * exchanges the code for a session, and redirects to your app.
 */
export default async function handler(req, res) {
  const { code } = req.query;

  if (code) {
    const supabase = createPagesServerClient({ req, res });

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to your actual destination after login
  res.redirect("/reports/folders/view-folders");
}
