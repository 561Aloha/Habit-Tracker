import { supabase } from '../client';
const LoginWithGoogle = () => {
  const handleGoogleLogin = async () => {
    console.log('🔵 Starting Google login...');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/authen` // Explicit redirect
        }
      });
      
      console.log('🔵 OAuth response:', { data, error });
      
      if (error) {
        console.error('❌ Google Sign-In error:', error.message);
        alert(`Login error: ${error.message}`);
      } else {
        console.log('✅ OAuth initiated successfully');
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      alert(`Unexpected error: ${err.message}`);
    }
  };

  return (
    <button className='signin' onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
};

export default LoginWithGoogle;