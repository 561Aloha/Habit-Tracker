// src/pages/Authen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

export default function Authen() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Ensure there is a signed-in user
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!mounted) return;

      if (!session?.user) {
        navigate("/", { replace: true });
        return;
      }

      const user = session.user;

      // Fetch or create the user's profile
      const { data: profile, error: selErr } = await supabase
        .from("profiles")
        .select("authen_seen,onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (selErr) {
        // If unable to read profile, send to onboarding as a safe default
        navigate("/onboarding", { replace: true });
        return;
      }

      if (!profile) {
        // First time ever: create row and mark authen_seen
        await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            authen_seen: true,
          });
        navigate("/onboarding", { replace: true });
        return;
      }

      // Mark authen_seen if not already true
      if (!profile.authen_seen) {
        await supabase
          .from("profiles")
          .update({ authen_seen: true })
          .eq("id", user.id);
      }

      // Route based on onboarding completion
      if (!profile.onboarding_completed) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/goal", { replace: true });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return null;
}
