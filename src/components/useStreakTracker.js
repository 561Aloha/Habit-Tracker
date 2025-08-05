import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // adjust path

export const useStreakTracker = () => {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndUpdateStreak = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setIsLoading(false);
        return;
      }

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // New user
        await supabase.from('streaks').insert({
          user_id: user.id,
          streak_count: 1,
          best_streak: 1,
          last_login_date: todayStr,
        });
        setStreak(1);
        setBestStreak(1);
      } else if (data) {
        const lastLogin = new Date(data.last_login_date);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (lastLogin.toDateString() === today.toDateString()) {
          setStreak(data.streak_count);
          setBestStreak(data.best_streak);
        } else if (lastLogin.toDateString() === yesterday.toDateString()) {
          const newStreak = data.streak_count + 1;
          const updatedBest = Math.max(data.best_streak, newStreak);

          await supabase
            .from('streaks')
            .update({
              streak_count: newStreak,
              best_streak: updatedBest,
              last_login_date: todayStr,
            })
            .eq('user_id', user.id);

          setStreak(newStreak);
          setBestStreak(updatedBest);
        } else {
          await supabase
            .from('streaks')
            .update({
              streak_count: 1,
              last_login_date: todayStr,
            })
            .eq('user_id', user.id);

          setStreak(1);
          setBestStreak(data.best_streak);
        }
      }

      setIsLoading(false);
    };

    checkAndUpdateStreak();
  }, []);

  return { streak, bestStreak, isLoading };
};
