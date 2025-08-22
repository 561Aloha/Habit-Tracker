// MyChart.jsx
import React, { useEffect, useState } from "react";
import CompleteGrid from "./CompleteGrid";
import { supabase } from "../client";
import { format } from 'date-fns';

function yyyymmddLocal(dateLike) {
  const d = new Date(dateLike);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MyChart = () => {
  const [completedDays, setCompletedDays] = useState({});
  const [user, setUser] = useState(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Fetch completions when user is available
  useEffect(() => {
    if (!user) return;

    const fetchCompletionData = async () => {
      try {
        // Fetch all habits for the user
        const { data: habitsData, error: habitsError } = await supabase
          .from('Habits')
          .select('*')
          .eq('user_id', user.id);
        
        if (habitsError) throw habitsError;

        // Fetch all completion data for the user
        const { data: completionData, error: completionError } = await supabase
          .from('Habit_Completion')
          .select('*')
          .eq('user_id', user.id);
        
        if (completionError) throw completionError;

        // Calculate daily completion percentages
        const dailyCompletions = {};
        
        // Get all unique dates from completion data and calculate for each day
        const allDates = new Set();
        
        // Add dates from completion data
        completionData?.forEach(completion => {
          if (completion.completion_date) {
            allDates.add(yyyymmddLocal(completion.completion_date));
          }
        });

        // Also calculate for recent dates even if no completions exist
        // This ensures we show 0% for days with scheduled habits but no completions
        const today = new Date();
        for (let i = 0; i < 365; i++) { // Check last year
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          allDates.add(yyyymmddLocal(date));
        }

        allDates.forEach(dateKey => {
          const date = new Date(dateKey);
          const dayName = format(date, 'EEEE');
          
          // Find habits scheduled for this day of week
          const scheduledHabits = habitsData?.filter(habit => 
            habit.frequency && habit.frequency.includes(dayName)
          ) || [];
          
          if (scheduledHabits.length === 0) {
            // No habits scheduled for this day, don't include in grid
            return;
          }

          // Count completed habits for this date
          const completedCount = scheduledHabits.filter(habit => {
            const completion = completionData?.find(c => 
              c.habit_id === habit.habit_id && 
              yyyymmddLocal(c.completion_date) === dateKey && 
              c.is_completed
            );
            return completion;
          }).length;

          // Calculate percentage
          const percentage = Math.round((completedCount / scheduledHabits.length) * 100);
          dailyCompletions[dateKey] = percentage;
        });

        console.log("Daily completion percentages:", dailyCompletions);
        setCompletedDays(dailyCompletions);

      } catch (error) {
        console.error("Error fetching completion data:", error);
      }
    };

    fetchCompletionData();
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Habit Completion Chart</h2>
      <CompleteGrid completedDays={completedDays} />
    </div>
  );
};

export default MyChart;