import { supabase } from "../utils/supabase";

export default function LandingPage() {
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/api/auth/callback"
            : "https://intelligence.marvin.technology/api/auth/callback",
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0a0a0a, #000000 60%, #111111)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'JetBrains Mono', monospace",
        textAlign: "center",
      }}
    >
      <img
        src="/logo.png"
        alt="Marvin Intelligence Logo"
        style={{ width: "100px", marginBottom: "2rem" }}
      />

      <h1
        style={{
          fontSize: "2.75rem",
          fontWeight: "700",
          marginBottom: "1rem",
          textShadow: "0 0 10px #00fff2",
        }}
      >
        Marvin Intelligence Agency
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "700px",
          marginBottom: "2rem",
          color: "#aaa",
        }}
      >
        AI-driven mission control for recursive intelligence workflows. Generate
        strategic reports, deploy smart agents, and visualize intelligence like
        never before.
      </p>

      <button
        onClick={signInWithGoogle}
        style={{
          background: "#db4437",
          border: "none",
          padding: "1rem 2rem",
          borderRadius: "0.5rem",
          color: "white",
          fontSize: "1.1rem",
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <i className="bi bi-google" style={{ marginRight: "0.5rem" }} />
        Sign in with Google
      </button>

      <div style={{ marginTop: "4rem", fontSize: "0.9rem", color: "#555" }}>
        <em>Recursive. Strategic. Intelligent.</em>
      </div>
    </div>
  );
}
