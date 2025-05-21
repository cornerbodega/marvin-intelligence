// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase"; // Adjust the import path as necessary

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (isMounted && data?.user) {
        router.push("/reports/folders/view-folders");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/reports/folders/view-folders"
            : "https://intelligence.marvin.technology/reports/folders/view-folders",
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
        background: "black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <img
        src="/logo.png"
        alt="Gunsmoke3D Logo"
        style={{ width: "120px", marginBottom: "1.5rem" }}
      />
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Welcome to Marvin Intelligence Agency
      </h1>
      <p
        style={{
          maxWidth: "600px",
          marginBottom: "2rem",
          fontSize: "1.1rem",
          lineHeight: "1.5",
        }}
      >
        Recursive AI-driven intelligence agency. Create, manage, and deploy.
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
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
