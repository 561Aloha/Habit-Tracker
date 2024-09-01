// Chart.jsx
import React from "react";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import './../css/goals.css'; 

const MyChart = ({ chartData }) => (
    <div className="chart">
        <h2>My Chart</h2>
        <div className='btn-bar'>
            <button>Week</button>
            <button>Month</button>
            <button>Year</button>
        </div>
        <Bar data={chartData} />
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
);

export default MyChart;
