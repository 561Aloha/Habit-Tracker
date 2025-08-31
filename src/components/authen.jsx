import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../client";

export default function Authen() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (code) {
        await supabase.auth.exchangeCodeForSession({ code });
      } else if (window.location.hash.includes("access_token")) {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (session?.user) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    })();
    return () => { mounted = false; };
  }, [location.search, navigate]);

  return null;
}
