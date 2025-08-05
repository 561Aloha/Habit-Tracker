import React, { useEffect, useState } from 'react';
import { supabase } from '../client'; // adjust path if needed
import googleIcon from '../assets/google.png';
import '../css/HowItWorks.css';

const SignInModal = ({ open, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleGoogleSignIn = async () => {
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setMessage(error.message);
  };

  const handleEmailAuth = async () => {
    setMessage('');
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        onClose();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes('User already registered')) {
          setMessage('User already exists with this email.');
        } else {
          setMessage(error.message);
        }
      } else {
        onClose();
      }
    }
  };

  if (!open) return null;

  return (
    <div className="zeno-modal-backdrop" onClick={onClose}>
      <div className="zeno-modal" onClick={(e) => e.stopPropagation()}>
        <div className="zeno-header">
          <h1 className="zeno-logo">Zeno</h1>
          <p className="zeno-tagline">
            Get better data with conversational forms,<br />
            surveys, quizzes & more.
          </p>
        </div>

        <button className="zeno-btn white" onClick={handleGoogleSignIn}>
          <img src={googleIcon} alt="Google icon" className="icon" />
          {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
        </button>

        <div className="zeno-divider">OR</div>

        {/* Render both login and signup forms to preserve hook order */}
        <div style={{ display: mode === 'login' ? 'block' : 'none' }}>
          <input
            type="email"
            placeholder="Email"
            className="zeno-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="zeno-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="zeno-btn primary" onClick={handleEmailAuth}>
            Sign In
          </button>
        </div>

        <div style={{ display: mode === 'signup' ? 'block' : 'none' }}>
          <input
            type="email"
            placeholder="Email"
            className="zeno-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="zeno-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="zeno-btn primary" onClick={handleEmailAuth}>
            Sign Up
          </button>
        </div>

        {message && <div className="zeno-error">{message}</div>}

        {mode === 'login' ? (
          <a className="zeno-login-link" onClick={() => setMode('signup')}>
            Don’t have an account? Sign up
          </a>
        ) : (
          <a className="zeno-login-link" onClick={() => setMode('login')}>
            Already have an account? Log in
          </a>
        )}
      </div>
    </div>
  );
};

export default SignInModal;
