import React, { useState } from "react";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import arrow from './../assets/arrow.png';
import './../pages/chart.css';

const MyChart = ({ chartData, onViewChange }) => {
    const [currentWeek, setCurrentWeek] = useState(getCurrentWeekRange(new Date()));
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const filled = tooltipItem.raw;
                        const total = 100;
                        const percentage = ((filled / total) * 100).toFixed(2) + '%';
                        return `Filled: ${filled}, Missing: ${total - filled}, ${percentage}`;
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

    function getCurrentWeekRange(date) {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const options = { month: 'long', day: 'numeric' };
        return {
            start: startOfWeek,
            end: endOfWeek,
            display: `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}`
        };
    }

    function updateWeek(offset) {
        const newStartDate = new Date(currentWeek.start);
        newStartDate.setDate(newStartDate.getDate() + offset * 7);
        setCurrentWeek(getCurrentWeekRange(newStartDate));
    }

    const handleNextClick = () => {
        updateWeek(1);
    };

    const handlePrevClick = () => {
        updateWeek(-1);
    };

    return (
        <div className="Chart">
            <h2>Progress</h2>
            <div className='btn-bar'>
                <button onClick={() => onViewChange('Week')}>Week</button>
                <button onClick={() => onViewChange('Month')}>Month</button>
                <button onClick={() => onViewChange('Year')}>Year</button>
            </div>
            <div className="calendar-header">
                <img
                    className="arrow left-arrow"
                    src={arrow}
                    style={{ transform: 'rotate(180deg)' }}
                    onClick={handlePrevClick}
                />
                <p>{currentWeek.display}</p>
                <img
                    className="arrow right-arrow"
                    src={arrow}
                    onClick={handleNextClick}
                />
            </div>
            <Bar data={chartData} options={options} />
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
