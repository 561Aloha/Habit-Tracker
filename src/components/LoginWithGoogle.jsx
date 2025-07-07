import React from 'react';
import { supabase } from '../client';


const LoginWithGoogle = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Google Sign-In error:', error.message);

  };

  return (
    <button className='signin' onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
};

export default LoginWithGoogle;
