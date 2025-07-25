import React ,{ useEffect } from "react";

function Onboard() {
  useEffect(() => {
    const handleOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Redirect to the Goals page if the user is already onboarded
        window.location.href = '/goals';
      }
    };
    handleOnboarding();
  }, []);

  return (
    <div className="onboard-container">
      <h1>Welcome to Habit Tracker</h1>
      <p>Please sign up or log in to continue.</p>
    </div>
  );
}