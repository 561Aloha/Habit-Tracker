import './../css/goals.css';
import React, { useState, useEffect } from "react";
import MyChart from '../components/MyChart.jsx';
import { supabase } from '../client'; // Ensure the correct path to the supabase client
import { Link } from 'react-router-dom';
import arrow from './../assets/arrow.png';
import { format } from 'date-fns';
import Planner from "../components/planner.jsx";

function Goals() {
  const [chartData, setChartData] = useState({
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Habits Filled',
        data: Array(7).fill(0), // Ensure default values for the chart data
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
        data: Array(7).fill(0), // Default to zero and update dynamically
        backgroundColor: '#4272f5',
        borderWidth: 1,
      },
    ],
  };
  

  const monthData = {
    labels: ['Jan','Feb','Mar','Apr','May','June',"July"],
    datasets: [
      {
        label: 'Habits Filled',
        data: [0, 0, 0, 0, 0, 0,0],
        backgroundColor: '#4272f5',
        borderWidth: 1,
      },
    ],
  };
  
  const [view, setView] = useState('Week');
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [calendarOffset, setCalendarOffset] = useState(0);

  // Fetch habits from Supabase
  const fetchHabits = async () => {
    const userId = 1; // Assuming a hardcoded user ID for now
    try {
      const { data, error } = await supabase
        .from('Habits')
        .select(`
          habit_id,
          habit_name,
          frequency,
          Habit_Completion (
            completion_date,
            is_completed
          )
        `)
        .eq('userid', userId);  
      if (error) throw error;

      // Check if data is valid and is an array
      if (!data || !Array.isArray(data)) {
        console.warn('No valid data received from Supabase');
        return;
      }

      const updatedHabits = data.map(habit => {
        const completions = Array.isArray(habit.Habit_Completion) ? habit.Habit_Completion : [];
        const completionMap = completions.reduce((map, completion) => {
          map[completion.completion_date] = completion.is_completed;
          return map;
        }, {});

        return { ...habit, completionMap };
      });

    setHabits(updatedHabits);
  } catch (error) {
    console.error('Error fetching habits:', error.message);
  }
};
  // Update chart data based on habits
  // const updateChartData = () => {
  //   // Initialize data arrays


  //   const weeklyData = Array(7).fill(0);
  //   const dailyHabitCounts = Array(7).fill(0);
  
  //   // Map weekday names to indices for easier lookup
  //   const dayNameMap = {
  //     Sun: 'Sunday',
  //     Mon: 'Monday',
  //     Tue: 'Tuesday',
  //     Wed: 'Wednesday',
  //     Thu: 'Thursday',
  //     Fri: 'Friday',
  //     Sat: 'Saturday',
  //   };
  
  //   // Calculate weekly completion percentages based on habits state
  //   habits.forEach(habit => {
  //     (habit.frequency || []).forEach(day => {
  //       const fullDayName = dayNameMap[day] || day;
  //       const dayIndex = chartData.labels.indexOf(fullDayName);
  
  //       if (dayIndex !== -1) {
  //         dailyHabitCounts[dayIndex] += 1;
  //         if (habit.completionMap && habit.completionMap[format(selectedDate, 'yyyy-MM-dd')]) {
  //           weeklyData[dayIndex] += 1;
  //         }
  //       }
  //     });
  //   });
  
  //   // Calculate percentage of completion for each day of the week
  //   const weeklyCompletionPercentages = weeklyData.map((completed, index) =>
  //     dailyHabitCounts[index] ? Math.round((completed / dailyHabitCounts[index]) * 100) : 0
  //   );
  
  //   // Update chart data dynamically
  //   setChartData(prev => ({
  //     ...prev,
  //     datasets: [
  //       {
  //         ...prev.datasets[0],
  //         data: weeklyCompletionPercentages,
  //       },
  //     ],
  //   }));
  // };

  const markHabitComplete = async (habitId) => {
    const habit = habits.find(habit => habit.habit_id === habitId);
    const habitDateKey = format(selectedDate, 'yyyy-MM-dd');
  
    // Toggle the completion status for the selected date
    const isCompleted = !(habit.completionMap && habit.completionMap[habitDateKey]);
  
    // Update local state for immediate feedback
    const updatedHabits = habits.map(habit =>
      habit.habit_id === habitId
        ? { ...habit, completionMap: { ...habit.completionMap, [habitDateKey]: isCompleted } }
        : habit
    );
    
    // Set updated habits state (async)
    setHabits(updatedHabits);
  
    // Update in Supabase
    try {
      const { data, error } = await supabase
        .from('Habit_Completion')
        .upsert({
          habit_id: habitId,
          completion_date: habitDateKey,
          is_completed: isCompleted,
          userid: 1,  // Replace with dynamic user ID if needed
        }, { onConflict: ['habit_id', 'completion_date', 'userid'] });
  
      if (error) throw error;
  
      console.log('Habit completion status updated:', data);
  
    } catch (error) {
      console.error('Error updating habit completion status:', error.message);
    }
  };
  
  // Use useEffect to update chart data when habits change
  useEffect(() => {
    updateChartData();
  }, [habits]);
  


  const updateChartData = () => {
    const weekDays = getCurrentWeek();
    const weeklyData = Array(7).fill(0);
    const dailyHabitCounts = Array(7).fill(0);

    habits.forEach(habit => {
      currentWeek.forEach((day, index) => {
        const habitDateKey = format(day.fullDate, 'yyyy-MM-dd');

        if (habit.frequency.includes(day.dayOfWeek)) {
          dailyHabitCounts[index] += 1;
          if (habit.completionMap && habit.completionMap[habitDateKey]) {
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
          label: 'Habits Filled',
          data: weeklyCompletionPercentages,
          backgroundColor: '#8884d8',
          borderWidth: 1,
        },
      ],
    });
  };


  // Update chart when habits or date changes
  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  useEffect(() => {
    updateChartData();
  }, [habits,currentWeek]);

  useEffect(() => {
    updateWeek(calendarOffset);
  }, [calendarOffset]);


  const handlePrevClick = () => setCalendarOffset(calendarOffset - 1);
  const handleNextClick = () => setCalendarOffset(calendarOffset + 1);


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
    setSelectedDate(currentWeek[index].fullDate);
  };

  const handleViewChange = (view) => {
    setView(view);
    if (view === 'Week') {
      setChartData(weekData);
    }
  };

  const filteredHabitsForSelectedDay = habits.filter(habit => {
    const dayName = format(selectedDate, 'EEEE');
    //const frequencyArray = habit.frequency || [];
    return habit.frequency.includes(dayName);
  });
  const handleWeekChange = (newWeek) => {
    setCurrentWeek(newWeek);
    updateChartData(newWeek);
  };



  return (
    <div className="goals-page">
      <h2>The Habit Tracker</h2>
      <div className="goals-container">
        <div className="habits-container">
          <h2>Habits for {format(selectedDate, 'EEEE, MMMM d')}</h2>
          {/* Calendar Section */}
          <div className="calendar">
            <div className="calendar-header">
              <img
                className="arrow left-arrow"
                src={arrow}
                style={{ transform: 'rotate(180deg)' }}
                onClick={handlePrevClick}
                alt="Previous Week"
              />
              {/* Days of the Current Week */}
              {currentWeek.map((item, index) => (
                <div
                  key={index}
                  className={`day-label ${selectedDate.getDay() === index ? 'selected' : ''}`}
                  onClick={() => handleDayClick(index)}
                >
                  <div className="selected-d">{item.dayOfWeek.slice(0, 3).toUpperCase()}</div>
                  <div>{item.date}</div>
                </div>
              ))}
              <img
                className="arrow right-arrow"
                src={arrow}
                onClick={handleNextClick}
                alt="Next Week"
              />
            </div>
          </div>
  
          {/* Display the list of habits for the selected day */}
          <div className="list">
            {filteredHabitsForSelectedDay.map(habit => {
              // Create a unique key for each habit and date combination
              const habitDateKey = format(selectedDate, 'yyyy-MM-dd');
  
              // Check if the habit is completed for the selected date
              const isCompleted = habit.completionMap && habit.completionMap[habitDateKey];
  
              return (
                <div key={`${habit.habit_id}-${habitDateKey}`} className={`habit ${isCompleted ? 'completed' : ''}`}>
                  <p>{habit.habit_name}</p>
                  {/* Display the appropriate button text based on completion status */}
                  <button className="habit-toggle" onClick={() => markHabitComplete(habit.habit_id)}>
                    {isCompleted ? 'Done ✓' : '○'}
                  </button>
                </div>
              );
            })}
          </div>
  
          {/* Additional habit management buttons */}
          <div className="habit-buttons">
            <Link to="/habit">
              <button className="organize">Add a new Habit</button>
            </Link>
            <button className="remove">Remove</button>
          </div>
        </div>
  
        {/* Chart Display Section */}
        <div className="chart-container">
        <MyChart
          chartData={chartData}
          onWeekChange={setCurrentWeek}
          currentWeek={currentWeek}
          onViewChange={setView}
        />
      </div>
    </div>
      {/* Planner Component Section */}
      <div className="planner-container">
        <Planner />
      </div>
    </div>
  );
}  
export default Goals;
