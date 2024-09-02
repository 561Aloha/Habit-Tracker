//import './../css/goals.css'; 
import React from "react";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './../pages/chart.css'; 
const MyChart = ({ chartData, onViewChange }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const filled = tooltipItem.raw;
                        const total = 100;
                        const percentage = ((filled / total) * 100).toFixed(2) + '%';
                        return `Filled: ${filled}, Missing: ${total - filled}, ${percentage}`;
                    },
                },
                bodyFont: {
                    size: 14 // Increase tooltip font size
                },
                titleFont: {
                    size: 16 // Increase tooltip title font size
                }
            },
        },
        scales: {
            x: {
                grid: { display: false, },
                ticks: {
                    font: {
                        size: 14 // Increase x-axis labels font size
                    }
                }
            },
            y: {
                grid: { display: false },
                beginAtZero: true,
                max: 100, // Set maximum value to 100
                ticks: {
                    stepSize: 10,
                    callback: function (value) {
                        return value + '%'; // Display as percentage
                    },
                    font: {
                        size: 14 // Increase y-axis labels font size
                    }
                }
            },
        },
        elements: {
            bar: {
                borderRadius: 2,
                borderSkipped: false,
            },
        },
    };

    return (
        <div className="Chart">
            <h2>My Chart</h2>
            <div className='btn-bar'>
                <button onClick={() => onViewChange('Week')}>Week</button>
                <button onClick={() => onViewChange('Month')}>Month</button>
                <button onClick={() => onViewChange('Year')}>Year</button>
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
