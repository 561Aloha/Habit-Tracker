// src/components/AuthRequiredOverlay.jsx
import React, { useState } from "react";
import { supabase } from "../client";
import "../css/auth.css";
import googleIcon from '../assets/google.png';

export default function AuthRequiredOverlay({ open, onClose }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!open) return null;

  const generateFakeCredentials = async () => {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomName = Math.random().toString(36).substring(2, 10);
    const fakeEmail = `demo_${randomName}@${randomDomain}`;
    const fakePassword = Math.random().toString(36).substring(2, 12) + '123!';
    
    try {
      // Create the fake user account in Supabase
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password: fakePassword,
        options: {
          emailRedirectTo: undefined, // Skip email confirmation
          data: {
            fake_account: true, // Mark as demo account
            created_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('Error creating fake account:', error);
        alert('Error creating demo account. Please try again.');
        return;
      }

      // If account creation was successful, sign them in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: fakePassword
      });

      if (signInError) {
        console.error('Error signing in with fake credentials:', signInError);
        alert('Demo account created but sign-in failed. Please try again.');
        return;
      }

      // Update the form fields to show what was used
      setEmail(fakeEmail);
      setPassword(fakePassword);
      setShowExitConfirm(false);
      
      // Reload to reflect the signed-in state
      window.location.reload();
      
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong creating your demo account.');
    }
  };

  const handleBackdropClick = () => {
    setShowExitConfirm(true);
  };

  const handleExitConfirm = async (useFakeCredentials) => {
    if (useFakeCredentials) {
      await generateFakeCredentials();
    } else {
      // Return to home screen
      if (onClose) {
        onClose();
      } else {
        // Fallback if no onClose prop
        window.history.back();
      }
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
      
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="auth-card exit-confirm">
          <h3>Don't want to sign up but want to see what this page would look like?</h3>
          <p>We can generate fake credentials for you to explore the interface.</p>
          <div className="auth-row">
            <button 
              className="auth-btn primary" 
              onClick={() => handleExitConfirm(true)}
            >
              Yes, create demo account
            </button>
            <button 
              className="auth-btn" 
              onClick={() => handleExitConfirm(false)}
            >
              No, take me home
            </button>
          </div>
        </div>
      )}

      {/* Main Auth Modal */}
      {!showExitConfirm && (
        <div className="auth-card" onClick={(e) => e.stopPropagation()}>
          <h3>🔒 You need an account</h3>
          <p>Please sign in or create an account to use Zeno.</p>

          <button className="auth-oauth" onClick={handleGoogleSignIn}>
            <img src={googleIcon} alt="Google icon" className="icon" />
            Sign up with Google
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
      )}
    </div>
  );
}