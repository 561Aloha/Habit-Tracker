import React from "react";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import arrow from './../assets/arrow.png';
import './../pages/chart.css';

const MyChart = ({ chartData, onWeekChange, currentWeek, onViewChange }) => {
  // Remove local state for `currentWeek` to avoid conflicts
  
  // Chart configuration options
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


  // Handle navigation to the next week
  const handleNextClick = () => {
    const newWeek = currentWeek.map(day => ({
      ...day,
      fullDate: new Date(day.fullDate.setDate(day.fullDate.getDate() + 7)),
    }));
    onWeekChange(newWeek);  // Notify the parent component (`Goals`) of the updated week
  };

  // Handle navigation to the previous week
  const handlePrevClick = () => {
    const newWeek = currentWeek.map(day => ({
      ...day,
      fullDate: new Date(day.fullDate.setDate(day.fullDate.getDate() - 7)),
    }));
    onWeekChange(newWeek);  // Notify the parent component (`Goals`) of the updated week
  };

  return (
    <div className="Chart">
      <h2>Weekly Habit Progress</h2>
      {/* Navigation Buttons */}
      <div className="calendar-header">
        <img
          className="arrow left-arrow"
          src={arrow}
          style={{ transform: 'rotate(180deg)' }}
          onClick={handlePrevClick}
          alt="previous week"
        />
        {/* Display days of the current week */}
        <p>
          {currentWeek[0].dayOfWeek}, {currentWeek[0].fullDate.toLocaleDateString()} - {currentWeek[6].dayOfWeek}, {currentWeek[6].fullDate.toLocaleDateString()}
        </p>
        <img
          className="arrow right-arrow"
          src={arrow}
          onClick={handleNextClick}
          alt="next week"
        />
      </div>

      {/* Render the Bar Chart */}
      <Bar data={chartData} options={options} />

      {/* Display streak and habit completion */}
      <div className='streaks-tracker-container'>
        <div className="streaks-tracker">
          <p>Your streak</p>
          <h2>5</h2>
          <p>Best Streak Day</p>
        </div>
        <div className="streaks-tracker">
          <p>Habits Done</p>
          <h2>10</h2>
          <p>This week</p>
        </div>
      </div>
    </div>
  );
};

export default MyChart;
