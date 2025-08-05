import React from "react";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import arrow from './../assets/arrow.svg';
import './../pages/chart.css';
import { format } from 'date-fns';

const MyChart = ({ 
  chartData, 
  onWeekChange, 
  currentWeek, 
  onViewChange, 
  habits = [], 
  completionData = [],
  onPrevWeek,
  onNextWeek
}) => {
  
  // DEBUG: Log what we're receiving
  console.log("DEBUG - MyChart Props:");
  console.log("habits:", habits);
  console.log("completionData:", completionData);
  console.log("currentWeek:", currentWeek);
  console.log("chartData:", chartData);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const filled = tooltipItem.raw;
            return `Completion: ${filled}%`;
          },
        },
        bodyFont: { size: 14 },
        titleFont: { size: 16 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 14 } },
      },
      y: {
        grid: { display: false },
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: value => `${value}%`,
          font: { size: 14 },
        },
      },
    },
    elements: {
      bar: { borderRadius: 2, borderSkipped: false },
    },
  };

  const handleNextClick = () => {
    if (onNextWeek) {
      onNextWeek();
    }
  };

  const handlePrevClick = () => {
    if (onPrevWeek) {
      onPrevWeek();
    }
  };

  // Calculate total habits completed this week (actual count, not percentages)
  const calculateTotalHabitsCompleted = () => {
    console.log("DEBUG - Calculating total habits completed...");
    
    // If we don't have the required data, fall back to 0
    if (!habits.length || !completionData.length || !currentWeek.length) {
      console.log("DEBUG - Missing required data, returning 0");
      return 0;
    }
    
    let totalCompleted = 0;
    
    currentWeek.forEach((day, dayIndex) => {
      const dateKey = format(day.fullDate, 'yyyy-MM-dd');
      const dayName = format(day.fullDate, 'EEEE');
      
      console.log(`DEBUG - Checking day ${dayIndex}: ${dayName} (${dateKey})`);
      
      habits.forEach(habit => {
        // Check if habit should occur on this day
        if (habit.frequency && habit.frequency.includes(dayName)) {
          // Check if it's completed
          const completion = completionData.find(
            c => c.habit_id === habit.habit_id && 
                 c.completion_date === dateKey && 
                 c.is_completed
          );
          
          if (completion) {
            totalCompleted += 1;
            console.log(`DEBUG - Found completed habit: ${habit.habit_name} on ${dateKey}`);
          }
        }
      });
    });
    
    console.log("DEBUG - Total completed habits:", totalCompleted);
    return totalCompleted;
  };

  const safeData =
    chartData &&
    chartData.datasets &&
    chartData.datasets[0] &&
    Array.isArray(chartData.datasets[0].data)
      ? chartData.datasets[0].data
      : [];

  const safeLabels = chartData && Array.isArray(chartData.labels)
    ? chartData.labels
    : [];

  if (!safeLabels.length || !safeData.length) {
    return <div style={{ textAlign: 'center', margin: '2rem 0' }}>No chart data available.</div>;
  }

  // OLD CALCULATION (what was causing 450)
  const oldTotalHabitsDone = safeData.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  
  // NEW CALCULATION
  const totalHabitsCompleted = calculateTotalHabitsCompleted();

  console.log("DEBUG - Old calculation result:", oldTotalHabitsDone);
  console.log("DEBUG - New calculation result:", totalHabitsCompleted);

  return (
    <div className="Chart">
      <h2>Weekly Habit Progress</h2>
      <div className="calendar-header">
        <img
          className="arrow left-arrow"
          src={arrow}
          style={{ transform: 'rotate(180deg)' }}
          onClick={handlePrevClick}
          alt="previous week"
        />
        <p>
          {currentWeek[0]?.dayOfWeek}, {currentWeek[0]?.fullDate.toLocaleDateString()} - {currentWeek[6]?.dayOfWeek}, {currentWeek[6]?.fullDate.toLocaleDateString()}
        </p>
        <img
          className="arrow right-arrow"
          src={arrow}
          onClick={handleNextClick}
          alt="next week"
        />
      </div>
      <Bar data={chartData} options={options} />

      <div className="streaks-tracker-container">
        <div className="streaks-tracker">
          <p>Current Streak</p>
          <h2>0</h2>
          <p>Best Streak</p>
          <h4>0</h4>
        </div>
        <div className="streaks-tracker">
          <p>Habits Done</p>
          <h2 style={{color: totalHabitsCompleted === 0 ? 'red' : 'green'}}>
            {totalHabitsCompleted}
          </h2>
          <p>This week</p>
          <small style={{color: 'gray'}}>
            (Old calc would show: {oldTotalHabitsDone})
          </small>
        </div>
      </div>
    </div>
  );
};

export default MyChart;