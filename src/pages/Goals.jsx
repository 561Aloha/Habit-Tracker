import './../css/goals.css';
import Footer from '../components/Footer.jsx';

import React, { useState, useEffect } from "react";
import MyChart from '../components/MyChart.jsx';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import arrow from './../assets/arrow.svg';
import { format } from 'date-fns';

import Planner from "../components/planner.jsx";
import CompleteGrid from '../components/completegrid.jsx';

function Goals() {
  const year = new Date().getFullYear();
  const [chartData, setChartData] = useState({
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Habits Filled',
        data: Array(7).fill(0),
        backgroundColor: '#8884d8',
        borderWidth: 1,
      },
    ],
  });

  const [view, setView] = useState('Week');
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Fetch habits and completion data together
  const fetchAllData = async () => {
    if (!user) return;
    
    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from('Habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) throw habitsError;

      // Fetch completion data
      const { data: completionData, error: completionError } = await supabase
        .from('Habit_Completion')
        .select('*')
        .eq('user_id', user.id);

      if (completionError) throw completionError;

      setHabits(habitsData || []);
      setCompletionData(completionData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleHabitCompletion = async (habitId, dateKey) => {
    if (!user) return;

    try {
      // Find existing completion record
      const existing = completionData.find(
        c => c.habit_id === habitId && c.completion_date === dateKey
      );
      
      const isCompleted = existing ? !existing.is_completed : true;

      // Update database
      const { error } = await supabase
        .from('Habit_Completion')
        .upsert({
          habit_id: habitId,
          completion_date: dateKey,
          is_completed: isCompleted,
          user_id: user.id,
        }, { onConflict: ['habit_id', 'completion_date', 'user_id'] });

      if (error) throw error;

      // Update local state immediately for better UX
      setCompletionData(prevData => {
        const newData = [...prevData];
        const existingIndex = newData.findIndex(
          c => c.habit_id === habitId && c.completion_date === dateKey
        );

        if (existingIndex >= 0) {
          newData[existingIndex] = { ...newData[existingIndex], is_completed: isCompleted };
        } else {
          newData.push({
            habit_id: habitId,
            completion_date: dateKey,
            is_completed: isCompleted,
            user_id: user.id
          });
        }
        return newData;
      });

    } catch (error) {
      console.error('Error updating habit completion:', error.message);
    }
  };

  // Update chart data whenever habits or completion data changes
  const updateChartData = () => {
    const weeklyData = Array(7).fill(0);
    const dailyHabitCounts = Array(7).fill(0);

    habits.forEach(habit => {
      currentWeek.forEach((day, index) => {
        const dateKey = format(day.fullDate, 'yyyy-MM-dd');
        const dayName = format(day.fullDate, 'EEEE');

        // Check if this habit should occur on this day
        if (habit.frequency && habit.frequency.includes(dayName)) {
          dailyHabitCounts[index] += 1;
          
          // Check if it's completed
          const completion = completionData.find(
            c => c.habit_id === habit.habit_id && c.completion_date === dateKey && c.is_completed
          );
          
          if (completion) {
            weeklyData[index] += 1;
          }
        }
      });
    });

    const weeklyCompletionPercentages = weeklyData.map((completed, index) =>
      dailyHabitCounts[index] ? Math.round((completed / dailyHabitCounts[index]) * 100) : 0
    );

    setChartData({
      labels: currentWeek.map(day => day.dayOfWeek),
      datasets: [
        {
          label: 'Habits Completed (%)',
          data: weeklyCompletionPercentages,
          backgroundColor: '#8884d8',
          borderWidth: 1,
        },
      ],
    });
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // Update chart when data changes
  useEffect(() => {
    updateChartData();
  }, [habits, completionData, currentWeek]);

  // Week navigation
  useEffect(() => {
    updateWeek(calendarOffset);
  }, [calendarOffset]);

  const handlePrevClick = () => setCalendarOffset(calendarOffset - 1);
  const handleNextClick = () => setCalendarOffset(calendarOffset + 1);

  function getCurrentWeek() {
    const today = new Date();
    const week = [];
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      
      const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
      const date = day.getDate();
      week.push({ dayOfWeek, date, fullDate: new Date(day) });
    }
    return week;
  }

  function updateWeek(offset) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (7 * offset));
    
    const updatedWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      
      const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
      const date = day.getDate();
      updatedWeek.push({ dayOfWeek, date, fullDate: new Date(day) });
    }
    setCurrentWeek(updatedWeek);
  }

  const handleDayClick = (index) => {
    if (currentWeek[index] && currentWeek[index].fullDate) {
      setSelectedDate(new Date(currentWeek[index].fullDate));
    }
  };

  const handleViewChange = (view) => {
    setView(view);
  };

  // Filter habits for selected day
  const filteredHabitsForSelectedDay = habits.filter(habit => {
    const dayName = format(selectedDate, 'EEEE');
    return habit.frequency && habit.frequency.includes(dayName);
  });

  const isHabitCompleted = (habitId, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const completion = completionData.find(
      c => c.habit_id === habitId && c.completion_date === dateKey
    );
    return completion ? completion.is_completed : false;
  };

  return (
    <div className="goals-page">
            <h2 className='goal-header'>The Habit Tracker</h2>
      <div className="goals-container">
        
        <div className="habits-container">
          <h2>Habits for {format(selectedDate, 'EEEE, MMMM d')}</h2>
          <div className="calendar">
            <div className="calendar-header">
              <img
                className="arrow left-arrow"
                src={arrow}
                style={{ transform: 'rotate(180deg)' }}
                onClick={handlePrevClick}
                alt="Previous Week"
              />
              {currentWeek.map((item, index) => {
                const isSelected = selectedDate && 
                  item.fullDate.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={`${item.fullDate.getTime()}-${index}`}
                    className={`day-label ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDayClick(index)}
                  >
                    <div className="selected-d">{item.dayOfWeek.slice(0, 3).toUpperCase()}</div>
                    <div>{item.date}</div>
                  </div>
                );
              })}
              <img
                className="arrow right-arrow"
                src={arrow}
                onClick={handleNextClick}
                alt="Next Week"
              />
            </div>
          </div>
          <div className="list">
            {filteredHabitsForSelectedDay.map(habit => {
              const habitDateKey = format(selectedDate, 'yyyy-MM-dd');
              const isCompleted = isHabitCompleted(habit.habit_id, selectedDate);

              return (
                <div key={`${habit.habit_id}-${habitDateKey}`} className={`habit ${isCompleted ? 'completed' : ''}`}>
                  <p>{habit.habit_name}</p>
                  <button 
                    className="habit-toggle" 
                    onClick={() => handleHabitCompletion(habit.habit_id, habitDateKey)}
                  >
                    {isCompleted ? 'Done ✓' : '○'}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="habit-buttons">
            <Link to="/habit">
              <button className="organize">Add a new Habit</button>
            </Link>
            <button className="remove">Remove</button>
          </div>
        </div>
        <div className='right-container'>
          <Planner
            habits={habits}
            completionData={completionData}
            onHabitCompletion={handleHabitCompletion}
            currentWeek={currentWeek}
          />    
          <div className="chart-container">
            <MyChart
              chartData={chartData}
              onWeekChange={setCurrentWeek}
              currentWeek={currentWeek}
              onViewChange={setView}
              habits={habits}
              completionData={completionData}
              onPrevWeek={handlePrevClick}
              onNextWeek={handleNextClick}
            />
          <CompleteGrid year={year} />
          </div>
        </div>

      </div>
              <Footer/>
    </div>
  );
}  

export default Goals;