// Debug version of Authen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

export default function Authen() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      console.log('🔵 Authen component started');
      
      // Ensure there is a signed-in user
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('🔵 Session data:', sessionData);
      
      const session = sessionData?.session;
      if (!mounted) return;

      if (!session?.user) {
        console.log('❌ No user session found, redirecting to login');
        navigate("/", { replace: true });
        return;
      }

      const user = session.user;
      console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      });

      // Check user metadata first (faster than database query)
      const hasCompletedOnboardingInMetadata = user.user_metadata?.onboarding_completed;
      console.log('🔵 Metadata onboarding completed:', hasCompletedOnboardingInMetadata);
      
      if (hasCompletedOnboardingInMetadata) {
        console.log('✅ Onboarding completed via metadata, going to /goal');
        navigate("/goal", { replace: true });
        return;
      }

      // Fetch or create the user's profile in UserData table
      console.log('🔵 Checking UserData table for user:', user.id);
      
      const { data: userData, error: selErr } = await supabase
        .from("UserData")
        .select("authen_seen,onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log('🔵 UserData query result:', { userData, error: selErr });

      if (!mounted) return;

      if (selErr) {
        console.error('❌ Error reading UserData:', selErr);
        navigate("/onboarding", { replace: true });
        return;
      }

      if (!userData) {
        console.log('🔵 First time user - creating UserData record');
        
        const { data: insertData, error: insertError } = await supabase
          .from("UserData")
          .insert({
            user_id: user.id,
            email: user.email,
            authen_seen: true,
            onboarding_completed: false,
          });
        
        console.log('🔵 Insert result:', { insertData, insertError });
        
        if (insertError) {
          console.error('❌ Error creating UserData:', insertError);
        }
        
        navigate("/onboarding", { replace: true });
        return;
      }

      // Mark authen_seen if not already true
      if (!userData.authen_seen) {
        console.log('🔵 Updating authen_seen to true');
        
        const { error: updateError } = await supabase
          .from("UserData")
          .update({ authen_seen: true })
          .eq("user_id", user.id);
          
        if (updateError) {
          console.error('❌ Error updating authen_seen:', updateError);
        }
      }

      // Check if onboarding is completed in database
      if (userData.onboarding_completed) {
        console.log('✅ Onboarding completed via database, updating metadata and going to /goal');
        
        // Update user metadata to match database for future fast lookups
        const { error: metaError } = await supabase.auth.updateUser({
          data: { 
            onboarding_completed: true 
          }
        });
        
        if (metaError) {
          console.error('❌ Error updating metadata:', metaError);
        }
        
        navigate("/goal", { replace: true });
      } else {
        console.log('🔵 Onboarding not completed, going to /onboarding');
        navigate("/onboarding", { replace: true });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return <div>Loading...</div>; // Show loading instead of null
}