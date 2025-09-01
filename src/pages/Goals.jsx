import './../css/goals.css';
import './../css/goals-layout.css';
import Footer from '../components/Footer.jsx';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import edit from './../assets/edit-03.svg';
import React, { useState, useEffect, useRef } from "react";
import MyChart from '../components/MyChart.jsx';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import arrow from './../assets/arrow.svg';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import chevronDown from './../assets/chevron-down.svg';
import Planner from "../components/planner.jsx";
import EditHabitModal from '../components/EditHabit.jsx';
import AuthRequiredOverlay from '../components/AuthRequiredOver.jsx';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function Goals() {
  const isMobile = () => window.innerWidth <= 768;
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const year = new Date().getFullYear();
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState({
    labels: DAYS,
    datasets: [{ label: 'Habits Filled', data: Array(7).fill(0), backgroundColor: '#8884d8', borderWidth: 1 }],
});
  const hasAnyHabits = habits.length > 0;
  const showMobileNoHabitsMessage = isMobile() && !hasAnyHabits;
  const [view, setView] = useState('Week');
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
  const [currentWeek, setCurrentWeek] = useState(getWeekForDate(new Date()));
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const headerAnchorRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);

  
  useEffect(() => {
      let mounted = true;
      const init = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted) {
          setUser(user);
          setLoadingUser(false);
        }
      };
      init();
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      });
      return () => {
        mounted = false;
        sub?.subscription?.unsubscribe?.();
      };
    }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => { if (user) fetchAllData(); }, [user]);
  useEffect(() => { updateChartData(); }, [habits, completionData, currentWeek]);
  useEffect(() => { updateWeek(calendarOffset); }, [calendarOffset]);

// Add this useEffect to your Goals component to handle week highlighting

useEffect(() => {
  if (!openDatePicker) return;
  
  const addWeekHighlighting = () => {
    const dayElements = document.querySelectorAll('.MuiPickersDay-root');
    const weekRows = document.querySelectorAll('[role="row"]');
    
    // Remove existing hover listeners
    dayElements.forEach(day => {
      const clonedDay = day.cloneNode(true);
      day.parentNode.replaceChild(clonedDay, day);
    });
    
    // Add new hover listeners
    document.querySelectorAll('.MuiPickersDay-root').forEach((day, index) => {
      day.addEventListener('mouseenter', () => {
        // Calculate which week row this day belongs to
        const weekRowIndex = Math.floor(index / 7);
        const weekRow = weekRows[weekRowIndex + 1]; // +1 to skip header row
        
        if (weekRow) {
          weekRow.classList.add('week-highlighted');
        }
      });
      
      day.addEventListener('mouseleave', () => {
        weekRows.forEach(row => row.classList.remove('week-highlighted'));
      });
    });
  };
  
  const timer = setTimeout(addWeekHighlighting, 100);
  
  return () => clearTimeout(timer);
}, [openDatePicker]);
const handleHabitCompletion = async (habitId, dateKey, completionState) => {
  if (!user) return;
  
  try {
    if (completionState === 'delete') {
      // Delete the completion record (back to blank state)
      const { error } = await supabase
        .from('Habit_Completion')
        .delete()
        .eq('habit_id', habitId)
        .eq('completion_date', dateKey)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setCompletionData(prev => 
        prev.filter(c => !(c.habit_id === habitId && c.completion_date === dateKey))
      );
    } else {
      // Update or create completion record
      const { error } = await supabase
        .from('Habit_Completion')
        .upsert(
          { habit_id: habitId, completion_date: dateKey, is_completed: completionState, user_id: user.id },
          { onConflict: ['habit_id','completion_date','user_id'] }
        );
      
      if (error) throw error;

      setCompletionData(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(c => c.habit_id === habitId && c.completion_date === dateKey);
        if (idx >= 0) {
          copy[idx] = { ...copy[idx], is_completed: completionState };
        } else {
          copy.push({ habit_id: habitId, completion_date: dateKey, is_completed: completionState, user_id: user.id });
        }
        return copy;
      });
    }
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

  const handleDeleteFromModal = async (habitId) => {
    if (!user || !habitId) return;
    const habit = habits.find(h => h.habit_id === habitId);
    const ok = window.confirm(
      `Delete "${habit?.habit_name ?? 'this habit'}" and its completion history?`
    );
    if (!ok) return;

    try {
      await supabase.from('Habit_Completion').delete().eq('habit_id', habitId).eq('user_id', user.id);
      const { error: delErr } = await supabase.from('Habits').delete().eq('habit_id', habitId).eq('user_id', user.id);
      if (delErr) throw delErr;

      setHabits(prev => prev.filter(h => h.habit_id !== habitId));
      setCompletionData(prev => prev.filter(c => c.habit_id !== habitId));
      setEditModalOpen(false);
      setHabitToEdit(null);
      if (selectedHabitId === habitId) setSelectedHabitId(null);
    } catch (error) {
      console.error('Error deleting habit:', error.message);
      alert('Failed to delete habit: ' + error.message);
    }
  };

  const toggleSelectHabit = (habitId) => {
    setSelectedHabitId(prev => (prev === habitId ? null : habitId));
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

  const handlePrevClick = () => setCalendarOffset(calendarOffset - 1);
  const handleNextClick = () => setCalendarOffset(calendarOffset + 1);

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


  const isHabitCompleted = (habitId, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const completion = completionData.find(c => c.habit_id === habitId && c.completion_date === dateKey);
    return completion ? completion.is_completed : false;
  };
  const selectedRangeText = `${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'MMM d')}`;
  const handleEditHabit = (habit, e) => {
    e.stopPropagation();
    setHabitToEdit(habit);
    setEditModalOpen(true);
  };
  const handleSaveEdit = async (updated) => {
    if (!user || !updated) return;
    try {
      const { error } = await supabase
        .from('Habits')
        .update({
          habit_name: updated.habit_name,   // 👈 match your column name
          frequency: updated.frequency,
          repetition: updated.repetition ?? null, // 👈 include repetition if editing
          user_id: user.id,                      // 👈 match your schema’s column
        })
        .eq('habit_id', updated.habit_id)
        .eq('user_id', user.id); // 👈 make sure update is scoped to user
      if (error) throw error;

      // Update local state so UI shows changes immediately
      setHabits(prev =>
        prev.map(h =>
          h.habit_id === updated.habit_id
            ? { ...h, ...updated }
            : h
        )
      );

      setHabitToEdit(null);
    } catch (err) {
      console.error('Error saving habit:', err.message);
      alert('Failed to save habit: ' + err.message);
    }
  };

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
  

  const filteredHabitsForSelectedDay = habits.filter(habit => {
  const dayName = format(selectedDate, 'EEEE');
    return habit.frequency && habit.frequency.includes(dayName);
  });
  const hasHabitsForToday = filteredHabitsForSelectedDay.length > 0;


  return (
    <div className="goals-page">
      <h2 className='goal-header'>The Habit Tracker</h2>
      <AuthRequiredOverlay open={!user} />
      <div className="goals-container">
        <div className="habits-container">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <h2 className="habits-header">
        <span
          ref={headerAnchorRef}
          onClick={() => setOpenDatePicker(true)}
          className="habits-header-span"
          role="button"
          tabIndex={0}
        >
          Habits for{" "}
          <span className="date-text">{format(selectedDate, 'EEEE, MMMM d')}</span>
          <img src={chevronDown} alt="open date picker" className="chevron-icon" style={{ marginLeft: 8 }} />
        </span>
        
        <DatePicker
          open={openDatePicker}
          onClose={() => setOpenDatePicker(false)}
          value={selectedDate}
          onChange={(newDate) => {
            if (newDate) {
              setSelectedDate(newDate);
              setCurrentWeek(getWeekForDate(newDate));
            }
          }}
          views={['year', 'month', 'day']} // Enable all three views
          openTo="month"
          slotProps={{
            textField: { style: { display: 'none' } },
            popper: {
              placement: 'bottom-start',
              anchorEl: () => headerAnchorRef.current,
              modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
            },

            calendarHeader: {
              format: 'MMMM yyyy',
            },
          }}
        />
        </h2>
        </LocalizationProvider>
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
          {showMobileNoHabitsMessage ? (
            <div className="mobile-no-habits">
              <p>No habits created yet.</p>
              <p>Create your first habit to get started!</p>
            </div>
          ) : !hasHabitsForToday && hasAnyHabits ? (
            // Show no habits for selected day (desktop and mobile)
            <div className="no-habits-today">
              <p>No habits scheduled for {format(selectedDate, 'EEEE')}.</p>
            </div>
          ) : (
            // Show habit list - removed the extra brace and added parentheses
            filteredHabitsForSelectedDay.map(habit => {
              const habitDateKey = format(selectedDate, 'yyyy-MM-dd');
              const isCompleted = isHabitCompleted(habit.habit_id, selectedDate);
              const selectedForRemoval = selectedHabitId === habit.habit_id;
              const isEditing = habitToEdit?.habit_id === habit.habit_id;

              return (
                <React.Fragment key={`${habit.habit_id}-${habitDateKey}`}>
                  <div
                    className={`habit-row selectable 
                      ${isCompleted ? 'completed' : ''} 
                      ${selectedForRemoval ? 'selected' : ''}`}
                    onClick={() => toggleSelectHabit(habit.habit_id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') toggleSelectHabit(habit.habit_id);
                    }}
                  >
                    <div className="habit-content">
                      <p>{habit.habit_name}</p>
                      <button
                        type="button"
                        className={`habit-toggle ${isCompleted ? 'completed' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHabitCompletion(habit.habit_id, habitDateKey);
                        }}
                      >
                        {isCompleted ? 'Done ✓' : '○'}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="edit-icon"
                      aria-label={`Edit ${habit.habit_name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHabitToEdit(habit);
                        setEditModalOpen(prev =>
                          !(prev && habitToEdit?.habit_id === habit.habit_id)
                        );
                      }}
                    >
                      <img src={edit} alt="edit" />
                    </button>
                  </div>

                  {isEditing && (
                    <EditHabitModal
                      habit={habitToEdit}
                      onClose={() => setHabitToEdit(null)}
                      onSave={handleSaveEdit}
                      onDelete={handleDeleteFromModal}
                      days={DAYS}
                    />
                  )}
                </React.Fragment>
              );
            })
          )}
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
          {/* <div className="chart-container">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Goals;
