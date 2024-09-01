import React, { useState, useEffect } from "react";
import MyChart from '../components/MyChart.jsx'; 
import { supabase } from '../client';
import './../css/goals.css'; 


function Goals() {
    const [chartData, setChartData] = useState({
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Monthly Progress',
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: [20, 30, 100, 60, 40],
        },
      ],
    });
  
    useEffect(() => {
      const fetchChartData = async () => {
        try {
          const { data, error } = await supabase
            .from('UserData')
            .select('*');
      
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error('Error fetching chart data:', error.message);
        }
      };
      fetchChartData();
    }, []);
    // calls on the mychart component to display react rechart
    return (
      <div className="new">
        <MyChart chartData={chartData} />
      </div>
    );
  }
  
  export default Goals;
  