// src/components/AuthRequiredOverlay.jsx
import React, { useState } from "react";
import { supabase } from "../client";
import "../css/auth.css";
import googleIcon from '../assets/google.png';

export default function AuthRequiredOverlay({ open, onClose }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleBackdropClick = () => {
    if (onClose) {
      onClose();
    } else {
      // Fallback if no onClose prop
      window.history.back();
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/authen`
      }
    });
    if (error) alert(error.message);
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);
      window.location.reload();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      alert("Check your email to confirm your account.");
    }
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" aria-label="Authentication required">
      <div className="auth-backdrop" onClick={handleBackdropClick} />
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <h3>🔒 You need an account</h3>
        <p>Please {mode === "signin" ? "sign in" : "create an account"} to use Zeno.</p>
        <button className="auth-oauth" onClick={handleGoogleSignIn}>
          <img src={googleIcon} alt="Google icon" className="icon" />
          {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
        </button>
        <div className="auth-divider">or use email</div>
        <form className="auth-form" onSubmit={submitEmail}>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
          />
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
          />

          <div className="auth-row">
            <button type="submit" className="auth-btn primary">
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
            <button 
              type="button" 
              className="auth-btn" 
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}