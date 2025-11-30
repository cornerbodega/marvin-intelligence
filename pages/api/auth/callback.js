// pages/api/auth/callback.js

import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

/**
 * This API route handles the OAuth callback from Supabase,
 * exchanges the code for a session, and redirects to your app.
 */
export default async function handler(req, res) {
  const { code, error, error_description } = req.query;

  // Check for OAuth errors
  if (error) {
    console.error("OAuth error:", error, error_description);
    return res.redirect(`/?error=${encodeURIComponent(error_description || error)}`);
  }

  if (code) {
    try {
      const supabase = createPagesServerClient({ req, res });

      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Code exchange error:", exchangeError);
        return res.redirect(`/?error=${encodeURIComponent(exchangeError.message)}`);
      }
    } catch (err) {
      console.error("Callback error:", err);
      return res.redirect(`/?error=${encodeURIComponent(err.message)}`);
    }
  }

  // Redirect to your actual destination after login
  res.redirect("/reports/folders/view-folders");
}
