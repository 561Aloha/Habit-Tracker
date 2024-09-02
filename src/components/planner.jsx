import React, { useEffect, useState } from 'react';
import { supabase } from './../client';
import './../css/goals.css'; 

const Planner = () => {
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState([]);

  useEffect(() => {
    fetchHabits();
    fetchCompletionData();
  }, []);

  const fetchHabits = async () => {
    const userId = 1; 
    try {
      const { data, error } = await supabase
        .from('Habits')
        .select('*')
        .eq('userid', userId);

      if (error) {
        throw error;
      }

      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error.message);
    }
  };

  const fetchCompletionData = async () => {
    const userId = 1; // Assuming the user ID is 1
    try {
      const { data, error } = await supabase
        .from('Habit_Completion')
        .select('*')
        .eq('userid', userId);

      if (error) {
        throw error;
      }

      setCompletionData(data);
    } catch (error) {
      console.error('Error fetching completion data:', error.message);
    }
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

  return (
    <div className="planner-container">
      <table className="plannertable">
        <thead>
          <tr>
            <th className="day-label" data-full=""></th>
            <th className="day-label" data-full="Monday"></th>
            <th className="day-label" data-full="Tuesday"></th>
            <th className="day-label" data-full="Wednesday"></th>
            <th className="day-label" data-full="Thursday"></th>
            <th className="day-label" data-full="Friday"></th>
            <th className="day-label" data-full="Saturday"></th>
            <th className="day-label" data-full="Sunday"></th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.habit_id} className="habit_name">
              <td>{habit.habit_name}</td>
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <td key={day} className="checkmate">{renderCheckmark(habit.habit_id, day)}</td>
              ))} 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Planner;
