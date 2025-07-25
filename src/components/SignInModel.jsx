import React from 'react';
import LoginWithGoogle from './LoginWithGoogle';
import EmailLogin from './EmailLogin'; // (if you want to plug this in)

const SignInModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Sign In</h3>
        <LoginWithGoogle />
        {/* You can use your real EmailLogin, or just show a disabled button for now */}
        <EmailLogin />
        {/* <button className="auth-btn" disabled>Sign in with Email (coming soon)</button> */}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff; border-radius: 10px; padding: 36px 30px 24px 30px;
          min-width: 320px; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          text-align: center;
        }
        .close-btn {
          margin-top: 18px; background: none; border: none; color: #888; cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SignInModal;
