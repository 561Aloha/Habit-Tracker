import React, { useState } from 'react';
import { supabase } from '../client';

const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  return (
    <form onSubmit={handleEmailLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign in with Email</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </form>
  );
};

export default EmailLogin;
