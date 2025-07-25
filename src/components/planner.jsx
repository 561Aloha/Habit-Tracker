import React, { useEffect, useState } from 'react';
import { supabase } from './../client';
import './../css/planner.css'; 
import CheckSVG from './../assets/Check.svg';
import CloseLSVG from './../assets/Close_L.svg';

const Planner = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchCompletionData();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('Habits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error.message);
    }
  };

  const fetchCompletionData = async () => {
    try {
      const { data, error } = await supabase
        .from('Habit_Completion')
        .select('*')
        .eq('user_id', user.id);

      if (error) { throw error;}
      setCompletionData(data);
    } catch (error) {
      console.error('Error fetching completion data:', error.message);
    }
  };
    const getStatus = (habitId, day) => {
    const item = completionData.find(
      (c) =>
        c.habit_id === habitId &&
        new Date(c.completion_date).getDay() === day
    );
    if (!item) return '';
    if (item.is_completed) return 'checked';
    if (item.is_completed === false) return 'failed';
    return '';
  };

  const renderCheckmark = (habitId, day) => {
    const completion = completionData.find(
      (item) =>
        item.habit_id === habitId &&
        new Date(item.completion_date).getDay() === day &&
        item.is_completed
    );
    return completion ? '✓' : '○';
  };

  const markHabitComplete = async (habitId, habitDateKey) => {
    if (!user) return;

    try {
      // Get current completion status for this cell
      const existing = completionData.find(
        c => c.habit_id === habitId && c.completion_date.startsWith(habitDateKey)
      );
      const isCompleted = existing ? !existing.is_completed : true;

      // Save to supabase
      const { data, error } = await supabase
        .from('Habit_Completion')
        .upsert({
          habit_id: habitId,
          completion_date: habitDateKey,
          is_completed: isCompleted,
          user_id: user.id, 
        }, { onConflict: ['habit_id', 'completion_date', 'user_id'] });

      if (error) throw error;
      fetchCompletionData(); // Re-fetch to update grid

    } catch (error) {
      console.error('Error updating habit completion status:', error.message);
    }
  };

  

return (
    <div className="planner-modern">
      <table>
        <thead>
          <tr>
            <th></th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.length > 0 ? (
            habits.map((habit, i) => (
              <tr key={habit.habit_id || i}>
                <td><strong>{habit.habit_name}</strong></td>
                {days.map((_, j) => {
                  const today = new Date();
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                  const cellDate = new Date(weekStart);
                  cellDate.setDate(weekStart.getDate() + j); // j = 0: Sun, 1: Mon, ...
                  const dateKey = cellDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
                  const dayIdx = (j + 1) % 7;
                  const status = getStatus(habit.habit_id, dayIdx);

                  return (
                    <td key={j} onClick={() => markHabitComplete(habit.habit_id, dateKey)}>
                      <span className={`habit-cell ${status}`}>
                        {status === 'checked' ? '✓' : status === 'failed' ? '✗' : ''}
                      </span>
                    </td>
                  );
                })}

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>No habits found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Planner;