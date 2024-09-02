
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
        data: [2, 4, 3, 9, 2, 1, 3],
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
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const data = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex === 0 ? data.length - 1 : currentIndex - 1);
    updateWeek(-1);
  };

  const handleNextClick = () => {
    setCurrentIndex(currentIndex === data.length - 1 ? 0 : currentIndex + 1);
    updateWeek(1);
  };

  function getCurrentWeek() {
    const current = new Date();
    const week = [];

    for (let i = 0; i < 7; i++) {
      const first = current.getDate() - current.getDay() + i;
      const day = new Date(current.setDate(first));
      const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
      const date = day.getDate(); // Only get the day of the month
      week.push({ dayOfWeek, date, fullDate: day });
    }
    return week;
  }

  function updateWeek(offset) {
    const updatedWeek = currentWeek.map(item => {
      const newDate = new Date(new Date().setDate(item.date + 7 * offset));
      const dayOfWeek = newDate.toLocaleDateString('en-US', { weekday: 'long' });
      const date = newDate.getDate(); 
      return { dayOfWeek, date, fullDate: newDate };
    });

    setCurrentWeek(updatedWeek);
  }
  
  const handleDayClick = (index) => {
    setSelectedDay(index);
    setSelectedDate(currentWeek[index].fullDate);
  };

  const handleViewChange = (view) => {
    setView(view);
    if (view === 'Week') {
      setChartData(weekData);
    } else if (view === 'Month') {
      setChartData(monthData);
    } else if (view === 'Year') {
      setChartData(yearData);
    }
  };

  const filteredHabitsForSelectedDay = habits.filter(habit => {
    const frequencyArray = habit.frequency || [];
    return frequencyArray.includes(data[selectedDay]);
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
                <span>{habit.habit_name}</span>
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
      <p>
        This page is still being worked on as of 7/19/24. <br />
        The goal is to create a habit tracker so that a specific user can create, remove, <br />
        and interact with each of their 'habits' by marking it complete or not complete. <br />
        Users can also toggle between views for the week, month, and year to see their progress. <br />
        I am working on connecting the two screens together after syncing the date with the list. <br />
        I am also working on updating the UI to something more user friend and usingg supabase to <br />
        allow account creation and log in<br />
      </p>
    </div>
  );
}

export default Goals;
