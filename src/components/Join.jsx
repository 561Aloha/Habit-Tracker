import React from 'react';
import { supabase } from '../client';

const Join = () => {
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Google Sign-Up error:', error.message);
  };

  const handleEmailSignup = () => {
    window.location = '/signup-email';
  };

  const handleSignIn = () => {
    window.location = '/login';
  };

  return (
    <div className="join-habit-tracker">
      <h2>Join Habit Tracker.</h2>
      <div className="auth-buttons">
        <button className="auth-btn google" onClick={handleGoogleSignup}>
          <img src="/google-icon.svg" alt="" style={{width: 20, marginRight: 8}} />
          Sign up with Google
        </button>
        <button className="auth-btn email" onClick={handleEmailSignup}>
          <span style={{marginRight: 8}}>✉️</span>
          Sign up with email
        </button>
      </div>
      <div className="small-text" style={{marginTop: 16}}>
        Already have an account?{" "}
        <button className="plain-link" onClick={handleSignIn}>Sign in</button>
      </div>
      <style>{`
        .join-habit-tracker {
          width: 350px;
          margin: 48px auto;
          padding: 32px 24px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 20px 0 rgba(0,0,0,0.08);
          text-align: center;
        }
        .auth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px 0;
          margin-bottom: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          background: #fff;
          cursor: pointer;
          transition: border .15s;
        }
        .auth-btn.google {
          border-color: #4285f4;
        }
        .auth-btn.email {
          border-color: #333;
        }
        .auth-btn:hover {
          border-color: #222;
        }
        .small-text {
          font-size: 14px;
          color: #888;
        }
        .plain-link {
          background: none;
          border: none;
          color: #2979ff;
          cursor: pointer;
          text-decoration: underline;
          font-size: 14px;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default Join;
