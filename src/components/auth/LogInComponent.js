// import { useEffect } from "react";
import { sanitize, isSupported } from "isomorphic-dompurify";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const LogInComponent = ({ title, content }) => {
  return <div>Log In!!!</div>;
};

export default LogInComponent;
