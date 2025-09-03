import React, { useState } from 'react';
import './../css/planner.css'; 
import { format } from 'date-fns';

const Planner = ({ habits = [], completionData = [], onHabitCompletion, currentWeek = [] }) => {
  const [showAllHabits, setShowAllHabits] = useState(false);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const INITIAL_DISPLAY_COUNT = 5;
  const getStatus = (habitId, dateKey) => {
      const completion = completionData.find(
        c => c.habit_id === habitId && c.completion_date === dateKey
      );
      
      if (!completion) return 'blank';
      return completion.is_completed ? 'checked' : 'failed';
    };
   const isHabitScheduledForDay = (habit, dayIndex) => {
    const dayName = fullDayNames[dayIndex];
    return habit.frequency && habit.frequency.includes(dayName);
  };

 const getWeekDateKeys = () => {
    if (currentWeek.length === 0) {
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

const handleCellClick = (habit, dateKey, dayIndex) => {
    if (!isHabitScheduledForDay(habit, dayIndex)) {
      return;
    }

    const currentStatus = getStatus(habit.habit_id, dateKey);
    
    let newCompletionState;
    switch (currentStatus) {
      case 'blank':
        newCompletionState = true;
        break;
      case 'checked':
        newCompletionState = false;
        break;
      case 'failed':
        newCompletionState = null; // back to blank (delete record)
        break;
      default:
        newCompletionState = true;
    }
    if (newCompletionState === null) {
      onHabitCompletion && onHabitCompletion(habit.habit_id, dateKey, 'delete');
    } else {
      onHabitCompletion && onHabitCompletion(habit.habit_id, dateKey, newCompletionState);
    }
  };
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
                const isScheduled = isHabitScheduledForDay(habit, dayIndex);
                  
                  return (
                    <td 
                      key={dayIndex} 
                      onClick={() => handleCellClick(habit, dateKey, dayIndex)}
                      className={!isScheduled ? 'disabled-cell' : ''}
                    >
                      <span className={`habit-cell ${status} ${!isScheduled ? 'not-scheduled' : ''}`}>
                        {!isScheduled ? ' ' : (
                          status === 'checked' ? '✓' : 
                          status === 'failed' ? '✗' : '○'
                        )}
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