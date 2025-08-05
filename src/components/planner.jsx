
import React from 'react';
import './../css/planner.css'; 
import { format } from 'date-fns';

const Planner = ({ habits = [], completionData = [], onHabitCompletion, currentWeek = [] }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get status for a specific habit and day
  const getStatus = (habitId, dateKey) => {
    const completion = completionData.find(
      c => c.habit_id === habitId && c.completion_date === dateKey
    );
    
    if (!completion) return '';
    return completion.is_completed ? 'checked' : 'failed';
  };

  // Generate date keys for the current week
  const getWeekDateKeys = () => {
    if (currentWeek.length === 0) {
      // Fallback to current week if currentWeek is not provided
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return format(date, 'yyyy-MM-dd');
      });
    }
    
    return currentWeek.map(day => format(day.fullDate, 'yyyy-MM-dd'));
  };

  const weekDateKeys = getWeekDateKeys();

  return (
    <div className="planner-modern">
      <h3>Weekly Habit Grid</h3>
      <table>
        <thead>
          <tr>
            <th>Habit</th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.length > 0 ? (
            habits.map((habit) => (
              <tr key={habit.habit_id}>
                <td><strong>{habit.habit_name}</strong></td>
                {weekDateKeys.map((dateKey, dayIndex) => {
                  const status = getStatus(habit.habit_id, dateKey);
                  
                  return (
                    <td 
                      key={dayIndex} 
                      onClick={() => onHabitCompletion && onHabitCompletion(habit.habit_id, dateKey)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={`habit-cell ${status}`}>
                        {status === 'checked' ? '✓' : status === 'failed' ? '✗' : '○'}
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