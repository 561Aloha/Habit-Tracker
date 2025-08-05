import React, { useState } from 'react';
import { supabase } from '../client';
import '../css/HowItWorks.css';

const EmailSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
  };

  return (
    <form onSubmit={handleEmailSignUp} className="email-form">
      <input
        type="email"
        className="email-input"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="email-input"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="email-submit">Sign up with Email</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default EmailSignUp;
