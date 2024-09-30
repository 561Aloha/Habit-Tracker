
import './../css/goals.css'; 
import React, { useState, useEffect } from "react";
import MyChart from '../components/MyChart.jsx';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

import arrow from './../assets/arrow.png';
import { format } from 'date-fns';
import Planner from "../components/planner.jsx";

function Goals() {
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Habits Filled',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#8884d8',
        borderWidth: 1,
      },
    ],
  });

  const weekData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Habits Filled',
        data: [40, 15, 25, 30, 1, 23],
        backgroundColor: '#4272f5',
        borderWidth: 1,
      },
    ],
  };

  const monthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Habits Filled',
        data: [20, 15, 25, 30],
        backgroundColor: '#82ca9d',
        borderWidth: 1,
      },
    ],
  };

  const yearData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Habits Filled',
        data: [50, 20, 80, 90, 100, 100, 20, 50, 60, 70, 70, 100],
        backgroundColor: '#ffc658',
        borderWidth: 1,
      },
    ],
  };

  const [view, setView] = useState('Week');
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const[selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [calendarOffset, setCalendarOffset] = useState(0);


  const fetchHabits = async () => {
    const userId = 1; // Assuming the user ID is 1
    try {
      const { data, error } = await supabase
        .from('Habits')
        .select(`
          *,
          Habit_Completion(
            is_completed
          )
        `)
        .eq('userid', userId)
        .eq('Habit_Completion.completion_date', format(selectedDate, 'yyyy-MM-dd'));

      if (error) {
        throw error;
      }

      const updatedHabits = data.map(habit => ({
        ...habit,
        is_completed: habit.Habit_Completion.length > 0 && habit.Habit_Completion[0].is_completed
      }));

      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error.message);
    }
  };
  const updateChartData = () => {
    const weeklyData = Array(7).fill(0); // Initialize an array with 7 zeros for each day of the week
    const dailyHabitCounts = Array(7).fill(0); // Track total habits for each day
  
    // Match day names format in chartData labels (e.g., full day names: 'Sunday', 'Monday', etc.)
    const dayNameMap = {
      Sun: 'Sunday',
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
    };
  
    // Count completed habits and total habits for each day
    habits.forEach((habit) => {
      (habit.frequency || []).forEach(day => {
        // Map to full day name if needed (e.g., convert "Sun" to "Sunday")
        const fullDayName = dayNameMap[day] || day;
  
        const dayIndex = chartData.labels.indexOf(fullDayName);
        if (dayIndex !== -1) { // Only process if dayIndex is valid
          dailyHabitCounts[dayIndex] += 1; // Increment the total count of habits for this day
          if (habit.is_completed) {
            weeklyData[dayIndex] += 1; // Increment the count of completed habits
          }
        }
      });
    });
  
    // Calculate percentage for each day
    const weeklyCompletionPercentages = weeklyData.map((completed, index) =>
      dailyHabitCounts[index] ? Math.round((completed / dailyHabitCounts[index]) * 100) : 0
    );
  
    setChartData((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: weeklyCompletionPercentages,
        },
      ],
    }));
  };
  
  const markHabitComplete = async (habitId) => {
    const habit = habits.find(habit => habit.habit_id === habitId);
    const isCompleted = !habit.is_completed; 
    const updatedHabits = habits.map(habit =>
      habit.habit_id === habitId ? { ...habit, is_completed: isCompleted } : habit
    );
    setHabits(updatedHabits);

    try {
      const { data, error } = await supabase
        .from('Habit_Completion')
        .upsert({
          habit_id: habitId,
          completion_date: format(selectedDate, 'yyyy-MM-dd'),
          is_completed: isCompleted,
          userid: 1
        }, { onConflict: ['habit_id', 'completion_date', 'userid'] });

      if (error) {
        throw error;
      }

      // Log the response to verify the update
      console.log('Habit updated successfully:', data);
    } catch (error) {
      console.error('Error updating habit:', error.message);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  useEffect(() => {
    updateChartData();
  }, [habits]);


  const [currentIndex, setCurrentIndex] = useState(0);
  const data = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  const handlePrevClick = () => {
    setCalendarOffset(calendarOffset - 1); // Update calendar navigation state
  };

  const handleNextClick = () => {
    setCalendarOffset(calendarOffset + 1); // Update calendar navigation state
  };

  useEffect(() => {
    // Update the week whenever calendarOffset changes
    updateWeek(calendarOffset);
  }, [calendarOffset]);

  function getCurrentWeek() {
    const current = new Date();
    const week = [];

    for (let i = 0; i < 7; i++) {
      const first = current.getDate() - current.getDay() + i;
      const day = new Date(current.setDate(first));
      const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
      const date = day.getDate(); 
      week.push({ dayOfWeek, date, fullDate: day });
    }
    return week;
  }

  function updateWeek(offset) {
    const updatedWeek = getCurrentWeek().map(item => {
      const newDate = new Date(new Date().setDate(item.date + 7 * offset));
      const dayOfWeek = newDate.toLocaleDateString('en-US', { weekday: 'long' });
      const date = newDate.getDate(); 
      return { dayOfWeek, date, fullDate: newDate };
    });

    setCurrentWeek(updatedWeek);
  }

  const handleDayClick = (index) => {
    setSelectedDate(currentWeek[index].fullDate); // Only update selected date without affecting calendar offset
  };

  const handleViewChange = (view) => {
    setView(view);
    if (view === 'Week') {
      setChartData(weekData);
    }
  };

  const filteredHabitsForSelectedDay = habits.filter(habit => {
    const frequencyArray = habit.frequency || [];
    return frequencyArray.includes(format(selectedDate, 'EEEE'));
  });


  
  return (
    <div className="goals-page">
      <h2>The Habit Tracker</h2>
      <div className="goals-container">
        <div className="habits-container">
          <h3>Habits for {format(selectedDate, 'EEEE, MMMM d')}</h3>
          <div className="calendar">
            <div className="calendar-header">
              <img
                className="arrow left-arrow"
                src={arrow}
                style={{ transform: 'rotate(180deg)' }}
                onClick={handlePrevClick}
              />
              {currentWeek.map((item, index) => (
                <div key={index} className={`day-label ${selectedDay === index ? 'selected' : ''}`} onClick={() => handleDayClick(index)}>
                  <div>{item.dayOfWeek.slice(0,3).toUpperCase()}</div>
                  <div>{item.date}</div>
                </div>
              ))}
              <img
                className="arrow right-arrow"
                src={arrow}
                onClick={handleNextClick}
              />
            </div>
          </div>

          <div className="list">
            {filteredHabitsForSelectedDay.map(habit => (
              <div key={habit.habit_id} className={`habit ${habit.is_completed ? 'completed' : ''}`}>
                <p>{habit.habit_name}</p>
                <button onClick={() => markHabitComplete(habit.habit_id)}>
                  {habit.is_completed ? 'Done ✓' : '○'}
                </button>
              </div>
            ))}
          </div>
          <div className="habit-buttons">
            <Link to="/habit"><button className="organize">Add a new Habit</button></Link>
            <button className="remove">Remove</button>
          </div>
        </div>
        <div className="chart-container">
          <MyChart chartData={chartData} onViewChange={handleViewChange} />
        </div>
      </div>
        <div className='planner-container'>
        <Planner />
        </div>

    </div>
  );
}

export default Goals;
