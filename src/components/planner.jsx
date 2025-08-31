import React, { useState } from 'react';
import './../css/planner.css'; 
import { format } from 'date-fns';

const Planner = ({ habits = [], completionData = [], onHabitCompletion, currentWeek = [] }) => {
  const [showAllHabits, setShowAllHabits] = useState(false);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const INITIAL_DISPLAY_COUNT = 5;

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

  // Determine which habits to display
  const displayedHabits = showAllHabits 
    ? habits 
    : habits.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreHabits = habits.length > INITIAL_DISPLAY_COUNT;

  const toggleShowAllHabits = () => {
    setShowAllHabits(!showAllHabits);
  };

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
          {displayedHabits.length > 0 ? (
            displayedHabits.map((habit) => (
              <tr key={habit.habit_id}>
                <td><strong>{habit.habit_name}</strong></td>
                {weekDateKeys.map((dateKey, dayIndex) => {
                  const status = getStatus(habit.habit_id, dateKey);
                  
                  return (
                    <td 
                      key={dayIndex} 
                      onClick={() => onHabitCompletion && onHabitCompletion(habit.habit_id, dateKey)}
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
              <td colSpan={8} className="no-habits-message">No habits found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {hasMoreHabits && (
        <button className="expand-toggle" onClick={toggleShowAllHabits}>
          {showAllHabits ? 'Show Less' : `Show ${habits.length - INITIAL_DISPLAY_COUNT} More`}
          <svg 
            className={`expand-chevron ${showAllHabits ? 'expanded' : ''}`}
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Planner;