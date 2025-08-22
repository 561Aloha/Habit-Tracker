// src/pages/Goals.jsx (full updated)
import './../css/goals.css';
import Footer from '../components/Footer.jsx';

import React, { useState, useEffect } from "react";
import MyChart from '../components/MyChart.jsx';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import arrow from './../assets/arrow.svg';
import { format, startOfWeek, endOfWeek } from 'date-fns';

import Planner from "../components/planner.jsx";
import WeekCalendar from "../components/WeekCalendar.jsx";

function Goals() {
  const year = new Date().getFullYear();
  const [chartData, setChartData] = useState({
    labels: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    datasets: [{ label: 'Habits Filled', data: Array(7).fill(0), backgroundColor: '#8884d8', borderWidth: 1 }],
  });

  const [view, setView] = useState('Week');
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeekForDate(new Date()));
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchAllData = async () => {
    if (!user) return;
    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from('Habits')
        .select('*')
        .eq('user_id', user.id);
      if (habitsError) throw habitsError;

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
      const existing = completionData.find(
        c => c.habit_id === habitId && c.completion_date === dateKey
      );
      const isCompleted = existing ? !existing.is_completed : true;

      const { error } = await supabase
        .from('Habit_Completion')
        .upsert(
          { habit_id: habitId, completion_date: dateKey, is_completed: isCompleted, user_id: user.id },
          { onConflict: ['habit_id','completion_date','user_id'] }
        );
      if (error) throw error;

      setCompletionData(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(c => c.habit_id === habitId && c.completion_date === dateKey);
        if (idx >= 0) copy[idx] = { ...copy[idx], is_completed: isCompleted };
        else copy.push({ habit_id: habitId, completion_date: dateKey, is_completed: isCompleted, user_id: user.id });
        return copy;
      });
    } catch (error) {
      console.error('Error updating habit completion:', error.message);
    }
  };

  const handleRemoveHabit = async () => {
    if (!user || !selectedHabitId) return;
    const habit = habits.find(h => h.habit_id === selectedHabitId);
    const ok = window.confirm(
      `Are you sure you want to delete "${habit?.habit_name ?? 'this habit'}"? This will also delete its completion history.`
    );
    if (!ok) return;

    try {
      await supabase.from('Habit_Completion').delete().eq('habit_id', selectedHabitId).eq('user_id', user.id);
      const { error: delErr } = await supabase.from('Habits').delete().eq('habit_id', selectedHabitId).eq('user_id', user.id);
      if (delErr) throw delErr;

      setHabits(prev => prev.filter(h => h.habit_id !== selectedHabitId));
      setCompletionData(prev => prev.filter(c => c.habit_id !== selectedHabitId));
      setSelectedHabitId(null);
    } catch (error) {
      console.error('Error deleting habit:', error.message);
      alert('Failed to delete habit: ' + error.message);
    }
  };

  const toggleSelectHabit = (habitId) => {
    setSelectedHabitId(prev => (prev === habitId ? null : prev = habitId));
  };

  const updateChartData = () => {
    const weeklyData = Array(7).fill(0);
    const dailyHabitCounts = Array(7).fill(0);

    habits.forEach(habit => {
      currentWeek.forEach((day, index) => {
        const dateKey = format(day.fullDate, 'yyyy-MM-dd');
        const dayName = format(day.fullDate, 'EEEE');
        if (habit.frequency && habit.frequency.includes(dayName)) {
          dailyHabitCounts[index] += 1;
          const completion = completionData.find(
            c => c.habit_id === habit.habit_id && c.completion_date === dateKey && c.is_completed
          );
          if (completion) weeklyData[index] += 1;
        }
      });
    });

    const weeklyCompletionPercentages = weeklyData.map((completed, index) =>
      dailyHabitCounts[index] ? Math.round((completed / dailyHabitCounts[index]) * 100) : 0
    );

    setChartData({
      labels: currentWeek.map(day => day.dayOfWeek),
      datasets: [{ label: 'Habits Completed (%)', data: weeklyCompletionPercentages, backgroundColor: '#8884d8', borderWidth: 1 }],
    });
  };

  useEffect(() => { if (user) fetchAllData(); }, [user]);
  useEffect(() => { updateChartData(); }, [habits, completionData, currentWeek]);
  useEffect(() => { updateWeek(calendarOffset); }, [calendarOffset]);

  const handlePrevClick = () => setCalendarOffset(calendarOffset - 1);
  const handleNextClick = () => setCalendarOffset(calendarOffset + 1);

  function getWeekForDate(date) {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push({
        dayOfWeek: day.toLocaleDateString('en-US', { weekday: 'long' }),
        date: day.getDate(),
        fullDate: new Date(day),
      });
    }
    return week;
  }

  function getCurrentWeek() {
    return getWeekForDate(new Date());
  }

  function updateWeek(offset) {
    const today = new Date();
    const base = new Date(today);
    base.setDate(today.getDate() + (7 * offset));
    setCurrentWeek(getWeekForDate(base));
    setSelectedDate(getWeekForDate(base)[0].fullDate);
  }

  const handleDayClick = (index) => {
    if (currentWeek[index] && currentWeek[index].fullDate) {
      setSelectedDate(new Date(currentWeek[index].fullDate));
    }
  };

  const onCalendarChange = (date) => {
    setSelectedDate(date);
    setCurrentWeek(getWeekForDate(date));
  };

  const handleViewChange = (view) => setView(view);

  const filteredHabitsForSelectedDay = habits.filter(habit => {
    const dayName = format(selectedDate, 'EEEE');
    return habit.frequency && habit.frequency.includes(dayName);
  });

  const isHabitCompleted = (habitId, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const completion = completionData.find(c => c.habit_id === habitId && c.completion_date === dateKey);
    return completion ? completion.is_completed : false;
  };

  const selectedRangeText = `${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'MMM d')}`;

  return (
    <div className="goals-page">
      <h2 className='goal-header'>The Habit Tracker</h2>
      <div className="goals-container">
        <div className="habits-container">
          <div style={{ marginBottom: 12 }}>
            <WeekCalendar value={selectedDate} onChange={onCalendarChange} weekStartsOn={0} />
            <div style={{ marginTop: 8, fontWeight: 600 }}>Week: {selectedRangeText}</div>
          </div>

          <h2>Habits for {format(selectedDate, 'EEEE, MMMM d')}</h2>

          <div className="calendar">
            <div className="calendar-header">
              <img className="arrow left-arrow" src={arrow} style={{ transform: 'rotate(180deg)' }} onClick={handlePrevClick} alt="Previous Week" />
              {currentWeek.map((item, index) => {
                const isSelected = selectedDate && item.fullDate.toDateString() === selectedDate.toDateString();
                return (
                  <div
                    key={`${item.fullDate.getTime()}-${index}`}
                    className={`day-label ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDayClick(index)}
                    style={{ background: isSelected ? 'rgba(79,70,229,0.12)' : 'transparent', borderRadius: 8 }}
                  >
                    <div className="selected-d">{item.dayOfWeek.slice(0, 3).toUpperCase()}</div>
                    <div>{item.date}</div>
                  </div>
                );
              })}
              <img className="arrow right-arrow" src={arrow} onClick={handleNextClick} alt="Next Week" />
            </div>
          </div>

          <div className="list">
            {filteredHabitsForSelectedDay.map(habit => {
              const habitDateKey = format(selectedDate, 'yyyy-MM-dd');
              const isCompleted = isHabitCompleted(habit.habit_id, selectedDate);
              const selectedForRemoval = selectedHabitId === habit.habit_id;

              return (
                <div
                  key={`${habit.habit_id}-${habitDateKey}`}
                  className={`habit ${isCompleted ? 'completed' : ''} selectable ${selectedForRemoval ? 'selected-for-removal' : ''}`}
                  onClick={() => toggleSelectHabit(habit.habit_id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSelectHabit(habit.habit_id); }}
                >
                  <p>{habit.habit_name}</p>
                  <button
                    className="habit-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHabitCompletion(habit.habit_id, habitDateKey);
                    }}
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
            <button className="remove" onClick={handleRemoveHabit} disabled={!selectedHabitId}>
              Remove
            </button>
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
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Goals;
